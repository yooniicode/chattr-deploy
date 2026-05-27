import { Gauge, MessageSquare, ShieldCheck } from 'lucide-react'
import { Button } from '../components/common/Button'
import { Input } from '../components/common/Input'

export function LoginPage() {
  return (
    <main className="flex min-h-screen flex-col bg-slate-50 text-slate-950">
      <header className="flex h-11 shrink-0 items-center px-4">
        <div className="flex items-center gap-2 text-[#0058BE]">
          <MessageSquare aria-hidden size={24} strokeWidth={2.5} />
          <span className="text-base font-bold">Chattr</span>
        </div>
      </header>

      <section className="relative flex min-h-0 flex-1 items-center justify-center overflow-hidden px-8 py-8 max-lg:overflow-visible">
        <div className="pointer-events-none absolute left-0 top-0 h-[28rem] w-[36rem] -translate-x-28 -translate-y-20 rounded-full bg-[#0058BE]/10 blur-3xl" />
        <div className="relative grid w-full max-w-6xl grid-cols-[minmax(0,1fr)_24.25rem] items-center gap-28 max-lg:grid-cols-1 max-lg:gap-8">
          <div className="max-w-xl">
            <h1 className="text-[1.7rem] font-extrabold leading-tight tracking-normal text-slate-950">
              협업의 새로운 기준,
              <br />
              <span className="text-[#0058BE]">Chattr</span>와 함께하세요.
            </h1>
            <p className="mt-6 text-[0.94rem] font-medium leading-6 text-slate-700">
              팀원들과 더 빠르고 정확하게 소통하세요. 더 편리한 협업을 위해 노력합니다.
            </p>

            <div className="mt-10 grid max-w-[31.5rem] grid-cols-2 gap-4 max-sm:grid-cols-1">
              <article className="rounded-lg border border-slate-300 bg-white p-5">
                <Gauge aria-hidden className="text-[#0058BE]" size={20} strokeWidth={2.2} />
                <h2 className="mt-3 text-base font-bold text-slate-950">실시간 동기화</h2>
                <p className="mt-2 text-sm leading-5 text-slate-700">
                  모든 기기에서 즉각적인 메시지 업데이트.
                </p>
              </article>

              <article className="rounded-lg border border-slate-300 bg-white p-5">
                <ShieldCheck aria-hidden className="text-[#0058BE]" size={20} strokeWidth={2.2} />
                <h2 className="mt-3 text-base font-bold text-slate-950">철저한 보안</h2>
                <p className="mt-2 text-sm leading-5 text-slate-700">
                  엔터프라이즈급 보안으로 데이터를 보호합니다.
                </p>
              </article>
            </div>
          </div>

          <form className="rounded-xl border border-slate-300 bg-white px-7 py-7 shadow-2xl shadow-slate-300/60">
            <div className="text-center">
              <h2 className="text-2xl font-extrabold text-slate-950">반가워요!</h2>
              <p className="mt-2 text-sm font-medium text-slate-700">
                계정에 로그인하여 대화를 시작하세요.
              </p>
            </div>

            <div className="mt-7 flex flex-col gap-3">
              <Input
                id="email"
                label="이메일"
                placeholder="name@company.com"
                type="email"
                className="min-h-10 text-base"
              />
              <Input
                id="password"
                label="비밀번호"
                placeholder="••••••••"
                type="password"
                className="min-h-10 text-base"
              />
            </div>

            <div className="mt-4 flex items-center justify-between gap-4 text-sm">
              <label className="flex items-center gap-2 font-medium text-slate-700">
                <input className="size-4 rounded border-slate-300 text-[#0058BE] focus:ring-[#0058BE]" type="checkbox" />
                로그인 유지
              </label>
              <a className="font-semibold text-[#0058BE] hover:text-[#004EA8]" href="/login">
                비밀번호 찾기
              </a>
            </div>

            <Button
              className="mt-6 min-h-10 w-full border-[#0058BE] bg-[#0058BE] text-base hover:bg-[#004EA8] focus-visible:ring-[#0058BE]"
              type="submit"
            >
              로그인
            </Button>

            <div className="my-6 h-px bg-slate-200" />

            <Button className="min-h-10 w-full font-medium" variant="secondary">
              <svg
                aria-hidden
                className="size-5 rounded-full bg-white shadow-sm ring-1 ring-slate-200"
                viewBox="0 0 24 24"
              >
                <path
                  fill="#4285F4"
                  d="M21.6 12.23c0-.74-.07-1.45-.19-2.13H12v4.03h5.38a4.6 4.6 0 0 1-1.99 3.02v2.46h3.22c1.88-1.74 2.99-4.3 2.99-7.38Z"
                />
                <path
                  fill="#34A853"
                  d="M12 22c2.7 0 4.96-.89 6.61-2.39l-3.22-2.46c-.9.6-2.04.96-3.39.96-2.6 0-4.81-1.76-5.6-4.12H3.08v2.54A9.99 9.99 0 0 0 12 22Z"
                />
                <path
                  fill="#FBBC05"
                  d="M6.4 13.99A6.01 6.01 0 0 1 6.09 12c0-.69.11-1.36.31-1.99V7.47H3.08A9.99 9.99 0 0 0 2 12c0 1.61.39 3.13 1.08 4.53l3.32-2.54Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.89c1.47 0 2.79.51 3.83 1.5l2.85-2.85C16.95 2.94 14.7 2 12 2a9.99 9.99 0 0 0-8.92 5.47l3.32 2.54C7.19 7.65 9.4 5.89 12 5.89Z"
                />
              </svg>
              Google로 계속하기
            </Button>

            <p className="mt-7 text-center text-sm font-medium text-slate-700">
              계정이 없으신가요?{' '}
              <a className="font-semibold text-[#0058BE] hover:text-[#004EA8]" href="/login">
                회원가입
              </a>
            </p>
          </form>
        </div>
      </section>

      <footer className="flex h-16 shrink-0 items-center justify-between border-t border-slate-200 px-9 text-xs font-medium text-slate-700 max-sm:flex-col max-sm:items-start max-sm:justify-center max-sm:gap-3">
        <div className="flex items-center gap-2">
          <MessageSquare aria-hidden className="text-slate-500" size={18} />
          <span>© 2024 Chattr Inc. All rights reserved.</span>
        </div>
        <nav aria-label="Footer" className="flex items-center gap-8">
          <a className="hover:text-[#0058BE]" href="/login">
            도움말
          </a>
          <a className="hover:text-[#0058BE]" href="/login">
            개인정보처리방침
          </a>
          <a className="hover:text-[#0058BE]" href="/login">
            서비스상태
          </a>
        </nav>
      </footer>
    </main>
  )
}
