import type { UserStatus } from '../../types/user'

interface OnlineStatusBadgeProps {
  status: UserStatus
}

export function OnlineStatusBadge({ status }: OnlineStatusBadgeProps) {
  const statusClass = status === 'online' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'

  return (
    <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-bold ${statusClass}`}>
      {status}
    </span>
  )
}
