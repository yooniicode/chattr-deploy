import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
}

export function Input({ id, label, className = '', ...props }: InputProps) {
  return (
    <label className="flex flex-col gap-2 text-sm font-semibold text-slate-700" htmlFor={id}>
      {label ? <span>{label}</span> : null}
      <input
        id={id}
        className={[
          'min-h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none transition-colors placeholder:text-slate-400 focus:border-[#0058BE] focus:ring-2 focus:ring-[#0058BE]/15 disabled:cursor-not-allowed disabled:bg-slate-100',
          className,
        ]
          .filter(Boolean)
          .join(' ')}
        {...props}
      />
    </label>
  )
}
