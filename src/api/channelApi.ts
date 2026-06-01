import { axiosInstance } from './axiosInstance'
import type { Channel, ChannelType } from '../types/channel'
import type { User } from '../types/user'

interface BackendChannel {
  id: string
  workspaceId: string
  name: string
  description?: string
  topic?: string
  createdById?: string
  createdAt: string
}

interface PageResponse<T> {
  content?: T[]
}

function mapChannel(raw: BackendChannel): Channel {
  return {
    id: raw.id,
    workspaceId: raw.workspaceId,
    name: raw.name,
    type: 'public' as ChannelType,
    description: raw.description,
    topic: raw.topic,
    createdById: raw.createdById,
    createdAt: raw.createdAt,
  }
}

const extractChannels = (response: BackendChannel[] | PageResponse<BackendChannel>): BackendChannel[] => {
  if (Array.isArray(response)) return response
  return response.content ?? []
}

export const channelApi = {
  getChannels: async (workspaceId: string) => {
    const { data } = await axiosInstance.get<BackendChannel[] | PageResponse<BackendChannel>>('/channels', {
      params: { workspaceId },
    })
    return extractChannels(data).map(mapChannel)
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
    channelId: string,
    payload: { name?: string; description?: string; topic?: string },
  ) => {
    const { data } = await axiosInstance.patch<BackendChannel>(`/channels/${channelId}`, payload)
    return mapChannel(data)
  },
  deleteChannel: async (channelId: string) => {
    await axiosInstance.delete(`/channels/${channelId}`)
  },
  getChannelMembers: async (channelId: string) => {
    const { data } = await axiosInstance.get<User[]>(`/channels/${channelId}/members`)
    return data
  },
  addChannelMember: async (channelId: string, userId: string) => {
    await axiosInstance.post(`/channels/${channelId}/members`, { userId })
  },
}
