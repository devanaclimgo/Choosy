import { createContext, useContext, useState, type ReactNode } from "react";
import {
  startVotingRequest,
  createRoomRequest,
  getRoomRequest,
  joinRoomRequest,
} from "../services/room_service";
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
  odId: string;
  playerId: string;
  vote: boolean;
}

export interface Room {
  code: string;
  players: Player[];
  currentFoodIndex: number;
  votes: Record<string, boolean[]>;
  isVotingStarted: boolean;
}

interface GameContextType {
  currentPlayer: Player | null;
  setCurrentPlayer: (player: Player | null) => void;
  room: Room | null;
  setRoom: (room: Room | null) => void;
  createRoom: (playerName: string) => void;
  joinRoom: (code: string, playerName: string) => Promise<boolean>;
  refreshRoom: () => Promise<void>;
  startVoting: () => void;
  submitVote: (foodId: string, vote: boolean) => void;
  resetVoting: () => void;
  getFoodOptions: () => FoodOption[];
  getResults: () => { food: FoodOption; votes: number }[];
}

const GameContext = createContext<GameContextType | undefined>(undefined);

const FOOD_OPTIONS: FoodOption[] = [
  {
    id: "1",
    name: "Pizza",
    image:
      "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop",
    category: "italiana",
  },
  {
    id: "2",
    name: "Sushi",
    image:
      "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=400&fit=crop",
    category: "japonesa",
  },
  {
    id: "3",
    name: "Hambúrguer",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop",
    category: "americana",
  },
  {
    id: "4",
    name: "Massas",
    image:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=400&fit=crop",
    category: "italiana",
  },
  {
    id: "5",
    name: "Salada",
    image:
      "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop",
    category: "saudável",
  },
  {
    id: "6",
    name: "Frutos do Mar",
    image:
      "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=400&h=400&fit=crop",
    category: "frutos do mar",
  },
  {
    id: "7",
    name: "Churrasco",
    image:
      "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=400&fit=crop",
    category: "brasileira",
  },
  {
    id: "8",
    name: "Comida Mexicana",
    image:
      "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=400&fit=crop",
    category: "mexicana",
  },
  {
    id: "9",
    name: "Poke",
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop",
    category: "havaiana",
  },
  {
    id: "10",
    name: "Açaí",
    image:
      "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=400&fit=crop",
    category: "brasileira",
  },
  { id: "11", name: "Pastel", image: "../pastel.jpg", category: "brasileira" },
  {
    id: "12",
    name: "Sanduíche",
    image:
      "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=400&fit=crop",
    category: "lanche",
  },
  { id: "13", name: "Sorvete", image: "../sorvete.jpg", category: "italiana" },
  {
    id: "14",
    name: "Ramen",
    image:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop",
    category: "japonesa",
  },
];

const AVATARS = ["🍕", "🍔", "🍣", "🌮", "🥗", "🍜", "🥩", "🍝"];

export function GameProvider({ children }: { children: ReactNode }) {
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [room, setRoom] = useState<Room | null>(null);

  const createRoom = async (playerName: string) => {
    const roomResponse = await createRoomRequest();

    const playerResponse = await joinRoomRequest(roomResponse.code, playerName);

    const player: Player = {
      id: playerResponse.id.toString(),
      name: playerResponse.name,
      avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
    };

    const room: Room = {
      code: roomResponse.code,
      players: [player],
      currentFoodIndex: 0,
      votes: {},
      isVotingStarted: false,
    };

    setCurrentPlayer(player);
    setRoom(room);
  };

  const refreshRoom = async () => {
    if (!room) return;

    const updatedRoom = await getRoomRequest(room.code);

    setRoom((prev) => ({
      ...prev!,
      players: updatedRoom.players,
      isVotingStarted: updatedRoom.status === "voting",
    }));
  };

  const joinRoom = async (
    code: string,
    playerName: string,
  ): Promise<boolean> => {
    try {
      const roomResponse = await getRoomRequest(code);

      const playerResponse = await joinRoomRequest(code, playerName);

      const player: Player = {
        id: playerResponse.id.toString(),
        name: playerResponse.name,
        avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
      };

      setCurrentPlayer(player);

      setRoom({
        code: roomResponse.code,
        players: [...roomResponse.players, player],
        currentFoodIndex: 0,
        votes: {},
        isVotingStarted: roomResponse.status === "voting",
      });

      return true;
    } catch (error) {
      console.error(error);

      return false;
    }
  };

  const startVoting = async () => {
    if (!room) return;

    await startVotingRequest(room.code);

    setRoom({
      ...room,
      isVotingStarted: true,
    });
  };

  const submitVote = (foodId: string, vote: boolean) => {
    if (room && currentPlayer) {
      const newVotes = { ...room.votes };
      if (!newVotes[foodId]) {
        newVotes[foodId] = [];
      }
      if (vote) {
        newVotes[foodId].push(true);
      }

      setRoom({
        ...room,
        votes: newVotes,
        currentFoodIndex: room.currentFoodIndex + 1,
      });
    }
  };

  const resetVoting = () => {
    if (room) {
      setRoom({
        ...room,
        currentFoodIndex: 0,
        votes: {},
        isVotingStarted: true,
      });
    }
  };

  const getFoodOptions = () => FOOD_OPTIONS;

  const getResults = () => {
    if (!room) return [];

    const results = FOOD_OPTIONS.map((food) => ({
      food,
      votes: room.votes[food.id]?.length || 0,
    }));

    return results.sort((a, b) => b.votes - a.votes);
  };

  return (
    <GameContext.Provider
      value={{
        currentPlayer,
        setCurrentPlayer,
        room,
        setRoom,
        createRoom,
        refreshRoom,
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
