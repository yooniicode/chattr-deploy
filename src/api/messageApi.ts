import { axiosInstance } from './axiosInstance'
import type { Message } from '../types/message'

export type RoomType = 'CHANNEL' | 'DM'

interface MessagePageResponse {
  content?: Message[]
}

function extractMessages(response: Message[] | MessagePageResponse | null | undefined) {
  if (Array.isArray(response)) return response
  return response?.content ?? []
}

export const messageApi = {
  getMessages: async (roomId: string, roomType: RoomType, cursor?: string, size = 30) => {
    const params: Record<string, string | number> = { roomId, roomType, size }
    if (cursor) params.cursor = cursor
    const { data } = await axiosInstance.get<Message[] | MessagePageResponse | null>('/messages', { params })
    return extractMessages(data)
  },
  deleteMessage: async (messageId: string) => {
    await axiosInstance.delete(`/messages/${messageId}`)
  },
  editMessage: async (messageId: string, content: string) => {
    const { data } = await axiosInstance.patch<Message>(`/messages/${messageId}`, { content })
    return data
  },
  updateReadCursor: async (roomId: string, roomType: RoomType, messageId: string) => {
    await axiosInstance.patch('/messages/read-cursor', { roomId, roomType, messageId })
  },
  getUnreadCount: async (roomId: string) => {
    const { data } = await axiosInstance.get<{ count: number }>('/messages/unread-count', {
      params: { roomId },
    })
    return data
  },
}
