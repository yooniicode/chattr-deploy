import type { SocketEventMap, SocketEventName } from '../types/socket'
import type { SocketClientOptions, SocketListener } from './socketTypes'

export class SocketClient {
  private socket?: WebSocket
  private listeners = new Map<SocketEventName, Set<SocketListener<SocketEventName>>>()

  connect({ url, token }: SocketClientOptions) {
    const socketUrl = token ? `${url}?token=${encodeURIComponent(token)}` : url
    this.socket = new WebSocket(socketUrl)
    this.socket.addEventListener('message', this.handleMessage)
  }

  disconnect() {
    this.socket?.removeEventListener('message', this.handleMessage)
    this.socket?.close()
    this.socket = undefined
  }

  send<T extends SocketEventName>(event: T, payload: SocketEventMap[T]) {
    this.socket?.send(JSON.stringify({ event, payload }))
  }

  on<T extends SocketEventName>(event: T, listener: SocketListener<T>) {
    const listeners = this.listeners.get(event) ?? new Set()
    listeners.add(listener as SocketListener<SocketEventName>)
    this.listeners.set(event, listeners)

    return () => {
      listeners.delete(listener as SocketListener<SocketEventName>)
    }
  }

  private handleMessage = (message: MessageEvent<string>) => {
    const parsed = JSON.parse(message.data) as {
      event: SocketEventName
      payload: SocketEventMap[SocketEventName]
    }

    this.listeners.get(parsed.event)?.forEach((listener) => listener(parsed.payload))
  }
}

export const socketClient = new SocketClient()
