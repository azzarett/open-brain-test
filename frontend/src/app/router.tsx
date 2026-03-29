import { Navigate, Route, Routes } from 'react-router-dom'
import { AuthProvider } from '../auth/model/auth-context'
import { RequireAuth } from '../auth/model/require-auth'
import { LoginPage } from '../pages/auth/login-page'
import { ApplicationDetailsPage } from '../pages/applications/application-details-page'
import { DashboardPage } from '../pages/dashboard/dashboard-page'

export const AppRouter = () => {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/auth/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <RequireAuth>
              <DashboardPage />
            </RequireAuth>
          }
        />
        <Route
          path="/dashboard/applications/:applicationId"
          element={
            <RequireAuth>
              <ApplicationDetailsPage />
            </RequireAuth>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </AuthProvider>
  )
}
