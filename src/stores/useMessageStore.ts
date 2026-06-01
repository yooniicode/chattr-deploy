import { create } from 'zustand'
import { mapMessage, messageApi } from '../api/messageApi'
import type { RoomType } from '../api/messageApi'
import type { Message } from '../types/message'
import { useWorkspaceStore } from './useWorkspaceStore'

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
    const rawMessages = await messageApi.getMessages(channelId, 'CHANNEL' as RoomType, cursor)
    const users = useWorkspaceStore.getState().workspaceMembers.map((m) => m.user)
    const messages = rawMessages.map((raw) => mapMessage(raw, users))
    set((state) => ({
      channelMessagesByRoomId: {
        ...state.channelMessagesByRoomId,
        [channelId]: messages,
      },
    }))
  },
  fetchDmMessages: async (roomId, cursor) => {
    const rawMessages = await messageApi.getMessages(roomId, 'DM' as RoomType, cursor)
    const users = useWorkspaceStore.getState().workspaceMembers.map((m) => m.user)
    const messages = rawMessages.map((raw) => mapMessage(raw, users))
    set((state) => ({
      dmMessagesByRoomId: {
        ...state.dmMessagesByRoomId,
        [roomId]: messages,
      },
    }))
  },
  replaceMessageState: (nextState) => set(nextState),
}))
