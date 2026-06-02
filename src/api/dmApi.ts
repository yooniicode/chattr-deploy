import { axiosInstance } from './axiosInstance'
import type { BackendDmRoom } from '../types/dm'

interface PageResponse<T> {
  content?: T[]
}

const extractRooms = (response: BackendDmRoom[] | PageResponse<BackendDmRoom> | null | undefined) => {
  if (!response) return []
  if (Array.isArray(response)) return response
  return response.content ?? []
}

export const dmApi = {
  getRooms: async () => {
    const { data } = await axiosInstance.get<BackendDmRoom[] | PageResponse<BackendDmRoom> | null>('/dms')
    return extractRooms(data)
  },
  createRoom: async (targetUserId: string) => {
    const { data } = await axiosInstance.post<BackendDmRoom>('/dms', { targetUserId })
    return data
  },
  deleteRoom: async (dmId: string) => {
    await axiosInstance.delete(`/dms/${dmId}`)
  },
}
