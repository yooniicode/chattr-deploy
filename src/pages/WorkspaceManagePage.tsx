import { useState, type MouseEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Pencil, Trash2, UserPlus, Users, X } from 'lucide-react'
import { userApi } from '../api/userApi'
import { workspaceApi } from '../api/workspaceApi'
import { AppPageHeader } from '../components/common/AppPageHeader'
import { Avatar } from '../components/common/Avatar'
import { MainLayout } from '../components/layout/MainLayout'
import { useAuthStore } from '../stores/useAuthStore'
import { useChannelStore } from '../stores/useChannelStore'
import { useMessageStore } from '../stores/useMessageStore'
import { useWorkspaceStore } from '../stores/useWorkspaceStore'
import type { User } from '../types/user'
import type { WorkspaceMember } from '../types/workspace'
import { getWorkspaceAccent } from '../utils/workspaceAccent'

interface PermissionNoticeState {
  left: number
  top: number
}

interface WorkspaceManageCardData {
  id: string
  badge: string
  name: string
  description: string
  members: number
  extraMembers: number
  accent: string
  previewMembers: WorkspaceMember[]
  isAdmin: boolean
}

function AddMemberModal({ workspaceId, onClose }: { workspaceId: string; onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [isAdding, setIsAdding] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [addedMembers, setAddedMembers] = useState<User[]>([])
  const fetchMembers = useWorkspaceStore((state) => state.fetchMembers)
  const currentMembers = useWorkspaceStore((state) => state.workspaceMembersByWorkspaceId[workspaceId] ?? [])

  const handleAdd = async () => {
    const trimmed = query.trim()
    if (!trimmed || isAdding) return
    setIsAdding(true)
    setError(null)
    try {
      const users = await userApi.searchUsers(trimmed)
      const found =
        users.find(
          (u) =>
            u.email.toLowerCase() === trimmed.toLowerCase() ||
            u.name.toLowerCase() === trimmed.toLowerCase(),
        ) ?? users[0]

      if (!found) {
        setError('일치하는 사용자를 찾을 수 없습니다.')
        return
      }
      if (currentMembers.some((m) => m.user.id === found.id)) {
        setError('이미 워크스페이스 멤버입니다.')
        return
      }
      if (addedMembers.some((m) => m.id === found.id)) {
        setError('이번 세션에서 이미 추가한 사용자입니다.')
        return
      }

      await workspaceApi.addMember(workspaceId, found.id)
      setAddedMembers((prev) => [...prev, found])
      setQuery('')
      void fetchMembers(workspaceId)
    } catch (err) {
      const status = (err as { response?: { status?: number } })?.response?.status
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      if (status === 409) setError('이미 워크스페이스 멤버입니다.')
      else if (status === 404) setError('일치하는 사용자를 찾을 수 없습니다.')
      else setError(message ?? '멤버 추가 중 오류가 발생했습니다.')
    } finally {
      setIsAdding(false)
    }
  }

  return (
    <div className="fixed inset-0 z-30 grid place-items-center bg-slate-950/35 px-4">
      <section className="w-full max-w-[34rem] overflow-hidden rounded-xl border border-slate-300 bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
          <div>
            <h2 className="text-base font-extrabold text-slate-950">워크스페이스 멤버 추가</h2>
            <p className="mt-1 text-xs font-medium text-slate-500">닉네임 또는 이메일을 입력해 가입된 사용자를 초대하세요.</p>
          </div>
          <button
            aria-label="멤버 추가 닫기"
            className="rounded-md p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
            onClick={onClose}
            type="button"
          >
            <X size={18} />
          </button>
        </header>
        <div className="px-6 py-5">
          <label className="block text-sm font-bold text-slate-800" htmlFor="add-member-query">
            닉네임 또는 이메일
          </label>
          <div className="mt-2 flex items-center gap-3">
            <input
              autoFocus
              className="h-10 min-w-0 flex-1 rounded-lg border border-slate-300 px-3 text-sm font-medium outline-none transition-colors placeholder:text-slate-400 focus:border-[#0058BE] focus:ring-2 focus:ring-[#0058BE]/20"
              id="add-member-query"
              onChange={(e) => { setQuery(e.target.value); setError(null) }}
              onKeyDown={(e) => { if (e.key === 'Enter') void handleAdd() }}
              placeholder="예: 홍길동 또는 user@example.com"
              value={query}
            />
            <button
              className="h-10 rounded-lg bg-[#0058BE] px-5 text-sm font-bold text-white transition-colors hover:bg-[#004EA8] disabled:cursor-not-allowed disabled:opacity-45"
              disabled={!query.trim() || isAdding}
              onClick={() => void handleAdd()}
              type="button"
            >
              {isAdding ? '추가 중...' : '추가'}
            </button>
          </div>
          {error ? <p className="mt-2 text-xs font-bold text-[#BA1A1A]">{error}</p> : null}

          <div className="mt-5">
            <h3 className="text-sm font-bold text-slate-800">추가된 멤버</h3>
            <p className="mt-1 text-xs font-medium text-slate-500">이번 세션에서 추가 성공한 멤버입니다.</p>
          </div>
          <div className="mt-3 max-h-56 overflow-y-auto rounded-lg border border-slate-200 bg-[#fbfbff] p-2">
            {addedMembers.length === 0 ? (
              <p className="py-8 text-center text-sm font-medium text-slate-400">추가된 멤버가 없습니다.</p>
            ) : (
              addedMembers.map((user) => (
                <div className="flex items-center gap-3 rounded-lg px-3 py-2" key={user.id}>
                  <Avatar name={user.name} size={34} src={user.avatarUrl} />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold text-slate-800">{user.name}</p>
                    <p className="truncate text-xs font-medium text-slate-500">{user.email}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}

function WorkspaceManageCard({
  onAddMember,
  onDelete,
  onSaveName,
  onViewMembers,
  workspace,
}: {
  onAddMember: () => void
  onDelete: (event: MouseEvent<HTMLButtonElement>) => void
  onSaveName: (name: string) => Promise<void>
  onViewMembers: () => void
  workspace: WorkspaceManageCardData
}) {
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const visiblePreviewMembers = workspace.previewMembers.slice(0, Math.min(2, workspace.members))

  const handleStartEdit = () => {
    setEditName(workspace.name)
    setSaveError(null)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setSaveError(null)
    setIsEditing(false)
  }

  const handleSave = async () => {
    const trimmed = editName.trim()
    if (!trimmed || trimmed === workspace.name) {
      setIsEditing(false)
      return
    }
    setIsSaving(true)
    setSaveError(null)
    try {
      await onSaveName(trimmed)
      setIsEditing(false)
    } catch (err) {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setSaveError(message ?? '이름 변경 중 오류가 발생했습니다.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <article className="group relative overflow-hidden rounded-lg border border-slate-300 bg-white transition-shadow hover:shadow-md">
      <div className="h-1" style={{ backgroundColor: workspace.accent }} />
      <button
        aria-label="워크스페이스 삭제"
        className="absolute right-4 top-5 grid size-8 place-items-center rounded-md text-slate-500 transition-colors hover:bg-slate-100 hover:text-[#BA1A1A]"
        onClick={onDelete}
        type="button"
      >
        <Trash2 size={18} />
      </button>
      <div className="p-4">
        <div className="grid size-9 place-items-center rounded-md bg-slate-200 text-xs font-extrabold text-slate-950">
          {workspace.badge}
        </div>

        {isEditing ? (
          <div className="mt-4">
            <div className="flex items-center gap-1">
              <input
                autoFocus
                className="min-w-0 flex-1 rounded border border-slate-300 px-2 py-1 text-sm font-extrabold text-slate-950 focus:border-[#0058BE] focus:outline-none"
                onChange={(e) => setEditName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') void handleSave()
                  if (e.key === 'Escape') handleCancel()
                }}
                value={editName}
              />
              <button
                className="shrink-0 rounded bg-[#0058BE] px-2 py-1 text-xs font-bold text-white hover:bg-[#004EA8] disabled:opacity-45"
                disabled={isSaving}
                onClick={() => { void handleSave() }}
                type="button"
              >
                저장
              </button>
              <button
                className="shrink-0 rounded px-2 py-1 text-xs font-bold text-slate-600 hover:bg-slate-100"
                onClick={handleCancel}
                type="button"
              >
                취소
              </button>
            </div>
            {saveError ? <p className="mt-1 text-xs font-medium text-red-500">{saveError}</p> : null}
          </div>
        ) : (
          <div className="mt-4 flex items-center gap-1">
            <h2 className="text-sm font-extrabold text-slate-950">{workspace.name}</h2>
            {workspace.isAdmin ? (
              <button
                aria-label="워크스페이스 이름 수정"
                className="text-slate-400 transition-colors hover:text-[#0058BE]"
                onClick={handleStartEdit}
                type="button"
              >
                <Pencil size={13} />
              </button>
            ) : null}
          </div>
        )}
        <p className="mt-2 min-h-10 text-xs font-medium leading-5 text-slate-600">{workspace.description}</p>

        <div className="my-4 h-px bg-slate-300" />

        <div className="flex items-center justify-between gap-4">
          <div>
            <div className="mb-2 flex min-h-6 items-center -space-x-2">
              {visiblePreviewMembers.map((member) => (
                <Avatar key={member.id} name={member.user.name} size={22} src={member.user.avatarUrl} />
              ))}
              {workspace.members >= 3 ? (
                <span className="grid size-6 place-items-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-600 ring-2 ring-white">
                  +{workspace.extraMembers}
                </span>
              ) : null}
            </div>
            <p className="text-xs font-medium text-slate-700">{workspace.members} Members</p>
          </div>

          <div className="flex flex-col items-end gap-1.5">
            <button
              className="rounded-full px-3 py-1 text-[11px] font-bold leading-none text-white transition-opacity hover:opacity-85"
              onClick={onViewMembers}
              style={{ backgroundColor: workspace.accent }}
              type="button"
            >
              멤버 조회
            </button>
            {workspace.isAdmin ? (
              <button
                className="flex items-center gap-1 rounded-full px-3 py-1 text-[11px] font-bold leading-none text-[#0058BE] ring-1 ring-[#0058BE] transition-colors hover:bg-[#0058BE] hover:text-white"
                onClick={onAddMember}
                type="button"
              >
                <UserPlus size={11} />
                멤버 추가
              </button>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  )
}

export function WorkspaceManagePage() {
  const navigate = useNavigate()
  const [permissionNotice, setPermissionNotice] = useState<PermissionNoticeState | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [addMemberWorkspaceId, setAddMemberWorkspaceId] = useState<string | null>(null)
  const authUser = useAuthStore((state) => state.user)
  const activeUserId = authUser?.id ?? ''
  const { deleteWorkspaceChannels, channels } = useChannelStore()
  const deleteChannelMessages = useMessageStore((state) => state.deleteChannelMessages)
  const deleteWorkspace = useWorkspaceStore((state) => state.deleteWorkspace)
  const updateWorkspaceName = useWorkspaceStore((state) => state.updateWorkspaceName)
  const setActiveWorkspaceId = useWorkspaceStore((state) => state.setActiveWorkspaceId)
  const storedWorkspaces = useWorkspaceStore((state) => state.workspaces)
  const workspaceMembersByWorkspaceId = useWorkspaceStore((state) => state.workspaceMembersByWorkspaceId)

  const displayedWorkspaces: WorkspaceManageCardData[] = storedWorkspaces.map((workspace, index) => {
    const workspaceMembers = workspaceMembersByWorkspaceId[workspace.id] ?? []
    const memberCount = workspaceMembers.length
    const currentRole = workspaceMembers.find((member) => member.user.id === activeUserId)?.role ?? 'member'

    return {
      accent: getWorkspaceAccent(index),
      badge: workspace.name.slice(0, 2).toUpperCase(),
      description: '참여 중인 워크스페이스입니다.',
      extraMembers: Math.max(0, memberCount - 2),
      id: workspace.id,
      isAdmin: currentRole === 'admin',
      members: memberCount,
      name: workspace.name,
      previewMembers: workspaceMembers,
    }
  })

  const handleSaveName = async (workspaceId: string, name: string) => {
    await workspaceApi.updateWorkspace(workspaceId, { name })
    updateWorkspaceName(workspaceId, name)
  }

  const handleViewMembers = (workspaceId: string) => {
    setActiveWorkspaceId(workspaceId)
    navigate('/workspaces/members')
  }

  const showPermissionNotice = (event: MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect()
    setPermissionNotice({
      left: Math.max(16, Math.min(rect.right + 10, window.innerWidth - 346)),
      top: Math.max(16, Math.min(rect.top - 10, window.innerHeight - 100)),
    })
  }

  const handleDeleteWorkspace = (workspaceId: string, event: MouseEvent<HTMLButtonElement>) => {
    const currentRole =
      workspaceMembersByWorkspaceId[workspaceId]?.find((member) => member.user.id === activeUserId)?.role ?? 'member'

    if (currentRole !== 'admin') {
      showPermissionNotice(event)
      return
    }

    void workspaceApi.deleteWorkspace(workspaceId).then(() => {
      channels
        .filter((channel) => channel.workspaceId === workspaceId)
        .forEach((channel) => deleteChannelMessages(channel.id))
      deleteWorkspaceChannels(workspaceId)
      deleteWorkspace(workspaceId)
      setPermissionNotice(null)
      setDeleteError(null)
    }).catch((err: unknown) => {
      const message = (err as { response?: { data?: { message?: string } } })?.response?.data?.message
      setDeleteError(message ?? '워크스페이스 삭제에 실패했습니다.')
    })
  }

  return (
    <MainLayout header={<AppPageHeader />}>
      {addMemberWorkspaceId ? (
        <AddMemberModal onClose={() => setAddMemberWorkspaceId(null)} workspaceId={addMemberWorkspaceId} />
      ) : null}
      <div className="min-h-0 overflow-y-auto bg-[#fbfbff] px-7 py-6">
        {permissionNotice ? (
          <div
            className="fixed z-40 w-[20.625rem] rounded-lg border border-slate-300 bg-white p-3 text-xs font-bold leading-5 text-slate-700 shadow-xl"
            style={{ left: permissionNotice.left, top: permissionNotice.top }}
          >
            <div className="flex items-start justify-between gap-3">
              <p>워크스페이스 삭제는 해당 워크스페이스의 admin 멤버만 가능합니다.</p>
              <button
                aria-label="워크스페이스 삭제 권한 안내 닫기"
                className="shrink-0 text-slate-400 transition-colors hover:text-slate-700"
                onClick={() => setPermissionNotice(null)}
                type="button"
              >
                <X size={14} />
              </button>
            </div>
          </div>
        ) : null}
        <div className="flex w-full flex-col gap-7">
          <section>
            <h1 className="text-base font-extrabold text-slate-950">워크스페이스 설정</h1>
          </section>

          <section>
            <div className="mb-5 flex items-center gap-2 text-base font-medium text-slate-800">
              <Users size={18} />
              <span>내 워크스페이스: 참여 중인 워크스페이스 정보를 확인하고 관리하세요.</span>
            </div>

            {deleteError ? (
              <p className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-[#BA1A1A]">
                {deleteError}
              </p>
            ) : null}
            {displayedWorkspaces.length === 0 ? (
              <p className="text-sm font-medium text-slate-500">참여 중인 워크스페이스가 없습니다.</p>
            ) : (
              <div className="grid grid-cols-3 gap-4 max-xl:grid-cols-2 max-md:grid-cols-1">
                {displayedWorkspaces.map((workspace) => (
                  <WorkspaceManageCard
                    key={workspace.id}
                    onAddMember={() => setAddMemberWorkspaceId(workspace.id)}
                    onDelete={(event) => handleDeleteWorkspace(workspace.id, event)}
                    onSaveName={(name) => handleSaveName(workspace.id, name)}
                    onViewMembers={() => handleViewMembers(workspace.id)}
                    workspace={workspace}
                  />
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="mb-5 flex items-center gap-2 text-base font-medium text-slate-800">
              <Mail size={18} />
              <span>초대 목록: 수락 대기 중인 워크스페이스 초대입니다.</span>
            </div>
            <p className="text-sm font-medium text-slate-500">수락 대기 중인 초대가 없습니다.</p>
          </section>
        </div>
      </div>
    </MainLayout>
  )
}
