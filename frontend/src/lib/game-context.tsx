import {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  startVotingRequest,
  createRoomRequest,
  getRoomRequest,
  joinRoomRequest,
  getResultsRequest,
} from "../services/room_service";
import { createVote } from "../services/vote_service";
import { getFoodOptionsRequest } from "../services/food_service";

export interface Player {
  id: string;
  name: string;
  avatar: string;
}

export interface FoodOption {
  id: string;
  name: string;
  image: string;
  category: string;
}

export interface Vote {
  foodId: string;
  playerId: string;
  vote: boolean;
}

export interface Room {
  id: string;
  ownerId: string;
  code: string;
  players: Player[];
  currentFoodIndex: number;
  votes: Record<string, boolean[]>;
  isVotingStarted: boolean;
}

export interface ResultsResponse {
  match: boolean;
  results: {
    food: FoodOption;
    votes: number;
  }[];
}

export interface GameContextType {
  currentPlayer: Player | null;
  setCurrentPlayerPersisted: (player: Player | null) => void;
  room: Room | null;
  setRoomPersisted: (room: Room | null) => void;
  createRoom: (playerName: string) => Promise<string>;
  joinRoom: (code: string, playerName: string) => Promise<boolean>;
  startVoting: () => void;
  submitVote: (foodId: string, vote: boolean) => void;
  resetVoting: () => void;
  getFoodOptions: () => FoodOption[];
  getResults: () => Promise<ResultsResponse>;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const AVATARS = [
  "🍕", "🍔", "🍣", "🌮", "🥗", "🍜", "🥩", "🍝", "🥘", "🧁",
  "🥞", "🍳", "🌯", "🫔", "🧋", "🍟", "🍗", "🍩", "🧀", "🫕", "🍙",
];

function randomAvatar() {
  return AVATARS[Math.floor(Math.random() * AVATARS.length)];
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(() => {
    try {
      const saved = sessionStorage.getItem("currentPlayer");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [room, setRoom] = useState<Room | null>(() => {
    try {
      const saved = sessionStorage.getItem("room");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [foodOptions, setFoodOptions] = useState<FoodOption[]>([]);
  const roomRef = useRef<Room | null>(room);

  // Mantém o ref sempre atualizado
  useEffect(() => {
    roomRef.current = room;
  }, [room]);

  // Persiste currentPlayer no sessionStorage
  const setCurrentPlayerPersisted = (player: Player | null) => {
    setCurrentPlayer(player);
    if (player) {
      sessionStorage.setItem("currentPlayer", JSON.stringify(player));
    } else {
      sessionStorage.removeItem("currentPlayer");
    }
  };

  // Persiste room no sessionStorage
  const setRoomPersisted = (room: Room | null) => {
    setRoom(room);
    roomRef.current = room;
    if (room) {
      sessionStorage.setItem("room", JSON.stringify(room));
    } else {
      sessionStorage.removeItem("room");
    }
  };

  // Polling: busca status da sala a cada 2s
  useEffect(() => {
    const interval = setInterval(() => {
      const current = roomRef.current;
      if (!current) {
        console.log("[polling] roomRef é null, pulando");
        return;
      }

      console.log("[polling] buscando sala:", current.code);

      getRoomRequest(current.code)
        .then((updatedRoom) => {
          console.log("[polling] resposta:", updatedRoom.status);

          const latest = roomRef.current;
          if (!latest) return;

          const next: Room = {
            ...latest,
            ownerId: updatedRoom.owner_id.toString(),
            players: updatedRoom.players.map((p: any) => ({
              id: p.id.toString(),
              name: p.name,
              avatar:
                latest.players.find((pl) => pl.id === p.id.toString())?.avatar ||
                randomAvatar(),
            })),
            isVotingStarted: updatedRoom.status === "voting",
          };

          setRoomPersisted(next);
        })
        .catch((err) => console.error("[polling] erro:", err));
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Busca opções de comida uma vez
  useEffect(() => {
    getFoodOptionsRequest()
      .then((data: any[]) => {
        setFoodOptions(
          data.map((f: any) => ({
            id: f.id.toString(),
            name: f.name,
            image: f.image_url,
            category: f.category,
          }))
        );
      })
      .catch((err) => console.error("[food] erro ao buscar opções:", err));
  }, []);

  const createRoom = async (playerName: string): Promise<string> => {
    const roomResponse = await createRoomRequest(playerName);
    const owner = roomResponse.players[0];

    const player: Player = {
      id: owner.id.toString(),
      name: owner.name,
      avatar: randomAvatar(),
    };

    const newRoom: Room = {
      id: roomResponse.id.toString(),
      ownerId: owner.id.toString(),
      code: roomResponse.code,
      players: [player],
      currentFoodIndex: 0,
      votes: {},
      isVotingStarted: false,
    };

    setCurrentPlayerPersisted(player);
    setRoomPersisted(newRoom);

    return roomResponse.code;
  };

  const joinRoom = async (code: string, playerName: string): Promise<boolean> => {
    try {
      const roomResponse = await getRoomRequest(code);
      const playerResponse = await joinRoomRequest(code, playerName);

      const player: Player = {
        id: playerResponse.id.toString(),
        name: playerResponse.name,
        avatar: randomAvatar(),
      };

      const newRoom: Room = {
        id: roomResponse.id.toString(),
        ownerId: roomResponse.owner_id.toString(),
        code: roomResponse.code,
        players: [...roomResponse.players, player],
        currentFoodIndex: 0,
        votes: {},
        isVotingStarted: roomResponse.status === "voting",
      };

      setCurrentPlayerPersisted(player);
      setRoomPersisted(newRoom);

      return true;
    } catch (error) {
      console.error("[joinRoom] erro:", error);
      return false;
    }
  };

  const startVoting = async () => {
    const current = roomRef.current;
    if (!current) return;

    await startVotingRequest(current.code, currentPlayer?.id || "");

    setRoomPersisted({ ...current, isVotingStarted: true });
  };

  const submitVote = async (foodId: string, vote: boolean) => {
    const current = roomRef.current;
    if (!current || !currentPlayer) return;

    await createVote({
      room_id: parseInt(current.id),
      player_id: parseInt(currentPlayer.id),
      food_option_id: parseInt(foodId),
      liked: vote,
    });

    const newVotes = { ...current.votes };
    if (!newVotes[foodId]) newVotes[foodId] = [];
    if (vote) newVotes[foodId].push(true);

    setRoomPersisted({
      ...current,
      votes: newVotes,
      currentFoodIndex: current.currentFoodIndex + 1,
    });
  };

  const resetVoting = () => {
    const current = roomRef.current;
    if (!current) return;

    setRoomPersisted({
      ...current,
      currentFoodIndex: 0,
      votes: {},
      isVotingStarted: true,
    });
  };

  const getFoodOptions = () => foodOptions;

  const getResults = async (): Promise<ResultsResponse> => {
    const current = roomRef.current;
    if (!current) return { match: false, results: [] };

    const data = await getResultsRequest(current.code);

    return {
      match: data.match,
      results: data.top_3.map((f: any) => ({
        food: {
          id: f.id.toString(),
          name: f.name,
          image: f.image_url,
          category: f.category,
        },
        votes: f.likes_count,
      })),
    };
  };

  return (
    <GameContext.Provider
      value={{
        currentPlayer,
        setCurrentPlayerPersisted,
        room,
        setRoomPersisted,
        createRoom,
        joinRoom,
        startVoting,
        submitVote,
        resetVoting,
        getFoodOptions,
        getResults,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

export function useGame() {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider");
  }
  return context;
}