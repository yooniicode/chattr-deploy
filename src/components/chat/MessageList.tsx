import type { Message } from '../../types/message'
import { sortMessagesByCreatedAt } from '../../utils/message'
import { ChatMessage } from './ChatMessage'

interface MessageListProps {
  messages: Message[]
}

export function MessageList({ messages }: MessageListProps) {
  return (
    <div className="min-h-0 overflow-auto bg-[#fbfbff] px-6 py-5">
      <div className="flex min-w-max flex-col gap-5">
      <div className="mb-1 flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-300" />
        <span className="rounded-full bg-white px-4 py-1 text-xs font-bold text-slate-600">
          2023년 10월 24일 (화)
        </span>
        <div className="h-px flex-1 bg-slate-300" />
      </div>
      {sortMessagesByCreatedAt(messages).map((message) => (
        <ChatMessage key={message.id} message={message} />
      ))}
      </div>
    </div>
  )
}
