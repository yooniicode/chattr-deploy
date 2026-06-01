const ACCESS_TOKEN_KEY = 'chattr.accessToken'
const REFRESH_TOKEN_KEY = 'chattr.refreshToken'
const ID_TOKEN_KEY = 'chattr.idToken'

export const getAccessToken = () => sessionStorage.getItem(ACCESS_TOKEN_KEY)

export const setAccessToken = (token: string) => {
  sessionStorage.setItem(ACCESS_TOKEN_KEY, token)
}

export const getRefreshToken = () => sessionStorage.getItem(REFRESH_TOKEN_KEY)

export const setRefreshToken = (token: string) => {
  sessionStorage.setItem(REFRESH_TOKEN_KEY, token)
}

export const getIdToken = () => sessionStorage.getItem(ID_TOKEN_KEY)

export const setIdToken = (token: string) => {
  sessionStorage.setItem(ID_TOKEN_KEY, token)
}

export const removeIdToken = () => {
  sessionStorage.removeItem(ID_TOKEN_KEY)
}

export const clearTokens = () => {
  sessionStorage.removeItem(ACCESS_TOKEN_KEY)
  sessionStorage.removeItem(REFRESH_TOKEN_KEY)
  removeIdToken()
}
