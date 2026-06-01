import { useEffect } from 'react'
import { useSocketStore } from '../stores/useSocketStore'
import { getAccessToken } from '../utils/token'
import { socketClient } from '../websocket/socketClient'

export const useSocket = () => {
  const setConnected = useSocketStore((state) => state.setConnected)

  useEffect(() => {
    const token = getAccessToken()
    if (token) socketClient.connect(token)
    setConnected(true)

    return () => {
      socketClient.disconnect()
      setConnected(false)
    }
  }, [setConnected])
}
