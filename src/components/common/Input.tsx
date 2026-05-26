import type { InputHTMLAttributes } from 'react'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
}

export function Input({ id, label, className = '', ...props }: InputProps) {
  return (
    <label className="field" htmlFor={id}>
      {label ? <span>{label}</span> : null}
      <input id={id} className={`input ${className}`.trim()} {...props} />
    </label>
  )
}
