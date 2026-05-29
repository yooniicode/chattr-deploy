import { mockChannels } from '../mocks/mockChannels'
import { mockMessagesByRoomId } from '../mocks/mockMessages'

const RESTORE_FLAG_KEY = 'chattr-restore-dev-common-v1'
const CHANNEL_STORE_KEY = 'chattr-channel-store'
const MESSAGE_STORE_KEY = 'chattr-message-store'
const DEV_COMMON_CHANNEL_ID = 'channel-1'
const DEV_COMMON_MEMBER_IDS = ['current-user', 'u3', 'u4']

function readPersistedState<T>(key: string): { state?: T; version?: number } | null {
  const raw = window.localStorage.getItem(key)
  if (!raw) return null

  try {
    return JSON.parse(raw) as { state?: T; version?: number }
  } catch {
    return null
  }
}

function writePersistedState<T>(key: string, persisted: { state?: T; version?: number }) {
  window.localStorage.setItem(key, JSON.stringify(persisted))
}

interface ChannelPersistedState {
  activeChannelId?: string
  channelMemberIds?: Record<string, string[]>
  channels?: typeof mockChannels
  openedUnreadCounts?: Record<string, number>
  unreadCounts?: Record<string, number>
}

interface MessagePersistedState {
  channelMessagesByRoomId?: typeof mockMessagesByRoomId
}

if (typeof window !== 'undefined' && window.localStorage.getItem(RESTORE_FLAG_KEY) !== 'done') {
  const devCommonChannel = mockChannels.find((channel) => channel.id === DEV_COMMON_CHANNEL_ID)
  const devCommonMessages = mockMessagesByRoomId[DEV_COMMON_CHANNEL_ID]

  if (devCommonChannel) {
    const persistedChannelStore = readPersistedState<ChannelPersistedState>(CHANNEL_STORE_KEY)

    if (persistedChannelStore?.state) {
      const channels = persistedChannelStore.state.channels ?? []
      const channelExists = channels.some((channel) => channel.id === DEV_COMMON_CHANNEL_ID)

      persistedChannelStore.state = {
        ...persistedChannelStore.state,
        channelMemberIds: {
          ...(persistedChannelStore.state.channelMemberIds ?? {}),
          [DEV_COMMON_CHANNEL_ID]: persistedChannelStore.state.channelMemberIds?.[DEV_COMMON_CHANNEL_ID] ?? DEV_COMMON_MEMBER_IDS,
        },
        channels: channelExists ? channels : [devCommonChannel, ...channels],
      }

      writePersistedState(CHANNEL_STORE_KEY, persistedChannelStore)
    }
  }

  if (devCommonMessages) {
    const persistedMessageStore = readPersistedState<MessagePersistedState>(MESSAGE_STORE_KEY)

    if (persistedMessageStore?.state) {
      persistedMessageStore.state = {
        ...persistedMessageStore.state,
        channelMessagesByRoomId: {
          ...(persistedMessageStore.state.channelMessagesByRoomId ?? {}),
          [DEV_COMMON_CHANNEL_ID]:
            persistedMessageStore.state.channelMessagesByRoomId?.[DEV_COMMON_CHANNEL_ID] ?? devCommonMessages,
        },
      }

      writePersistedState(MESSAGE_STORE_KEY, persistedMessageStore)
    }
  }

  window.localStorage.setItem(RESTORE_FLAG_KEY, 'done')
}
