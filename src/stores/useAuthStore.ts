import { create } from 'zustand'
import { isAxiosError } from 'axios'
import { authApi } from '../api/authApi'
import { userApi } from '../api/userApi'
import { clearTokens, getIdToken, setAccessToken, setIdToken, setRefreshToken, setUsername } from '../utils/token'
import { getDeviceName, getDevicePlatform, getOrCreateDeviceId } from '../utils/device'
import type { User } from '../types/user'
import { useChannelStore } from './useChannelStore'
import { useDmStore } from './useDmStore'
import { useMessageStore } from './useMessageStore'
import { useWorkspaceStore } from './useWorkspaceStore'

interface AuthState {
  user: User | null
  isAuthenticated: boolean
  isSessionReady: boolean
  setUser: (user: User | null) => void
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  restoreSession: () => Promise<void>
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  isAuthenticated: false,
  isSessionReady: false,
  setUser: (user) => set({ user, isAuthenticated: Boolean(user) }),
  login: async (email, password) => {
    const tokens = await authApi.login({ email, password })
    setIdToken(tokens.idToken)
    setAccessToken(tokens.accessToken)
    setRefreshToken(tokens.refreshToken)
    setUsername(tokens.username)
    const user = await userApi.getProfile()
    set({ user, isAuthenticated: true, isSessionReady: true })
    authApi.registerDevice({
      deviceId: getOrCreateDeviceId(),
      deviceName: getDeviceName(),
      platform: getDevicePlatform(),
    }).catch(() => {})
  },
  logout: async () => {
    try {
      await authApi.logout()
    } finally {
      clearTokens()
      set({ user: null, isAuthenticated: false })
      useWorkspaceStore.setState({ workspaces: [], workspaceMembers: [], workspaceMembersByWorkspaceId: {}, activeWorkspaceId: undefined })
      useChannelStore.setState({ channels: [], channelMemberIds: {}, activeChannelId: undefined, openedUnreadCounts: {}, unreadCounts: {} })
      useDmStore.setState({ rooms: [], activeRoomId: undefined, unreadCounts: {}, openedUnreadCounts: {} })
      useMessageStore.setState({ channelMessagesByRoomId: {}, dmMessagesByRoomId: {} })
    }
  },
  restoreSession: async () => {
    if (!getIdToken()) {
      set({ isSessionReady: true, isAuthenticated: false, user: null })
      return
    }
    try {
      const user = await userApi.getProfile()
      set({ user, isAuthenticated: true, isSessionReady: true })
    } catch (error) {
      const status = isAxiosError(error) ? error.response?.status : undefined
      if (status === 401 || status === 403) {
        clearTokens()
      }
      set({ user: null, isAuthenticated: false, isSessionReady: true })
    }
  },
}))
