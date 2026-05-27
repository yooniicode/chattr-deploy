import type { User } from '../../types/user'
import { Avatar } from '../common/Avatar'

interface ChannelMemberListProps {
  members: User[]
}

export function ChannelMemberList({ members }: ChannelMemberListProps) {
  return (
    <div className="flex flex-col gap-3">
      {members.map((member) => (
        <div className="flex items-center gap-3" key={member.id}>
          <Avatar name={member.name} src={member.avatarUrl} />
          <span className="font-medium text-slate-800">{member.name}</span>
        </div>
      ))}
    </div>
  )
}
