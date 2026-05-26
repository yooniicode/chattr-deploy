import { useMutation, useQuery } from '@tanstack/react-query'
import { authApi } from '../api/authApi'
import { useAuthStore } from '../stores/useAuthStore'
import { clearTokens, setAccessToken, setRefreshToken } from '../utils/token'

export const useAuth = () => {
  const setUser = useAuthStore((state) => state.setUser)

  const meQuery = useQuery({
    queryKey: ['auth', 'me'],
    queryFn: authApi.me,
    retry: false,
  })

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ tokens, user }) => {
      setAccessToken(tokens.accessToken)
      setRefreshToken(tokens.refreshToken)
      setUser(user)
    },
  })

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      clearTokens()
      setUser(null)
    },
  })

  return { meQuery, loginMutation, logoutMutation }
}
