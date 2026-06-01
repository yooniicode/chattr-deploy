import { useEffect, useRef, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { fileApi } from '../api/fileApi'
import { messageApi } from '../api/messageApi'
import { ChatInput } from '../components/chat/ChatInput'
import { Avatar } from '../components/common/Avatar'
import { DmMessage } from '../components/dm/DmMessage'
import { DmSidebar } from '../components/layout/DmSidebar'
import { MainLayout } from '../components/layout/MainLayout'
import { useAuthStore } from '../stores/useAuthStore'
import { useDmStore } from '../stores/useDmStore'
import { useMessageStore } from '../stores/useMessageStore'
import type { Message } from '../types/message'
import type { User } from '../types/user'
import { formatDateLabel, getDateKey } from '../utils/formatDate'
import { dmSocket } from '../websocket/dmSocket'

function DmHeader({ onDelete, participant }: { onDelete: () => void; participant?: User }) {
  return (
    <header className="flex h-13 items-center justify-between border-b border-slate-300 bg-[#fbfbff] px-6">
      <div className="flex items-center gap-3">
        <span className="relative inline-flex shrink-0">
          <Avatar name={participant?.name ?? 'DM'} size={36} src={participant?.avatarUrl} />
          {participant?.status === 'online' ? (
            <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-[#fbfbff] bg-emerald-500" />
          ) : null}
        </span>
        <h1 className="text-sm font-extrabold text-slate-950">{participant?.name ?? 'Direct Message'}</h1>
      </div>
      <button
        aria-label="DM 삭제"
        className="grid size-7 place-items-center text-slate-700 transition-colors hover:text-[#BA1A1A] disabled:cursor-not-allowed disabled:opacity-35"
        disabled={!participant}
        onClick={onDelete}
        type="button"
      >
        <Trash2 size={20} />
      </button>
    </header>
  )
}

function DmMessageList({
  messages,
  onDeleteMessage,
  onEditMessage,
  onReadToBottom,
  onReplyMessage,
  unreadCount = 0,
}: {
  messages: Message[]
  onDeleteMessage: (messageId: string) => void
  onEditMessage: (messageId: string, content: string) => void
  onReadToBottom?: () => void
  onReplyMessage: (message: Message) => void
  unreadCount?: number
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const readBoundaryRef = useRef<HTMLDivElement>(null)
  const lastMessageId = messages[messages.length - 1]?.id
  const boundaryIndex = unreadCount > 0 && unreadCount < messages.length ? messages.length - unreadCount : -1
  const showReadBoundary = boundaryIndex > 0

  useEffect(() => {
    if (showReadBoundary) {
      readBoundaryRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' })
      return
    }
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [lastMessageId, showReadBoundary])

  const handleScroll = () => {
    const scrollElement = scrollRef.current
    if (!scrollElement || !showReadBoundary) return
    const isAtBottom = scrollElement.scrollTop + scrollElement.clientHeight >= scrollElement.scrollHeight - 8
    if (isAtBottom) onReadToBottom?.()
  }

  return (
    <div
      ref={scrollRef}
      className="flex min-h-0 flex-col gap-3 overflow-y-auto bg-[#fbfbff] px-6 py-4"
      onScroll={handleScroll}
    >
      {messages.map((message, index) => {
        const prevMessage = messages[index - 1]
        const showDateSep =
          !prevMessage || getDateKey(message.createdAt) !== getDateKey(prevMessage.createdAt)
        return (
          <div className="contents" key={message.id}>
            {showDateSep ? (
              <div className="mb-1 flex items-center gap-4">
                <div className="h-px flex-1 bg-slate-300" />
                <span className="rounded-full bg-white px-4 py-1 text-xs font-bold text-slate-600">
                  {formatDateLabel(message.createdAt)}
                </span>
                <div className="h-px flex-1 bg-slate-300" />
              </div>
            ) : null}
            {showReadBoundary && index === boundaryIndex ? (
              <div ref={readBoundaryRef} className="flex justify-center py-2">
                <span className="rounded-full bg-red-50 px-4 py-1.5 text-xs font-bold text-red-500">
                  여기까지 읽으셨습니다
                </span>
              </div>
            ) : null}
            <DmMessage
              message={message}
              onDelete={onDeleteMessage}
              onEdit={onEditMessage}
              onReply={onReplyMessage}
            />
          </div>
        )
      })}
    </div>
  )
}

export function DmPage() {
  const { activeRoomId, clearOpenedUnreadCount, deleteRoom, openedUnreadCounts, rooms } = useDmStore()
  const authUser = useAuthStore((state) => state.user)
  const activeUserId = authUser?.id ?? ''
  const { deleteDmMessages, dmMessagesByRoomId, updateDmMessages } = useMessageStore()
  const [replyTarget, setReplyTarget] = useState<Message | null>(null)

  const activeRoom = rooms.find((room) => room.id === activeRoomId) ?? rooms[0]
  const participant = activeRoom?.participants.find((p) => p.id !== activeUserId) ?? activeRoom?.participants[0]
  const activeRoomIdValue = activeRoom?.id
  const storedMessages = activeRoomIdValue ? dmMessagesByRoomId[activeRoomIdValue] : undefined
  const messages = Array.isArray(storedMessages) ? storedMessages : []

  const updateActiveMessages = (updater: (messages: Message[]) => Message[]) => {
    if (!activeRoomIdValue) return
    updateDmMessages(activeRoomIdValue, updater)
  }

  const handleSendMessage = async (content: string, file?: File) => {
    if (!activeRoomIdValue) return

    let attachments: { url: string; name: string; size: number; contentType: string }[] | undefined

    if (file) {
      const { presignedUrl, fileUrl } = await fileApi.getPresignedUrl(file.name, file.type)
      await fileApi.uploadToS3(presignedUrl, file)
      attachments = [{ url: fileUrl, name: file.name, size: file.size, contentType: file.type }]
    }

    dmSocket.sendMessage(activeRoomIdValue, content, {
      parentMessageId: replyTarget?.id,
      attachments,
    })
    setReplyTarget(null)
  }

  const handleDeleteMessage = (messageId: string) => {
    void messageApi.deleteMessage(messageId).then(() =>
      updateActiveMessages((current) => current.filter((message) => message.id !== messageId)),
    )
  }

  const handleEditMessage = (messageId: string, content: string) => {
    void messageApi.editMessage(messageId, content).then((updated) =>
      updateActiveMessages((current) =>
        current.map((message) => (message.id === messageId ? updated : message)),
      ),
    )
  }

  const handleDeleteRoom = () => {
    if (!activeRoomIdValue) return
    deleteDmMessages(activeRoomIdValue)
    deleteRoom(activeRoomIdValue)
    setReplyTarget(null)
  }

  return (
    <MainLayout header={<DmHeader onDelete={handleDeleteRoom} participant={participant} />} sidebar={<DmSidebar />}>
      <DmMessageList
        messages={messages}
        onDeleteMessage={handleDeleteMessage}
        onEditMessage={handleEditMessage}
        onReadToBottom={() => {
          if (activeRoomIdValue) clearOpenedUnreadCount(activeRoomIdValue)
        }}
        onReplyMessage={setReplyTarget}
        unreadCount={activeRoomIdValue ? openedUnreadCounts[activeRoomIdValue] : 0}
      />
      <ChatInput
        compact
        helperText="Enter를 눌러 메시지 전송, Shift + Enter로 줄바꿈"
        onCancelReply={() => setReplyTarget(null)}
        onSend={(content, file) => { void handleSendMessage(content, file) }}
        replyTarget={replyTarget}
      />
    </MainLayout>
  )
}
