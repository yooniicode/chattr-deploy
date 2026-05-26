import { create } from 'zustand'
import type { DmRoom } from '../types/dm'

interface DmState {
  rooms: DmRoom[]
  activeRoomId?: string
  setRooms: (rooms: DmRoom[]) => void
  setActiveRoomId: (roomId: string) => void
}

export const useDmStore = create<DmState>((set) => ({
  rooms: [],
  setRooms: (rooms) => set({ rooms }),
  setActiveRoomId: (activeRoomId) => set({ activeRoomId }),
}))
