import { httpClient } from '../../common/api/http-client'

interface SignInResponse {
  data: {
    user: {
      id: string
      email: string
      first_name: string | null
      last_name: string | null
    }
    auth: {
      access: {
        token: string
      }
    }
  }
}

export interface SignInPayload {
  email: string
  password: string
}

export interface AuthUser {
  id: string
  email: string
  first_name: string | null
  last_name: string | null
}

export interface SignInResult {
  token: string
  user: AuthUser
}

export const signIn = async (payload: SignInPayload): Promise<SignInResult> => {
  const response = await httpClient<SignInResponse>('/v1/auth/sign-in', {
    method: 'POST',
    body: payload,
  })

  return {
    token: response.data.auth.access.token,
    user: response.data.user,
  }
}

export const signOut = async (token: string): Promise<void> => {
  await httpClient('/v1/auth/sign-out', {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}
