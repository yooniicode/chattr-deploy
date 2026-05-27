import type { WorkspaceRole } from '../../types/workspace'

interface WorkspaceRoleBadgeProps {
  role: WorkspaceRole
  onClick?: () => void
}

export function WorkspaceRoleBadge({ role, onClick }: WorkspaceRoleBadgeProps) {
  const label = role === 'admin' ? 'Admin' : 'Member'
  const className =
    role === 'admin'
      ? 'bg-[#0058BE] text-white'
      : 'bg-slate-200 text-slate-900'

  return (
    <button
      className={`ml-auto inline-flex h-6 w-16 items-center justify-center rounded-full text-[11px] font-bold leading-none shadow-sm transition-transform hover:-translate-y-px ${className}`}
      onClick={onClick}
      type="button"
    >
      {label}
    </button>
  )
}
