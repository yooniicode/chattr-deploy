import { create } from 'zustand'
import { dmApi } from '../api/dmApi'
import { userApi } from '../api/userApi'
import type { BackendDmRoom, DmRoom } from '../types/dm'
import type { User } from '../types/user'

const resolveOtherUserId = (room: BackendDmRoom, currentUserId?: string, fallbackUserId?: string) => {
  if (fallbackUserId) return fallbackUserId
  if (!currentUserId) return room.otherUserId
  if (room.otherUserId && room.otherUserId !== currentUserId) return room.otherUserId
  return room.userAId === currentUserId ? room.userBId : room.userAId
}

const createFallbackUser = (userId: string): User => ({
  id: userId,
  email: '',
  name: '알 수 없는 사용자',
  status: 'offline',
})

const mapBackendDmRoom = (
  room: BackendDmRoom,
  users: User[] = [],
  currentUserId?: string,
  fallbackUserId?: string,
): DmRoom => {
  const resolvedOtherUserId = resolveOtherUserId(room, currentUserId, fallbackUserId)
  const participant = users.find((user) => user.id === resolvedOtherUserId) ?? createFallbackUser(resolvedOtherUserId)

  return {
    id: room.id,
    otherUserId: resolvedOtherUserId,
    participants: [participant],
    updatedAt: room.createdAt,
  }
}

const fetchUsersSafely = async () => {
  try {
    return await userApi.getUsers()
  } catch {
    return []
  }
}

interface DmState {
  rooms: DmRoom[]
  activeRoomId?: string
  unreadCounts: Record<string, number>
  openedUnreadCounts: Record<string, number>
  clearOpenedUnreadCount: (roomId: string) => void
  deleteRoom: (roomId: string) => void
  markRoomOpened: (roomId: string) => void
  setRooms: (rooms: DmRoom[]) => void
  setActiveRoomId: (roomId: string) => void
  setUnreadCounts: (unreadCounts: Record<string, number>) => void
  createRoom: (targetUser: User) => Promise<DmRoom>
  fetchDmRooms: (currentUserId?: string) => Promise<void>
  replaceDmState: (state: {
    activeRoomId?: string
    openedUnreadCounts: Record<string, number>
    rooms: DmRoom[]
    unreadCounts: Record<string, number>
  }) => void
}

export const useDmStore = create<DmState>()((set) => ({
  rooms: [],
  activeRoomId: undefined,
  unreadCounts: {},
  openedUnreadCounts: {},
  clearOpenedUnreadCount: (roomId) =>
    set((state) => {
      const nextOpenedCounts = { ...state.openedUnreadCounts }
      delete nextOpenedCounts[roomId]
      return { openedUnreadCounts: nextOpenedCounts }
    }),
  deleteRoom: (roomId) =>
    set((state) => {
      const nextRooms = state.rooms.filter((room) => room.id !== roomId)
      const nextOpenedCounts = { ...state.openedUnreadCounts }
      const nextUnreadCounts = { ...state.unreadCounts }
      delete nextOpenedCounts[roomId]
      delete nextUnreadCounts[roomId]

      return {
        activeRoomId: state.activeRoomId === roomId ? nextRooms[0]?.id : state.activeRoomId,
        openedUnreadCounts: nextOpenedCounts,
        rooms: nextRooms,
        unreadCounts: nextUnreadCounts,
      }
    }),
  markRoomOpened: (roomId) =>
    set((state) => {
      const unreadCount = state.unreadCounts[roomId] ?? 0
      const nextUnreadCounts = { ...state.unreadCounts }
      const nextOpenedCounts = { ...state.openedUnreadCounts }
      delete nextUnreadCounts[roomId]
      if (unreadCount > 0) {
        nextOpenedCounts[roomId] = unreadCount
      }

      return {
        activeRoomId: roomId,
        openedUnreadCounts: nextOpenedCounts,
        unreadCounts: nextUnreadCounts,
      }
    }),
  setRooms: (rooms) => set({ rooms }),
  setActiveRoomId: (activeRoomId) => set({ activeRoomId }),
  setUnreadCounts: (unreadCounts) => set({ unreadCounts }),
  createRoom: async (targetUser) => {
    const backendRoom = await dmApi.createRoom(targetUser.id)
    const room = mapBackendDmRoom(backendRoom, [targetUser], undefined, targetUser.id)

    set((state) => {
      const existingRoom = state.rooms.find(
        (item) =>
          item.id === room.id ||
          item.otherUserId === targetUser.id ||
          item.participants.some((participant) => participant.id === targetUser.id),
      )

      if (existingRoom) {
        return {
          activeRoomId: existingRoom.id,
          rooms: state.rooms.map((item) => (item.id === existingRoom.id ? { ...existingRoom, ...room } : item)),
        }
      }

      return {
        activeRoomId: room.id,
        rooms: [room, ...state.rooms],
      }
    })

    return room
  },
  fetchDmRooms: async (currentUserId) => {
    const [backendRooms, users] = await Promise.all([dmApi.getRooms(), fetchUsersSafely()])
    const rooms = backendRooms.map((room) => mapBackendDmRoom(room, users, currentUserId))
    set((state) => ({
      activeRoomId:
        state.activeRoomId && rooms.some((room) => room.id === state.activeRoomId)
          ? state.activeRoomId
          : rooms[0]?.id,
      rooms,
    }))
  },
  replaceDmState: (nextState) => set(nextState),
}))
