import type { WorkspaceRole } from '../../types/workspace'

interface WorkspaceRoleBadgeProps {
  role: WorkspaceRole
}

export function WorkspaceRoleBadge({ role }: WorkspaceRoleBadgeProps) {
  return <span className="badge">{role}</span>
}
