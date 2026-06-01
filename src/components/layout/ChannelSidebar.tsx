import { ChevronDown, Plus, X } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '../../stores/useAuthStore'
import { useChannelStore } from '../../stores/useChannelStore'
import { useWorkspaceStore } from '../../stores/useWorkspaceStore'
import type { WorkspaceMember } from '../../types/workspace'
import { Avatar } from '../common/Avatar'
import { ChannelItem } from '../channel/ChannelItem'
import { WorkspaceRoleBadge } from '../workspace/WorkspaceRoleBadge'

const CHANNEL_EXPANDED_STORAGE_KEY = 'chattr-channel-sidebar-expanded'

const getInitialChannelExpanded = () => localStorage.getItem(CHANNEL_EXPANDED_STORAGE_KEY) !== 'false'

function CreateChannelModal({
  currentUserId,
  members,
  onClose,
  onCreate,
}: {
  currentUserId: string
  members: WorkspaceMember[]
  onClose: () => void
  onCreate: (channelName: string, memberIds: string[]) => void
}) {
  const [channelName, setChannelName] = useState('')
  const [selectedMemberIds, setSelectedMemberIds] = useState<string[]>([currentUserId])
  const canCreate = channelName.trim().length > 0 && selectedMemberIds.length > 0

  const toggleMember = (memberId: string) => {
    setSelectedMemberIds((current) =>
      current.includes(memberId) ? current.filter((id) => id !== memberId) : [...current, memberId],
    )
  }

  return (
    <div className="fixed inset-0 z-30 grid place-items-center bg-slate-950/35 px-4">
      <section className="w-full max-w-[34rem] overflow-hidden rounded-xl border border-slate-300 bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-base font-extrabold text-slate-950">채널 추가</h2>
            <p className="mt-1 text-xs font-medium text-slate-500">채널명과 참여 멤버를 선택하세요.</p>
          </div>
          <button
            aria-label="채널 추가 닫기"
            className="rounded-md p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
            onClick={onClose}
            type="button"
          >
            <X size={18} />
          </button>
        </header>

        <div className="px-6 py-5">
          <label className="block text-sm font-bold text-slate-800" htmlFor="channel-name">
            채널명
          </label>
          <input
            className="mt-2 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium outline-none transition-colors placeholder:text-slate-400 focus:border-[#0058BE] focus:ring-2 focus:ring-[#0058BE]/20"
            id="channel-name"
            onChange={(event) => setChannelName(event.currentTarget.value)}
            placeholder="예: frontend- 공통"
            value={channelName}
          />

          <div className="mt-5 flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-800">멤버 추가</h3>
            <span className="text-xs font-bold text-slate-500">{selectedMemberIds.length}명 선택</span>
          </div>

          <div className="mt-3 h-72 overflow-y-auto rounded-lg border border-slate-200 bg-[#fbfbff] p-2">
            {members.map((member) => {
              const checked = selectedMemberIds.includes(member.user.id)

              return (
                <label
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-white"
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
                    className="size-4 rounded border-slate-300 text-[#0058BE] focus:ring-[#0058BE]"
                    onChange={() => toggleMember(member.user.id)}
                    type="checkbox"
                  />
                </label>
              )
            })}
          </div>

          <button
            className="mt-5 h-10 w-full rounded-lg bg-[#0058BE] text-sm font-bold text-white transition-colors hover:bg-[#004EA8] disabled:cursor-not-allowed disabled:opacity-45"
            disabled={!canCreate}
            onClick={() => {
              if (!canCreate) return

              onCreate(channelName.trim(), selectedMemberIds)
              setChannelName('')
              setSelectedMemberIds([currentUserId])
            }}
            type="button"
          >
            채널 추가
          </button>
        </div>
      </section>
    </div>
  )
}

export function ChannelSidebar() {
  const [expanded, setExpanded] = useState(getInitialChannelExpanded)
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const authUser = useAuthStore((state) => state.user)
  const activeUserId = authUser?.id ?? ''
  const { activeChannelId, addChannel, channels, markChannelOpened, unreadCounts } = useChannelStore()
  const { activeWorkspaceId, workspaceMembers } = useWorkspaceStore()
  const activeWorkspace = useWorkspaceStore((state) =>
    state.workspaces.find((workspace) => workspace.id === activeWorkspaceId),
  )
  const visibleChannels = channels.filter((channel) => channel.workspaceId === activeWorkspaceId)
  const workspaceTitle = activeWorkspace?.name ?? '워크스페이스'

  const handleCreateChannel = (channelName: string, memberIds: string[]) => {
    if (!activeWorkspaceId) return

    void addChannel(channelName, memberIds, activeWorkspaceId)
    localStorage.setItem(CHANNEL_EXPANDED_STORAGE_KEY, 'true')
    setExpanded(true)
    setCreateModalOpen(false)
  }

  const handleSelectChannel = (channelId: string) => {
    markChannelOpened(channelId)
  }

  const handleToggleExpanded = () => {
    setExpanded((current) => {
      const nextExpanded = !current
      localStorage.setItem(CHANNEL_EXPANDED_STORAGE_KEY, String(nextExpanded))
      return nextExpanded
    })
  }

  return (
    <aside className="h-screen min-w-60 overflow-hidden border-r border-slate-300 bg-[#f1f3fb] max-md:hidden">
      {createModalOpen ? (
        <CreateChannelModal
          currentUserId={activeUserId}
          members={workspaceMembers}
          onClose={() => setCreateModalOpen(false)}
          onCreate={handleCreateChannel}
        />
      ) : null}
      <header className="flex h-14 items-center justify-between border-b border-slate-300 px-4">
        <button className="flex items-center gap-1 whitespace-nowrap text-left text-sm font-extrabold text-slate-950" type="button">
          <span>{workspaceTitle}</span>
        </button>
      </header>

      <div className="px-3 py-5">
        <div className="mb-2 flex items-center justify-between px-1 text-xs font-extrabold uppercase tracking-wide text-slate-600">
          <button
            className="flex items-center gap-1 text-left transition-colors hover:text-slate-950"
            onClick={handleToggleExpanded}
            type="button"
          >
            <ChevronDown className={`shrink-0 transition-transform ${expanded ? '' : '-rotate-90'}`} size={13} />
            <span>My Channels</span>
          </button>
          <button
            aria-label="채널 추가"
            className="rounded p-0.5 text-slate-600 transition-colors hover:bg-slate-200 hover:text-[#0058BE]"
            onClick={() => setCreateModalOpen(true)}
            type="button"
          >
            <Plus size={15} />
          </button>
        </div>
        {expanded ? (
          <div className="flex flex-col gap-1">
            {visibleChannels.map((channel) => (
              <ChannelItem
                active={channel.id === activeChannelId}
                channel={channel}
                key={channel.id}
                onClick={() => handleSelectChannel(channel.id)}
                unreadCount={unreadCounts[channel.id]}
              />
            ))}
          </div>
        ) : null}
      </div>
    </aside>
  )
}
