const apiBaseUrl =
  import.meta.env.VITE_API_URL?.replace(/\/$/, '') || 'http://localhost:4004'

interface RequestOptions extends Omit<RequestInit, 'body'> {
  body?: unknown
}

export const httpClient = async <T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> => {
  const { body, headers, ...restOptions } = options

  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...restOptions,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  const responseBody = await response.json().catch(() => null)

  if (!response.ok) {
    const message =
      responseBody?.message || responseBody?.error_code || 'Request failed'
    throw new Error(message)
  }

  return responseBody as T
}
