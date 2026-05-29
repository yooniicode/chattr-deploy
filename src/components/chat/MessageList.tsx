import { useEffect, useRef } from 'react'
import type { Message } from '../../types/message'
import { sortMessagesByCreatedAt } from '../../utils/message'
import { ChatMessage } from './ChatMessage'

interface MessageListProps {
  messages: Message[]
  onDeleteMessage?: (messageId: string) => void
  onEditMessage?: (messageId: string, content: string) => void
  onReadToBottom?: () => void
  onReplyMessage?: (message: Message) => void
  unreadCount?: number
}

function ReadBoundary() {
  return (
    <div className="flex justify-center py-2">
      <span className="rounded-full bg-red-50 px-4 py-1.5 text-xs font-bold text-red-500">
        여기까지 읽으셨습니다
      </span>
    </div>
  )
}

export function MessageList({
  messages,
  onDeleteMessage,
  onEditMessage,
  onReadToBottom,
  onReplyMessage,
  unreadCount = 0,
}: MessageListProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const readBoundaryRef = useRef<HTMLDivElement>(null)
  const sortedMessages = sortMessagesByCreatedAt(messages)
  const lastMessageId = sortedMessages[sortedMessages.length - 1]?.id
  const boundaryIndex =
    unreadCount > 0 && unreadCount < sortedMessages.length ? sortedMessages.length - unreadCount : -1
  const showReadBoundary = boundaryIndex > 0

  useEffect(() => {
    if (showReadBoundary) {
      readBoundaryRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      })
      return
    }

    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [lastMessageId, showReadBoundary])

  const handleScroll = () => {
    const scrollElement = scrollRef.current
    if (!scrollElement || !showReadBoundary) return

    const isAtBottom = scrollElement.scrollTop + scrollElement.clientHeight >= scrollElement.scrollHeight - 8
    if (isAtBottom) {
      onReadToBottom?.()
    }
  }

  return (
    <div ref={scrollRef} className="min-h-0 overflow-auto bg-[#fbfbff] px-6 py-5" onScroll={handleScroll}>
      <div className="flex min-w-max flex-col gap-5">
      <div className="mb-1 flex items-center gap-4">
        <div className="h-px flex-1 bg-slate-300" />
        <span className="rounded-full bg-white px-4 py-1 text-xs font-bold text-slate-600">
          2023년 10월 24일 (화)
        </span>
        <div className="h-px flex-1 bg-slate-300" />
      </div>
      {sortedMessages.map((message, index) => (
        <div className="contents" key={message.id}>
          {showReadBoundary && index === boundaryIndex ? (
            <div ref={readBoundaryRef}>
              <ReadBoundary />
            </div>
          ) : null}
          <ChatMessage
            message={message}
            onDelete={onDeleteMessage}
            onEdit={onEditMessage}
            onReply={onReplyMessage}
          />
        </div>
      ))}
      </div>
    </div>
  )
}
