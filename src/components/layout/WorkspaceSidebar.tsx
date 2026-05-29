import { LogOut, Plus, Settings, X } from 'lucide-react'
import { useState, type MouseEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { Avatar } from '../common/Avatar'
import { WorkspaceCard } from '../workspace/WorkspaceCard'
import { WorkspaceRoleBadge } from '../workspace/WorkspaceRoleBadge'
import { currentUserId } from '../../mocks/mockWorkspaceMembers'
import { useAuthStore } from '../../stores/useAuthStore'
import { useChannelStore } from '../../stores/useChannelStore'
import { useDmStore } from '../../stores/useDmStore'
import { useWorkspaceStore } from '../../stores/useWorkspaceStore'
import type { User } from '../../types/user'
import type { WorkspaceMember } from '../../types/workspace'
import { clearTokens } from '../../utils/token'
import { currentUserName } from '../../utils/userDisplay'

interface PermissionNoticeState {
  left: number
  top: number
}

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
  owner,
}: {
  onClose: () => void
  onCreate: (name: string, members: WorkspaceMember[]) => void
  owner: User
}) {
  const [workspaceName, setWorkspaceName] = useState('')
  const [memberNickname, setMemberNickname] = useState('')
  const [members, setMembers] = useState<WorkspaceMember[]>(() => [createWorkspaceOwner(owner)])
  const [permissionNotice, setPermissionNotice] = useState<PermissionNoticeState | null>(null)
  const canCreate = workspaceName.trim().length > 0
  const canAddMember = memberNickname.trim().length > 0

  const handleAddMember = () => {
    if (!canAddMember) return

    const now = Date.now()
    setMembers((current) => [
      ...current,
      {
        id: `pending-workspace-member-${now}`,
        joinedAt: new Date(now).toISOString(),
        role: 'member',
        user: {
          id: `pending-workspace-user-${now}`,
          email: `${now}@example.com`,
          name: memberNickname.trim(),
          status: 'offline',
        },
      },
    ])
    setMemberNickname('')
  }

  const handleRoleClick = (member: WorkspaceMember, event: MouseEvent<HTMLButtonElement>) => {
    if (member.user.id === currentUserId) {
      const rect = event.currentTarget.getBoundingClientRect()
      const popupWidth = 312
      const popupHeight = 92

      setPermissionNotice({
        left: Math.max(16, Math.min(rect.right + 10, window.innerWidth - popupWidth - 16)),
        top: Math.max(16, Math.min(rect.top - 8, window.innerHeight - popupHeight - 16)),
      })
      return
    }

    setPermissionNotice(null)
    setMembers((current) =>
      current.map((item) =>
        item.id === member.id ? { ...item, role: item.role === 'admin' ? 'member' : 'admin' } : item,
      ),
    )
  }

  const handleCreate = () => {
    if (!canCreate) return

    onCreate(workspaceName.trim(), members)
    setWorkspaceName('')
    setMemberNickname('')
    setMembers([createWorkspaceOwner(owner)])
  }

  return (
    <div className="fixed inset-0 z-30 grid place-items-center bg-slate-950/25 px-4">
      {permissionNotice ? (
        <div
          className="fixed z-40 w-[19.5rem] rounded-lg border border-slate-300 bg-white p-3 shadow-xl"
          style={{ left: permissionNotice.left, top: permissionNotice.top }}
        >
          <div className="flex items-start justify-between gap-3">
            <p className="text-xs font-bold leading-5 text-slate-700">
              생성자의 admin 권한은 워크스페이스 멤버 설정 화면에서만 변경 가능합니다.
            </p>
            <button
              aria-label="권한 안내 닫기"
              className="shrink-0 text-slate-400 transition-colors hover:text-slate-700"
              onClick={() => setPermissionNotice(null)}
              type="button"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      ) : null}

      <section className="w-full max-w-[34rem] overflow-hidden rounded-xl border border-slate-300 bg-white shadow-2xl shadow-slate-400/30">
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-base font-extrabold text-slate-950">워크스페이스 추가</h2>
            <p className="mt-1 text-xs font-medium text-slate-500">워크스페이스 이름과 참여 멤버를 설정하세요.</p>
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
            className="mt-2 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium outline-none transition-colors placeholder:text-slate-400 focus:border-[#0058BE] focus:ring-2 focus:ring-[#0058BE]/20"
            id="workspace-name"
            onChange={(event) => setWorkspaceName(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault()
                handleCreate()
              }
            }}
            placeholder="예: product team"
            value={workspaceName}
          />

          <div className="mt-5 border-t border-slate-200 pt-5">
            <h3 className="text-sm font-bold text-slate-800">워크스페이스 멤버 추가</h3>
            <p className="mt-1 text-xs font-medium text-slate-500">
              닉네임을 입력해 워크스페이스에 초대할 멤버를 추가하세요.
            </p>
          </div>

          <label className="mt-4 block text-sm font-bold text-slate-800" htmlFor="workspace-member-name">
            닉네임
          </label>
          <div className="mt-2 flex items-center gap-3">
            <input
              className="h-10 min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium outline-none transition-colors placeholder:text-slate-400 focus:border-[#0058BE] focus:ring-2 focus:ring-[#0058BE]/20"
              id="workspace-member-name"
              onChange={(event) => setMemberNickname(event.currentTarget.value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  event.preventDefault()
                  handleAddMember()
                }
              }}
              placeholder="예: 홍길동"
              value={memberNickname}
            />
            <button
              className="h-10 rounded-lg bg-[#0058BE] px-5 text-sm font-bold text-white transition-colors hover:bg-[#004EA8] disabled:cursor-not-allowed disabled:opacity-45"
              disabled={!canAddMember}
              onClick={handleAddMember}
              type="button"
            >
              추가
            </button>
          </div>

          <div className="mt-5">
            <h3 className="text-sm font-bold text-slate-800">추가된 멤버</h3>
            <p className="mt-1 text-xs font-medium text-slate-500">
              생성할 워크스페이스 멤버 리스트 확인 및 멤버 권한을 설정하세요.
            </p>
          </div>

          <div className="mt-3 max-h-56 overflow-y-auto rounded-lg border border-slate-200 bg-[#fbfbff] p-2">
            {members.map((member) => (
              <div className="flex items-center gap-3 rounded-lg px-3 py-2 transition-colors hover:bg-white" key={member.id}>
                <span className="relative inline-flex">
                  <Avatar name={member.user.name} size={34} />
                  {member.user.status === 'online' ? (
                    <span className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-[#fbfbff] bg-emerald-500" />
                  ) : null}
                </span>
                <span className="min-w-0 flex-1 truncate text-sm font-bold text-slate-800">
                  {member.user.name}
                  {member.user.id === currentUserId ? <span className="ml-1 text-[#0058BE]">(나)</span> : null}
                </span>
                <WorkspaceRoleBadge role={member.role} onClick={(event) => handleRoleClick(member, event)} />
              </div>
            ))}
          </div>

          <button
            className="mt-4 h-10 w-full rounded-lg bg-[#0058BE] text-sm font-bold text-white transition-colors hover:bg-[#004EA8] disabled:cursor-not-allowed disabled:opacity-45"
            disabled={!canCreate}
            onClick={handleCreate}
            type="button"
          >
            추가
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
  const setUser = useAuthStore((state) => state.setUser)
  const totalDmUnreadCount = useDmStore((state) =>
    Object.values(state.unreadCounts).reduce((total, count) => total + count, 0),
  )
  const {
    activeWorkspaceId,
    addWorkspace,
    setActiveWorkspaceId,
    workspaceMembers,
    workspaceMembersByWorkspaceId,
    workspaces,
  } = useWorkspaceStore()
  const { channels, setActiveChannelId, unreadCounts: channelUnreadCounts } = useChannelStore()
  const currentMember =
    Object.values(workspaceMembersByWorkspaceId)
      .flat()
      .find((member) => member.user.id === currentUserId) ??
    workspaceMembers.find((member) => member.user.id === currentUserId)
  const currentUser: User = currentMember?.user ?? {
    id: currentUserId,
    email: 'kim.chattr@example.com',
    name: currentUserName,
    status: 'online',
  }
  const currentProfileName = currentUser.name

  const handleLogout = () => {
    clearTokens()
    setUser(null)
    setLogoutOpen(false)
    navigate('/login', { replace: true })
  }

  const handleWorkspaceSelect = (workspaceId: string) => {
    setActiveWorkspaceId(workspaceId)
    const firstWorkspaceChannel = channels.find((channel) => channel.workspaceId === workspaceId)

    setActiveChannelId(firstWorkspaceChannel?.id)

    navigate('/chat')
  }

  const handleCreateWorkspace = (name: string, members: WorkspaceMember[]) => {
    const workspaceId = `workspace-${Date.now()}`

    addWorkspace(
      {
        id: workspaceId,
        name,
        createdAt: new Date().toISOString(),
      },
      members.map((member) => ({
        ...member,
        id: `${workspaceId}-${member.id}`,
      })),
    )
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
          owner={currentUser}
        />
      ) : null}

      <div className="flex flex-col items-center gap-3">
        {workspaces.map((workspace) => (
          <WorkspaceCard
            active={isChatPage && workspace.id === activeWorkspaceId}
            key={workspace.id}
            onClick={() => handleWorkspaceSelect(workspace.id)}
            unreadCount={channels
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
