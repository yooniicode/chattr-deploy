import { currentUserId } from '../mocks/mockWorkspaceMembers'
import type { User } from '../types/user'

export const currentUserName = '김채트'

export function isCurrentUser(user?: Pick<User, 'id'>) {
  return user?.id === currentUserId || user?.id === 'me'
}

export function getUserDisplayName(user?: Pick<User, 'id' | 'name'>) {
  if (!user) return ''

  if (!isCurrentUser(user)) return user.name

  const name = user.name && user.name !== '나' ? user.name : currentUserName
  return `${name} (나)`
}

export function getUserAvatarName(user?: Pick<User, 'id' | 'name'>) {
  if (!user) return currentUserName

  if (!isCurrentUser(user)) return user.name

  return user.name && user.name !== '나' ? user.name : currentUserName
}
