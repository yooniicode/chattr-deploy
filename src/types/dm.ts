import type { Message } from './message'
import type { User } from './user'

export interface DmRoom {
  id: string
  participants: User[]
  lastMessage?: Message
  updatedAt: string
}
