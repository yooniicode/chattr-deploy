import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import './index.css'
import App from './App.tsx'

// Migrate tokens from localStorage → sessionStorage (one-time cleanup)
;['chattr.idToken', 'chattr.accessToken', 'chattr.refreshToken'].forEach((key) => {
  const value = localStorage.getItem(key)
  if (value) {
    sessionStorage.setItem(key, value)
    localStorage.removeItem(key)
  }
})
// Clear stale persisted auth user from Zustand localStorage
localStorage.removeItem('chattr-auth-store')

const queryClient = new QueryClient()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </StrictMode>,
)
