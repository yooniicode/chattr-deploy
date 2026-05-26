import type { Message } from '../../types/message'
import { formatDate } from '../../utils/formatDate'
import { Avatar } from '../common/Avatar'

interface ChatMessageProps {
  message: Message
}

export function ChatMessage({ message }: ChatMessageProps) {
  return (
    <article className="message">
      <Avatar name={message.author.name} src={message.author.avatarUrl} />
      <div>
        <strong>{message.author.name}</strong>
        <time dateTime={message.createdAt}>{formatDate(message.createdAt)}</time>
        <p>{message.content}</p>
      </div>
    </article>
  )
}
