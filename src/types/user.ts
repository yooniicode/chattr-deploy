export type UserStatus = 'online' | 'offline' | 'away'

export interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string
  status: UserStatus
}

export interface Device {
  id: string
  name: string
  lastActiveAt: string
}
