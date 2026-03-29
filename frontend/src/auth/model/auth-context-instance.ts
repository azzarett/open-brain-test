import { createContext } from 'react'
import type { AuthUser, SignInPayload } from '../api/auth.api'

export interface AuthContextValue {
  token: string | null
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (payload: SignInPayload) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)