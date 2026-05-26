import { MoreHorizontal } from 'lucide-react'
import { Button } from '../common/Button'

export function MessageMenu() {
  return (
    <Button aria-label="Message actions" variant="ghost">
      <MoreHorizontal size={18} />
    </Button>
  )
}
