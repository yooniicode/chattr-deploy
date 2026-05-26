import type { ReactNode } from 'react'
import { Button } from './Button'

interface ModalProps {
  open: boolean
  title: string
  children: ReactNode
  onClose: () => void
}

export function Modal({ children, onClose, open, title }: ModalProps) {
  if (!open) return null

  return (
    <div className="modal-backdrop" role="presentation">
      <section aria-modal="true" className="modal" role="dialog">
        <header>
          <h2>{title}</h2>
          <Button aria-label="Close modal" onClick={onClose} variant="ghost">
            X
          </Button>
        </header>
        {children}
      </section>
    </div>
  )
}
