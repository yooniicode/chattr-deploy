import type { Message } from './message'
import type { UserStatus } from './user'

export type SocketEventName =
  | 'message:new'
  | 'message:update'
  | 'message:delete'
  | 'user:status'

export interface SocketEventMap {
  'message:new': Message
  'message:update': Message
  'message:delete': { messageId: string }
  'user:status': { userId: string; status: UserStatus }
}
