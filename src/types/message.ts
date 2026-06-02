import type { User } from './user'

export type MessageType = 'text' | 'file'

export interface BackendMessage {
  id: string
  roomId: string
  roomType?: 'CHANNEL' | 'DM'
  senderId: string
  senderNickname: string | null
  senderAvatarUrl: string | null
  type: MessageType
  content: string | null
  attachments?: { fileUrl: string; fileName: string }[]
  parentMessageId?: string
  createdAt: string
  updatedAt?: string
  editedAt?: string
  deletedAt?: string
}

export interface FileAttachment {
  id: string
  name: string
  url: string
  size: number
  contentType: string
}

export interface Message {
  id: string
  roomId: string
  author: User
  type: MessageType
  content: string
  attachments?: FileAttachment[]
  parentMessageId?: string
  displayTime?: string
  codeBlock?: string
  imagePreviewUrl?: string
  replyPreview?: {
    authorName: string
    content: string
  }
  createdAt: string
  updatedAt?: string
}
