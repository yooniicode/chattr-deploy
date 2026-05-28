import type { Workspace, WorkspaceMember } from '../types/workspace'

export const mockWorkspaces: Workspace[] = [
  {
    id: 'apollo',
    name: 'apollo',
    createdAt: '2026-05-26T00:00:00.000Z',
  },
  {
    id: '0602',
    name: '0602',
    createdAt: '2026-05-26T00:00:00.000Z',
  },
  {
    id: 'pj5',
    name: 'PJ5',
    createdAt: '2026-05-26T00:00:00.000Z',
  },
]

export const mockWorkspaceMembers: WorkspaceMember[] = [
  {
    id: 'member-1',
    joinedAt: '2026-05-26T00:00:00.000Z',
    role: 'admin',
    user: {
      id: 'user-1',
      email: 'owner@chattr.app',
      name: 'Owner',
      status: 'online',
    },
  },
]
