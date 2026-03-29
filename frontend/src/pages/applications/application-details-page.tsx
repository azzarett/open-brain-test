import { useCallback, useEffect, useMemo, useState } from 'react'
import { ArrowLeft, CalendarDays, FileText, RefreshCcw, UserRoundSearch } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import {
  getApplicationById,
  type Application,
  type ApplicationStatus,
} from '../../applications/api/applications.api'
import { useAuth } from '../../auth/model/use-auth'
import { Button, Card, CardContent, CardHeader, CardTitle } from '../../common/components/ui'

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

const formatDate = (dateValue: string): string => {
  const date = new Date(dateValue)

  if (Number.isNaN(date.getTime())) {
    return 'Unknown'
  }

  return date.toLocaleString()
}

export const ApplicationDetailsPage = () => {
  const { token } = useAuth()
  const navigate = useNavigate()
  const { applicationId } = useParams<{ applicationId: string }>()

  const [application, setApplication] = useState<Application | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  const isNotFound = useMemo(
    () => error.toLowerCase().includes('not_found') || error.toLowerCase().includes('not found'),
    [error],
  )

  const loadApplication = useCallback(async () => {
    if (!token || !applicationId) {
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const loadedApplication = await getApplicationById(token, applicationId)
      setApplication(loadedApplication)
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : 'Failed to load application details',
      )
    } finally {
      setIsLoading(false)
    }
  }, [token, applicationId])

  useEffect(() => {
    void loadApplication()
  }, [loadApplication])

  return (
    <main className="min-h-screen px-4 py-6 md:px-8 md:py-8">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Button variant="outline" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to board
          </Button>
          <Button variant="outline" onClick={() => void loadApplication()} disabled={isLoading}>
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh details
          </Button>
        </div>

        {error ? (
          <Card className="border-red-200 bg-red-50/70">
            <CardContent className="p-5">
              <p className="text-sm text-red-700">
                {isNotFound
                  ? 'Application was not found. It may have been removed.'
                  : error}
              </p>
            </CardContent>
          </Card>
        ) : null}

        {isLoading ? (
          <Card className="border-slate-300 bg-white/95">
            <CardContent className="p-5 text-sm text-slate-500">
              Loading application details...
            </CardContent>
          </Card>
        ) : null}

        {!isLoading && application ? (
          <Card className="border-slate-300 bg-white/95">
            <CardHeader className="space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold uppercase tracking-[0.08em] text-sky-700">
                    Application details
                  </p>
                  <CardTitle className="mt-1 break-words text-2xl text-slate-900">
                    {application.title}
                  </CardTitle>
                </div>
                <span
                  className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadgeClasses[application.status]}`}
                >
                  {statusLabels[application.status]}
                </span>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <section className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h2 className="mb-2 flex items-center text-sm font-semibold text-slate-800">
                  <FileText className="mr-2 h-4 w-4" />
                  Description
                </h2>
                <p className="whitespace-pre-wrap text-sm leading-6 text-slate-700">
                  {application.description}
                </p>
              </section>

              <section className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <p className="mb-2 flex items-center text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                    <UserRoundSearch className="mr-2 h-4 w-4" />
                    Application ID
                  </p>
                  <p className="break-all text-sm font-medium text-slate-800">{application.id}</p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <p className="mb-2 flex items-center text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                    <CalendarDays className="mr-2 h-4 w-4" />
                    Last updated
                  </p>
                  <p className="text-sm font-medium text-slate-800">
                    {formatDate(application.updated_at)}
                  </p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                    Created at
                  </p>
                  <p className="text-sm font-medium text-slate-800">
                    {formatDate(application.created_at)}
                  </p>
                </div>

                <div className="rounded-lg border border-slate-200 bg-white p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-[0.08em] text-slate-500">
                    Deleted at
                  </p>
                  <p className="text-sm font-medium text-slate-800">
                    {application.deleted_at ? formatDate(application.deleted_at) : 'Not deleted'}
                  </p>
                </div>
              </section>
            </CardContent>
          </Card>
        ) : null}
      </div>
    </main>
  )
}
