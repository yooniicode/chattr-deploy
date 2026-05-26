import type { DmRoom } from '../../types/dm'

interface DmRoomItemProps {
  room: DmRoom
}

export function DmRoomItem({ room }: DmRoomItemProps) {
  const title = room.participants.map((user) => user.name).join(', ')
  return <button className="nav-item" type="button">{title}</button>
}
