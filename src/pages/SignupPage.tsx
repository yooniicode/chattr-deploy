import { isAxiosError } from 'axios'
import { CheckCircle2 } from 'lucide-react'
import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { authApi } from '../api/authApi'
import { Button } from '../components/common/Button'
import { Input } from '../components/common/Input'
import { Logo } from '../components/common/Logo'

const PASSWORD_RULES = [
  {
    label: '8자 이상',
    test: (value: string) => value.length >= 8,
  },
  {
    label: '영문 대문자 포함',
    test: (value: string) => /[A-Z]/.test(value),
  },
  {
    label: '영문 소문자 포함',
    test: (value: string) => /[a-z]/.test(value),
  },
  {
    label: '숫자 포함',
    test: (value: string) => /\d/.test(value),
  },
  {
    label: '특수문자 포함',
    test: (value: string) => /[^A-Za-z0-9]/.test(value),
  },
]

export function SignupPage() {
  const navigate = useNavigate()
  const [nickname, setNickname] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const passwordChecks = useMemo(
    () => PASSWORD_RULES.map((rule) => ({ ...rule, passed: rule.test(password) })),
    [password],
  )
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const isPasswordValid = passwordChecks.every((rule) => rule.passed)
  const isPasswordMatched = password.length > 0 && password === confirmPassword
  const canSubmit = nickname.trim().length >= 2 && isEmailValid && isPasswordValid && isPasswordMatched

  const handleSubmit = async (event: { preventDefault: () => void }) => {
    event.preventDefault()
    setSubmitted(true)
    setErrorMessage('')

    if (!canSubmit) return

    setIsLoading(true)
    try {
      await authApi.signup({ email: email.trim(), password, nickname: nickname.trim() })
      navigate('/login')
    } catch (error) {
      if (isAxiosError(error) && error.response?.status === 409) {
        setErrorMessage('이미 가입된 이메일입니다.')
      } else {
        setErrorMessage('회원가입 중 오류가 발생했습니다. 다시 시도해주세요.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col bg-slate-50 text-slate-950">
      <header className="flex h-12 shrink-0 items-center px-5">
        <Logo linkTo="/login" />
      </header>

      <section className="relative flex min-h-0 flex-1 items-center justify-center overflow-auto px-6 py-8">
        <div className="pointer-events-none absolute left-0 top-0 h-[24rem] w-[34rem] -translate-x-24 -translate-y-24 rounded-full bg-[#0058BE]/10 blur-3xl" />
        <div className="relative grid w-full max-w-5xl grid-cols-[minmax(0,1fr)_26rem] items-center gap-16 max-lg:max-w-xl max-lg:grid-cols-1">
          <div className="max-w-lg">
            <p className="text-sm font-bold uppercase tracking-wide text-[#0058BE]">새 계정 만들기</p>
            <h1 className="mt-4 text-3xl font-extrabold leading-tight text-slate-950">
              Chattr에서 새 협업을 시작하세요.
            </h1>
            <p className="mt-5 text-sm font-medium leading-6 text-slate-700">
              안전하게 계정을 생성하고, 팀원들과 실시간으로 소통하세요.
            </p>
            <div className="mt-8 rounded-lg border border-slate-300 bg-white p-5">
              <h2 className="text-sm font-extrabold text-slate-950">Chattr을 선택해야 하는 이유</h2>
              <ul className="mt-3 space-y-2 text-sm font-medium leading-5 text-slate-700">
                <li>💬 채널 기반의 체계적인 팀 소통</li>
                <li>📨 1:1 다이렉트 메시지 지원</li>
                <li>🔒 엔터프라이즈급 보안 인증</li>
                <li>📱 모든 기기에서 실시간 동기화</li>
              </ul>
            </div>
          </div>

          <form className="rounded-xl border border-slate-300 bg-white px-7 py-7 shadow-2xl shadow-slate-300/60" onSubmit={handleSubmit}>
            <div>
              <h2 className="text-2xl font-extrabold text-slate-950">회원가입</h2>
              <p className="mt-2 text-sm font-medium text-slate-600">계정 생성에 필요한 정보를 입력하세요.</p>
            </div>

            <div className="mt-6 flex flex-col gap-4">
              <div>
                <Input
                  id="nickname"
                  label="닉네임"
                  onChange={(event) => {
                    setNickname(event.currentTarget.value)
                    setErrorMessage('')
                  }}
                  placeholder="예: 김채트"
                  value={nickname}
                />
                <p className="mt-1.5 text-xs font-medium text-slate-500">닉네임은 본명으로 입력해주세요.</p>
                {submitted && nickname.trim().length < 2 ? (
                  <p className="mt-1 text-xs font-semibold text-[#BA1A1A]">닉네임은 2자 이상 입력해주세요.</p>
                ) : null}
              </div>

              <div>
                <Input
                  id="signup-email"
                  label="이메일"
                  onChange={(event) => {
                    setEmail(event.currentTarget.value)
                    setErrorMessage('')
                  }}
                  placeholder="name@company.com"
                  type="email"
                  value={email}
                />
                {submitted && !isEmailValid ? (
                  <p className="mt-1 text-xs font-semibold text-[#BA1A1A]">올바른 이메일 형식으로 입력해주세요.</p>
                ) : null}
              </div>

              <div>
                <Input
                  id="signup-password"
                  label="비밀번호"
                  onChange={(event) => setPassword(event.currentTarget.value)}
                  placeholder="8자 이상, 대소문자/숫자/특수문자 포함"
                  type="password"
                  value={password}
                />
                <div className="mt-2 grid grid-cols-2 gap-1.5">
                  {passwordChecks.map((rule) => (
                    <span
                      className={`flex items-center gap-1.5 text-xs font-semibold ${
                        rule.passed ? 'text-[#0058BE]' : 'text-slate-400'
                      }`}
                      key={rule.label}
                    >
                      <CheckCircle2 size={13} />
                      {rule.label}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <Input
                  id="confirm-password"
                  label="비밀번호 확인"
                  onChange={(event) => setConfirmPassword(event.currentTarget.value)}
                  placeholder="비밀번호를 다시 입력하세요"
                  type="password"
                  value={confirmPassword}
                />
                {submitted && !isPasswordMatched ? (
                  <p className="mt-1 text-xs font-semibold text-[#BA1A1A]">비밀번호가 일치하지 않습니다.</p>
                ) : null}
              </div>
            </div>

            {errorMessage ? <p className="mt-4 text-sm font-semibold text-[#BA1A1A]">{errorMessage}</p> : null}

            <Button
              className="mt-7 w-full"
              disabled={isLoading || (submitted && !canSubmit)}
              type="submit"
            >
              {isLoading ? '처리 중...' : '회원가입 완료'}
            </Button>

            <p className="mt-5 text-center text-sm font-medium text-slate-700">
              이미 계정이 있으신가요?{' '}
              <Link className="font-semibold text-[#0058BE] hover:text-[#004EA8]" to="/login">
                로그인
              </Link>
            </p>
          </form>
        </div>
      </section>
    </main>
  )
}
