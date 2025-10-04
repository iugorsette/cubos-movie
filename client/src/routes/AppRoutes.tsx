import { Routes, Route, Navigate } from 'react-router-dom'
import Filmes from '../pages/Filmes'
import AuthPage from '../pages/AuthPage'
import MovieDetail from '../pages/MovieDetail'
import ProtectedRoute from './ProtectedRoute'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path='/login' element={<AuthPage />} />
      <Route
        path='/filmes'
        element={
          <ProtectedRoute>
            <Filmes />
          </ProtectedRoute>
        }
      />
      <Route
        path='/filmes/:id'
        element={
          <ProtectedRoute>
            <MovieDetail />
          </ProtectedRoute>
        }
      />

      <Route path='*' element={<Navigate to='/login' replace />} />
    </Routes>
  )
}
