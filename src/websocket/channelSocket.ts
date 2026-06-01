import type { BackendMessage } from '../types/message'
import { socketClient } from './socketClient'
import type { MessageSendRequest } from './socketTypes'

type SendOptions = Pick<MessageSendRequest, 'parentMessageId' | 'attachments'>

export const channelSocket = {
  sendMessage: (roomId: string, content: string, options?: SendOptions) =>
    socketClient.send({ roomId, roomType: 'CHANNEL', content, ...options }),
  subscribe: (roomId: string, callback: (message: BackendMessage) => void) =>
    socketClient.subscribe(roomId, callback),
}
