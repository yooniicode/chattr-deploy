import { axiosInstance } from './axiosInstance'
import type { Workspace, WorkspaceMember } from '../types/workspace'

export const workspaceApi = {
  getWorkspaces: async () => {
    const { data } = await axiosInstance.get<Workspace[]>('/workspaces')
    return data
  },
  getMembers: async (workspaceId: string) => {
    const { data } = await axiosInstance.get<WorkspaceMember[]>(
      `/workspaces/${workspaceId}/members`,
    )
    return data
  },
  createWorkspace: async (payload: Pick<Workspace, 'name'>) => {
    const { data } = await axiosInstance.post<Workspace>('/workspaces', payload)
    return data
  },
}
