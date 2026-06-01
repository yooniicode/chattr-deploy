export type ChannelType = 'public' | 'private'

export interface Channel {
  id: string
  workspaceId: string
  name: string
  type: ChannelType
  description?: string
  topic?: string
  createdById?: string
  createdAt: string
}
