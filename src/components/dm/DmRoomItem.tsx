import type { DmRoom } from '../../types/dm'

interface DmRoomItemProps {
  active?: boolean
  room: DmRoom
  unreadCount?: number
}

function DmAvatar({ online }: { online?: boolean }) {
  return (
    <span className="relative grid size-9 shrink-0 place-items-center overflow-hidden rounded-xl bg-slate-950">
      <span className="size-7 rounded-full bg-[radial-gradient(circle_at_65%_45%,#23d3bf_0,#0e7282_32%,#061827_70%)]" />
      {online ? (
        <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-[#f1f3fb] bg-emerald-500" />
      ) : null}
    </span>
  )
}

export function DmRoomItem({ active = false, room, unreadCount }: DmRoomItemProps) {
  const participant = room.participants[0]
  const title = participant?.name ?? 'Direct message'
  const preview = room.lastMessage?.content ?? ''

  return (
    <button
      className={`relative flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left transition-colors ${
        active ? 'bg-[#dcd6f3] shadow-sm' : 'hover:bg-slate-100'
      }`}
      type="button"
    >
      {active ? <span className="absolute left-0 top-0 h-full w-1 rounded-l-lg bg-[#0058BE]" /> : null}
      <DmAvatar online={participant?.status === 'online'} />
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
