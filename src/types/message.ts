import type { User } from './user'

export type MessageType = 'text' | 'file'

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
  createdAt: string
  updatedAt?: string
}
