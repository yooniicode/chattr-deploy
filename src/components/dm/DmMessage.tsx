import { Download, FileText } from 'lucide-react'
import type { Message } from '../../types/message'
import { formatFileSize } from '../../utils/upload'
import { getUserAvatarName, getUserDisplayName, isCurrentUser } from '../../utils/userDisplay'
import { Avatar } from '../common/Avatar'

interface DmMessageProps {
  message: Message
}

export function DmMessage({ message }: DmMessageProps) {
  if (message.content === '여기까지 읽으셨습니다') {
    return (
      <div className="flex justify-center py-2">
        <span className="rounded-full bg-red-50 px-4 py-1.5 text-xs font-bold text-red-500">
          여기까지 읽으셨습니다
        </span>
      </div>
    )
  }

  const isMine = isCurrentUser(message.author)
  const authorName = getUserDisplayName(message.author)
  const avatarName = getUserAvatarName(message.author)

  if (isMine) {
    return (
      <article className="ml-auto flex max-w-md items-start gap-2.5">
        <div className="text-right">
          <div className="mb-1 flex justify-end gap-2 text-[11px] font-medium text-slate-500">
            <time dateTime={message.createdAt}>{message.displayTime}</time>
            <strong className="text-sm font-bold text-slate-950">{authorName}</strong>
          </div>
          <p className="rounded-lg bg-[#0058BE] px-3.5 py-2 text-xs font-medium leading-5 text-white shadow-md">
            {message.content}
          </p>
        </div>
        <Avatar name={avatarName} size={32} src={message.author.avatarUrl} />
      </article>
    )
  }

  return (
    <article className="flex max-w-md items-start gap-2.5">
      <span className="relative inline-flex">
        <Avatar name={avatarName} size={36} src={message.author.avatarUrl} />
        {message.author.status === 'online' ? (
          <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-[#fbfbff] bg-emerald-500" />
        ) : null}
      </span>
      <div>
        <div className="mb-1 flex items-baseline gap-2">
          <strong className="text-sm font-bold text-slate-950">{authorName}</strong>
          <time className="text-[11px] font-medium text-slate-500" dateTime={message.createdAt}>
            {message.displayTime}
          </time>
        </div>
        {message.content ? (
          <p className="w-fit rounded-lg border border-slate-300 bg-[#ebeef7] px-3.5 py-2 text-xs font-medium leading-5 text-slate-950 shadow-sm">
            {message.content}
          </p>
        ) : null}
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
