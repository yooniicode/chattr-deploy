import { create } from 'zustand'
import { messageApi } from '../api/messageApi'
import type { RoomType } from '../api/messageApi'
import type { Message } from '../types/message'

interface MessageState {
  channelMessagesByRoomId: Record<string, Message[]>
  dmMessagesByRoomId: Record<string, Message[]>
  deleteChannelMessages: (roomId: string) => void
  deleteDmMessages: (roomId: string) => void
  updateChannelMessages: (roomId: string, updater: (messages: Message[]) => Message[]) => void
  updateDmMessages: (roomId: string, updater: (messages: Message[]) => Message[]) => void
  fetchChannelMessages: (channelId: string, cursor?: string) => Promise<void>
  fetchDmMessages: (roomId: string, cursor?: string) => Promise<void>
  replaceMessageState: (state: {
    channelMessagesByRoomId: Record<string, Message[]>
    dmMessagesByRoomId: Record<string, Message[]>
  }) => void
}

function ensureMessageArray(messages: unknown): Message[] {
  return Array.isArray(messages) ? messages : []
}

export const useMessageStore = create<MessageState>()((set) => ({
  channelMessagesByRoomId: {},
  dmMessagesByRoomId: {},
  deleteChannelMessages: (roomId) =>
    set((state) => {
      const nextMessages = { ...state.channelMessagesByRoomId }
      delete nextMessages[roomId]
      return { channelMessagesByRoomId: nextMessages }
    }),
  deleteDmMessages: (roomId) =>
    set((state) => {
      const nextMessages = { ...state.dmMessagesByRoomId }
      delete nextMessages[roomId]
      return { dmMessagesByRoomId: nextMessages }
    }),
  updateChannelMessages: (roomId, updater) =>
    set((state) => ({
      channelMessagesByRoomId: {
        ...state.channelMessagesByRoomId,
        [roomId]: updater(state.channelMessagesByRoomId[roomId] ?? []),
      },
    })),
  updateDmMessages: (roomId, updater) =>
    set((state) => ({
      dmMessagesByRoomId: {
        ...state.dmMessagesByRoomId,
        [roomId]: updater(state.dmMessagesByRoomId[roomId] ?? []),
      },
    })),
  fetchChannelMessages: async (channelId, cursor) => {
    const messages = await messageApi.getMessages(channelId, 'CHANNEL' as RoomType, cursor)
    set((state) => ({
      channelMessagesByRoomId: {
        ...state.channelMessagesByRoomId,
        [channelId]: ensureMessageArray(messages),
      },
    }))
  },
  fetchDmMessages: async (roomId, cursor) => {
    const messages = await messageApi.getMessages(roomId, 'DM' as RoomType, cursor)
    set((state) => ({
      dmMessagesByRoomId: {
        ...state.dmMessagesByRoomId,
        [roomId]: ensureMessageArray(messages),
      },
    }))
  },
  replaceMessageState: (nextState) => set(nextState),
}))
