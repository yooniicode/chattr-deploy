import { X } from 'lucide-react'
import type { DmRoom } from '../../types/dm'
import { Avatar } from '../common/Avatar'

interface DmRoomItemProps {
  active?: boolean
  onClick?: () => void
  onDelete?: () => void
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

export function DmRoomItem({ active = false, onClick, onDelete, room, unreadCount }: DmRoomItemProps) {
  const participant = room.participants[0]
  const title = participant?.name ?? 'Direct message'
  const preview = room.lastMessage?.content ?? ''

  return (
    <div
      className={`group relative flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
        active ? 'bg-[#dcd6f3] shadow-sm' : 'hover:bg-slate-100'
      }`}
    >
      {active ? <span className="absolute left-0 top-0 h-full w-1 rounded-l-lg bg-[#0058BE]" /> : null}
      <button className="flex min-w-0 flex-1 items-center gap-3 text-left" onClick={onClick} type="button">
        <DmAvatar name={title} online={participant?.status === 'online'} src={participant?.avatarUrl} />
        <span className="min-w-0 flex-1">
          <span className="block text-sm font-bold leading-5 text-slate-950">{title}</span>
          <span className="block truncate text-xs font-medium text-slate-500">{preview}</span>
        </span>
      </button>

      <div className="flex shrink-0 items-center gap-1">
        {unreadCount ? (
          <span className="grid size-4 place-items-center rounded-full bg-red-600 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        ) : null}
        {onDelete ? (
          <button
            aria-label="DM 방 삭제"
            className="grid size-5 place-items-center rounded text-slate-400 opacity-0 transition-opacity hover:bg-slate-200 hover:text-slate-700 group-hover:opacity-100"
            onClick={(e) => { e.stopPropagation(); onDelete() }}
            type="button"
          >
            <X size={13} />
          </button>
        ) : null}
      </div>
    </div>
  )
}
