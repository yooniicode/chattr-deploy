import type { ReactNode } from 'react'
import { WorkspaceSidebar } from './WorkspaceSidebar'

interface MainLayoutProps {
  sidebar?: ReactNode
  header?: ReactNode
  children: ReactNode
}

export function MainLayout({ children, header, sidebar }: MainLayoutProps) {
  return (
    <div
      className={`grid h-screen overflow-hidden bg-slate-50 text-slate-950 ${
        sidebar
          ? 'grid-cols-[3.75rem_max-content_minmax(0,1fr)] max-md:grid-cols-[3.5rem_minmax(0,1fr)]'
          : 'grid-cols-[3.75rem_minmax(0,1fr)] max-md:grid-cols-[3.5rem_minmax(0,1fr)]'
      }`}
    >
      <WorkspaceSidebar />
      {sidebar}
      <main className="grid min-h-0 min-w-0 grid-rows-[auto_minmax(0,1fr)_auto] overflow-hidden">
        {header}
        {children}
      </main>
    </div>
  )
}
