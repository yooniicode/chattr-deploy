import { axiosInstance } from './axiosInstance'
import type { DmRoom } from '../types/dm'
import type { Message } from '../types/message'

export const dmApi = {
  getRooms: async () => {
    const { data } = await axiosInstance.get<DmRoom[]>('/dms')
    return data
  },
  getMessages: async (roomId: string) => {
    const { data } = await axiosInstance.get<Message[]>(`/dms/${roomId}/messages`)
    return data
  },
  sendMessage: async (roomId: string, content: string) => {
    const { data } = await axiosInstance.post<Message>(`/dms/${roomId}/messages`, {
      content,
    })
    return data
  },
}
