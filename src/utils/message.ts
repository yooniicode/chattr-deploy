import type { Message } from '../types/message'

export const sortMessagesByCreatedAt = (messages: Message[]) =>
  [...messages].sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
  )

export const isFileMessage = (message: Message) => message.type === 'file'
