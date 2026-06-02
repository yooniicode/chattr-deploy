import { useState } from 'react'
import { X } from 'lucide-react'
import { dmApi } from '../../api/dmApi'
import { userApi } from '../../api/userApi'
import { useDmStore } from '../../stores/useDmStore'
import { Button } from '../common/Button'
import { DmRoomItem } from '../dm/DmRoomItem'

function CreateDmModal({
  error,
  loading,
  onClose,
  onCreate,
}: {
  error?: string
  loading?: boolean
  onClose: () => void
  onCreate: (query: string) => Promise<void> | void
}) {
  const [query, setQuery] = useState('')
  const canCreate = query.trim().length > 0 && !loading

  const handleCreate = () => {
    if (!canCreate) return
    void onCreate(query.trim())
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
          {loading ? '추가 중' : 'DM 추가'}
        </button>
      </div>
    </div>
  )
}

export function DmSidebar() {
  const [createModalOpen, setCreateModalOpen] = useState(false)
  const [createError, setCreateError] = useState<string | undefined>()
  const [creating, setCreating] = useState(false)
  const { activeRoomId, createRoom, deleteRoom, markRoomOpened, rooms, setActiveRoomId, unreadCounts } = useDmStore()

  const handleSelectRoom = (roomId: string) => {
    markRoomOpened(roomId)
  }

  const handleDeleteRoom = (roomId: string) => {
    void dmApi.deleteRoom(roomId).then(() => deleteRoom(roomId))
  }

  const handleCreateDm = async (query: string) => {
    const normalizedQuery = query.trim().toLowerCase()
    if (!normalizedQuery) return

    setCreating(true)
    setCreateError(undefined)

    try {
      const users = await userApi.searchUsers(query)
      const targetUser =
        users.find(
          (user) => user.name.toLowerCase() === normalizedQuery || user.email.toLowerCase() === normalizedQuery,
        ) ?? users[0]

      if (!targetUser) {
        setCreateError('일치하는 멤버를 찾을 수 없습니다.')
        return
      }

      const existingRoom = rooms.find(
        (room) =>
          room.otherUserId === targetUser.id || room.participants.some((participant) => participant.id === targetUser.id),
      )

      if (existingRoom) {
        setActiveRoomId(existingRoom.id)
      } else {
        await createRoom(targetUser)
      }

      setCreateModalOpen(false)
      setCreateError(undefined)
    } catch {
      setCreateError('DM 생성에 실패했습니다.')
    } finally {
      setCreating(false)
    }
  }

  return (
    <aside className="relative flex min-w-60 flex-col border-r border-slate-300 bg-[#f1f3fb] px-3 py-4 max-md:hidden">
      {createModalOpen ? (
        <CreateDmModal
          error={createError}
          loading={creating}
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
            onDelete={() => handleDeleteRoom(room.id)}
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
