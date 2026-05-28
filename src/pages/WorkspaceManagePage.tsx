import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Flag, Mail, MessageSquare, UserRoundCheck, Users } from 'lucide-react'
import { Avatar } from '../components/common/Avatar'
import { Button } from '../components/common/Button'
import { MainLayout } from '../components/layout/MainLayout'
import { useWorkspaceStore } from '../stores/useWorkspaceStore'
import type { WorkspaceMember } from '../types/workspace'

const staticWorkspaces = [
  {
    id: 'apollo',
    badge: 'apollo',
    name: '프로젝트 apollo TF',
    description: '제품 개발 및 인프라 관리를 위한 통합 워크스페이스입니다.',
    accent: '#0058BE',
    selected: true,
  },
  {
    id: '0602',
    badge: '0602',
    name: '0602 meeting 준비',
    description: '브랜드 가이드라인 및 디자인 라이브러리 운영 공간입니다.',
    accent: '#5a6072',
  },
  {
    id: 'pj5',
    badge: 'PJ5',
    name: 'project5',
    description: '글로벌 마케팅 캠페인 기획 및 성과 분석 워크스페이스.',
    accent: '#8A3D00',
  },
]

const invites = [
  {
    id: 'invite-1',
    title: 'week2 milestone meeting',
    icon: Flag,
  },
  {
    id: 'invite-2',
    title: '유저 피드백 기능 개선 작업',
    icon: UserRoundCheck,
  },
]

const ACCEPTED_INVITES_STORAGE_KEY = 'chattr-accepted-invite-ids'

const getInitialAcceptedInviteIds = () => {
  try {
    return JSON.parse(localStorage.getItem(ACCEPTED_INVITES_STORAGE_KEY) ?? '[]') as string[]
  } catch {
    return []
  }
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
  selected?: boolean
}

function WorkspaceTopHeader() {
  return (
    <header className="flex h-10 items-center border-b border-slate-300 bg-[#fbfbff] px-6">
      <div className="flex items-center gap-2 text-[#0058BE]">
        <MessageSquare aria-hidden size={22} strokeWidth={2.5} />
        <span className="text-2xl font-extrabold">Chattr</span>
      </div>
    </header>
  )
}

function WorkspaceManageCard({
  onViewMembers,
  workspace,
}: {
  onViewMembers: () => void
  workspace: WorkspaceManageCardData
}) {
  const visiblePreviewMembers =
    workspace.members < 3 ? workspace.previewMembers.slice(0, 1) : workspace.previewMembers.slice(0, 2)

  return (
    <article className="group overflow-hidden rounded-lg border border-slate-300 bg-white transition-shadow hover:shadow-md">
      <div className="h-1" style={{ backgroundColor: workspace.accent }} />
      <div className="p-4">
        <div className="grid size-9 place-items-center rounded-md bg-slate-200 text-xs font-extrabold text-slate-950">
          {workspace.badge}
        </div>

        <h2 className="mt-4 text-sm font-extrabold text-slate-950">{workspace.name}</h2>
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

          <button
            className="rounded-full px-3 py-1 text-[11px] font-bold leading-none text-white transition-opacity hover:opacity-85"
            onClick={onViewMembers}
            style={{ backgroundColor: workspace.accent }}
            type="button"
          >
            멤버 조회
          </button>
        </div>
      </div>
    </article>
  )
}

function InviteCard({ invite, onAccept }: { invite: (typeof invites)[number]; onAccept: () => void }) {
  const Icon = invite.icon

  return (
    <article className="overflow-hidden rounded-lg border border-slate-300 bg-white transition-shadow hover:shadow-md">
      <div className="h-1 bg-[#0058BE]" />
      <div className="flex items-center justify-between gap-5 px-5 py-2.5">
        <div className="flex items-center gap-4">
          <span className="grid size-9 place-items-center rounded-md bg-slate-200 text-slate-800">
            <Icon size={19} />
          </span>
          <h3 className="text-xs font-extrabold leading-5 text-slate-950">{invite.title}</h3>
        </div>
        <Button className="min-h-8 gap-2 px-4 py-1.5 text-xs" onClick={onAccept} variant="secondary">
          <Mail size={15} />
          초대 수락하기
        </Button>
      </div>
    </article>
  )
}

