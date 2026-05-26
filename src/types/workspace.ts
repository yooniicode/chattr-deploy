import type { User } from './user'

export type WorkspaceRole = 'owner' | 'admin' | 'member'

export interface Workspace {
  id: string
  name: string
  imageUrl?: string
  createdAt: string
}

export interface WorkspaceMember {
  id: string
  user: User
  role: WorkspaceRole
  joinedAt: string
}
