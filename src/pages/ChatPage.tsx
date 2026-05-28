import { UserPlus, X } from 'lucide-react'
import { useState } from 'react'
import { ChatInput } from '../components/chat/ChatInput'
import { MessageList } from '../components/chat/MessageList'
import { Avatar } from '../components/common/Avatar'
import { ChannelSidebar } from '../components/layout/ChannelSidebar'
import { MainLayout } from '../components/layout/MainLayout'
import { WorkspaceRoleBadge } from '../components/workspace/WorkspaceRoleBadge'
import { mockMessagesByRoomId } from '../mocks/mockMessages'
import { currentUserId } from '../mocks/mockWorkspaceMembers'
import { useChannelStore } from '../stores/useChannelStore'
import { useWorkspaceStore } from '../stores/useWorkspaceStore'
import type { Message } from '../types/message'
import type { WorkspaceMember } from '../types/workspace'

function ChannelMemberModal({ onClose }: { onClose: () => void }) {
  const { activeChannelId, addChannelMembers, channelMemberIds } = useChannelStore()
  const { workspaceMembers } = useWorkspaceStore()
  const currentChannelMemberIds = activeChannelId ? (channelMemberIds[activeChannelId] ?? []) : []
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>(currentChannelMemberIds)
  const newMemberIds = selectedMemberIds.filter((memberId) => !currentChannelMemberIds.includes(memberId))
  const canAdd = Boolean(activeChannelId && newMemberIds.length > 0)

  const toggleMember = (memberId: string) => {
    if (currentChannelMemberIds.includes(memberId)) return

    setSelectedMemberIds((current) =>
      current.includes(memberId) ? current.filter((id) => id !== memberId) : [...current, memberId],
    )
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
                    {member.user.id === currentUserId ? <span className="ml-1 text-[#0058BE]">(나)</span> : null}
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

          <button
            className="mt-5 h-10 w-full rounded-lg bg-[#0058BE] text-sm font-bold text-white transition-colors hover:bg-[#004EA8] disabled:cursor-not-allowed disabled:opacity-45"
            disabled={!canAdd}
            onClick={() => {
              if (!activeChannelId || !canAdd) return

              addChannelMembers(activeChannelId, newMemberIds)
              onClose()
            }}
            type="button"
          >
            멤버 추가
          </button>
        </div>
      </section>
    </div>
  )
}

function ChannelHeader() {
  const [memberModalOpen, setMemberModalOpen] = useState(false)
  const { activeChannelId, channels } = useChannelStore()
  const activeWorkspaceId = useWorkspaceStore((state) => state.activeWorkspaceId)
  const activeChannel = channels.find(
    (channel) => channel.id === activeChannelId && channel.workspaceId === activeWorkspaceId,
  )
  const hasActiveChannel = Boolean(activeChannel)

  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-300 bg-[#fbfbff] px-6">
      {memberModalOpen && hasActiveChannel ? <ChannelMemberModal onClose={() => setMemberModalOpen(false)} /> : null}
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
      <button
        aria-label="채널 멤버 추가"
        className="text-slate-700 hover:text-[#0058BE] disabled:cursor-not-allowed disabled:opacity-35"
        disabled={!hasActiveChannel}
        onClick={() => setMemberModalOpen(true)}
        type="button"
      >
        <UserPlus size={20} />
      </button>
    </header>
  )
}

function getChannelMemberAuthors(members: WorkspaceMember[], memberIds: string[]) {
  const memberById = new Map(members.map((member) => [member.user.id, member]))
  const orderedMembers = memberIds.map((memberId) => memberById.get(memberId)).filter(Boolean) as WorkspaceMember[]

  return orderedMembers.length > 0 ? orderedMembers : members.slice(0, 1)
}

function applyChannelMemberAuthors(messages: Message[], members: WorkspaceMember[], memberIds: string[]) {
  const authors = getChannelMemberAuthors(members, memberIds)
  if (authors.length === 0) return messages

  const currentUserAuthor = authors[0]?.user

  const nextMessages = messages.map((message, index) => {
    const authorIndex = message.author.id === currentUserId ? 0 : Math.min(index + 1, authors.length - 1)
    const author = authors[authorIndex]?.user ?? currentUserAuthor ?? message.author

    return {
      ...message,
      author,
    }
  })

  return nextMessages.map((message) => {
    if (!message.replyPreview || !message.parentMessageId) return message

    const parentMessage = nextMessages.find((item) => item.id === message.parentMessageId)
    if (!parentMessage) return message

    return {
      ...message,
      replyPreview: {
        ...message.replyPreview,
        authorName: parentMessage.author.name,
      },
    }
  })
}

export function ChatPage() {
  const { activeChannelId, channelMemberIds, channels } = useChannelStore()
  const { activeWorkspaceId, workspaceMembers } = useWorkspaceStore()
  const activeChannel = channels.find(
    (channel) => channel.id === activeChannelId && channel.workspaceId === activeWorkspaceId,
  )
  const baseMessages = activeChannel ? (mockMessagesByRoomId[activeChannel.id] ?? []) : []
  const messages = activeChannel
    ? applyChannelMemberAuthors(baseMessages, workspaceMembers, channelMemberIds[activeChannel.id] ?? [])
    : []

  return (
    <MainLayout header={<ChannelHeader />} sidebar={<ChannelSidebar />}>
      {activeChannel ? (
        <>
          <MessageList messages={messages} />
          <ChatInput />
        </>
      ) : (
        <div className="grid min-h-0 flex-1 place-items-center bg-[#fbfbff] px-6 text-center">
          <p className="text-sm font-bold text-slate-500">채널을 생성 후 채널을 선택해야 채팅방이 보입니다.</p>
        </div>
      )}
    </MainLayout>
  )
}
