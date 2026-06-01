import { Settings, Trash2, UserPlus, X } from 'lucide-react'
import { useState } from 'react'
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
import type { Channel } from '../types/channel'
import type { Message } from '../types/message'
import { channelSocket } from '../websocket/channelSocket'

function ChannelEditModal({ channel, onClose }: { channel: Channel; onClose: () => void }) {
  const updateChannel = useChannelStore((state) => state.updateChannel)
  const [name, setName] = useState(channel.name)
  const [description, setDescription] = useState(channel.description ?? '')
  const [topic, setTopic] = useState(channel.topic ?? '')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isDirty =
    name.trim() !== channel.name ||
    description !== (channel.description ?? '') ||
    topic !== (channel.topic ?? '')

  const handleSave = async () => {
    const trimmedName = name.trim()
    if (!trimmedName || isSubmitting) return
    setIsSubmitting(true)
    setError(null)
    try {
      const updated = await channelApi.updateChannel(channel.id, {
        name: trimmedName,
        description: description.trim() || undefined,
        topic: topic.trim() || undefined,
      })
      updateChannel(channel.id, updated)
      onClose()
    } catch (err) {
      const status = (err as { response?: { status?: number } })?.response?.status
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      if (status === 403) setError('채널 수정 권한이 없습니다.')
      else setError(message ?? '채널 수정 중 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-30 grid place-items-center bg-slate-950/35 px-4">
      <section className="w-full max-w-[34rem] overflow-hidden rounded-xl border border-slate-300 bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-base font-extrabold text-slate-950">채널 수정</h2>
            <p className="mt-1 text-xs font-medium text-slate-500">채널 이름, 설명, 토픽을 수정하세요.</p>
          </div>
          <button
            aria-label="채널 수정 닫기"
            className="rounded-md p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
            onClick={onClose}
            type="button"
          >
            <X size={18} />
          </button>
        </header>
        <div className="px-6 py-5 space-y-4">
          <div>
            <label className="block text-sm font-bold text-slate-800" htmlFor="channel-edit-name">
              채널명
            </label>
            <input
              autoFocus
              className="mt-2 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm font-medium outline-none transition-colors placeholder:text-slate-400 focus:border-[#0058BE] focus:ring-2 focus:ring-[#0058BE]/20"
              id="channel-edit-name"
              onChange={(e) => setName(e.target.value)}
              placeholder="채널명"
              value={name}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-800" htmlFor="channel-edit-description">
              설명
            </label>
            <input
              className="mt-2 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm font-medium outline-none transition-colors placeholder:text-slate-400 focus:border-[#0058BE] focus:ring-2 focus:ring-[#0058BE]/20"
              id="channel-edit-description"
              onChange={(e) => setDescription(e.target.value)}
              placeholder="채널 설명 (선택)"
              value={description}
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-slate-800" htmlFor="channel-edit-topic">
              토픽
            </label>
            <input
              className="mt-2 h-10 w-full rounded-lg border border-slate-300 px-3 text-sm font-medium outline-none transition-colors placeholder:text-slate-400 focus:border-[#0058BE] focus:ring-2 focus:ring-[#0058BE]/20"
              id="channel-edit-topic"
              onChange={(e) => setTopic(e.target.value)}
              placeholder="채널 토픽 (선택)"
              value={topic}
            />
          </div>
          {error ? <p className="text-xs font-medium text-red-500">{error}</p> : null}
          <button
            className="h-10 w-full rounded-lg bg-[#0058BE] text-sm font-bold text-white transition-colors hover:bg-[#004EA8] disabled:cursor-not-allowed disabled:opacity-45"
            disabled={!name.trim() || !isDirty || isSubmitting}
            onClick={() => { void handleSave() }}
            type="button"
          >
            {isSubmitting ? '저장 중...' : '저장'}
          </button>
        </div>
      </section>
    </div>
  )
}

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
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)
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

  const handleConfirmDelete = async () => {
    if (!activeChannel || isDeleting) return
    setIsDeleting(true)
    setDeleteError(null)
    try {
      await channelApi.deleteChannel(activeChannel.id)
      deleteChannelMessages(activeChannel.id)
      deleteChannel(activeChannel.id)
      setDeleteConfirmOpen(false)
    } catch (err) {
      const status = (err as { response?: { status?: number } })?.response?.status
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      if (status === 403) setDeleteError('채널 삭제 권한이 없습니다.')
      else setDeleteError(message ?? '채널 삭제 중 오류가 발생했습니다.')
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-300 bg-[#fbfbff] px-6">
      {memberModalOpen && hasActiveChannel ? (
        <ChannelMemberModal activeUserId={activeUserId} onClose={() => setMemberModalOpen(false)} />
      ) : null}
      {editModalOpen && activeChannel ? (
        <ChannelEditModal channel={activeChannel} onClose={() => setEditModalOpen(false)} />
      ) : null}
      {deleteConfirmOpen && activeChannel ? (
        <div className="fixed inset-0 z-30 grid place-items-center bg-slate-950/35 px-4">
          <div className="w-full max-w-xs rounded-xl border border-slate-300 bg-white p-6 shadow-2xl">
            <h2 className="text-sm font-extrabold text-slate-950">채널 삭제</h2>
            <p className="mt-2 text-xs font-medium text-slate-600">
              <span className="font-bold text-slate-950">#{activeChannel.name}</span> 채널을 삭제하시겠습니까?<br />
              삭제된 채널은 복구할 수 없습니다.
            </p>
            {deleteError ? <p className="mt-2 text-xs font-medium text-red-500">{deleteError}</p> : null}
            <div className="mt-5 flex gap-2">
              <button
                className="flex-1 h-9 rounded-lg border border-slate-300 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-50"
                onClick={() => { setDeleteConfirmOpen(false); setDeleteError(null) }}
                type="button"
              >
                취소
              </button>
              <button
                className="flex-1 h-9 rounded-lg bg-[#BA1A1A] text-sm font-bold text-white transition-colors hover:bg-[#9f1515] disabled:opacity-45"
                disabled={isDeleting}
                onClick={() => { void handleConfirmDelete() }}
                type="button"
              >
                {isDeleting ? '삭제 중...' : '삭제'}
              </button>
            </div>
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
        {currentRole === 'admin' ? (
          <button
            aria-label="채널 수정"
            className="grid size-7 place-items-center text-slate-700 hover:text-[#0058BE] disabled:cursor-not-allowed disabled:opacity-35"
            disabled={!hasActiveChannel}
            onClick={() => setEditModalOpen(true)}
            type="button"
          >
            <Settings size={20} />
          </button>
        ) : null}
        <button
          aria-label="채널 멤버 추가"
          className="grid size-7 place-items-center text-slate-700 hover:text-[#0058BE] disabled:cursor-not-allowed disabled:opacity-35"
          disabled={!hasActiveChannel}
          onClick={() => setMemberModalOpen(true)}
          type="button"
        >
          <UserPlus size={20} />
        </button>
        {currentRole === 'admin' ? (
          <button
            aria-label="채널 삭제"
            className="grid size-7 place-items-center text-slate-700 hover:text-[#BA1A1A] disabled:cursor-not-allowed disabled:opacity-35"
            disabled={!hasActiveChannel}
            onClick={() => { setDeleteConfirmOpen(true); setDeleteError(null) }}
            type="button"
          >
            <Trash2 size={20} />
          </button>
        ) : null}
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
