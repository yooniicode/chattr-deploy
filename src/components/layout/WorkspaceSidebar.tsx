import { Plus, Settings } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { WorkspaceCard } from '../workspace/WorkspaceCard'
import { Avatar } from '../common/Avatar'

const workspaceRailItems = [
  {
    id: 'apollo',
    name: 'apollo',
  },
  {
    id: '0602',
    name: '0602',
  },
  {
    id: 'pj5',
    name: 'PJ5',
  },
]

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
  const isProfilePage = location.pathname === '/profile'

  return (
    <nav
      aria-label="Workspaces"
      className="flex h-screen min-h-0 flex-col items-center border-r border-slate-300 bg-[#e7eaf2] px-2 py-4"
    >
      <div className="flex flex-col items-center gap-3">
        {workspaceRailItems.map((workspace, index) => (
          <WorkspaceCard active={index === 0} key={workspace.id} workspace={{ ...workspace, createdAt: '' }} />
        ))}
        <button
          aria-label="Settings"
          className="flex size-10 items-center justify-center rounded-xl border border-slate-300 bg-slate-100 text-slate-700 hover:bg-white"
          type="button"
        >
          <Settings size={21} />
        </button>
        <button
          aria-label="Create workspace"
          className="flex size-10 items-center justify-center rounded-full border border-dashed border-slate-300 bg-slate-100 text-slate-600 hover:bg-white"
          type="button"
        >
          <Plus size={22} />
        </button>
      </div>

      <div className="mt-4 h-px w-8 bg-slate-300" />

      <button
        aria-label="Messages"
        className="relative mt-3 flex size-10 items-center justify-center rounded-xl border border-slate-300 bg-slate-100 text-slate-700 hover:bg-white"
        type="button"
      >
        <ChatRailIcon />
        <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-red-600 text-[10px] font-bold text-white">
          4
        </span>
      </button>

      <button
        aria-label="Profile"
        className={`mt-auto rounded-full p-0.5 ${isProfilePage ? 'ring-2 ring-[#0058BE]' : ''}`}
        type="button"
      >
        <Avatar name="나" size={38} />
      </button>
    </nav>
  )
}
