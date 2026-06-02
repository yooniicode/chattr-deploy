import { Logo } from './Logo'

export function AppPageHeader() {
  return (
    <header className="flex h-10 items-center border-b border-slate-300 bg-[#fbfbff] px-6">
      <Logo iconSize={22} textClassName="text-2xl font-extrabold" />
    </header>
  )
}
