import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { mockDmRooms } from '../mocks/mockDmRooms'
import type { DmRoom } from '../types/dm'

interface DmState {
  rooms: DmRoom[]
  activeRoomId?: string
  unreadCounts: Record<string, number>
  setRooms: (rooms: DmRoom[]) => void
  setActiveRoomId: (roomId: string) => void
  setUnreadCounts: (unreadCounts: Record<string, number>) => void
}

export const useDmStore = create<DmState>()(
  persist(
    (set) => ({
      rooms: mockDmRooms,
      activeRoomId: mockDmRooms[0]?.id,
      unreadCounts: {
        'dm-2': 1,
        'dm-3': 3,
      },
      setRooms: (rooms) => set({ rooms }),
      setActiveRoomId: (activeRoomId) => set({ activeRoomId }),
      setUnreadCounts: (unreadCounts) => set({ unreadCounts }),
    }),
    {
      name: 'chattr-dm-store',
      partialize: (state) => ({
        activeRoomId: state.activeRoomId,
        rooms: state.rooms,
        unreadCounts: state.unreadCounts,
      }),
    },
  ),
)
