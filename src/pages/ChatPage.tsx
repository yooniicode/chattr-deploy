import { Trash2, UserPlus, X } from 'lucide-react'
import { useState, type MouseEvent } from 'react'
import { channelApi } from '../api/channelApi'
import { messageApi } from '../api/messageApi'
import { fileApi } from '../api/fileApi'
import { ChatInput } from '../components/chat/ChatInput'
import { MessageList } from '../components/chat/MessageList'
import { Avatar } from '../components/common/Avatar'
import { ChannelSidebar } from '../components/layout/ChannelSidebar'
import { MainLayout } from '../components/layout/MainLayout'
import { WorkspaceRoleBadge } from '../components/workspace/WorkspaceRoleBadge'
import { useAuthStore } from '../stores/useAuthStore'
import { useChannelStore } from '../stores/useChannelStore'
import { useMessageStore } from '../stores/useMessageStore'
import { useWorkspaceStore } from '../stores/useWorkspaceStore'
import type { Message } from '../types/message'
import { channelSocket } from '../websocket/channelSocket'

function ChannelMemberModal({ activeUserId, onClose }: { activeUserId: string; onClose: () => void }) {
  const { activeChannelId, addChannelMembers, channelMemberIds } = useChannelStore()
  const { workspaceMembers } = useWorkspaceStore()
  const currentChannelMemberIds = activeChannelId ? (channelMemberIds[activeChannelId] ?? []) : []
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(currentChannelMemberIds)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const newMemberIds = selectedMemberIds.filter((memberId) => !currentChannelMemberIds.includes(memberId))
  const canAdd = Boolean(activeChannelId && newMemberIds.length > 0)

  const toggleMember = (memberId: string) => {
    if (currentChannelMemberIds.includes(memberId)) return
    setSelectedMemberIds((current) =>
      current.includes(memberId) ? current.filter((id) => id !== memberId) : [...current, memberId],
    )
  }

  const handleAdd = async () => {
    if (!activeChannelId || !canAdd) return
    setIsSubmitting(true)
    setError(null)
    try {
      await Promise.all(newMemberIds.map((userId) => channelApi.addChannelMember(activeChannelId, userId)))
      addChannelMembers(activeChannelId, newMemberIds)
      onClose()
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setError(message ?? '멤버 추가 중 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-30 grid place-items-center bg-slate-950/35 px-4">
      <section className="w-full max-w-[34rem] overflow-hidden rounded-xl border border-slate-300 bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-base font-extrabold text-slate-950">채널 멤버 추가</h2>
            <p className="mt-1 text-xs font-medium text-slate-500">
              워크스페이스 멤버 중 채널에 추가할 멤버를 선택하세요.
            </p>
          </div>
          <button
            aria-label="채널 멤버 추가 닫기"
            className="rounded-md p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
            onClick={onClose}
            type="button"
          >
            <X size={18} />
          </button>
        </header>

        <div className="px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-800">멤버 추가</h3>
              <p className="mt-1 text-xs font-medium text-slate-500">
                기존 채널 멤버들은 체크된 표시로 나타나며 수정 불가합니다.
              </p>
            </div>
            <span className="text-xs font-bold text-slate-500">{selectedMemberIds.length}명 선택</span>
          </div>

          <div className="mt-3 h-72 overflow-y-auto rounded-lg border border-slate-200 bg-[#fbfbff] p-2">
            {workspaceMembers.map((member) => {
              const isExistingMember = currentChannelMemberIds.includes(member.user.id)
              const checked = selectedMemberIds.includes(member.user.id)

              return (
                <label
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                    isExistingMember ? 'cursor-not-allowed opacity-70' : 'cursor-pointer hover:bg-white'
                  }`}
                  key={member.id}
                >
                  <span className="relative inline-flex">
                    <Avatar name={member.user.name} size={34} src={member.user.avatarUrl} />
                    {member.user.status === 'online' ? (
                      <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-[#fbfbff] bg-emerald-500" />
                    ) : null}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-sm font-bold text-slate-800">
                    {member.user.name}
                    {member.user.id === activeUserId ? <span className="ml-1 text-[#0058BE]">(나)</span> : null}
                  </span>
                  <WorkspaceRoleBadge role={member.role} />
                  <input
                    checked={checked}
                    className="size-4 rounded border-slate-300 text-[#0058BE] disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={isExistingMember}
                    onChange={() => toggleMember(member.user.id)}
                    type="checkbox"
                  />
                </label>
              )
            })}
          </div>

          {error ? (
            <p className="mt-3 text-xs font-medium text-red-500">{error}</p>
          ) : null}
          <button
            className="mt-3 h-10 w-full rounded-lg bg-[#0058BE] text-sm font-bold text-white transition-colors hover:bg-[#004EA8] disabled:cursor-not-allowed disabled:opacity-45"
            disabled={!canAdd || isSubmitting}
            onClick={() => { void handleAdd() }}
            type="button"
          >
            {isSubmitting ? '추가 중...' : '멤버 추가'}
          </button>
        </div>
      </section>
    </div>
  )
}

function ChannelHeader() {
  const [memberModalOpen, setMemberModalOpen] = useState(false)
  const [permissionNotice, setPermissionNotice] = useState<{ left: number; top: number } | null>(null)
  const { activeChannelId, channels, deleteChannel } = useChannelStore()
  const deleteChannelMessages = useMessageStore((state) => state.deleteChannelMessages)
  const authUser = useAuthStore((state) => state.user)
  const { activeWorkspaceId, workspaceMembers } = useWorkspaceStore()
  const activeUserId = authUser?.id ?? ''
  const activeChannel = channels.find(
    (channel) => channel.id === activeChannelId && channel.workspaceId === activeWorkspaceId,
  )
  const hasActiveChannel = Boolean(activeChannel)
  const currentRole = workspaceMembers.find((member) => member.user.id === activeUserId)?.role ?? 'member'

  const showPermissionNotice = (event: MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setPermissionNotice({
      left: Math.max(16, Math.min(rect.right + 10, window.innerWidth - 316)),
      top: Math.max(16, Math.min(rect.top - 10, window.innerHeight - 100)),
    })
  }

  const handleDeleteChannel = (event: MouseEvent<HTMLButtonElement>) => {
    if (!activeChannel) return

    if (currentRole !== 'admin') {
      showPermissionNotice(event)
      return
    }

    deleteChannelMessages(activeChannel.id)
    deleteChannel(activeChannel.id)
    setPermissionNotice(null)
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-300 bg-[#fbfbff] px-6">
      {memberModalOpen && hasActiveChannel ? (
        <ChannelMemberModal activeUserId={activeUserId} onClose={() => setMemberModalOpen(false)} />
      ) : null}
      {permissionNotice ? (
        <div
          className="fixed z-40 w-[18.75rem] rounded-lg border border-slate-300 bg-white p-3 text-xs font-bold leading-5 text-slate-700 shadow-xl"
          style={{ left: permissionNotice.left, top: permissionNotice.top }}
        >
          <div className="flex items-start justify-between gap-3">
            <p>채널 삭제는 해당 워크스페이스의 admin 멤버만 가능합니다.</p>
            <button
              aria-label="채널 삭제 권한 안내 닫기"
              className="shrink-0 text-slate-400 transition-colors hover:text-slate-700"
              onClick={() => setPermissionNotice(null)}
              type="button"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ) : null}
      <h1 className="flex items-center gap-2 text-sm font-extrabold text-slate-950">
        {activeChannel ? (
          <>
            <span className="text-lg text-[#0058BE]">#</span>
            <span>{activeChannel.name}</span>
          </>
        ) : (
          <span className="text-slate-500">채널 없음</span>
        )}
      </h1>
      <div className="flex items-center gap-3">
        <button
          aria-label="채널 멤버 추가"
          className="grid size-7 place-items-center text-slate-700 hover:text-[#0058BE] disabled:cursor-not-allowed disabled:opacity-35"
          disabled={!hasActiveChannel}
          onClick={() => setMemberModalOpen(true)}
          type="button"
        >
          <UserPlus size={20} />
        </button>
        <button
          aria-label="채널 삭제"
          className="grid size-7 place-items-center text-slate-700 hover:text-[#BA1A1A] disabled:cursor-not-allowed disabled:opacity-35"
          disabled={!hasActiveChannel}
          onClick={handleDeleteChannel}
          type="button"
        >
          <Trash2 size={20} />
        </button>
      </div>
    </header>
  )
}

export function ChatPage() {
  const { activeChannelId, channels, clearOpenedUnreadCount, openedUnreadCounts } = useChannelStore()
  const { channelMessagesByRoomId, updateChannelMessages } = useMessageStore()
  const { activeWorkspaceId } = useWorkspaceStore()
  const [replyTarget, setReplyTarget] = useState<Message | null>(null)
  const activeChannel = channels.find(
    (channel) => channel.id === activeChannelId && channel.workspaceId === activeWorkspaceId,
  )
  const messages = activeChannel ? (channelMessagesByRoomId[activeChannel.id] ?? []) : []

  const updateActiveMessages = (updater: (messages: Message[]) => Message[]) => {
    if (!activeChannel) return
    updateChannelMessages(activeChannel.id, updater)
  }

  const handleSendMessage = async (content: string, file?: File) => {
    if (!activeChannel) return

    let attachments: { url: string; name: string; size: number; contentType: string }[] | undefined

    if (file) {
      const { presignedUrl, fileUrl } = await fileApi.getPresignedUrl(file.name, file.type)
      await fileApi.uploadToS3(presignedUrl, file)
      attachments = [{ url: fileUrl, name: file.name, size: file.size, contentType: file.type }]
    }

    channelSocket.sendMessage(activeChannel.id, content, {
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

  return (
    <MainLayout header={<ChannelHeader />} sidebar={<ChannelSidebar />}>
      {activeChannel ? (
        <>
          <MessageList
            messages={messages}
            onDeleteMessage={handleDeleteMessage}
            onEditMessage={handleEditMessage}
            onReadToBottom={() => {
              if (activeChannel) clearOpenedUnreadCount(activeChannel.id)
            }}
            onReplyMessage={setReplyTarget}
            unreadCount={activeChannel ? openedUnreadCounts[activeChannel.id] : 0}
          />
          <ChatInput
            onCancelReply={() => setReplyTarget(null)}
            onSend={(content, file) => { void handleSendMessage(content, file) }}
            replyTarget={replyTarget}
          />
        </>
      ) : (
        <div className="grid min-h-0 flex-1 place-items-center bg-[#fbfbff] px-6 text-center">
          <p className="text-sm font-bold text-slate-500">채널을 생성 후 채널을 선택해야 채팅방이 보입니다.</p>
        </div>
      )}
    </MainLayout>
  )
}
