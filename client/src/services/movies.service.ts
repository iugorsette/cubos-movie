import type { Movie, ClassificacaoIndicativa } from '../types/movie'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'
const apiEndpoint = `${API_URL}/movies`

let getToken: (() => string | null) | null = null
export function setGetToken(fn: () => string | null) {
  getToken = fn
}

function getAuthHeaders(isFormData = false): HeadersInit {
  const token = getToken?.()
  if (!token) throw new Error('Usuário não autenticado')
  return isFormData
    ? { Authorization: `Bearer ${token}` }
    : { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }
}

export async function createMovie(movie: Movie | FormData) {
  const body = movie instanceof FormData ? movie : JSON.stringify(movie)
  const headers = getAuthHeaders(movie instanceof FormData)
  const res = await fetch(apiEndpoint, { method: 'POST', headers, body })
  return res.json()
}

export async function updateMovie(id: string, movie: Movie | FormData) {
  const body = movie instanceof FormData ? movie : JSON.stringify(movie)
  const headers = getAuthHeaders(movie instanceof FormData)
  const res = await fetch(`${apiEndpoint}/${id}`, {
    method: 'PATCH',
    headers,
    body,
  })
  return res.json()
}

export async function deleteMovie(id: string) {
  const headers = getAuthHeaders()
  const res = await fetch(`${apiEndpoint}/${id}`, { method: 'DELETE', headers })
  return res.json()
}

export async function getMovieById(id: string): Promise<Movie> {
  const headers = getAuthHeaders()
  const res = await fetch(`${apiEndpoint}/${id}`, { method: 'GET', headers })
  return res.json()
}

export async function getMovies(params: {
  skip?: number
  take?: number
  search?: string
  generos?: string[]
  classificacoesIndicativas?: ClassificacaoIndicativa[]
  minDuration?: number
  maxDuration?: number
  startDate?: string
  endDate?: string
  sortBy?: 'titulo' | 'dataLancamento' | 'popularidade'
  order?: 'asc' | 'desc'
}): Promise<{ movies: Movie[]; total: number }> {
  const headers = getAuthHeaders()
  const query = new URLSearchParams()
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined) {
      query.append(key, Array.isArray(value) ? value.join(',') : String(value))
    }
  })
  const res = await fetch(`${apiEndpoint}?${query.toString()}`, {
    method: 'GET',
    headers,
  })
  return res.json()
}
