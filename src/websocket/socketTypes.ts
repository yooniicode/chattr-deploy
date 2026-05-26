import type { SocketEventMap, SocketEventName } from '../types/socket'

export type SocketListener<T extends SocketEventName> = (payload: SocketEventMap[T]) => void

export interface SocketClientOptions {
  url: string
  token?: string
}
