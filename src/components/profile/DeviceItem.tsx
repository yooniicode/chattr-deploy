import type { Device } from '../../types/user'
import { formatDate } from '../../utils/formatDate'

interface DeviceItemProps {
  device: Device
}

export function DeviceItem({ device }: DeviceItemProps) {
  return (
    <div className="list-item">
      <span>{device.name}</span>
      <time dateTime={device.lastActiveAt}>{formatDate(device.lastActiveAt)}</time>
    </div>
  )
}
