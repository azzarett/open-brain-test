import { LogOut } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../../common/components/ui/card'
import { Button } from '../../common/components/ui/button'
import { useAuth } from '../../auth/model/use-auth'

export const DashboardPage = () => {
  const { user, logout } = useAuth()

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="pointer-events-none absolute left-0 top-0 h-56 w-56 rounded-full bg-amber-200/40 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-56 w-56 rounded-full bg-orange-300/30 blur-3xl" />

      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Authorization Passed</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-zinc-700">
            Frontend is connected to backend auth and your session is active.
          </p>

          <div className="rounded-lg border border-amber-900/20 bg-amber-50 px-4 py-3 text-sm text-zinc-800">
            Signed in as: <strong>{user?.email ?? 'Unknown user'}</strong>
          </div>

          <Button variant="outline" onClick={() => logout()}>
            <LogOut className="mr-2 h-4 w-4" />
            Sign out
          </Button>
        </CardContent>
      </Card>
    </main>
  )
}
