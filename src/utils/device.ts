const DEVICE_ID_KEY = 'chattr.deviceId'

export const getOrCreateDeviceId = (): string => {
  const stored = localStorage.getItem(DEVICE_ID_KEY)
  if (stored) return stored
  const id = crypto.randomUUID()
  localStorage.setItem(DEVICE_ID_KEY, id)
  return id
}

export const getDeviceName = (): string => {
  const ua = navigator.userAgent
  const platform = navigator.platform ?? ''

  if (/iPhone/.test(ua)) return 'iPhone'
  if (/iPad/.test(ua)) return 'iPad'
  if (/Android/.test(ua)) return 'Android'
  if (/Mac/.test(platform)) return 'Mac'
  if (/Win/.test(platform)) return 'Windows'
  if (/Linux/.test(platform)) return 'Linux'
  return 'Web Browser'
}

export const getDevicePlatform = (): string => 'WEB'
