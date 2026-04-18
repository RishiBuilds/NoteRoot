import { login } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginForm() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await login(identifier, password)
      navigate('/')
    } catch {
      setError('Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 rounded-base border-2 border-border bg-secondary-background p-8 shadow-shadow">
        <div className="text-center">
          <h1 className="text-3xl font-heading tracking-tight text-foreground">
            🌳 NoteRoot
          </h1>
          <p className="mt-2 text-sm text-foreground/60">
            Sign in to manage your wiki
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="rounded-base border-2 border-red-500 bg-red-50 p-3 text-sm text-red-700 font-base">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label
              htmlFor="login-identifier"
              className="text-sm font-heading text-foreground"
            >
              Username or Email
            </label>
            <Input
              id="login-identifier"
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="admin"
              required
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="login-password"
              className="text-sm font-heading text-foreground"
            >
              Password
            </label>
            <Input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>

          <Button
            id="login-submit"
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </div>
    </div>
  )
}
