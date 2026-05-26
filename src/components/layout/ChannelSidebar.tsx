import { mockChannels } from '../../mocks/mockChannels'
import { ChannelItem } from '../channel/ChannelItem'
import { Sidebar } from './Sidebar'

export function ChannelSidebar() {
  return (
    <Sidebar title="Channels">
      {mockChannels.map((channel) => (
        <ChannelItem channel={channel} key={channel.id} />
      ))}
    </Sidebar>
  )
}
