interface HeaderProps {
  title: string
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="flex min-h-14 items-center border-b border-slate-200 bg-white px-6">
      <h1 className="text-xl font-bold text-slate-950">{title}</h1>
    </header>
  )
}
