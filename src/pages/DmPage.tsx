import { ChatInput } from '../components/chat/ChatInput'
import { MessageList } from '../components/chat/MessageList'
import { MainLayout } from '../components/layout/MainLayout'
import { mockMessages } from '../mocks/mockMessages'

export function DmPage() {
  return (
    <MainLayout title="Direct messages">
      <MessageList messages={mockMessages} />
      <ChatInput />
    </MainLayout>
  )
}
