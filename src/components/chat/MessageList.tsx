import type { Message } from '../../types/message'
import { sortMessagesByCreatedAt } from '../../utils/message'
import { ChatMessage } from './ChatMessage'

interface MessageListProps {
  messages: Message[]
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="message-list">
      {sortMessagesByCreatedAt(messages).map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
    </div>
  )
}
