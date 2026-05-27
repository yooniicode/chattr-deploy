import { mockDmRooms } from '../../mocks/mockDmRooms'
import { Button } from '../common/Button'
import { DmRoomItem } from '../dm/DmRoomItem'

export function DmSidebar() {
  return (
    <aside className="flex min-w-60 flex-col border-r border-slate-300 bg-[#f1f3fb] px-3 py-5 max-md:hidden">
      <h2 className="mb-4 px-2 text-sm font-extrabold text-slate-950">Direct Messages</h2>
      <div className="flex flex-col gap-2">
        {mockDmRooms.map((room, index) => (
          <DmRoomItem
            active={index === 0}
            key={room.id}
            room={room}
            unreadCount={index === 1 ? 1 : index === 2 ? 3 : undefined}
          />
        ))}
      </div>
      <Button className="mt-auto min-h-11 w-full text-base" type="button">
        + New DM
      </Button>
    </aside>
  )
}
