import { useEffect } from 'react'
import { useSocketStore } from '../stores/useSocketStore'
import { getAccessToken } from '../utils/token'
import { socketClient } from '../websocket/socketClient'

export const useSocket = () => {
  const setConnected = useSocketStore((state) => state.setConnected)

  useEffect(() => {
    socketClient.connect({
      url: import.meta.env.VITE_SOCKET_URL ?? 'ws://localhost:8080/ws',
      token: getAccessToken() ?? undefined,
    })
    setConnected(true)

    return () => {
      socketClient.disconnect()
      setConnected(false)
    }
  }, [setConnected])
}
