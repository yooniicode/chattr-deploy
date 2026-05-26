import type { User } from '../../types/user'
import { Avatar } from '../common/Avatar'

interface ChannelMemberListProps {
  members: User[]
}

export function ChannelMemberList({ members }: ChannelMemberListProps) {
  return (
    <div className="stack">
      {members.map((member) => (
        <div className="list-item" key={member.id}>
          <Avatar name={member.name} src={member.avatarUrl} />
          <span>{member.name}</span>
        </div>
      ))}
    </div>
  )
}
