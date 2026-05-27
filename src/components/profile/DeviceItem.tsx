import type { Device } from '../../types/user'
import { formatDate } from '../../utils/formatDate'

interface DeviceItemProps {
  device: Device
}

export function DeviceItem({ device }: DeviceItemProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border border-slate-200 bg-white px-4 py-3">
      <span className="font-medium text-slate-800">{device.name}</span>
      <time className="text-sm text-slate-500" dateTime={device.lastActiveAt}>
        {formatDate(device.lastActiveAt)}
      </time>
    </div>
  )
}
