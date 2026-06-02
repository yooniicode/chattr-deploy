import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { useSocketStore } from '../stores/useSocketStore'
import type { BackendMessage } from '../types/message'
import type { MessageSendRequest } from './socketTypes'

const WS_URL = import.meta.env.VITE_WS_URL ?? 'https://api.acc-chattr.cloud/ws'

class StompSocketClient {
  private client?: Client
  private activeSubscriptions = new Map<string, { unsubscribe: () => void }>()
  private pendingRooms = new Map<string, (message: BackendMessage) => void>()

  connect(idToken: string) {
    if (this.client?.active) return

    this.client = new Client({
      webSocketFactory: () => new SockJS(WS_URL) as unknown as WebSocket,
      connectHeaders: {
        Authorization: `Bearer ${idToken}`,
      },
      reconnectDelay: 5000,
      onConnect: () => {
        useSocketStore.getState().setConnected(true)
        this.pendingRooms.forEach((callback, roomId) => {
          this.doSubscribe(roomId, callback)
        })
      },
      onDisconnect: () => {
        useSocketStore.getState().setConnected(false)
        this.activeSubscriptions.clear()
      },
    })

    this.client.activate()
  }

  private doSubscribe(roomId: string, callback: (message: BackendMessage) => void) {
    if (!this.client?.connected) return

    const sub = this.client.subscribe(`/topic/rooms/${roomId}`, (frame) => {
      try {
        const message = JSON.parse(frame.body) as BackendMessage
        callback(message)
      } catch {
        // ignore malformed frames
      }
    })

    this.activeSubscriptions.set(roomId, sub)
  }

  subscribe(roomId: string, callback: (message: BackendMessage) => void) {
    this.pendingRooms.set(roomId, callback)
    if (this.client?.connected) {
      this.doSubscribe(roomId, callback)
    }

    return () => {
      this.pendingRooms.delete(roomId)
      this.activeSubscriptions.get(roomId)?.unsubscribe()
      this.activeSubscriptions.delete(roomId)
    }
  }

  send(payload: MessageSendRequest) {
    if (!this.client?.connected) return false

    this.client.publish({
      destination: '/app/messages',
      body: JSON.stringify(payload),
    })
    return true
  }

  disconnect() {
    this.client?.deactivate()
    this.client = undefined
    this.activeSubscriptions.clear()
    this.pendingRooms.clear()
    useSocketStore.getState().setConnected(false)
  }

  get isConnected() {
    return this.client?.connected ?? false
  }
}

export const socketClient = new StompSocketClient()
