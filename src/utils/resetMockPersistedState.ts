const MOCK_STORE_RESET_KEY = 'chattr-mock-store-reset-v1'

const MOCK_STORE_KEYS = [
  'chattr-workspace-store',
  'chattr-channel-store',
  'chattr-dm-store',
  'chattr-message-store',
]

if (typeof window !== 'undefined' && window.localStorage.getItem(MOCK_STORE_RESET_KEY) !== 'done') {
  MOCK_STORE_KEYS.forEach((key) => window.localStorage.removeItem(key))
  window.localStorage.setItem(MOCK_STORE_RESET_KEY, 'done')
}
