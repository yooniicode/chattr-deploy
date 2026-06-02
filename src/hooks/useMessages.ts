import { useQuery } from '@tanstack/react-query'
import { mapMessage, messageApi } from '../api/messageApi'

export const useMessages = (channelId?: string) =>
  useQuery({
    queryKey: ['messages', channelId],
    queryFn: async () => {
      const rawMessages = await messageApi.getMessages(channelId ?? '', 'CHANNEL')
      return rawMessages.map((raw) => mapMessage(raw))
    },
    enabled: Boolean(channelId),
  })
