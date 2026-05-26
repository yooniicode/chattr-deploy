import { useQuery } from '@tanstack/react-query'
import { channelApi } from '../api/channelApi'

export const useChannels = (workspaceId?: string) =>
  useQuery({
    queryKey: ['channels', workspaceId],
    queryFn: () => channelApi.getChannels(workspaceId ?? ''),
    enabled: Boolean(workspaceId),
  })
