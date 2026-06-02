import { MessageSquare } from 'lucide-react'
import { Link } from 'react-router-dom'

interface LogoProps {
  linkTo?: string
  iconSize?: number
  textClassName?: string
}

export function Logo({ linkTo, iconSize = 24, textClassName = 'text-base font-bold' }: LogoProps) {
  const inner = (
    <div className="flex items-center gap-2 text-[#0058BE]">
      <MessageSquare aria-hidden size={iconSize} strokeWidth={2.5} />
      <span className={textClassName}>Chattr</span>
    </div>
  )
  return linkTo ? <Link to={linkTo}>{inner}</Link> : inner
}
