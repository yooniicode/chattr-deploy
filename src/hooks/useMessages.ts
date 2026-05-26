import { useQuery } from '@tanstack/react-query'
import { messageApi } from '../api/messageApi'

export const useMessages = (channelId?: string) =>
  useQuery({
    queryKey: ['messages', channelId],
    queryFn: () => messageApi.getChannelMessages(channelId ?? ''),
    enabled: Boolean(channelId),
  })
