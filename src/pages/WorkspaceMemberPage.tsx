import { useMemo, useState, type MouseEvent } from 'react'
import { isAxiosError } from 'axios'
import { AlertCircle, UsersRound, X } from 'lucide-react'
import { workspaceApi } from '../api/workspaceApi'
import { AppPageHeader } from '../components/common/AppPageHeader'
import { MainLayout } from '../components/layout/MainLayout'
import { WorkspaceMemberItem } from '../components/workspace/WorkspaceMemberItem'
import { useAuthStore } from '../stores/useAuthStore'
import { useWorkspaceStore } from '../stores/useWorkspaceStore'
import type { WorkspaceMember } from '../types/workspace'
import { getWorkspaceAccent } from '../utils/workspaceAccent'

interface PermissionErrorState {
  message: string
  left: number
  top: number
}

export function WorkspaceMemberPage() {
  const [permissionError, setPermissionError] = useState<PermissionErrorState | null>(null)
  const authUser = useAuthStore((state) => state.user)
  const activeUserId = authUser?.id ?? ''
  const activeWorkspaceId = useWorkspaceStore((state) => state.activeWorkspaceId)
  const updateWorkspaceMemberRole = useWorkspaceStore((state) => state.updateWorkspaceMemberRole)
  const workspaceMembers = useWorkspaceStore((state) => state.workspaceMembers)
  const workspaceMembersByWorkspaceId = useWorkspaceStore((state) => state.workspaceMembersByWorkspaceId)
  const workspaces = useWorkspaceStore((state) => state.workspaces)
  const activeWorkspaceMembers = useMemo(
    () =>
      (activeWorkspaceId ? (workspaceMembersByWorkspaceId[activeWorkspaceId] ?? workspaceMembers) : workspaceMembers).filter(
        (member) => Boolean(member?.user?.id),
      ),
    [activeWorkspaceId, workspaceMembers, workspaceMembersByWorkspaceId],
  )
  const activeWorkspace = useMemo(
    () => workspaces.find((workspace) => workspace?.id === activeWorkspaceId),
    [activeWorkspaceId, workspaces],
  )
  const activeWorkspaceIndex = useMemo(
    () => Math.max(0, workspaces.findIndex((workspace) => workspace?.id === activeWorkspaceId)),
    [activeWorkspaceId, workspaces],
  )
  const workspaceAccent = getWorkspaceAccent(activeWorkspaceIndex)
  const displayedMemberCount = activeWorkspaceMembers.length
  const currentWorkspaceRole =
    activeWorkspaceMembers.find((member) => member.user.id === activeUserId)?.role ?? 'member'

  const handleRoleClick = (member: WorkspaceMember, event: MouseEvent<HTMLButtonElement>) => {
    const buttonRect = event.currentTarget.getBoundingClientRect()
    const left = Math.max(16, Math.min(buttonRect.right + 10, window.innerWidth - 368))
    const top = Math.max(16, Math.min(buttonRect.top - 8, window.innerHeight - 148))

    if (currentWorkspaceRole !== 'admin') {
      setPermissionError({
        left,
        message: `${member.user.name}님의 권한을 수정할 수 없습니다. 권한 수정은 워크스페이스 관리자만 가능합니다.`,
        top,
      })
      return
    }

    if (!activeWorkspaceId) return

    setPermissionError(null)
    const newRole = member.role === 'admin' ? 'member' : 'admin'
    void workspaceApi.changeMemberRole(activeWorkspaceId, member.user.id, newRole)
      .then(() => {
        updateWorkspaceMemberRole(member.id, newRole)
      })
      .catch((error: unknown) => {
        const message = isAxiosError(error)
          ? (error.response?.data as { message?: string } | undefined)?.message ?? '권한 변경에 실패했습니다.'
          : '권한 변경에 실패했습니다.'
        setPermissionError({ left, message, top })
      })
  }

  return (
    <MainLayout header={<AppPageHeader />}>
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
            <h1 className="text-base font-extrabold text-slate-950">워크스페이스 멤버 설정</h1>
          </section>

          <section>
            <div className="mb-5 flex items-center gap-2 text-sm font-medium text-slate-800">
              <UsersRound size={19} />
              <span>
                워크스페이스 멤버 목록: 참여 중인 멤버 정보 확인 및 권한 수정이 가능합니다. (권한 수정은 관리자만 가능합니다.)
              </span>
            </div>

            <article className="overflow-hidden rounded-lg border border-slate-300 bg-white">
              <div className="h-1.5" style={{ backgroundColor: workspaceAccent }} />
              <div className="p-5">
                <header className="flex items-center justify-between border-b border-slate-300 pb-4">
                  <div className="flex items-center gap-4">
                    <span className="grid size-10 place-items-center rounded-md bg-slate-200 text-xs font-extrabold text-slate-950">
                      {activeWorkspace?.name.slice(0, 2).toUpperCase() ?? 'WS'}
                    </span>
                    <h2 className="text-sm font-extrabold text-slate-950">{activeWorkspace?.name ?? '워크스페이스'}</h2>
                  </div>
                  <span className="text-xs font-medium text-slate-700">{displayedMemberCount} Members</span>
                </header>

                <div className="mt-2 max-h-[34rem] overflow-y-auto pr-1">
                  {activeWorkspaceMembers.map((member) => (
                    <WorkspaceMemberItem
                      key={member.id}
                      isCurrentUser={member.user.id === activeUserId}
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
