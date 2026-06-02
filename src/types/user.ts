export type UserStatus = 'online' | 'offline' | 'away'

export interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string
  status: UserStatus
}

export interface BackendUser {
  id: string
  email: string
  nickname: string
  online: boolean
  createdAt?: string
}

export interface Device {
  deviceId: string
  deviceName: string
  platform: string
  lastActiveAt: string
  registeredAt: string
}
