import type { UserStatus } from '../../types/user'

interface OnlineStatusBadgeProps {
  status: UserStatus
}

export function OnlineStatusBadge({ status }: OnlineStatusBadgeProps) {
  return <span className={`status status-${status}`}>{status}</span>
}
