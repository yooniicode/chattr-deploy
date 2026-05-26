import { Send } from 'lucide-react'
import { Button } from '../common/Button'

export function ChatInput() {
  return (
    <form className="chat-input">
      <input aria-label="Message" placeholder="메시지를 입력하세요" />
      <Button aria-label="Send message">
        <Send size={18} />
      </Button>
    </form>
  )
}
