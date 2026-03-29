import type { AuthUser } from '../api/auth.api'

const AUTH_TOKEN_KEY = 'openbrain.auth.token'
const AUTH_USER_KEY = 'openbrain.auth.user'

export const authStorage = {
  getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY)
  },

  setToken(token: string): void {
    localStorage.setItem(AUTH_TOKEN_KEY, token)
  },

  getUser(): AuthUser | null {
    const rawUser = localStorage.getItem(AUTH_USER_KEY)

    if (!rawUser) {
      return null
    }

    try {
      return JSON.parse(rawUser) as AuthUser
    } catch {
      localStorage.removeItem(AUTH_USER_KEY)
      return null
    }
  },

  setUser(user: AuthUser): void {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user))
  },

  clear(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    localStorage.removeItem(AUTH_USER_KEY)
  },
}
