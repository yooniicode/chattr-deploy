import type { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: 'primary' | 'secondary' | 'ghost'
}

const variantClasses = {
  primary:
    'border-[#0058BE] bg-[#0058BE] text-white hover:bg-[#004EA8] focus-visible:ring-[#0058BE]',
  secondary:
    'border-slate-300 bg-white text-slate-900 hover:bg-slate-50 focus-visible:ring-[#0058BE]',
  ghost:
    'border-transparent bg-transparent text-slate-700 hover:bg-slate-100 focus-visible:ring-[#0058BE]',
}

export function Button({ className = '', variant = 'primary', ...props }: ButtonProps) {
  return (
    <button
      className={[
        'inline-flex min-h-10 items-center justify-center gap-2 rounded-md border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        variantClasses[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      type="button"
      {...props}
    />
  )
}
