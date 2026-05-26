import type { ReactNode } from 'react'

interface SidebarProps {
  children: ReactNode
  title?: string
}

export function Sidebar({ children, title }: SidebarProps) {
  return (
    <aside className="sidebar">
      {title ? <h2>{title}</h2> : null}
      {children}
    </aside>
  )
}
