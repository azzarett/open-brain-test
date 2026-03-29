import { httpClient } from '../../common/api/http-client'

export type ApplicationStatus = 'new' | 'in_review' | 'approved' | 'rejected'

export interface Application {
  id: string
  title: string
  description: string
  status: ApplicationStatus
  created_at: string
  updated_at: string
  deleted_at: string | null
}

interface ApplicationsListResponse {
  data: Application[]
  meta: {
    page: number
    limit: number
    total: number
  }
}

interface ApplicationResponse {
  data: Application
}

interface GetApplicationsQuery {
  page?: number
  limit?: number
  status?: ApplicationStatus
}

export interface CreateApplicationPayload {
  title: string
  description: string
  status?: ApplicationStatus
}

export interface UpdateApplicationPayload {
  title?: string
  description?: string
  status?: ApplicationStatus
}

const authHeaders = (token: string) => ({
  Authorization: `Bearer ${token}`,
})

export const getApplications = async (
  token: string,
  query: GetApplicationsQuery = {},
): Promise<ApplicationsListResponse> => {
  const searchParams = new URLSearchParams()

  if (query.page) {
    searchParams.set('page', String(query.page))
  }

  if (query.limit) {
    searchParams.set('limit', String(query.limit))
  }

  if (query.status) {
    searchParams.set('status', query.status)
  }

  const queryString = searchParams.toString()

  return httpClient<ApplicationsListResponse>(
    `/v1/applications${queryString ? `?${queryString}` : ''}`,
    {
      method: 'GET',
      headers: authHeaders(token),
    },
  )
}

export const createApplication = async (
  token: string,
  payload: CreateApplicationPayload,
): Promise<Application> => {
  const response = await httpClient<ApplicationResponse>('/v1/applications', {
    method: 'POST',
    headers: authHeaders(token),
    body: payload,
  })

  return response.data
}

export const updateApplication = async (
  token: string,
  applicationId: string,
  payload: UpdateApplicationPayload,
): Promise<Application> => {
  const response = await httpClient<ApplicationResponse>(
    `/v1/applications/${applicationId}`,
    {
      method: 'PATCH',
      headers: authHeaders(token),
      body: payload,
    },
  )

  return response.data
}
