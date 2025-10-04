import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

type ProtectedRouteProps = {
  children: React.ReactNode
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, token } = useAuth()

  if (!user || !token) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}