export function WorkspaceManagePage() {
  const navigate = useNavigate()
  const [acceptedInviteIds, setAcceptedInviteIds] = useState<string[]>(getInitialAcceptedInviteIds)
  const addWorkspace = useWorkspaceStore((state) => state.addWorkspace)
  const setActiveWorkspaceId = useWorkspaceStore((state) => state.setActiveWorkspaceId)
  const storedWorkspaces = useWorkspaceStore((state) => state.workspaces)
  const workspaceMembersByWorkspaceId = useWorkspaceStore((state) => state.workspaceMembersByWorkspaceId)
  const pendingInvites = invites.filter((invite) => !acceptedInviteIds.includes(invite.id))

  const displayedWorkspaces: WorkspaceManageCardData[] = storedWorkspaces.map((workspace) => {
    const staticWorkspace = staticWorkspaces.find((item) => item.id === workspace.id)
    const workspaceMembers = workspaceMembersByWorkspaceId[workspace.id] ?? []
    const memberCount = workspaceMembers.length || 0

    return {
      accent: staticWorkspace?.accent ?? '#0058BE',
      badge: staticWorkspace?.badge ?? workspace.name.slice(0, 2),
      description: staticWorkspace?.description ?? '새로 추가된 워크스페이스입니다.',
      extraMembers: Math.max(0, memberCount - 2),
      id: workspace.id,
      members: memberCount,
      name: staticWorkspace?.name ?? workspace.name,
      previewMembers: workspaceMembers,
      selected: staticWorkspace?.selected,
    }
  })

  const handleAcceptInvite = (invite: (typeof invites)[number]) => {
    addWorkspace({
      id: `accepted-${invite.id}`,
      name: invite.title,
      createdAt: new Date().toISOString(),
    })
    setAcceptedInviteIds((current) => {
      const nextIds = Array.from(new Set([...current, invite.id]))
      localStorage.setItem(ACCEPTED_INVITES_STORAGE_KEY, JSON.stringify(nextIds))
      return nextIds
    })
  }

  const handleViewMembers = (workspaceId: string) => {
    setActiveWorkspaceId(workspaceId)
    navigate('/workspaces/members')
  }

  return (
    <MainLayout header={<WorkspaceTopHeader />}>
      <div className="min-h-0 overflow-y-auto bg-[#fbfbff] px-7 py-6">
        <div className="flex w-full flex-col gap-7">
          <section>
            <h1 className="text-base font-extrabold text-slate-950">workspace 설정</h1>
          </section>

          <section>
            <div className="mb-5 flex items-center gap-2 text-base font-medium text-slate-800">
              <Users size={18} />
              <span>내 워크스페이스 목록: 참여 중인 워크스페이스를 정보를 확인 및 수정하세요.</span>
            </div>

            <div className="grid grid-cols-3 gap-4 max-xl:grid-cols-2 max-md:grid-cols-1">
              {displayedWorkspaces.map((workspace) => (
                <WorkspaceManageCard
                  key={workspace.id}
                  onViewMembers={() => handleViewMembers(workspace.id)}
                  workspace={workspace}
                />
              ))}
            </div>
          </section>

          <section>
            <div className="mb-5 flex items-center gap-2 text-base font-medium text-slate-800">
              <Mail size={18} />
              <span>초대된 목록: 워크스페이스에 참여하기 위해 초대를 수락해주세요.</span>
            </div>

            <div className="flex w-full flex-col gap-4">
              {pendingInvites.map((invite) => (
                <InviteCard invite={invite} key={invite.id} onAccept={() => handleAcceptInvite(invite)} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  )
}
