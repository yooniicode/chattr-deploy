interface ReplyPreviewProps {
  content: string
  onCancel?: () => void
}

export function ReplyPreview({ content, onCancel }: ReplyPreviewProps) {
  return (
    <div className="reply-preview">
      <span>{content}</span>
      {onCancel ? <button type="button" onClick={onCancel}>Cancel</button> : null}
    </div>
  )
}
