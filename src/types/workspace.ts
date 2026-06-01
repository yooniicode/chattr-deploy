import type { User } from './user'

export type WorkspaceRole = 'admin' | 'member'

export interface Workspace {
  id: string
  name: string
  imageUrl?: string
  createdAt: string
  myRole?: 'ADMIN' | 'MEMBER'
}

export interface WorkspaceMember {
  id: string
  user: User
  role: WorkspaceRole
  joinedAt: string
}
