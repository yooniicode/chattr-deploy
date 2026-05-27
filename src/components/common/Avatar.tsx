interface AvatarProps {
  name: string
  src?: string
  size?: number
}

export function Avatar({ name, size = 32, src }: AvatarProps) {
  return src ? (
    <img
      alt={`${name} avatar`}
      className="inline-flex shrink-0 rounded-full object-cover ring-1 ring-slate-200"
      height={size}
      src={src}
      width={size}
    />
  ) : (
    <span
      className="inline-flex shrink-0 items-center justify-center rounded-full bg-slate-600 text-sm font-bold text-white ring-1 ring-slate-200"
      style={{ height: size, width: size }}
    >
      {name.slice(0, 1).toUpperCase()}
    </span>
  )
}
