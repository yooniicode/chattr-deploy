import type { Message } from '../../types/message'
import { ChatMessage } from '../chat/ChatMessage'

interface DmMessageProps {
  message: Message
}

export function DmMessage({ message }: DmMessageProps) {
  return <ChatMessage message={message} />
}
