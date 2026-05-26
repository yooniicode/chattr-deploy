import { axiosInstance } from './axiosInstance'
import type { Message } from '../types/message'

export const messageApi = {
  getChannelMessages: async (channelId: string) => {
    const { data } = await axiosInstance.get<Message[]>(`/channels/${channelId}/messages`)
    return data
  },
  sendChannelMessage: async (channelId: string, content: string) => {
    const { data } = await axiosInstance.post<Message>(`/channels/${channelId}/messages`, {
      content,
    })
    return data
  },
}
