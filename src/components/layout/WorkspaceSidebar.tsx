import { LogOut, Plus, Settings, X } from 'lucide-react'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { workspaceApi } from '../../api/workspaceApi'
import { useAuthStore } from '../../stores/useAuthStore'
import { useChannelStore } from '../../stores/useChannelStore'
import { useDmStore } from '../../stores/useDmStore'
import { useWorkspaceStore } from '../../stores/useWorkspaceStore'
import type { User } from '../../types/user'
import type { WorkspaceMember } from '../../types/workspace'
import { Avatar } from '../common/Avatar'
import { WorkspaceCard } from '../workspace/WorkspaceCard'

const createWorkspaceOwner = (user: User): WorkspaceMember => ({
  id: 'new-workspace-owner',
  joinedAt: new Date().toISOString(),
  role: 'admin',
  user: {
    ...user,
    status: 'online',
  },
})

function CreateWorkspaceModal({
  onClose,
  onCreate,
}: {
  onClose: () => void
  onCreate: (name: string) => Promise<void>
}) {
  const [workspaceName, setWorkspaceName] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const canCreate = workspaceName.trim().length > 0 && !submitting

  const handleCreate = async () => {
    if (!canCreate) return
    setSubmitting(true)
    setErrorMessage('')
    try {
      await onCreate(workspaceName.trim())
      setWorkspaceName('')
    } catch {
      setErrorMessage('워크스페이스 생성에 실패했습니다.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 z-30 grid place-items-center bg-slate-950/25 px-4">
      <section className="w-full max-w-[34rem] overflow-hidden rounded-xl border border-slate-300 bg-white shadow-2xl shadow-slate-400/30">
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-base font-extrabold text-slate-950">워크스페이스 추가</h2>
            <p className="mt-1 text-xs font-medium text-slate-500">워크스페이스 이름을 설정하세요.</p>
          </div>
          <button
            aria-label="워크스페이스 추가 닫기"
            className="rounded p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
            onClick={onClose}
            type="button"
          >
            <X size={16} />
          </button>
        </header>

        <div className="p-5">
          <label className="block text-sm font-bold text-slate-800" htmlFor="workspace-name">
            워크스페이스명
          </label>
          <input
            autoFocus
            className="mt-2 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium outline-none transition-colors placeholder:text-slate-400 focus:border-[#0058BE] focus:ring-2 focus:ring-[#0058BE]/20"
            id="workspace-name"
            onChange={(event) => setWorkspaceName(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                void handleCreate()
              }
            }}
            placeholder="예: product team"
            value={workspaceName}
          />

          <p className="mt-4 text-xs font-medium text-slate-500">
            멤버 추가는 워크스페이스 설정에서 가능합니다.
          </p>

          {errorMessage ? <p className="mt-2 text-xs font-bold text-[#BA1A1A]">{errorMessage}</p> : null}

          <button
            className="mt-4 h-10 w-full rounded-lg bg-[#0058BE] text-sm font-bold text-white transition-colors hover:bg-[#004EA8] disabled:cursor-not-allowed disabled:opacity-45"
            disabled={!canCreate}
            onClick={() => void handleCreate()}
            type="button"
          >
            {submitting ? '생성 중...' : '워크스페이스 생성'}
          </button>
        </div>
      </section>
    </div>
  )
}

function ChatRailIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[22px]" fill="none" aria-hidden>
      <path
        d="M4.25 5.25h15.5v10.4a1.1 1.1 0 0 1-1.1 1.1h-7.2L5.1 20.2a.55.55 0 0 1-.85-.47V5.25Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.1"
      />
      <path d="M8 9h8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
      <path d="M8 12.2h7.2" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
      <path d="M8 15.4h4.5" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  )
}

