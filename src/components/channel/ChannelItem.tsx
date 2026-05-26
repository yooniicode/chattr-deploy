import type { Channel } from '../../types/channel'

interface ChannelItemProps {
  channel: Channel
}

export function ChannelItem({ channel }: ChannelItemProps) {
  return <button className="nav-item" type="button"># {channel.name}</button>
}
