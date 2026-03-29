import { useEffect, useMemo, useState } from 'react'
import { LogOut, RefreshCcw, Save, Send } from 'lucide-react'
import {
  createApplication,
  getApplications,
  type Application,
  type ApplicationStatus,
  updateApplication,
} from '../../applications/api/applications.api'
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Input,
  Label,
  Select,
  Textarea,
} from '../../common/components/ui'
import { useAuth } from '../../auth/model/use-auth'

export const DashboardPage = () => {
  const { user, token, logout } = useAuth()

  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [status, setStatus] = useState<ApplicationStatus>('new')
  const [isCreating, setIsCreating] = useState(false)

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editingStatus, setEditingStatus] = useState<ApplicationStatus>('new')

  const canCreate = title.trim().length > 0 && description.trim().length > 0

  const statusOptions = useMemo(
    () => [
      { label: 'New', value: 'new' },
      { label: 'In review', value: 'in_review' },
      { label: 'Approved', value: 'approved' },
      { label: 'Rejected', value: 'rejected' },
    ],
    [],
  )

  const loadApplications = async () => {
    if (!token) {
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await getApplications(token, { page: 1, limit: 50 })
      setApplications(response.data)
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Failed to load applications',
      )
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    void loadApplications()
  }, [token])

  const handleCreate = async () => {
    if (!token || !canCreate) {
      return
    }

    setIsCreating(true)
    setError('')

    try {
      const created = await createApplication(token, {
        title: title.trim(),
        description: description.trim(),
        status,
      })

      setApplications((current) => [created, ...current])
      setTitle('')
      setDescription('')
      setStatus('new')
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Failed to create application',
      )
    } finally {
      setIsCreating(false)
    }
  }

  const startEditStatus = (application: Application) => {
    setEditingId(application.id)
    setEditingStatus(application.status)
  }

  const submitStatusUpdate = async () => {
    if (!token || !editingId) {
      return
    }

    setError('')

    try {
      const updated = await updateApplication(token, editingId, {
        status: editingStatus,
      })

      setApplications((current) =>
        current.map((application) =>
          application.id === editingId ? updated : application,
        ),
      )

      setEditingId(null)
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Failed to update application',
      )
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden p-4 md:p-8">
      <div className="pointer-events-none absolute left-0 top-0 h-64 w-64 rounded-full bg-amber-200/35 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 right-0 h-64 w-64 rounded-full bg-orange-300/25 blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-6xl gap-6 lg:grid-cols-[360px_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>OpenBrain Workspace</CardTitle>
            <p className="text-sm text-zinc-600">
              Signed in as <strong>{user?.email ?? 'Unknown user'}</strong>
            </p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Application title</Label>
              <Input
                id="title"
                placeholder="New application title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe this application..."
                value={description}
                onChange={(event) => setDescription(event.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Initial status</Label>
              <Select
                id="status"
                value={status}
                onChange={(event) =>
                  setStatus(event.target.value as ApplicationStatus)
                }
              >
                {statusOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </Select>
            </div>

            <Button
              className="w-full"
              onClick={handleCreate}
              disabled={!canCreate || isCreating}
            >
              <Send className="mr-2 h-4 w-4" />
              {isCreating ? 'Creating...' : 'Create application'}
            </Button>

            <Button className="w-full" variant="outline" onClick={() => logout()}>
              <LogOut className="mr-2 h-4 w-4" />
              Sign out
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0">
            <CardTitle>Applications</CardTitle>
            <Button variant="outline" size="sm" onClick={() => void loadApplications()}>
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
          </CardHeader>
          <CardContent>
            {error ? (
              <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                {error}
              </p>
            ) : null}

            {isLoading ? <p className="text-zinc-600">Loading applications...</p> : null}

            {!isLoading && applications.length === 0 ? (
              <p className="text-zinc-600">No applications yet. Create your first one.</p>
            ) : null}

            <div className="space-y-4">
              {applications.map((application) => (
                <div
                  key={application.id}
                  className="rounded-lg border border-amber-900/20 bg-amber-50/40 p-4"
                >
                  <div className="mb-2 flex items-start justify-between gap-4">
                    <div>
                      <h3 className="text-base font-semibold text-zinc-900">
                        {application.title}
                      </h3>
                      <p className="text-sm text-zinc-700">{application.description}</p>
                    </div>
                    <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold uppercase text-amber-900">
                      {application.status}
                    </span>
                  </div>

                  {editingId === application.id ? (
                    <div className="flex gap-2">
                      <Select
                        value={editingStatus}
                        onChange={(event) =>
                          setEditingStatus(event.target.value as ApplicationStatus)
                        }
                      >
                        {statusOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </Select>
                      <Button size="sm" onClick={submitStatusUpdate}>
                        <Save className="mr-2 h-4 w-4" />
                        Save
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => startEditStatus(application)}
                      >
                        Update status
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
