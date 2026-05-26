import type { FileAttachment } from '../../types/message'
import { formatFileSize } from '../../utils/upload'

interface FileMessageProps {
  file: FileAttachment
}

export function FileMessage({ file }: FileMessageProps) {
  return (
    <a className="file-message" href={file.url} rel="noreferrer" target="_blank">
      <span>{file.name}</span>
      <small>{formatFileSize(file.size)}</small>
    </a>
  )
}
