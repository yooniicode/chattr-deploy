import { Client } from '@stomp/stompjs'
import SockJS from 'sockjs-client'
import { useSocketStore } from '../stores/useSocketStore'
import type { BackendMessage } from '../types/message'
import type { MessageSendRequest } from './socketTypes'

class StompSocketClient {
  private client?: Client
  private activeSubscriptions = new Map<string, { unsubscribe: () => void }>()
  private pendingRooms = new Map<string, (message: BackendMessage) => void>()

  connect(accessToken: string) {
    if (this.client?.active) return

    this.client = new Client({
      webSocketFactory: () => new SockJS(import.meta.env.VITE_WS_URL ?? 'http://localhost:8080/ws') as unknown as WebSocket,
      connectHeaders: {
        Authorization: `Bearer ${accessToken}`,
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
    if (!this.client?.connected) return

    this.client.publish({
      destination: '/app/messages',
      body: JSON.stringify(payload),
    })
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
