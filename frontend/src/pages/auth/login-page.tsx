import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../common/components/ui/card'
import { Input } from '../../common/components/ui/input'
import { Button } from '../../common/components/ui/button'
import { Label } from '../../common/components/ui/label'
import { useAuth } from '../../auth/model/use-auth'

export const LoginPage = () => {
  const navigate = useNavigate()
  const location = useLocation() as { state?: { from?: string } }
  const { login, isAuthenticated, isLoading } = useAuth()

  const [email, setEmail] = useState('admin@openbrain.test')
  const [password, setPassword] = useState('Password123!')
  const [error, setError] = useState('')

  if (isAuthenticated) {
    return <Navigate to="/" replace />
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError('')

    try {
      await login({ email, password })
      navigate(location.state?.from || '/', { replace: true })
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Failed to sign in',
      )
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="pointer-events-none absolute -left-24 top-14 h-72 w-72 rounded-full bg-amber-200/60 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-20 h-72 w-72 rounded-full bg-orange-300/40 blur-3xl" />

      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>OpenBrain Sign In</CardTitle>
          <CardDescription>
            Use backend credentials to access the MVP dashboard.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                autoComplete="email"
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error ? (
              <p className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            <Button className="w-full" type="submit" disabled={isLoading}>
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </main>
  )
}
