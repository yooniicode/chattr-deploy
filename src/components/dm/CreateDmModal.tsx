import { Input } from '../common/Input'
import { Modal } from '../common/Modal'

interface CreateDmModalProps {
  open: boolean
  onClose: () => void
}

export function CreateDmModal({ onClose, open }: CreateDmModalProps) {
  return (
    <Modal onClose={onClose} open={open} title="New direct message">
      <Input label="Member" placeholder="이름 또는 이메일" />
    </Modal>
  )
}
