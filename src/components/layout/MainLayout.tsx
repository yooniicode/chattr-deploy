import type { ReactNode } from 'react'
import { ChannelSidebar } from './ChannelSidebar'
import { Header } from './Header'
import { WorkspaceSidebar } from './WorkspaceSidebar'

interface MainLayoutProps {
  children: ReactNode
  title: string
}

export function MainLayout({ children, title }: MainLayoutProps) {
  return (
    <div className="app-shell">
      <WorkspaceSidebar />
      <ChannelSidebar />
      <main className="main-panel">
        <Header title={title} />
        {children}
      </main>
    </div>
  )
}
