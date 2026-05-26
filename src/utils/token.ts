const ACCESS_TOKEN_KEY = 'chattr.accessToken'
const REFRESH_TOKEN_KEY = 'chattr.refreshToken'

export const getAccessToken = () => localStorage.getItem(ACCESS_TOKEN_KEY)

export const setAccessToken = (token: string) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export const getRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY)

export const setRefreshToken = (token: string) => {
  localStorage.setItem(REFRESH_TOKEN_KEY, token)
}

export const clearTokens = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY)
  localStorage.removeItem(REFRESH_TOKEN_KEY)
}
