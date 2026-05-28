import { useState, type MouseEvent } from 'react'
import { AlertCircle, MessageSquare, UsersRound, X } from 'lucide-react'
import { MainLayout } from '../components/layout/MainLayout'
import { WorkspaceMemberItem } from '../components/workspace/WorkspaceMemberItem'
import { currentUserId } from '../mocks/mockWorkspaceMembers'
import { useWorkspaceStore } from '../stores/useWorkspaceStore'
import type { WorkspaceMember } from '../types/workspace'

interface PermissionErrorState {
  message: string
  left: number
  top: number
}

const workspaceMemberViewMeta = {
  apollo: {
    accent: '#0058BE',
    badge: 'apollo',
    memberCount: 68,
    name: '프로젝트 apollo TF',
  },
  '0602': {
    accent: '#5a6072',
    badge: '0602',
    memberCount: 14,
    name: '0602 meeting 준비',
  },
  pj5: {
    accent: '#8A3D00',
    badge: 'PJ5',
    memberCount: 31,
    name: 'project5',
  },
} as const

function WorkspaceMemberHeader() {
  return (
    <header className="flex h-10 items-center border-b border-slate-300 bg-[#fbfbff] px-6">
      <div className="flex items-center gap-2 text-[#0058BE]">
        <MessageSquare aria-hidden size={22} strokeWidth={2.5} />
        <span className="text-2xl font-extrabold">Chattr</span>
      </div>
    </header>
  )
}

export function WorkspaceMemberPage() {
  const [permissionError, setPermissionError] = useState<PermissionErrorState | null>(null)
  const { activeWorkspaceId = 'apollo', updateWorkspaceMemberRole, workspaceMembers } = useWorkspaceStore()
  const activeWorkspaceMembers = useWorkspaceStore(
    (state) => state.workspaceMembersByWorkspaceId[activeWorkspaceId] ?? workspaceMembers,
  )
  const activeWorkspace = useWorkspaceStore((state) =>
    state.workspaces.find((workspace) => workspace.id === activeWorkspaceId),
  )
  const workspaceMeta = workspaceMemberViewMeta[activeWorkspaceId as keyof typeof workspaceMemberViewMeta] ?? {
    accent: '#0058BE',
    badge: activeWorkspace?.name.slice(0, 2) ?? 'ws',
    memberCount: Math.max(1, activeWorkspaceMembers.length),
    name: activeWorkspace?.name ?? '워크스페이스',
  }
  const displayedMembers = activeWorkspaceMembers
  const displayedMemberCount = activeWorkspaceMembers.length
  const currentWorkspaceRole =
    activeWorkspaceMembers.find((member) => member.user.id === currentUserId)?.role ?? 'member'

  const handleRoleClick = (member: WorkspaceMember, event: MouseEvent<HTMLButtonElement>) => {
    const buttonRect = event.currentTarget.getBoundingClientRect()
    const popupWidth = 352
    const popupHeight = 132
    const left = Math.max(16, Math.min(buttonRect.right + 10, window.innerWidth - popupWidth - 16))
    const top = Math.max(16, Math.min(buttonRect.top - 8, window.innerHeight - popupHeight - 16))

    if (currentWorkspaceRole !== 'admin') {
      setPermissionError({
        left,
        message: `${member.user.name}님의 권한을 수정할 수 없습니다. 권한 수정은 workspace admin만 가능합니다.`,
        top,
      })
      return
    }

    setPermissionError(null)
    updateWorkspaceMemberRole(member.id, member.role === 'admin' ? 'member' : 'admin')
  }

  return (
    <MainLayout header={<WorkspaceMemberHeader />}>
      <div className="relative min-h-0 overflow-y-auto bg-[#fbfbff] px-7 py-6">
        {permissionError ? (
          <div
            className="fixed z-20 w-[22rem] rounded-lg border border-[#BA1A1A]/25 bg-white p-4 shadow-xl"
            style={{ left: permissionError.left, top: permissionError.top }}
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-[#BA1A1A]/10 text-[#BA1A1A]">
                <AlertCircle size={17} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-extrabold text-slate-950">권한 수정 실패</p>
                <p className="mt-1 text-xs leading-5 text-slate-600">{permissionError.message}</p>
                <p className="mt-2 text-[11px] font-bold text-[#BA1A1A]">403 Forbidden</p>
              </div>
              <button
                aria-label="권한 수정 실패 안내 닫기"
                className="text-slate-400 transition-colors hover:text-slate-700"
                onClick={() => setPermissionError(null)}
                type="button"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        ) : null}

        <div className="flex w-full flex-col gap-6">
          <section>
            <h1 className="text-base font-extrabold text-slate-950">workspace member 설정</h1>
          </section>

          <section>
            <div className="mb-5 flex items-center gap-2 text-sm font-medium text-slate-800">
              <UsersRound size={19} />
              <span>
                워크스페이스 멤버 목록: 참여중인 멤버 정보 확인 및 멤버 권한을 수정하세요. (권한 수정은 admin만 가능합니다.)
              </span>
            </div>

            <article className="overflow-hidden rounded-lg border border-slate-300 bg-white">
              <div className="h-1.5" style={{ backgroundColor: workspaceMeta.accent }} />
              <div className="p-5">
                <header className="flex items-center justify-between border-b border-slate-300 pb-4">
                  <div className="flex items-center gap-4">
                    <span className="grid size-10 place-items-center rounded-md bg-slate-200 text-xs font-extrabold text-slate-950">
                      {workspaceMeta.badge}
                    </span>
                    <h2 className="text-sm font-extrabold text-slate-950">{workspaceMeta.name}</h2>
                  </div>
                  <span className="text-xs font-medium text-slate-700">{displayedMemberCount} Members</span>
                </header>

                <div className="mt-2 max-h-[34rem] overflow-y-auto pr-1">
                  {displayedMembers.map((member) => (
                    <WorkspaceMemberItem
                      key={member.id}
                      isCurrentUser={member.user.id === currentUserId}
                      member={member}
                      onRoleClick={handleRoleClick}
                    />
                  ))}
                </div>
              </div>
            </article>
          </section>
        </div>
      </div>
    </MainLayout>
  )
}
