import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { mockChannels } from '../mocks/mockChannels'
import { currentUserId } from '../mocks/mockWorkspaceMembers'
import type { Channel } from '../types/channel'

interface ChannelState {
  channels: Channel[]
  channelMemberIds: Record<string, string[]>
  activeChannelId?: string
  openedUnreadCounts: Record<string, number>
  unreadCounts: Record<string, number>
  addChannel: (name: string, memberIds: string[], workspaceId?: string) => Channel
  addChannelMembers: (channelId: string, memberIds: string[]) => void
  clearOpenedUnreadCount: (channelId: string) => void
  deleteChannel: (channelId: string) => void
  deleteWorkspaceChannels: (workspaceId: string) => void
  markChannelOpened: (channelId: string) => void
  setChannels: (channels: Channel[]) => void
  setActiveChannelId: (channelId?: string) => void
  setUnreadCounts: (unreadCounts: Record<string, number>) => void
}

export const useChannelStore = create<ChannelState>()(
  persist(
    (set) => ({
      channels: mockChannels,
      channelMemberIds: {
        'channel-1': [currentUserId, 'u3', 'u4'],
        'channel-2': [currentUserId, 'u6'],
        'channel-3': [currentUserId, 'u2', 'u4'],
        'channel-4': [currentUserId, 'u10'],
        'channel-0602-1': [currentUserId, '0602-u2', '0602-u3', '0602-u4'],
        'channel-0602-2': [currentUserId, '0602-u5', '0602-u6'],
        'channel-0602-3': [currentUserId, '0602-u7', '0602-u8', '0602-u9'],
        'channel-pj5-1': [currentUserId, 'pj5-u2', 'pj5-u3', 'pj5-u4'],
        'channel-pj5-2': [currentUserId, 'pj5-u5', 'pj5-u6', 'pj5-u7'],
        'channel-pj5-3': [currentUserId, 'pj5-u8', 'pj5-u9', 'pj5-u10'],
      },
      activeChannelId: mockChannels[0]?.id,
      openedUnreadCounts: {},
      unreadCounts: {
        'channel-2': 3,
        'channel-4': 8,
      },
      addChannel: (name, memberIds, workspaceId = 'apollo') => {
        const channel: Channel = {
          id: `channel-${Date.now()}`,
          workspaceId,
          name,
          type: 'public',
          createdAt: new Date().toISOString(),
        }

        set((state) => ({
          activeChannelId: channel.id,
          channelMemberIds: {
            ...state.channelMemberIds,
            [channel.id]: memberIds,
          },
          channels: [...state.channels, channel],
        }))

        return channel
      },
      addChannelMembers: (channelId, memberIds) =>
        set((state) => ({
          channelMemberIds: {
            ...state.channelMemberIds,
            [channelId]: Array.from(new Set([...(state.channelMemberIds[channelId] ?? []), ...memberIds])),
          },
        })),
      clearOpenedUnreadCount: (channelId) =>
        set((state) => {
          const nextOpenedCounts = { ...state.openedUnreadCounts }
          delete nextOpenedCounts[channelId]
          return { openedUnreadCounts: nextOpenedCounts }
        }),
      deleteChannel: (channelId) =>
        set((state) => {
          const deletedChannel = state.channels.find((channel) => channel.id === channelId)
          const nextChannels = state.channels.filter((channel) => channel.id !== channelId)
          const nextChannelMemberIds = { ...state.channelMemberIds }
          const nextOpenedUnreadCounts = { ...state.openedUnreadCounts }
          const nextUnreadCounts = { ...state.unreadCounts }
          delete nextChannelMemberIds[channelId]
          delete nextOpenedUnreadCounts[channelId]
          delete nextUnreadCounts[channelId]

          const nextActiveChannelId =
            state.activeChannelId === channelId
              ? nextChannels.find((channel) => channel.workspaceId === deletedChannel?.workspaceId)?.id
              : state.activeChannelId

          return {
            activeChannelId: nextActiveChannelId,
            channelMemberIds: nextChannelMemberIds,
            channels: nextChannels,
            openedUnreadCounts: nextOpenedUnreadCounts,
            unreadCounts: nextUnreadCounts,
          }
        }),
      deleteWorkspaceChannels: (workspaceId) =>
        set((state) => {
          const deletedChannelIds = new Set(
            state.channels.filter((channel) => channel.workspaceId === workspaceId).map((channel) => channel.id),
          )
          const nextChannels = state.channels.filter((channel) => !deletedChannelIds.has(channel.id))
          const nextChannelMemberIds = { ...state.channelMemberIds }
          const nextOpenedUnreadCounts = { ...state.openedUnreadCounts }
          const nextUnreadCounts = { ...state.unreadCounts }

          deletedChannelIds.forEach((channelId) => {
            delete nextChannelMemberIds[channelId]
            delete nextOpenedUnreadCounts[channelId]
            delete nextUnreadCounts[channelId]
          })

          return {
            activeChannelId: state.activeChannelId && deletedChannelIds.has(state.activeChannelId) ? nextChannels[0]?.id : state.activeChannelId,
            channelMemberIds: nextChannelMemberIds,
            channels: nextChannels,
            openedUnreadCounts: nextOpenedUnreadCounts,
            unreadCounts: nextUnreadCounts,
          }
        }),
      markChannelOpened: (channelId) =>
        set((state) => {
          const unreadCount = state.unreadCounts[channelId] ?? 0
          const nextUnreadCounts = { ...state.unreadCounts }
          const nextOpenedCounts = { ...state.openedUnreadCounts }
          delete nextUnreadCounts[channelId]
          if (unreadCount > 0) {
            nextOpenedCounts[channelId] = unreadCount
          }

          return {
            activeChannelId: channelId,
            openedUnreadCounts: nextOpenedCounts,
            unreadCounts: nextUnreadCounts,
          }
        }),
      setChannels: (channels) => set({ channels }),
      setActiveChannelId: (activeChannelId) => set({ activeChannelId }),
      setUnreadCounts: (unreadCounts) => set({ unreadCounts }),
    }),
    {
      name: 'chattr-channel-store',
      partialize: (state) => ({
        activeChannelId: state.activeChannelId,
        channelMemberIds: state.channelMemberIds,
        channels: state.channels,
        openedUnreadCounts: state.openedUnreadCounts,
        unreadCounts: state.unreadCounts,
      }),
    },
  ),
)
