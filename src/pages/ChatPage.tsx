import { ChatInput } from '../components/chat/ChatInput'
import { MessageList } from '../components/chat/MessageList'
import { ChannelSidebar } from '../components/layout/ChannelSidebar'
import { MainLayout } from '../components/layout/MainLayout'
import { mockMessages } from '../mocks/mockMessages'
import { UserPlus } from 'lucide-react'

function ChannelHeader() {
  return (
    <header className="flex h-14 items-center justify-between border-b border-slate-300 bg-[#fbfbff] px-6">
      <h1 className="flex items-center gap-2 text-sm font-extrabold text-slate-950">
        <span className="text-lg text-[#0058BE]">#</span>
        <span>dev- 공통</span>
      </h1>
      <button className="text-slate-700 hover:text-[#0058BE]" type="button" aria-label="Invite member">
        <UserPlus size={20} />
      </button>
    </header>
  )
}

export function ChatPage() {
  return (
    <MainLayout header={<ChannelHeader />} sidebar={<ChannelSidebar />}>
      <MessageList messages={mockMessages} />
      <ChatInput />
    </MainLayout>
  )
}
