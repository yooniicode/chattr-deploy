import { axiosInstance } from './axiosInstance'
import type { BackendMessage, FileAttachment, Message } from '../types/message'
import type { User } from '../types/user'

export type RoomType = 'CHANNEL' | 'DM'

interface MessagePageResponse {
  content?: BackendMessage[]
}

interface UnreadCountResponse {
  roomId: string
  roomType: RoomType
  unreadCount: number
}

function extractMessages(response: BackendMessage[] | MessagePageResponse | null | undefined): BackendMessage[] {
  if (Array.isArray(response)) return response
  return response?.content ?? []
}

export function mapMessage(raw: BackendMessage): Message {
  const author: User = {
    id: raw.senderId,
    name: raw.senderNickname ?? '알 수 없는 사용자',
    avatarUrl: raw.senderAvatarUrl ?? undefined,
    email: '',
    status: 'offline',
  }
  const attachments: FileAttachment[] | undefined = raw.attachments?.map((a) => ({
    id: a.fileUrl,
    name: a.fileName,
    url: a.fileUrl,
    size: 0,
    contentType: '',
  }))
  return {
    id: raw.id,
    roomId: raw.roomId,
    author,
    type: raw.type,
    content: raw.content ?? '',
    attachments,
    parentMessageId: raw.parentMessageId,
    createdAt: raw.createdAt,
    updatedAt: raw.updatedAt,
  }
}

export const messageApi = {
  getMessages: async (roomId: string, roomType: RoomType, cursor?: string, size = 30) => {
    const params: Record<string, string | number> = { roomId, roomType, size }
    if (cursor) params.cursor = cursor
    const { data } = await axiosInstance.get<BackendMessage[] | MessagePageResponse | null>('/messages', { params })
    return extractMessages(data)
  },
  deleteMessage: async (messageId: string) => {
    await axiosInstance.delete(`/messages/${messageId}`)
  },
  editMessage: async (messageId: string, content: string) => {
    const { data } = await axiosInstance.patch<Message>(`/messages/${messageId}`, { content })
    return data
  },
  updateReadCursor: async (roomId: string, roomType: RoomType, lastReadMessageId: string) => {
    await axiosInstance.patch('/messages/read-cursor', { roomId, roomType, lastReadMessageId })
  },
  getUnreadCount: async (roomId: string, roomType: RoomType) => {
    const { data } = await axiosInstance.get<UnreadCountResponse>('/messages/unread-count', {
      params: { roomId, roomType },
    })
    return data
  },
}
