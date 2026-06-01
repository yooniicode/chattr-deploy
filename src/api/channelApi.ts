import { axiosInstance } from './axiosInstance'
import type { Channel } from '../types/channel'
import type { User } from '../types/user'

interface PageResponse<T> {
  content?: T[]
}

const extractChannels = (response: Channel[] | PageResponse<Channel>) => {
  if (Array.isArray(response)) return response
  return response.content ?? []
}

export const channelApi = {
  getChannels: async (workspaceId: string) => {
    const { data } = await axiosInstance.get<Channel[] | PageResponse<Channel>>('/channels', {
      params: { workspaceId },
    })
    return extractChannels(data)
  },
  getChannel: async (workspaceId: string, channelId: string) => {
    const { data } = await axiosInstance.get<Channel>(
      `/workspaces/${workspaceId}/channels/${channelId}`,
    )
    return data
  },
  createChannel: async (
    workspaceId: string,
    payload: Pick<Channel, 'name' | 'type' | 'description'>,
  ) => {
    const { data } = await axiosInstance.post<Channel>(
      `/workspaces/${workspaceId}/channels`,
      payload,
    )
    return data
  },
  updateChannel: async (
    workspaceId: string,
    channelId: string,
    payload: Partial<Pick<Channel, 'name' | 'description'>>,
  ) => {
    const { data } = await axiosInstance.patch<Channel>(
      `/workspaces/${workspaceId}/channels/${channelId}`,
      payload,
    )
    return data
  },
  deleteChannel: async (workspaceId: string, channelId: string) => {
    await axiosInstance.delete(`/workspaces/${workspaceId}/channels/${channelId}`)
  },
  getChannelMembers: async (workspaceId: string, channelId: string) => {
    const { data } = await axiosInstance.get<User[]>(
      `/workspaces/${workspaceId}/channels/${channelId}/members`,
    )
    return data
  },
  addChannelMember: async (workspaceId: string, channelId: string, userId: string) => {
    await axiosInstance.post(`/workspaces/${workspaceId}/channels/${channelId}/members`, { userId })
  },
}
