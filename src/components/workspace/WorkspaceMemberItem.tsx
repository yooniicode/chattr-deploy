import type { WorkspaceMember } from '../../types/workspace'
import { Avatar } from '../common/Avatar'
import { WorkspaceRoleBadge } from './WorkspaceRoleBadge'

interface WorkspaceMemberItemProps {
  member: WorkspaceMember
}

export function WorkspaceMemberItem({ member }: WorkspaceMemberItemProps) {
  return (
    <div className="list-item">
      <Avatar name={member.user.name} src={member.user.avatarUrl} />
      <span>{member.user.name}</span>
      <WorkspaceRoleBadge role={member.role} />
    </div>
  )
}
