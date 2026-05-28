import { useState } from 'react'
import { useDmStore } from '../../stores/useDmStore'
import { useWorkspaceStore } from '../../stores/useWorkspaceStore'
import type { DmRoom } from '../../types/dm'
import { Button } from '../common/Button'
import { DmRoomItem } from '../dm/DmRoomItem'
import { X } from 'lucide-react'

function CreateDmModal({
  error,
  onClose,
  onCreate,
}: {
  error?: string
  onClose: () => void
  onCreate: (query: string) => void
}) {
  const [query, setQuery] = useState('')
  const canCreate = query.trim().length > 0

  const handleCreate = () => {
    if (!canCreate) return

    onCreate(query.trim())
  }

  return (
    <div className="absolute bottom-24 left-1/2 z-20 w-[18rem] -translate-x-1/2 overflow-hidden rounded-xl border border-slate-300 bg-white shadow-2xl shadow-slate-400/30">
      <header className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
        <div>
          <h3 className="text-base font-extrabold text-slate-950">DM 추가</h3>
          <p className="mt-1 whitespace-nowrap text-[11px] font-medium text-slate-500">
            닉네임이나 이메일로 DM 상대를 설정하세요.
          </p>
        </div>
        <button
          aria-label="DM 추가 닫기"
          className="rounded-md p-1 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
          onClick={onClose}
          type="button"
        >
          <X size={18} />
        </button>
      </header>

      <div className="p-4">
        <label className="block text-sm font-bold text-slate-800" htmlFor="dm-target">
          DM 상대
        </label>
        <input
          className="mt-2 h-10 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium outline-none transition-colors placeholder:text-slate-400 focus:border-[#0058BE] focus:ring-2 focus:ring-[#0058BE]/20"
          id="dm-target"
          onChange={(event) => setQuery(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              handleCreate()
            }
          }}
          placeholder="닉네임 또는 이메일"
          value={query}
        />
        {error ? <p className="mt-2 text-xs font-bold text-[#BA1A1A]">{error}</p> : null}

        <button
          className="mx-auto mt-4 block h-9 w-36 rounded-lg bg-[#0058BE] text-sm font-bold text-white transition-colors hover:bg-[#004EA8] disabled:cursor-not-allowed disabled:opacity-45"
          disabled={!canCreate}
          onClick={handleCreate}
          type="button"
        >
          DM 추가
        </button>
      </div>
    </div>
  )
}

export function DmSidebar() {
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [createError, setCreateError] = useState<string | undefined>()
  const { activeRoomId, rooms, setActiveRoomId, setRooms, setUnreadCounts, unreadCounts } = useDmStore()
  const { workspaceMembers } = useWorkspaceStore()

  const handleSelectRoom = (roomId: string) => {
    setActiveRoomId(roomId)
    const nextCounts = { ...unreadCounts }
    delete nextCounts[roomId]
    setUnreadCounts(nextCounts)
  }

  const handleCreateDm = (query: string) => {
    const normalizedQuery = query.toLowerCase()
    const targetMember = workspaceMembers.find(
      (member) =>
        member.user.name.toLowerCase() === normalizedQuery || member.user.email.toLowerCase() === normalizedQuery,
    )

    if (!targetMember) {
      setCreateError('일치하는 멤버를 찾을 수 없습니다.')
      return
    }

    const existingRoom = rooms.find((room) => room.participants.some((user) => user.id === targetMember.user.id))

    if (existingRoom) {
      setActiveRoomId(existingRoom.id)
      setCreateModalOpen(false)
      setCreateError(undefined)
      return
    }

    const now = Date.now()
    const newRoomId = `dm-${now}`
    const newRoom: DmRoom = {
      id: newRoomId,
      participants: [targetMember.user],
      lastMessage: {
        id: `dm-preview-${now}`,
        roomId: newRoomId,
        type: 'text',
        content: '새 DM을 시작해보세요.',
        createdAt: new Date(now).toISOString(),
        author: targetMember.user,
      },
      updatedAt: new Date(now).toISOString(),
    }

    setRooms([newRoom, ...rooms])
    setActiveRoomId(newRoom.id)
    setCreateModalOpen(false)
    setCreateError(undefined)
  }

  return (
    <aside className="relative flex min-w-60 flex-col border-r border-slate-300 bg-[#f1f3fb] px-3 py-4 max-md:hidden">
      {createModalOpen ? (
        <CreateDmModal
          error={createError}
          onClose={() => {
            setCreateModalOpen(false)
            setCreateError(undefined)
          }}
          onCreate={handleCreateDm}
        />
      ) : null}
      <h2 className="mb-3 px-2 text-sm font-extrabold text-slate-950">Direct Messages</h2>
      <div className="flex flex-col gap-1.5">
        {rooms.map((room) => (
          <DmRoomItem
            active={room.id === activeRoomId}
            key={room.id}
            onClick={() => handleSelectRoom(room.id)}
            room={room}
            unreadCount={unreadCounts[room.id]}
          />
        ))}
      </div>
      <Button className="mt-auto min-h-10 w-full text-sm" onClick={() => setCreateModalOpen(true)} type="button">
        + New DM
      </Button>
    </aside>
  )
}
