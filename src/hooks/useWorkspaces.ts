import { useQuery } from '@tanstack/react-query'
import { workspaceApi } from '../api/workspaceApi'

export const useWorkspaces = () =>
  useQuery({
    queryKey: ['workspaces'],
    queryFn: workspaceApi.getWorkspaces,
  })
