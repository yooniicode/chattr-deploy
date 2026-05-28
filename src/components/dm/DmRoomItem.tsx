import type { DmRoom } from '../../types/dm'
import { Avatar } from '../common/Avatar'

interface DmRoomItemProps {
  active?: boolean
  onClick?: () => void
  room: DmRoom
  unreadCount?: number
}

function DmAvatar({ name, online, src }: { name: string; online?: boolean; src?: string }) {
  return (
    <span className="relative inline-flex shrink-0">
      <Avatar name={name} size={36} src={src} />
      {online ? (
        <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-[#f1f3fb] bg-emerald-500" />
      ) : null}
    </span>
  )
}

export function DmRoomItem({ active = false, onClick, room, unreadCount }: DmRoomItemProps) {
  const participant = room.participants[0]
  const title = participant?.name ?? 'Direct message'
  const preview = room.lastMessage?.content ?? ''

  return (
    <button
      className={`relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
        active ? 'bg-[#dcd6f3] shadow-sm' : 'hover:bg-slate-100'
      }`}
      onClick={onClick}
      type="button"
    >
      {active ? <span className="absolute left-0 top-0 h-full w-1 rounded-l-lg bg-[#0058BE]" /> : null}
      <DmAvatar name={title} online={participant?.status === 'online'} src={participant?.avatarUrl} />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-bold leading-5 text-slate-950">{title}</span>
        <span className="block truncate text-xs font-medium text-slate-500">{preview}</span>
      </span>
      {unreadCount ? (
        <span className="grid size-4 place-items-center rounded-full bg-red-600 text-[10px] font-bold text-white">
          {unreadCount}
        </span>
      ) : null}
    </button>
  )
}
