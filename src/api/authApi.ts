import { axiosInstance } from './axiosInstance'
import type { LoginRequest, LoginResponse } from '../types/auth'

export interface SignupRequest {
  email: string
  password: string
  nickname: string
}

export const authApi = {
  login: async (payload: LoginRequest) => {
    const { data } = await axiosInstance.post<LoginResponse>('/auth/login', payload)
    return data
  },
  signup: async (payload: SignupRequest) => {
    await axiosInstance.post('/auth/signup', payload)
  },
  logout: async () => {
    await axiosInstance.post('/auth/logout')
  },
  refresh: async (refreshToken: string, username: string) => {
    const { data } = await axiosInstance.post<LoginResponse>('/auth/refresh', { refreshToken, username })
    return data
  },
  registerDevice: async (deviceToken: string) => {
    await axiosInstance.post('/auth/device/register', { deviceToken })
  },
}
