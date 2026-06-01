import { useEffect } from 'react'
import { mapMessage } from '../api/messageApi'
import { useAuthStore } from '../stores/useAuthStore'
import { useChannelStore } from '../stores/useChannelStore'
import { useDmStore } from '../stores/useDmStore'
import { useMessageStore } from '../stores/useMessageStore'
import { useWorkspaceStore } from '../stores/useWorkspaceStore'
import { getAccessToken } from '../utils/token'
import { socketClient } from '../websocket/socketClient'

export function DataLoader() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  const isSessionReady = useAuthStore((state) => state.isSessionReady)
  const authUserId = useAuthStore((state) => state.user?.id)

  const fetchWorkspaces = useWorkspaceStore((state) => state.fetchWorkspaces)
  const fetchMembers = useWorkspaceStore((state) => state.fetchMembers)
  const activeWorkspaceId = useWorkspaceStore((state) => state.activeWorkspaceId)
  const activeWorkspaceExists = useWorkspaceStore((state) =>
    Boolean(state.activeWorkspaceId && state.workspaces.some((workspace) => workspace?.id === state.activeWorkspaceId)),
  )

  const fetchChannels = useChannelStore((state) => state.fetchChannels)
  const activeChannelId = useChannelStore((state) => state.activeChannelId)

  const fetchDmRooms = useDmStore((state) => state.fetchDmRooms)
  const activeRoomId = useDmStore((state) => state.activeRoomId)

  const fetchChannelMessages = useMessageStore((state) => state.fetchChannelMessages)
  const fetchDmMessages = useMessageStore((state) => state.fetchDmMessages)

  useEffect(() => {
    if (!isSessionReady || !isAuthenticated) return
    fetchWorkspaces()
    fetchDmRooms(authUserId)
    const token = getAccessToken()
    if (token) socketClient.connect(token)
    return () => { socketClient.disconnect() }
  }, [isSessionReady, isAuthenticated, authUserId, fetchWorkspaces, fetchDmRooms])

  useEffect(() => {
    if (!activeWorkspaceId) return
    if (!activeWorkspaceExists) return
    fetchChannels(activeWorkspaceId)
    fetchMembers(activeWorkspaceId)
  }, [activeWorkspaceExists, activeWorkspaceId, fetchChannels, fetchMembers])

  useEffect(() => {
    if (!activeChannelId) return
    fetchChannelMessages(activeChannelId)
    const unsubscribe = socketClient.subscribe(activeChannelId, (raw) => {
      const users = useWorkspaceStore.getState().workspaceMembers.map((m) => m.user)
      const message = mapMessage(raw, users)
      useMessageStore.getState().updateChannelMessages(activeChannelId, (msgs) =>
        msgs.some((m) => m.id === message.id) ? msgs : [...msgs, message],
      )
    })
    return unsubscribe
  }, [activeChannelId, fetchChannelMessages])

  useEffect(() => {
    if (!activeRoomId) return
    fetchDmMessages(activeRoomId)
    const unsubscribe = socketClient.subscribe(activeRoomId, (raw) => {
      const users = useWorkspaceStore.getState().workspaceMembers.map((m) => m.user)
      const message = mapMessage(raw, users)
      useMessageStore.getState().updateDmMessages(activeRoomId, (msgs) =>
        msgs.some((m) => m.id === message.id) ? msgs : [...msgs, message],
      )
    })
    return unsubscribe
  }, [activeRoomId, fetchDmMessages])

  return null
}
