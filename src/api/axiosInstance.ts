import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios'
import {
  clearTokens,
  getIdToken,
  getRefreshToken,
  getUsername,
  setAccessToken,
  setIdToken,
  setRefreshToken,
  setUsername,
} from '../utils/token'

interface RetryConfig extends InternalAxiosRequestConfig {
  _retry?: boolean
}

interface RefreshTokenResponse {
  idToken: string
  accessToken: string
  refreshToken: string
  username: string
  expiresIn: number
}

type QueueItem = {
  resolve: (token: string) => void
  reject: (error: unknown) => void
}

let isRefreshing = false
let pendingQueue: QueueItem[] = []

const flushQueue = (error: unknown, token?: string) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error)
    else if (token) resolve(token)
  })
  pendingQueue = []
}

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? '/api'

export const axiosInstance = axios.create({
  baseURL: API_BASE,
})

axiosInstance.interceptors.request.use((config) => {
  const token = getIdToken()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

axiosInstance.interceptors.response.use(
  (response) => {
    if (response.data && typeof response.data === 'object' && 'data' in response.data) {
      response.data = response.data.data
    }
    return response
  },
  async (error: AxiosError) => {
    const config = error.config as RetryConfig | undefined

    if (error.response?.status !== 401 || !config || config._retry) {
      return Promise.reject(error)
    }

    const storedRefreshToken = getRefreshToken()
    const username = getUsername()

    if (!storedRefreshToken || !username) {
      clearTokens()
      window.location.href = '/login'
      return Promise.reject(error)
    }

    if (isRefreshing) {
      return new Promise<string>((resolve, reject) => {
        pendingQueue.push({ resolve, reject })
      }).then((token) => {
        config.headers.Authorization = `Bearer ${token}`
        config._retry = true
        return axiosInstance(config)
      })
    }

    config._retry = true
    isRefreshing = true

    try {
      // plain axios로 호출해 순환 참조 및 401 인터셉터 재진입 방지
      const { data: body } = await axios.post<{ data: RefreshTokenResponse }>(
        `${API_BASE}/auth/refresh`,
        { refreshToken: storedRefreshToken, username },
        { withCredentials: true },
      )
      const tokens = body.data

      setIdToken(tokens.idToken)
      setAccessToken(tokens.accessToken)
      setRefreshToken(tokens.refreshToken)
      setUsername(tokens.username)

      flushQueue(null, tokens.idToken)
      config.headers.Authorization = `Bearer ${tokens.idToken}`
      return axiosInstance(config)
    } catch (refreshError) {
      flushQueue(refreshError)
      clearTokens()
      window.location.href = '/login'
      return Promise.reject(refreshError)
    } finally {
      isRefreshing = false
    }
  },
)
