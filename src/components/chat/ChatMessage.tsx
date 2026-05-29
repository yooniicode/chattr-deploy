import { Download, FileText, Image as ImageIcon } from 'lucide-react'
import { useState } from 'react'
import type { Message } from '../../types/message'
import { formatDate } from '../../utils/formatDate'
import { formatFileSize } from '../../utils/upload'
import { getUserAvatarName, getUserDisplayName, isCurrentUser } from '../../utils/userDisplay'
import { Avatar } from '../common/Avatar'
import { MessageActionToolbar } from './MessageActionToolbar'

interface ChatMessageProps {
  message: Message
  onDelete?: (messageId: string) => void
  onEdit?: (messageId: string, content: string) => void
  onReply?: (message: Message) => void
}

function MessageAvatar({ message }: ChatMessageProps) {
  return (
    <span className="relative inline-flex">
      <Avatar name={getUserAvatarName(message.author)} size={36} src={message.author.avatarUrl} />
      {message.author.status === 'online' ? (
        <span className="absolute -bottom-0.5 -right-0.5 size-3 rounded-full border-2 border-[#fbfbff] bg-emerald-500" />
      ) : null}
    </span>
  )
}

export function ChatMessage({ message, onDelete, onEdit, onReply }: ChatMessageProps) {
  const authorName = getUserDisplayName(message.author)
  const canMutate = isCurrentUser(message.author)
  const [editing, setEditing] = useState(false)
  const [draft, setDraft] = useState(message.content)

  const handleReplyPreviewClick = () => {
    if (!message.parentMessageId) return

    document.getElementById(message.parentMessageId)?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
    })
  }

  const handleEditSave = () => {
    const nextContent = draft.trim()
    if (!nextContent) return

    onEdit?.(message.id, nextContent)
    setEditing(false)
  }

  return (
    <article className="group relative grid scroll-mt-6 grid-cols-[2.5rem_minmax(0,1fr)] gap-3" id={message.id}>
      <MessageActionToolbar
        canMutate={canMutate}
        onDelete={() => onDelete?.(message.id)}
        onEdit={() => {
          setDraft(message.content)
          setEditing(true)
        }}
        onReply={() => onReply?.(message)}
      />
      {message.replyPreview ? (
        <span className="absolute left-[18px] top-[6px] h-[18px] w-[18px] rounded-tl-md border-l-2 border-t-2 border-slate-300" />
      ) : null}
      <div className={message.replyPreview ? 'pt-6' : undefined}>
        <MessageAvatar message={message} />
      </div>
      <div>
        {message.replyPreview ? (
          <button
            className="-ml-[34px] mb-0.5 flex h-5 -translate-y-1 items-center gap-2 text-left text-xs font-medium text-slate-500/75 transition-colors hover:text-[#0058BE]"
            onClick={handleReplyPreviewClick}
            type="button"
          >
            <span className="relative h-[18px] w-[38px] shrink-0">
              <span className="absolute right-0 top-0">
              <span className="opacity-75">
              <Avatar name={message.replyPreview.authorName} size={18} />
              </span>
              </span>
            </span>
            <span className="shrink-0 whitespace-nowrap">@{message.replyPreview.authorName}</span>
            <span className="max-w-md truncate whitespace-nowrap">{message.replyPreview.content}</span>
          </button>
        ) : null}

        <div className="flex items-baseline gap-2">
          <strong className="shrink-0 whitespace-nowrap text-sm font-bold text-slate-950">{authorName}</strong>
          <time className="text-xs font-medium text-slate-500" dateTime={message.createdAt}>
            {message.displayTime ?? formatDate(message.createdAt)}
          </time>
        </div>
        {editing ? (
          <div className="mt-2 max-w-xl rounded-lg border border-slate-300 bg-white p-2 shadow-sm">
            <textarea
              className="min-h-20 w-full resize-none rounded-md bg-slate-50 p-2 text-sm leading-6 text-slate-800 outline-none focus:ring-2 focus:ring-[#0058BE]/20"
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
        ) : (
          <p className="mt-1 whitespace-pre-wrap text-sm leading-6 text-slate-800">{message.content}</p>
        )}

        {message.attachments?.map((file) => (
          <a
            className="mt-3 flex w-fit min-w-60 items-center gap-3 rounded-lg border border-slate-300 bg-white px-3 py-3 text-slate-950 shadow-sm"
            href={file.url}
            key={file.id}
          >
            <span className="grid size-10 place-items-center rounded-md bg-red-100 text-red-600">
              {file.contentType.startsWith('image/') ? <ImageIcon size={20} /> : <FileText size={20} />}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-base font-extrabold">{file.name}</span>
              <span className="block text-xs font-semibold text-slate-500">{formatFileSize(file.size)}</span>
            </span>
            <Download className="text-slate-600" size={18} />
          </a>
        ))}

        {message.codeBlock ? (
          <div className="mt-3 max-w-xl rounded-lg bg-[#1f1e2e] p-4 text-sm text-slate-200 shadow-lg">
            <div className="mb-2 flex justify-end gap-2">
              <span className="size-3 rounded-full bg-red-500" />
              <span className="size-3 rounded-full bg-yellow-400" />
              <span className="size-3 rounded-full bg-green-500" />
            </div>
            <pre className="overflow-x-auto whitespace-pre-wrap font-mono leading-6">{message.codeBlock}</pre>
          </div>
        ) : null}

        {message.imagePreviewUrl ? (
          <div className="mt-3 w-fit overflow-hidden rounded-lg border border-slate-300 bg-white">
            <div className="grid w-[26rem] grid-cols-2 gap-2 bg-slate-100 p-3">
              <img
                alt="dashboard reference preview"
                className="h-36 w-full rounded object-cover"
                src={message.imagePreviewUrl}
              />
              <img
                alt="dashboard reference preview"
                className="h-36 w-full rounded object-cover"
                src={message.imagePreviewUrl}
              />
            </div>
            <div className="flex items-center gap-2 px-3 py-2 text-sm">
              <ImageIcon className="text-[#0058BE]" size={18} />
              <span className="font-medium text-slate-800">dashboard_reference.png (1.2MB)</span>
              <Download className="ml-auto text-slate-600" size={18} />
            </div>
          </div>
        ) : null}
      </div>
    </article>
  )
}
