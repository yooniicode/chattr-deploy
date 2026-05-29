import type { Workspace } from '../../types/workspace'

interface WorkspaceCardProps {
  workspace: Workspace
  active?: boolean
  onClick?: () => void
  unreadCount?: number
}

export function WorkspaceCard({ active = false, onClick, unreadCount, workspace }: WorkspaceCardProps) {
  return (
    <button
      aria-label={workspace.name}
      className={`relative flex size-10 items-center justify-center rounded-xl border text-sm font-bold shadow-sm transition-colors ${
        active
          ? 'border-[#0058BE] bg-[#0058BE] text-white'
          : 'border-slate-300 bg-slate-100 text-slate-700 hover:bg-white'
      }`}
      onClick={onClick}
      type="button"
    >
      {workspace.name.slice(0, 2)}
      {unreadCount ? (
        <span className="absolute -right-1 -top-1 grid size-4 place-items-center rounded-full bg-red-600 text-[10px] font-bold text-white">
          {unreadCount}
        </span>
      ) : null}
    </button>
  )
}
