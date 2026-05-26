import { Input } from '../common/Input'
import { Modal } from '../common/Modal'

interface CreateChannelModalProps {
  open: boolean
  onClose: () => void
}

export function CreateChannelModal({ onClose, open }: CreateChannelModalProps) {
  return (
    <Modal onClose={onClose} open={open} title="Create channel">
      <Input label="Channel name" placeholder="general" />
    </Modal>
  )
}
