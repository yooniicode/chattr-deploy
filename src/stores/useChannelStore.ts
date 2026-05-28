import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { mockChannels } from '../mocks/mockChannels'
import { currentUserId } from '../mocks/mockWorkspaceMembers'
import type { Channel } from '../types/channel'

interface ChannelState {
  channels: Channel[]
  channelMemberIds: Record<string, string[]>
  activeChannelId?: string
  addChannel: (name: string, memberIds: string[], workspaceId?: string) => Channel
  addChannelMembers: (channelId: string, memberIds: string[]) => void
  setChannels: (channels: Channel[]) => void
  setActiveChannelId: (channelId?: string) => void
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
      setChannels: (channels) => set({ channels }),
      setActiveChannelId: (activeChannelId) => set({ activeChannelId }),
    }),
    {
      name: 'chattr-channel-store',
      partialize: (state) => ({
        activeChannelId: state.activeChannelId,
        channelMemberIds: state.channelMemberIds,
        channels: state.channels,
      }),
    },
  ),
)
