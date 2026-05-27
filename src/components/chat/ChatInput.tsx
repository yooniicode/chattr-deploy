import { useState } from 'react'
import { Bold, Code2, Italic, Link, Plus } from 'lucide-react'

interface ChatInputProps {
  helperText?: string
}

export function ChatInput({ helperText }: ChatInputProps) {
  const [message, setMessage] = useState('')
  const [hasAttachment, setHasAttachment] = useState(false)
  const canSend = message.trim().length > 0 || hasAttachment

  return (
    <form
      className="border-t border-slate-200 bg-[#fbfbff] px-6 py-4"
      onSubmit={(event) => {
        event.preventDefault()

        if (!canSend) return

        setMessage('')
        setHasAttachment(false)
      }}
    >
      <div className="overflow-hidden rounded-xl border border-slate-300 bg-white shadow-lg shadow-slate-300/40">
        <div className="flex h-9 items-center gap-3 border-b border-slate-200 px-4 text-slate-700">
          <Bold size={16} />
          <Italic size={16} />
          <Link size={16} />
          <span className="h-4 w-px bg-slate-300" />
          <Code2 size={17} />
        </div>
        <div className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 px-4 py-3">
          <label
            aria-label="Attach file"
            className="grid size-9 cursor-pointer place-items-center rounded-md bg-slate-200 text-slate-700 hover:bg-slate-300"
          >
            <Plus size={22} />
            <input
              className="sr-only"
              type="file"
              onChange={(event) => setHasAttachment((event.currentTarget.files?.length ?? 0) > 0)}
            />
          </label>
          <input
            aria-label="Message"
            className="min-h-10 bg-transparent text-sm outline-none placeholder:text-slate-400"
            onChange={(event) => setMessage(event.currentTarget.value)}
            placeholder="메시지를 입력하세요"
            value={message}
          />
          <button
            aria-label="Send message"
            className={`grid size-8 place-items-center rounded-md bg-[#0058BE] transition-opacity focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0058BE] focus-visible:ring-offset-2 ${
              canSend ? 'opacity-100' : 'opacity-45'
            }`}
            type="submit"
          >
            <svg aria-hidden className="size-5" viewBox="0 0 24 24">
              <path fill="white" d="M5 5.5 19.5 12 5 18.5v-5l7-1.5-7-1.5v-5Z" />
            </svg>
          </button>
        </div>
      </div>
      {helperText ? <p className="mt-2 text-center text-xs text-slate-500">{helperText}</p> : null}
    </form>
  )
}
