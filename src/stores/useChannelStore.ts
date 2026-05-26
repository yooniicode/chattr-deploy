import { create } from 'zustand'
import type { Channel } from '../types/channel'

interface ChannelState {
  channels: Channel[]
  activeChannelId?: string
  setChannels: (channels: Channel[]) => void
  setActiveChannelId: (channelId: string) => void
}

export const useChannelStore = create<ChannelState>((set) => ({
  channels: [],
  setChannels: (channels) => set({ channels }),
  setActiveChannelId: (activeChannelId) => set({ activeChannelId }),
}))
