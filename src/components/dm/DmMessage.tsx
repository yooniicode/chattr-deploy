import { Download, FileText } from 'lucide-react'
import { useState } from 'react'
import type { Message } from '../../types/message'
import { formatFileSize } from '../../utils/upload'
import { getUserAvatarName, getUserDisplayName, isCurrentUser } from '../../utils/userDisplay'
import { Avatar } from '../common/Avatar'
import { MessageActionToolbar } from '../chat/MessageActionToolbar'

interface DmMessageProps {
  message: Message
  onDelete?: (messageId: string) => void
  onEdit?: (messageId: string, content: string) => void
  onReply?: (message: Message) => void
}

export function DmMessage({ message, onDelete, onEdit, onReply }: DmMessageProps) {
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(message.content)

  const isMine = isCurrentUser(message.author)
  const authorName = getUserDisplayName(message.author)
  const avatarName = getUserAvatarName(message.author)

  const handleEditSave = () => {
    const nextContent = draft.trim()
    if (!nextContent) return

    onEdit?.(message.id, nextContent)
    setEditing(false)
  }

  const contentNode = editing ? (
    <div className={`mt-1 rounded-lg border border-slate-300 bg-white p-2 shadow-sm ${isMine ? 'ml-auto' : ''}`}>
      <textarea
        className="min-h-20 w-72 resize-none rounded-md bg-slate-50 p-2 text-xs leading-5 text-slate-800 outline-none focus:ring-2 focus:ring-[#0058BE]/20"
        onChange={(event) => setDraft(event.currentTarget.value)}
        value={draft}
      />
      <div className="mt-2 flex justify-end gap-2">
        <button
          className="rounded-md px-3 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-100"
          onClick={() => setEditing(false)}
          type="button"
        >
          취소
        </button>
        <button
          className="rounded-md bg-[#0058BE] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#004EA8]"
          onClick={handleEditSave}
          type="button"
        >
          저장
        </button>
      </div>
    </div>
  ) : message.content ? (
    <p
      className={
        isMine
          ? 'ml-auto w-fit max-w-[min(32rem,70vw)] whitespace-pre-wrap break-words rounded-lg bg-[#0058BE] px-3.5 py-2 text-left text-xs font-medium leading-5 text-white shadow-md'
          : 'w-fit max-w-[min(32rem,70vw)] whitespace-pre-wrap break-words rounded-lg border border-slate-300 bg-[#ebeef7] px-3.5 py-2 text-xs font-medium leading-5 text-slate-950 shadow-sm'
      }
    >
      {message.content}
    </p>
  ) : null

  if (isMine) {
    return (
      <article className="group relative ml-auto flex max-w-md scroll-mt-6 items-start gap-2.5" id={message.id}>
        <MessageActionToolbar
          canMutate
          onDelete={() => onDelete?.(message.id)}
          onEdit={() => {
            setDraft(message.content)
            setEditing(true)
          }}
          onReply={() => onReply?.(message)}
        />
        <div className="text-right">
          {message.replyPreview ? (
            <button
              className="mb-1 ml-auto flex max-w-xs items-center gap-2 truncate text-right text-[11px] font-medium text-slate-500/80 hover:text-[#0058BE]"
              onClick={() => {
                if (message.parentMessageId) {
                  document.getElementById(message.parentMessageId)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                }
              }}
              type="button"
            >
              @{message.replyPreview.authorName} {message.replyPreview.content}
            </button>
          ) : null}
          <div className="mb-1 flex justify-end gap-2 text-[11px] font-medium text-slate-500">
            <time dateTime={message.createdAt}>{message.displayTime}</time>
            <strong className="text-sm font-bold text-slate-950">{authorName}</strong>
          </div>
          {contentNode}
        </div>
        <Avatar name={avatarName} size={32} src={message.author.avatarUrl} />
      </article>
    )
  }

  return (
    <article className="group relative flex max-w-md scroll-mt-6 items-start gap-2.5" id={message.id}>
      <MessageActionToolbar
        canMutate={false}
        onDelete={() => onDelete?.(message.id)}
        onEdit={() => {
          setDraft(message.content)
          setEditing(true)
        }}
        onReply={() => onReply?.(message)}
      />
      <span className="relative inline-flex">
        <Avatar name={avatarName} size={36} src={message.author.avatarUrl} />
        {message.author.status === 'online' ? (
          <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-[#fbfbff] bg-emerald-500" />
        ) : null}
      </span>
      <div>
        {message.replyPreview ? (
          <button
            className="mb-1 flex max-w-xs items-center gap-2 truncate text-left text-[11px] font-medium text-slate-500/80 hover:text-[#0058BE]"
            onClick={() => {
              if (message.parentMessageId) {
                document.getElementById(message.parentMessageId)?.scrollIntoView({ behavior: 'smooth', block: 'center' })
              }
            }}
            type="button"
          >
            @{message.replyPreview.authorName} {message.replyPreview.content}
          </button>
        ) : null}
        <div className="mb-1 flex items-baseline gap-2">
          <strong className="text-sm font-bold text-slate-950">{authorName}</strong>
          <time className="text-[11px] font-medium text-slate-500" dateTime={message.createdAt}>
            {message.displayTime}
          </time>
        </div>
        {contentNode}
        {message.attachments?.map((file) => (
          <a
            className="mt-2 flex w-fit min-w-60 items-center gap-2.5 rounded-lg border border-slate-300 bg-[#e0e3ee] px-3 py-2 text-slate-950 shadow-sm"
            href={file.url}
            key={file.id}
          >
            <span className="grid size-9 place-items-center rounded-md border border-slate-300 bg-white text-[#0058BE]">
              <FileText size={19} />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-xs font-extrabold">{file.name}</span>
              <span className="block text-[11px] font-medium text-slate-600">{formatFileSize(file.size)} · PDF</span>
            </span>
            <Download className="text-slate-600" size={16} />
          </a>
        ))}
      </div>
    </article>
  )
}
