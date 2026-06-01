import { useQuery } from '@tanstack/react-query'
import { mapMessage, messageApi } from '../api/messageApi'
import { useWorkspaceStore } from '../stores/useWorkspaceStore'

export const useMessages = (channelId?: string) =>
  useQuery({
    queryKey: ['messages', channelId],
    queryFn: async () => {
      const rawMessages = await messageApi.getMessages(channelId ?? '', 'CHANNEL')
      const users = useWorkspaceStore.getState().workspaceMembers.map((m) => m.user)
      return rawMessages.map((raw) => mapMessage(raw, users))
    },
    enabled: Boolean(channelId),
  })
