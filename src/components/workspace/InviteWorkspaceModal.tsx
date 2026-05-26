import { Modal } from '../common/Modal'
import { Input } from '../common/Input'

interface InviteWorkspaceModalProps {
  open: boolean
  onClose: () => void
}

export function InviteWorkspaceModal({ onClose, open }: InviteWorkspaceModalProps) {
  return (
    <Modal onClose={onClose} open={open} title="Invite member">
      <Input label="Email" placeholder="member@example.com" type="email" />
    </Modal>
  )
}
