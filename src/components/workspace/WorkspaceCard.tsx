import type { Workspace } from '../../types/workspace'

interface WorkspaceCardProps {
  workspace: Workspace
  active?: boolean
  onClick?: () => void
}

export function WorkspaceCard({ active = false, onClick, workspace }: WorkspaceCardProps) {
  return (
    <button
      aria-label={workspace.name}
      className={`flex size-10 items-center justify-center rounded-xl border text-sm font-bold shadow-sm transition-colors ${
        active
          ? 'border-[#0058BE] bg-[#0058BE] text-white'
          : 'border-slate-300 bg-slate-100 text-slate-700 hover:bg-white'
      }`}
      onClick={onClick}
      type="button"
    >
      {workspace.name.slice(0, 2)}
    </button>
  )
}
