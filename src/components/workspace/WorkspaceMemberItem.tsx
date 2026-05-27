import type { WorkspaceMember } from '../../types/workspace'
import { Avatar } from '../common/Avatar'
import { WorkspaceRoleBadge } from './WorkspaceRoleBadge'

interface WorkspaceMemberItemProps {
  member: WorkspaceMember
  isCurrentUser?: boolean
  onRoleClick?: (member: WorkspaceMember) => void
}

export function WorkspaceMemberItem({ member, isCurrentUser = false, onRoleClick }: WorkspaceMemberItemProps) {
  return (
    <div className="flex items-center gap-3 rounded-md px-2 py-1.5 transition-colors hover:bg-slate-50">
      <span className="relative inline-flex">
        <Avatar name={member.user.name} size={30} src={member.user.avatarUrl} />
        {member.user.status === 'online' ? (
          <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-white bg-emerald-500" />
        ) : null}
      </span>
      <span className="text-sm font-medium text-slate-800">
        {member.user.name}
        {isCurrentUser ? <span className="ml-1 text-xs font-bold text-[#0058BE]">(나)</span> : null}
      </span>
      <WorkspaceRoleBadge role={member.role} onClick={() => onRoleClick?.(member)} />
    </div>
  )
}
