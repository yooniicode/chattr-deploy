import type { User } from '../../types/user'
import { Avatar } from '../common/Avatar'
import { OnlineStatusBadge } from './OnlineStatusBadge'

interface ProfileCardProps {
  user: User
}

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <section className="profile-card">
      <Avatar name={user.name} size={56} src={user.avatarUrl} />
      <div>
        <h2>{user.name}</h2>
        <p>{user.email}</p>
        <OnlineStatusBadge status={user.status} />
      </div>
    </section>
  )
}
