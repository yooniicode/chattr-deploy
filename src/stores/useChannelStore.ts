import { create } from 'zustand'
import { channelApi } from '../api/channelApi'
import type { Channel } from '../types/channel'

interface ChannelState {
  channels: Channel[]
  channelMemberIds: Record<string, string[]>
  activeChannelId?: string
  openedUnreadCounts: Record<string, number>
  unreadCounts: Record<string, number>
  addChannel: (name: string, memberIds: string[], workspaceId: string) => Promise<Channel>
  addChannelMembers: (channelId: string, memberIds: string[]) => void
  fetchChannelMembers: (channelId: string) => Promise<void>
  clearOpenedUnreadCount: (channelId: string) => void
  deleteChannel: (channelId: string) => void
  deleteWorkspaceChannels: (workspaceId: string) => void
  markChannelOpened: (channelId: string) => void
  setChannels: (channels: Channel[]) => void
  setActiveChannelId: (channelId?: string) => void
  setUnreadCounts: (unreadCounts: Record<string, number>) => void
  fetchChannels: (workspaceId: string) => Promise<void>
  replaceChannelState: (state: {
    activeChannelId?: string
    channelMemberIds: Record<string, string[]>
    channels: Channel[]
    openedUnreadCounts: Record<string, number>
    unreadCounts: Record<string, number>
  }) => void
}

export const useChannelStore = create<ChannelState>()((set) => ({
  channels: [],
  channelMemberIds: {},
  activeChannelId: undefined,
  openedUnreadCounts: {},
  unreadCounts: {},
  addChannel: async (name, memberIds, workspaceId) => {
    const createdChannel = await channelApi.createChannel(workspaceId, {
      description: '',
      name,
      type: 'public',
    })
    const channel: Channel = {
      ...createdChannel,
      workspaceId: createdChannel.workspaceId ?? workspaceId,
      type: createdChannel.type ?? 'public',
    }

    await Promise.all(
      memberIds.map((memberId) => channelApi.addChannelMember(channel.id, memberId).catch(() => undefined)),
    )

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
  fetchChannels: async (workspaceId) => {
    const channels = await channelApi.getChannels(workspaceId)
    set((state) => {
      const otherChannels = state.channels.filter((ch) => ch.workspaceId !== workspaceId)
      const nextChannels = [...otherChannels, ...channels]
      const hasActiveChannel = channels.some((ch) => ch.id === state.activeChannelId)
      return {
        channels: nextChannels,
        activeChannelId: hasActiveChannel ? state.activeChannelId : channels[0]?.id,
      }
    })
  },
  fetchChannelMembers: async (channelId) => {
    const members = await channelApi.getChannelMembers(channelId)
    set((state) => ({
      channelMemberIds: {
        ...state.channelMemberIds,
        [channelId]: members.map((m) => m.id),
      },
    }))
  },
  replaceChannelState: (nextState) => set(nextState),
}))
