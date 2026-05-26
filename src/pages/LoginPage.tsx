import { Button } from '../components/common/Button'
import { Input } from '../components/common/Input'

export function LoginPage() {
  return (
    <main className="auth-page">
      <form className="auth-panel">
        <h1>CHATTR</h1>
        <Input label="Email" placeholder="you@example.com" type="email" />
        <Input label="Password" placeholder="password" type="password" />
        <Button>Login</Button>
      </form>
    </main>
  )
}
