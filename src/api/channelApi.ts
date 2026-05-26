import { axiosInstance } from './axiosInstance'
import type { Channel } from '../types/channel'

export const channelApi = {
  getChannels: async (workspaceId: string) => {
    const { data } = await axiosInstance.get<Channel[]>(
      `/workspaces/${workspaceId}/channels`,
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
}
