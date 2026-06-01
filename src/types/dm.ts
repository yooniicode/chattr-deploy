import type { Message } from './message'
import type { User } from './user'

export interface BackendDmRoom {
  id: string
  userAId: string
  userBId: string
  otherUserId: string
  createdAt: string
}

export interface DmRoom {
  id: string
  otherUserId: string
  participants: User[]
  lastMessage?: Message
  updatedAt: string
}
