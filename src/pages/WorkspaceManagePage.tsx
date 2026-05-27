import { Flag, Mail, MessageSquare, UserRoundCheck, Users } from 'lucide-react'
import { Button } from '../components/common/Button'
import { Avatar } from '../components/common/Avatar'
import { MainLayout } from '../components/layout/MainLayout'

const workspaces = [
  {
    id: 'apollo',
    badge: 'apollo',
    name: '프로젝트 apollo TF',
    description: '제품 개발 및 인프라 관리를 위한 통합 워크스페이스입니다.',
    members: 68,
    extraMembers: 66,
    accent: '#0058BE',
    selected: true,
  },
  {
    id: '0602',
    badge: '0602',
    name: '0602 meeting 준비',
    description: '브랜드 가이드라인 및 디자인 라이브러리 운영 공간입니다.',
    members: 14,
    extraMembers: 13,
    accent: '#5a6072',
  },
  {
    id: 'pj5',
    badge: 'PJ5',
    name: 'project5',
    description: '글로벌 마케팅 캠페인 기획 및 성과 분석 워크스페이스.',
    members: 31,
    extraMembers: 30,
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

function WorkspaceManageCard({ workspace }: { workspace: (typeof workspaces)[number] }) {
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
            <div className="mb-2 flex items-center -space-x-2">
              <Avatar name="강지원" size={22} />
              <Avatar name="이서윤" size={22} />
              <span className="grid size-6 place-items-center rounded-full bg-slate-200 text-[10px] font-bold text-slate-600 ring-2 ring-white">
                +{workspace.extraMembers}
              </span>
            </div>
            <p className="text-xs font-medium text-slate-700">{workspace.members} Members</p>
          </div>

          <button
            className={`rounded-full px-3 py-1 text-[11px] font-bold leading-none transition-colors ${
              workspace.selected
                ? 'bg-[#0058BE] text-white hover:bg-[#004EA8]'
                : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
            }`}
            type="button"
          >
            멤버 조회
          </button>
        </div>
      </div>
    </article>
  )
}

function InviteCard({ invite }: { invite: (typeof invites)[number] }) {
  const Icon = invite.icon

  return (
    <article className="overflow-hidden rounded-lg border border-slate-300 bg-white transition-shadow hover:shadow-md">
      <div className="h-1 bg-[#0058BE]" />
      <div className="flex items-center justify-between gap-5 px-5 py-4">
        <div className="flex items-center gap-4">
          <span className="grid size-9 place-items-center rounded-md bg-slate-200 text-slate-800">
            <Icon size={19} />
          </span>
          <h3 className="text-xs font-extrabold leading-5 text-slate-950">{invite.title}</h3>
        </div>
        <Button className="min-h-8 gap-2 px-4 py-1.5 text-xs" variant="secondary">
          <Mail size={15} />
          초대 수락하기
        </Button>
      </div>
    </article>
  )
}

export function WorkspaceManagePage() {
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
              {workspaces.map((workspace) => (
                <WorkspaceManageCard key={workspace.id} workspace={workspace} />
              ))}
            </div>
          </section>

          <section>
            <div className="mb-5 flex items-center gap-2 text-base font-medium text-slate-800">
              <Mail size={18} />
              <span>초대된 목록: 워크스페이스에 참여하기 위해 초대를 수락해주세요.</span>
            </div>

            <div className="flex w-full flex-col gap-4">
              {invites.map((invite) => (
                <InviteCard invite={invite} key={invite.id} />
              ))}
            </div>
          </section>
        </div>
      </div>
    </MainLayout>
  )
}
