import type { ReactNode } from 'react'

interface SidebarProps {
  children: ReactNode
  title?: string
}

export function Sidebar({ children, title }: SidebarProps) {
  return (
    <aside className="border-r border-slate-200 bg-white px-4 py-5 max-md:hidden">
      {title ? <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-slate-500">{title}</h2> : null}
      <div className="flex flex-col gap-1">{children}</div>
    </aside>
  )
}
