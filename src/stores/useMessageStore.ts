import { create } from 'zustand'
import { mapMessage, messageApi } from '../api/messageApi'
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

const getResponseStatus = (error: unknown) => (error as { response?: { status?: number } })?.response?.status

const isServerError = (error: unknown) => {
  const status = getResponseStatus(error)
  return Boolean(status && status >= 500)
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
    try {
      const rawMessages = await messageApi.getMessages(channelId, 'CHANNEL', cursor)
      const messages = rawMessages.map((raw) => mapMessage(raw))
      set((state) => ({
        channelMessagesByRoomId: {
          ...state.channelMessagesByRoomId,
          [channelId]: messages,
        },
      }))
    } catch (error) {
      if (!isServerError(error)) throw error
      set((state) => ({
        channelMessagesByRoomId: {
          ...state.channelMessagesByRoomId,
          [channelId]: state.channelMessagesByRoomId[channelId] ?? [],
        },
      }))
    }
  },
  fetchDmMessages: async (roomId, cursor) => {
    try {
      const rawMessages = await messageApi.getMessages(roomId, 'DM', cursor)
      const messages = rawMessages.map((raw) => mapMessage(raw))
      set((state) => ({
        dmMessagesByRoomId: {
          ...state.dmMessagesByRoomId,
          [roomId]: messages,
        },
      }))
    } catch (error) {
      if (!isServerError(error)) throw error
      set((state) => ({
        dmMessagesByRoomId: {
          ...state.dmMessagesByRoomId,
          [roomId]: state.dmMessagesByRoomId[roomId] ?? [],
        },
      }))
    }
  },
  replaceMessageState: (nextState) => set(nextState),
}))
