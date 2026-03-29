import { useEffect, useMemo, useState } from 'react'
import {
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  ListFilter,
  LogOut,
  RefreshCcw,
  Save,
  Send,
  XCircle,
} from 'lucide-react'
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

const statusLabels: Record<ApplicationStatus, string> = {
  new: 'New',
  in_review: 'In review',
  approved: 'Approved',
  rejected: 'Rejected',
}

const statusBadgeClasses: Record<ApplicationStatus, string> = {
  new: 'bg-slate-100 text-slate-700',
  in_review: 'bg-sky-100 text-sky-800',
  approved: 'bg-emerald-100 text-emerald-800',
  rejected: 'bg-rose-100 text-rose-800',
}

const statusColumnStyles: Record<ApplicationStatus, string> = {
  new: 'border-slate-200 bg-slate-50/60',
  in_review: 'border-sky-200 bg-sky-50/60',
  approved: 'border-emerald-200 bg-emerald-50/60',
  rejected: 'border-rose-200 bg-rose-50/60',
}

export const DashboardPage = () => {
  const { user, token, logout } = useAuth()

  const [applications, setApplications] = useState<Application[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [listStatusFilter, setListStatusFilter] = useState<
    'all' | ApplicationStatus
  >('all')

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

  const totalApplications = applications.length

  const approvedCount = applications.filter(
    (application) => application.status === 'approved',
  ).length

  const inReviewCount = applications.filter(
    (application) => application.status === 'in_review',
  ).length

  const rejectedCount = applications.filter(
    (application) => application.status === 'rejected',
  ).length

  const groupedApplicationsByStatus = useMemo(() => {
    const initial: Record<ApplicationStatus, Application[]> = {
      new: [],
      in_review: [],
      approved: [],
      rejected: [],
    }

    for (const application of applications) {
      initial[application.status].push(application)
    }

    return initial
  }, [applications])

  const loadApplications = async () => {
    if (!token) {
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const response = await getApplications(token, {
        page: 1,
        limit: 50,
        status: listStatusFilter === 'all' ? undefined : listStatusFilter,
      })
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
  }, [token, listStatusFilter])

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

      if (listStatusFilter === 'all' || created.status === listStatusFilter) {
        setApplications((current) => [created, ...current])
      }
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

      if (listStatusFilter !== 'all' && updated.status !== listStatusFilter) {
        setApplications((current) =>
          current.filter((application) => application.id !== editingId),
        )
      } else {
        setApplications((current) =>
          current.map((application) =>
            application.id === editingId ? updated : application,
          ),
        )
      }

      setEditingId(null)
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Failed to update application',
      )
    }
  }

  const renderApplicationCard = (application: Application) => {
    return (
      <div
        key={application.id}
        className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm"
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-semibold text-slate-900">
              {application.title}
            </h3>
            <p className="mt-1 text-sm leading-5 text-slate-600">
              {application.description}
            </p>
          </div>
          <span
            className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadgeClasses[application.status]}`}
          >
            {statusLabels[application.status]}
          </span>
        </div>

        {editingId === application.id ? (
          <div className="flex flex-wrap items-center gap-2 border-t border-slate-200 pt-3">
            <Select
              className="min-w-[140px] flex-1"
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
          <div className="border-t border-slate-200 pt-3">
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
    )
  }

  return (
    <main className="min-h-screen px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto flex w-full max-w-[1400px] flex-col gap-6">
        <Card className="border-slate-300 bg-white/95">
          <CardContent className="p-5 md:p-6">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.08em] text-sky-700">
                  Operations workspace
                </p>
                <h1 className="mt-1 text-2xl font-semibold text-slate-900">
                  OpenBrain Applications
                </h1>
                <p className="mt-1 truncate text-sm text-slate-500">
                  Signed in as {user?.email ?? 'Unknown user'}
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button variant="outline" size="sm" onClick={() => void loadApplications()}>
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  Refresh
                </Button>
                <Button variant="outline" size="sm" onClick={() => logout()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </Button>
              </div>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>Total applications</span>
                  <BriefcaseBusiness className="h-4 w-4" />
                </div>
                <p className="mt-2 text-2xl font-semibold text-slate-900">{totalApplications}</p>
              </div>

              <div className="rounded-lg border border-sky-200 bg-sky-50 p-4">
                <div className="flex items-center justify-between text-sm text-sky-800">
                  <span>In review</span>
                  <Clock3 className="h-4 w-4" />
                </div>
                <p className="mt-2 text-2xl font-semibold text-sky-900">{inReviewCount}</p>
              </div>

              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
                <div className="flex items-center justify-between text-sm text-emerald-800">
                  <span>Approved</span>
                  <CheckCircle2 className="h-4 w-4" />
                </div>
                <p className="mt-2 text-2xl font-semibold text-emerald-900">{approvedCount}</p>
              </div>

              <div className="rounded-lg border border-rose-200 bg-rose-50 p-4">
                <div className="flex items-center justify-between text-sm text-rose-800">
                  <span>Rejected</span>
                  <XCircle className="h-4 w-4" />
                </div>
                <p className="mt-2 text-2xl font-semibold text-rose-900">{rejectedCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[360px_1fr]">
          <Card className="h-fit border-slate-300 bg-white/95">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl">Create application</CardTitle>
              <p className="text-sm text-slate-500">
                Add a new application and assign its initial workflow status.
              </p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Application title</Label>
                <Input
                  id="title"
                  placeholder="e.g. Strategic partnership request"
                  value={title}
                  onChange={(event) => setTitle(event.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  placeholder="Describe business context, owner, and key notes..."
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
            </CardContent>
          </Card>

          <Card className="border-slate-300 bg-white/95">
            <CardHeader className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle className="text-xl">Applications board</CardTitle>
                <div className="flex items-center gap-2 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-medium text-slate-600">
                  <ListFilter className="h-4 w-4" />
                  Live status filtering
                </div>
              </div>

              <div className="grid gap-2 sm:max-w-[280px]">
                <Label htmlFor="list-status-filter">Filter by status</Label>
                <Select
                  id="list-status-filter"
                  value={listStatusFilter}
                  onChange={(event) =>
                    setListStatusFilter(
                      event.target.value as 'all' | ApplicationStatus,
                    )
                  }
                >
                  <option value="all">All statuses</option>
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </div>
            </CardHeader>
            <CardContent>
              {error ? (
                <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                  {error}
                </p>
              ) : null}

              {isLoading ? (
                <p className="text-sm text-slate-500">Loading applications...</p>
              ) : null}

              {!isLoading && applications.length === 0 ? (
                <p className="text-sm text-slate-500">
                  No applications yet. Create your first one.
                </p>
              ) : null}

              {listStatusFilter === 'all' ? (
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-4">
                  {statusOptions.map((column) => {
                    const columnStatus = column.value as ApplicationStatus
                    const columnData = groupedApplicationsByStatus[columnStatus]

                    return (
                      <div
                        key={column.value}
                        className={`min-w-0 rounded-lg border p-3 ${statusColumnStyles[columnStatus]}`}
                      >
                        <div className="mb-3 flex items-center justify-between">
                          <h3 className="text-sm font-semibold text-slate-800">
                            {column.label}
                          </h3>
                          <span className="rounded-full bg-white px-2 py-0.5 text-xs font-semibold text-slate-700">
                            {columnData.length}
                          </span>
                        </div>

                        <div className="max-h-[58vh] space-y-3 overflow-y-auto pr-1">
                          {columnData.length === 0 ? (
                            <p className="rounded-md border border-dashed border-slate-300 bg-white/70 px-3 py-4 text-center text-xs text-slate-500">
                              No applications
                            </p>
                          ) : (
                            columnData.map((application) =>
                              renderApplicationCard(application),
                            )
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="space-y-3">
                  {applications.map((application) => renderApplicationCard(application))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
