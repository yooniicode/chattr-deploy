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
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-slate-950/45 p-6"
      role="presentation"
    >
      <section
        aria-modal="true"
        className="w-full max-w-lg rounded-lg border border-slate-200 bg-white p-5 shadow-xl"
        role="dialog"
      >
        <header className="mb-5 flex items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-slate-950">{title}</h2>
          <Button aria-label="Close modal" onClick={onClose} variant="ghost">
            X
          </Button>
        </header>
        {children}
      </section>
    </div>
  )
}
