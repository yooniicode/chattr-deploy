import type { FileAttachment } from '../../types/message'
import { formatFileSize } from '../../utils/upload'

interface FileMessageProps {
  file: FileAttachment
}

export function FileMessage({ file }: FileMessageProps) {
  return (
    <a
      className="inline-flex items-center gap-3 rounded-lg border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-sm transition-colors hover:bg-slate-50"
      href={file.url}
      rel="noreferrer"
      target="_blank"
    >
      <span>{file.name}</span>
      <small className="text-xs font-medium text-slate-500">{formatFileSize(file.size)}</small>
    </a>
  )
}
