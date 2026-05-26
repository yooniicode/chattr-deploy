import { axiosInstance } from './axiosInstance'
import type { Device, User } from '../types/user'

export const userApi = {
  getProfile: async () => {
    const { data } = await axiosInstance.get<User>('/users/me')
    return data
  },
  updateProfile: async (payload: Partial<Pick<User, 'name' | 'avatarUrl'>>) => {
    const { data } = await axiosInstance.patch<User>('/users/me', payload)
    return data
  },
  getDevices: async () => {
    const { data } = await axiosInstance.get<Device[]>('/users/me/devices')
    return data
  },
}
