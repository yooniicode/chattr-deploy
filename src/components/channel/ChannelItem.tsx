import type { Channel } from '../../types/channel'

interface ChannelItemProps {
  channel: Channel
  active?: boolean
  onClick?: () => void
  unreadCount?: number
}

export function ChannelItem({ active = false, channel, onClick, unreadCount }: ChannelItemProps) {
  return (
    <button
      className={`relative flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-medium transition-colors ${
        active ? 'bg-[#dcd6f3] text-slate-950' : 'text-slate-700 hover:bg-slate-100 hover:text-slate-950'
      }`}
      onClick={onClick}
      type="button"
    >
      {active ? <span className="absolute left-0 top-0 h-full w-1 rounded-l-md bg-[#0058BE]" /> : null}
      <span className={active ? 'text-[#0058BE]' : 'text-slate-700'}>#</span>
      <span className="min-w-0 flex-1 truncate">{channel.name}</span>
      {unreadCount ? (
        <span className="grid size-4 place-items-center rounded-full bg-red-600 text-[10px] font-bold text-white">
          {unreadCount}
        </span>
      ) : null}
    </button>
  )
}
