import { BehaviorSubject } from 'rxjs'
import type { Movie } from '../types/movie'
import { getMovies } from './movies.service'

type MovieFilters = {
  search?: string
  generos?: string[]
  duration?: { min: number; max: number }
  dateRange?: { start: string; end: string }
  minRating?: number
  sortBy?: 'titulo' | 'dataLancamento' | 'popularidade'
  order?: 'asc' | 'desc'
  skip?: number
  take?: number
}
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

class MovieStore {
  private moviesSubject = new BehaviorSubject<Movie[]>([])
  public movies$ = this.moviesSubject.asObservable()

  private filters: MovieFilters = { take: 50, skip: 0 }

  setFilters(filters: MovieFilters) {
    this.filters = { ...this.filters, ...filters }
    this.fetchMovies()
  }

  async fetchMovies() {
    const data = await getMovies(this.filters)
    this.moviesSubject.next(data)
  }

  async addMovie(movie: Movie, token: string) {
    const res = await fetch(`${API_URL}/movies`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(movie),
    })
    const newMovie = await res.json()
    await this.fetchMovies()
    return newMovie
  }

  async updateMovie(id: string, movie: Partial<Movie>, token: string) {
    const res = await fetch(`${API_URL}/movies/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(movie),
    })
    const updated = await res.json()
    await this.fetchMovies()
    return updated
  }

  async deleteMovie(id: string, token: string) {
    await fetch(`${API_URL}/movies/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    })
    await this.fetchMovies()
  }
}

export const movieStore = new MovieStore()
