import type { User } from '../../types/user'
import { Avatar } from '../common/Avatar'
import { OnlineStatusBadge } from './OnlineStatusBadge'

interface ProfileCardProps {
  user: User
}

export function ProfileCard({ user }: ProfileCardProps) {
  return (
    <section className="flex w-full max-w-xl items-center gap-4 rounded-lg border border-slate-200 bg-white p-6">
      <Avatar name={user.name} size={56} src={user.avatarUrl} />
      <div>
        <h2 className="text-lg font-bold text-slate-950">{user.name}</h2>
        <p className="text-sm text-slate-500">{user.email}</p>
        <OnlineStatusBadge status={user.status} />
      </div>
    </section>
  )
}
