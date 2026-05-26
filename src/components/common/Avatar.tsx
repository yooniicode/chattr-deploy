interface AvatarProps {
  name: string
  src?: string
  size?: number
}

export function Avatar({ name, size = 32, src }: AvatarProps) {
  return src ? (
    <img alt={`${name} avatar`} className="avatar" height={size} src={src} width={size} />
  ) : (
    <span className="avatar avatar-fallback" style={{ height: size, width: size }}>
      {name.slice(0, 1).toUpperCase()}
    </span>
  )
}
