import { axiosInstance } from './axiosInstance'
import type { BackendUser, Device, User } from '../types/user'

interface PageResponse<T> {
  content?: T[]
}

const mapBackendUser = (user: BackendUser): User => ({
  id: user.id,
  email: user.email,
  name: user.nickname,
  status: user.online ? 'online' : 'offline',
})

const extractUsers = (response: BackendUser[] | PageResponse<BackendUser>) => {
  if (Array.isArray(response)) return response
  return response.content ?? []
}

export const userApi = {
  getProfile: async () => {
    const { data } = await axiosInstance.get<BackendUser>('/users/me')
    return mapBackendUser(data)
  },
  getUsers: async () => {
    const { data } = await axiosInstance.get<BackendUser[] | PageResponse<BackendUser>>('/users')
    return extractUsers(data).map(mapBackendUser)
  },
  searchUsers: async (query: string) => {
    const { data } = await axiosInstance.get<BackendUser[] | PageResponse<BackendUser>>('/users', {
      params: { query },
    })
    return extractUsers(data).map(mapBackendUser)
  },
  updateProfile: async (payload: Partial<Pick<User, 'name' | 'avatarUrl'>>) => {
    const requestPayload: { avatarUrl?: string; nickname?: string } = {}
    if (payload.name !== undefined) requestPayload.nickname = payload.name
    if (payload.avatarUrl !== undefined) requestPayload.avatarUrl = payload.avatarUrl

    const { data } = await axiosInstance.patch<BackendUser>('/users/me', requestPayload)
    return mapBackendUser(data)
  },
  getDevices: async () => {
    const { data } = await axiosInstance.get<Device[]>('/auth/devices')
    return data
  },
}
