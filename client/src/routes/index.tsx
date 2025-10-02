import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Filmes from '../pages/Filmes'
import AuthPage from '../pages/AuthPage'
import MovieDetail from '../pages/MovieDetail'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<AuthPage />} />
        <Route path='/filmes' element={<Filmes />} />
        <Route path="/filmes/:id" element={<MovieDetail />} />

        <Route path='*' element={<Navigate to='/login' />} />
      </Routes>
    </BrowserRouter>
  )
}
