import { axiosInstance } from './axiosInstance'
import type { Workspace, WorkspaceMember, WorkspaceRole } from '../types/workspace'

interface PageResponse<T> {
  content?: T[]
}

interface BackendWorkspaceMember {
  createdAt?: string
  email?: string
  id?: string
  joinedAt?: string
  memberId?: string
  name?: string
  nickname?: string
  online?: boolean
  role?: string
  user?: {
    avatarUrl?: string
    email?: string
    id?: string
    name?: string
    nickname?: string
    online?: boolean
  }
  userId?: string
}

const extractList = <T>(response: T[] | PageResponse<T>) => {
  if (Array.isArray(response)) return response
  return response.content ?? []
}

const normalizeRole = (role?: string): WorkspaceRole => (role?.toLowerCase() === 'admin' ? 'admin' : 'member')

const mapWorkspaceMember = (member: BackendWorkspaceMember): WorkspaceMember | null => {
  const backendUser = member.user
  const userId = backendUser?.id ?? member.userId ?? member.id
  const name = backendUser?.name ?? backendUser?.nickname ?? member.name ?? member.nickname ?? member.email

  if (!userId || !name) return null

  return {
    id: member.memberId ?? member.id ?? userId,
    joinedAt: member.joinedAt ?? member.createdAt ?? '',
    role: normalizeRole(member.role),
    user: {
      avatarUrl: backendUser?.avatarUrl,
      email: backendUser?.email ?? member.email ?? '',
      id: userId,
      name,
      status: (backendUser?.online ?? member.online) ? 'online' : 'offline',
    },
  }
}

export const workspaceApi = {
  getWorkspaces: async () => {
    const { data } = await axiosInstance.get<Workspace[]>('/workspaces')
    return data
  },
  getWorkspace: async (workspaceId: string) => {
    const { data } = await axiosInstance.get<Workspace>(`/workspaces/${workspaceId}`)
    return data
  },
  createWorkspace: async (payload: Pick<Workspace, 'name'>) => {
    const { data } = await axiosInstance.post<Workspace>('/workspaces', payload)
    return data
  },
  updateWorkspace: async (workspaceId: string, payload: Partial<Pick<Workspace, 'name'>>) => {
    const { data } = await axiosInstance.patch<Workspace>(`/workspaces/${workspaceId}`, payload)
    return data
  },
  deleteWorkspace: async (workspaceId: string) => {
    await axiosInstance.delete(`/workspaces/${workspaceId}`)
  },
  getMembers: async (workspaceId: string) => {
    const { data } = await axiosInstance.get<BackendWorkspaceMember[] | PageResponse<BackendWorkspaceMember>>(
      `/workspaces/${workspaceId}/members`,
    )
    return extractList(data)
      .map(mapWorkspaceMember)
      .filter((member): member is WorkspaceMember => Boolean(member))
  },
  inviteMember: async (workspaceId: string, email: string) => {
    await axiosInstance.post(`/workspaces/${workspaceId}/invitations`, { email })
  },
  acceptInvitation: async (workspaceId: string) => {
    await axiosInstance.post(`/workspaces/${workspaceId}/members`)
  },
  changeMemberRole: async (workspaceId: string, memberId: string, role: WorkspaceRole) => {
    await axiosInstance.patch(`/workspaces/${workspaceId}/members`, { memberId, role })
  },
}
