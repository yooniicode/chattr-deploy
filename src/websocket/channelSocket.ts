import type { Message } from '../types/message'
import { socketClient } from './socketClient'

export const channelSocket = {
  sendMessage: (message: Message) => socketClient.send('message:new', message),
  onMessage: (listener: (message: Message) => void) => socketClient.on('message:new', listener),
}
