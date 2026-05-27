interface ReplyPreviewProps {
  content: string
  onCancel?: () => void
}

export function ReplyPreview({ content, onCancel }: ReplyPreviewProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-md border-l-4 border-[#0058BE] bg-[#0058BE]/10 px-3 py-2 text-sm text-slate-700">
      <span className="truncate">{content}</span>
      {onCancel ? (
        <button className="text-xs font-semibold text-[#0058BE] hover:text-[#004EA8]" type="button" onClick={onCancel}>
          Cancel
        </button>
      ) : null}
    </div>
  )
}
