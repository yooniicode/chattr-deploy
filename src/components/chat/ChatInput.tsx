import { Bold, Code2, Italic, Link, Plus, X } from 'lucide-react'
import { useRef, useState } from 'react'
import type { Message } from '../../types/message'
import { getUserDisplayName } from '../../utils/userDisplay'

interface ChatInputProps {
  compact?: boolean
  helperText?: string
  onCancelReply?: () => void
  onSend?: (content: string, file?: File) => void
  replyTarget?: Message | null
}

export function ChatInput({ compact = false, helperText, onCancelReply, onSend, replyTarget }: ChatInputProps) {
  const [message, setMessage] = useState('')
  const [hasFile, setHasFile] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canSend = message.trim().length > 0 || hasFile

  const handleSubmit = () => {
    const content = message.trim()
    const file = fileInputRef.current?.files?.[0]
    if (!content && !file) return

    setMessage('')
    setHasFile(false)
    if (fileInputRef.current) fileInputRef.current.value = ''

    try {
      onSend?.(content, file)
    } catch (error) {
      console.error('Failed to send message', error)
    } finally {
      onCancelReply?.()
    }
  }

  return (
    <form
      className={`border-t border-slate-200 bg-[#fbfbff] px-6 ${compact ? 'py-2.5' : 'py-4'}`}
      onSubmit={(event) => {
        event.preventDefault()
        handleSubmit()
      }}
    >
      <div className="overflow-hidden rounded-xl border border-slate-300 bg-white shadow-lg shadow-slate-300/40">
        {replyTarget ? (
          <div className="flex items-center justify-between border-b border-slate-200 bg-white px-4 py-1.5">
            <p className="min-w-0 truncate text-xs font-medium text-slate-500">
              <span className="font-semibold">@{getUserDisplayName(replyTarget.author)}</span>{' '}
              <span>{replyTarget.content}</span>
            </p>
            <button
              aria-label="답글 취소"
              className="ml-3 grid size-5 shrink-0 place-items-center rounded-full bg-slate-200 text-slate-700 hover:bg-slate-300"
              onClick={onCancelReply}
              type="button"
            >
              <X size={13} />
            </button>
          </div>
        ) : null}

        <div className={`flex items-center gap-3 border-b border-slate-200 px-4 text-slate-700 ${compact ? 'h-8' : 'h-9'}`}>
          <Bold size={16} />
          <Italic size={16} />
          <Link size={16} />
          <span className="h-4 w-px bg-slate-300" />
          <Code2 size={17} />
        </div>

        <div className={`grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-4 px-4 ${compact ? 'py-2' : 'py-3'}`}>
          <label
            aria-label="Attach file"
            className={`${compact ? 'size-8' : 'size-9'} grid cursor-pointer place-items-center rounded-md bg-slate-200 text-slate-700 hover:bg-slate-300`}
          >
            <Plus size={22} />
            <input
              className="sr-only"
              ref={fileInputRef}
              type="file"
              onChange={(e) => setHasFile(Boolean(e.currentTarget.files?.[0]))}
            />
          </label>

          <textarea
            aria-label="Message"
            className={`${compact ? 'min-h-8' : 'min-h-10'} max-h-28 resize-none bg-transparent py-2 text-sm leading-5 outline-none placeholder:text-slate-400`}
            onChange={(event) => setMessage(event.currentTarget.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault()
                handleSubmit()
              }
            }}
            placeholder="메시지를 입력하세요"
            rows={1}
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
      {helperText ? <p className={`${compact ? 'mt-1' : 'mt-2'} text-center text-xs text-slate-500`}>{helperText}</p> : null}
    </form>
  )
}
