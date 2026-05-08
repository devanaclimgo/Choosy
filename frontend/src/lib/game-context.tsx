import { createContext, useContext, useState, type ReactNode } from "react"

export interface Player {
  id: string
  name: string
  avatar: string
}

export interface FoodOption {
  id: string
  name: string
  image: string
  category: string
}

export interface Vote {
  odId: string
  playerId: string
  vote: boolean
}

export interface Room {
  code: string
  players: Player[]
  currentFoodIndex: number
  votes: Record<string, boolean[]>
  isVotingStarted: boolean
}

interface GameContextType {
  currentPlayer: Player | null
  setCurrentPlayer: (player: Player | null) => void
  room: Room | null
  setRoom: (room: Room | null) => void
  createRoom: (playerName: string) => void
  joinRoom: (code: string, playerName: string) => boolean
  startVoting: () => void
  submitVote: (foodId: string, vote: boolean) => void
  resetVoting: () => void
  getFoodOptions: () => FoodOption[]
  getResults: () => { food: FoodOption; votes: number }[]
}

const GameContext = createContext<GameContextType | undefined>(undefined)

const FOOD_OPTIONS: FoodOption[] = [
  { id: "1", name: "Pizza", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=400&h=400&fit=crop", category: "italiana" },
  { id: "2", name: "Sushi", image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=400&h=400&fit=crop", category: "japonesa" },
  { id: "3", name: "Hambúrguer", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=400&fit=crop", category: "americana" },
  { id: "4", name: "Massas", image: "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=400&h=400&fit=crop", category: "italiana" },
  { id: "5", name: "Salada", image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=400&fit=crop", category: "saudável" },
  { id: "6", name: "Frutos do Mar", image: "https://images.unsplash.com/photo-1615141982883-c7ad0e69fd62?w=400&h=400&fit=crop", category: "frutos do mar" },
  { id: "7", name: "Churrasco", image: "https://images.unsplash.com/photo-1529193591184-b1d58069ecdd?w=400&h=400&fit=crop", category: "brasileira" },
  { id: "8", name: "Comida Mexicana", image: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=400&h=400&fit=crop", category: "mexicana" },
  { id: "9", name: "Poke", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop", category: "havaiana" },
  { id: "10", name: "Açaí", image: "https://images.unsplash.com/photo-1590301157890-4810ed352733?w=400&h=400&fit=crop", category: "brasileira" },
  { id: "11", name: "Pastel", image: "https://images.unsplash.com/photo-1601000938259-9e92002320b2?w=400&h=400&fit=crop", category: "brasileira" },
  { id: "12", name: "Sanduíche", image: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&h=400&fit=crop", category: "lanche" },
  { id: "13", name: "Comida Árabe", image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=400&fit=crop", category: "árabe" },
  { id: "14", name: "Ramen", image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop", category: "japonesa" },
]

const AVATARS = ["🍕", "🍔", "🍣", "🌮", "🥗", "🍜", "🥩", "🍝"]

function generateRoomCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"
  let code = ""
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return code
}

function generatePlayerId(): string {
  return Math.random().toString(36).substring(2, 9)
}

export function GameProvider({ children }: { children: ReactNode }) {
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null)
  const [room, setRoom] = useState<Room | null>(null)

  const createRoom = (playerName: string) => {
    const playerId = generatePlayerId()
    const avatar = AVATARS[Math.floor(Math.random() * AVATARS.length)]
    const player: Player = { id: playerId, name: playerName, avatar }
    
    const newRoom: Room = {
      code: generateRoomCode(),
      players: [player],
      currentFoodIndex: 0,
      votes: {},
      isVotingStarted: false,
    }
    
    setCurrentPlayer(player)
    setRoom(newRoom)
  }

  const joinRoom = (code: string, playerName: string): boolean => {
    // In a real app, this would validate against a backend
    // For now, we'll simulate joining
    const playerId = generatePlayerId()
    const avatar = AVATARS[Math.floor(Math.random() * AVATARS.length)]
    const player: Player = { id: playerId, name: playerName, avatar }
    
    if (room && room.code === code) {
      setRoom({
        ...room,
        players: [...room.players, player],
      })
      setCurrentPlayer(player)
      return true
    }
    
    // Create a new room with this code for demo purposes
    const newRoom: Room = {
      code: code.toUpperCase(),
      players: [player],
      currentFoodIndex: 0,
      votes: {},
      isVotingStarted: false,
    }
    
    setCurrentPlayer(player)
    setRoom(newRoom)
    return true
  }

  const startVoting = () => {
    if (room) {
      setRoom({
        ...room,
        isVotingStarted: true,
        currentFoodIndex: 0,
        votes: {},
      })
    }
  }

  const submitVote = (foodId: string, vote: boolean) => {
    if (room && currentPlayer) {
      const newVotes = { ...room.votes }
      if (!newVotes[foodId]) {
        newVotes[foodId] = []
      }
      if (vote) {
        newVotes[foodId].push(true)
      }
      
      setRoom({
        ...room,
        votes: newVotes,
        currentFoodIndex: room.currentFoodIndex + 1,
      })
    }
  }

  const resetVoting = () => {
    if (room) {
      setRoom({
        ...room,
        currentFoodIndex: 0,
        votes: {},
        isVotingStarted: true,
      })
    }
  }

  const getFoodOptions = () => FOOD_OPTIONS

  const getResults = () => {
    if (!room) return []
    
    const results = FOOD_OPTIONS.map(food => ({
      food,
      votes: room.votes[food.id]?.length || 0,
    }))
    
    return results.sort((a, b) => b.votes - a.votes)
  }

  return (
    <GameContext.Provider
      value={{
        currentPlayer,
        setCurrentPlayer,
        room,
        setRoom,
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
  )
}

export function useGame() {
  const context = useContext(GameContext)
  if (context === undefined) {
    throw new Error("useGame must be used within a GameProvider")
  }
  return context
}