export function WorkspaceSidebar() {
  const location = useLocation()
  const navigate = useNavigate()
  const [logoutOpen, setLogoutOpen] = useState(false)
  const [createWorkspaceOpen, setCreateWorkspaceOpen] = useState(false)
  const isProfilePage = location.pathname === '/profile'
  const isWorkspaceManagePage = location.pathname === '/workspaces/manage' || location.pathname === '/workspaces/members'
  const isChatPage = location.pathname === '/chat'
  const isDmPage = location.pathname === '/dm'
  const authUser = useAuthStore((state) => state.user)
  const logout = useAuthStore((state) => state.logout)
  const totalDmUnreadCount = useDmStore((state) =>
    Object.values(state.unreadCounts).reduce((total, count) => total + count, 0),
  )
  const {
    activeWorkspaceId,
    addWorkspace,
    fetchMembers,
    setActiveWorkspaceId,
    workspaceMembers,
    workspaceMembersByWorkspaceId,
    workspaces,
  } = useWorkspaceStore()
  const { channels, fetchChannels, setActiveChannelId, unreadCounts: channelUnreadCounts } = useChannelStore()
  const activeUserId = authUser?.id ?? ''
  const validWorkspaces = workspaces.filter((workspace) => Boolean(workspace?.id))
  const validChannels = channels.filter((channel) => Boolean(channel?.id && channel.workspaceId))
  const validWorkspaceMembers = workspaceMembers.filter((member) => Boolean(member?.user?.id))
  const validMembersByWorkspaceId = Object.values(workspaceMembersByWorkspaceId)
    .flat()
    .filter((member) => Boolean(member?.user?.id))
  const currentMember =
    validMembersByWorkspaceId.find((member) => member.user.id === activeUserId) ??
    validWorkspaceMembers.find((member) => member.user.id === activeUserId)
  const currentUser: User = currentMember?.user ?? authUser ?? {
    id: '',
    email: '',
    name: '',
    status: 'online',
  }
  const currentProfileName = currentUser.name

  const handleLogout = () => {
    void logout().then(() => {
      setLogoutOpen(false)
      navigate('/login', { replace: true })
    })
  }

  const handleWorkspaceSelect = (workspaceId: string) => {
    setActiveWorkspaceId(workspaceId)
    const firstWorkspaceChannel = validChannels.find((channel) => channel.workspaceId === workspaceId)

    setActiveChannelId(firstWorkspaceChannel?.id)

    navigate('/chat')
  }

  const handleCreateWorkspace = async (name: string) => {
    const createdWorkspace = await workspaceApi.createWorkspace({ name })
    if (!createdWorkspace?.id) {
      throw new Error('Workspace creation response did not include an id.')
    }

    addWorkspace(createdWorkspace, [createWorkspaceOwner(currentUser)])
    setActiveWorkspaceId(createdWorkspace.id)
    void fetchMembers(createdWorkspace.id)
    void fetchChannels(createdWorkspace.id)
    setCreateWorkspaceOpen(false)
  }

  return (
    <nav
      aria-label="Workspaces"
      className="flex h-screen min-h-0 flex-col items-center border-r border-slate-300 bg-[#e7eaf2] px-2 py-4"
    >
      {createWorkspaceOpen ? (
        <CreateWorkspaceModal
          onClose={() => setCreateWorkspaceOpen(false)}
          onCreate={handleCreateWorkspace}
        />
      ) : null}

      <div className="flex flex-col items-center gap-3">
        {validWorkspaces.map((workspace) => (
          <WorkspaceCard
            active={isChatPage && workspace.id === activeWorkspaceId}
            key={workspace.id}
            onClick={() => handleWorkspaceSelect(workspace.id)}
            unreadCount={validChannels
              .filter((channel) => channel.workspaceId === workspace.id)
              .reduce((total, channel) => total + (channelUnreadCounts[channel.id] ?? 0), 0)}
            workspace={workspace}
          />
        ))}
        <button
          aria-label="Settings"
          className={`flex size-10 items-center justify-center rounded-xl border shadow-sm transition-colors ${
            isWorkspaceManagePage
              ? 'border-[#0058BE] bg-[#0058BE] text-white'
              : 'border-slate-300 bg-slate-100 text-slate-700 hover:bg-white'
          }`}
          onClick={() => navigate('/workspaces/manage')}
          type="button"
        >
          <Settings size={21} />
        </button>
        <button
          aria-label="Create workspace"
          className="flex size-10 items-center justify-center rounded-full border border-dashed border-slate-300 bg-slate-100 text-slate-600 hover:bg-white"
          onClick={() => setCreateWorkspaceOpen(true)}
          type="button"
        >
          <Plus size={22} />
        </button>
      </div>

      <div className="mt-4 h-px w-8 bg-slate-300" />

      <button
        aria-label="Messages"
        className={`relative mt-3 flex size-10 items-center justify-center rounded-xl border shadow-sm transition-colors ${
          isDmPage
            ? 'border-[#0058BE] bg-[#0058BE] text-white'
            : 'border-slate-300 bg-slate-100 text-slate-700 hover:bg-white'
        }`}
        onClick={() => navigate('/dm')}
        type="button"
      >
        <ChatRailIcon />
        {totalDmUnreadCount > 0 ? (
          <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-red-600 text-[10px] font-bold text-white">
            {totalDmUnreadCount}
          </span>
        ) : null}
      </button>

      <div className="relative mt-auto flex flex-col items-center gap-2">
        {logoutOpen ? (
          <div className="fixed inset-0 z-30 grid place-items-center bg-slate-950/25 px-4">
            <div className="w-64 rounded-xl border border-slate-300 bg-white p-4 shadow-2xl shadow-slate-400/30">
              <div className="flex items-start justify-between gap-3">
                <p className="whitespace-nowrap text-sm font-extrabold leading-5 text-slate-950">
                  로그아웃 하시겠습니까?
                </p>
                <button
                  aria-label="로그아웃 확인 닫기"
                  className="rounded p-0.5 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700"
                  onClick={() => setLogoutOpen(false)}
                  type="button"
                >
                  <X size={14} />
                </button>
              </div>
              <button
                className="mt-3 h-9 w-full rounded-lg bg-[#BA1A1A] text-sm font-bold text-white transition-colors hover:bg-[#9f1515]"
                onClick={handleLogout}
                type="button"
              >
                로그아웃
              </button>
            </div>
          </div>
        ) : null}

        <button
          aria-label="Profile"
          className={`rounded-full ${isProfilePage ? 'ring-4 ring-[#0058BE]' : ''}`}
          onClick={() => navigate('/profile')}
          type="button"
        >
          <Avatar name={currentProfileName} size={38} src={currentUser.avatarUrl} />
        </button>
        <button
          aria-label="Logout"
          className="grid size-9 place-items-center rounded-full bg-slate-600 text-white transition-colors hover:bg-slate-700"
          onClick={() => setLogoutOpen(true)}
          type="button"
        >
          <LogOut size={17} />
        </button>
      </div>
    </nav>
  )
}
