import { axiosInstance } from './axiosInstance'
import type { AuthResponse, LoginRequest } from '../types/auth'

export const authApi = {
  login: async (payload: LoginRequest) => {
    const { data } = await axiosInstance.post<AuthResponse>('/auth/login', payload)
    return data
  },
  logout: async () => {
    await axiosInstance.post('/auth/logout')
  },
  me: async () => {
    const { data } = await axiosInstance.get<AuthResponse>('/auth/me')
    return data
  },
}
