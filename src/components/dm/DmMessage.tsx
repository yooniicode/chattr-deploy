import { Download, FileText } from 'lucide-react'
import type { Message } from '../../types/message'
import { formatFileSize } from '../../utils/upload'
import { Avatar } from '../common/Avatar'

interface DmMessageProps {
  message: Message
}

function DmUserAvatar({ name, online }: { name: string; online?: boolean }) {
  return (
    <span className="relative inline-flex">
      <span className="grid size-9 shrink-0 place-items-center overflow-hidden rounded-xl bg-slate-950">
        <span className="size-7 rounded-full bg-[radial-gradient(circle_at_65%_45%,#23d3bf_0,#0e7282_32%,#061827_70%)]" />
      </span>
      {online ? (
        <span className="absolute bottom-0 right-0 size-2.5 rounded-full border-2 border-[#fbfbff] bg-emerald-500" />
      ) : null}
      <span className="sr-only">{name}</span>
    </span>
  )
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

  const isMine = message.author.name === '나'

  if (isMine) {
    return (
      <article className="ml-auto flex max-w-md items-start gap-2.5">
        <div className="text-right">
          <div className="mb-1 flex justify-end gap-2 text-[11px] font-medium text-slate-500">
            <time dateTime={message.createdAt}>{message.displayTime}</time>
            <strong className="text-sm font-bold text-slate-950">{message.author.name}</strong>
          </div>
          <p className="rounded-lg bg-[#0058BE] px-3.5 py-2 text-xs font-medium leading-5 text-white shadow-md">
            {message.content}
          </p>
        </div>
        <Avatar name={message.author.name} size={32} />
      </article>
    )
  }

  return (
    <article className="flex max-w-md items-start gap-2.5">
      <DmUserAvatar name={message.author.name} online={message.author.status === 'online'} />
      <div>
        <div className="mb-1 flex items-baseline gap-2">
          <strong className="text-sm font-bold text-slate-950">{message.author.name}</strong>
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
              <span className="block text-[11px] font-medium text-slate-600">
                {formatFileSize(file.size)} · PDF
              </span>
            </span>
            <Download className="text-slate-600" size={16} />
          </a>
        ))}
      </div>
    </article>
  )
}
