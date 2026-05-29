import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import { mockDmMessagesByRoomId } from '../mocks/mockDmMessages'
import { mockMessagesByRoomId } from '../mocks/mockMessages'
import type { Message } from '../types/message'

interface MessageState {
  channelMessagesByRoomId: Record<string, Message[]>
  dmMessagesByRoomId: Record<string, Message[]>
  deleteChannelMessages: (roomId: string) => void
  deleteDmMessages: (roomId: string) => void
  updateChannelMessages: (roomId: string, updater: (messages: Message[]) => Message[]) => void
  updateDmMessages: (roomId: string, updater: (messages: Message[]) => Message[]) => void
}

export const useMessageStore = create<MessageState>()(
  persist(
    (set) => ({
      channelMessagesByRoomId: mockMessagesByRoomId,
      dmMessagesByRoomId: mockDmMessagesByRoomId,
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
    }),
    {
      name: 'chattr-message-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        channelMessagesByRoomId: state.channelMessagesByRoomId,
        dmMessagesByRoomId: state.dmMessagesByRoomId,
      }),
    },
  ),
)
