import { axiosInstance } from './axiosInstance'
import type { LoginRequest, LoginResponse } from '../types/auth'
import type { Device } from '../types/user'

export interface SignupRequest {
  email: string
  password: string
  nickname: string
}

export interface RegisterDeviceRequest {
  deviceId: string
  deviceName: string
  platform: string
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
  registerDevice: async (payload: RegisterDeviceRequest) => {
    const { data } = await axiosInstance.post<Device>('/auth/device/register', payload)
    return data
  },
  deleteDevice: async (deviceId: string) => {
    await axiosInstance.delete(`/auth/devices/${deviceId}`)
  },
}
