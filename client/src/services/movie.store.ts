import { BehaviorSubject } from 'rxjs'
import type { Movie } from '../types/movie'
import {
  createMovie,
  deleteMovie,
  getMovies,
  updateMovie,
} from './movies.service'

type MovieFilters = {
  search?: string
  generos?: string[]
  classificacoes?: string[]
  minDuration?: number
  maxDuration?: number
  startDate?: string
  endDate?: string
  sortBy?: 'titulo' | 'dataLancamento' | 'popularidade'
  order?: 'asc' | 'desc'
  skip?: number
  take?: number
}

class MovieStore {
  private moviesSubject = new BehaviorSubject<Movie[]>([])
  public movies$ = this.moviesSubject.asObservable()

  private filters: MovieFilters = { take: 5, skip: 0 }

  setFilters(filters: MovieFilters) {
    this.filters = { ...this.filters, ...filters, skip: 0 }
    this.fetchMovies()
  }

  async fetchMovies() {
    const data = await getMovies(this.filters)
    this.moviesSubject.next(data.movies)
  }

  async addMovie(movie: Movie, token: string) {
    const res = await createMovie(movie, token)
    await this.fetchMovies()
    return res
  }

  async updateMovie(id: string, movie: Movie, token: string) {
    const res = await updateMovie(id, movie, token)
    await this.fetchMovies()
    return res
  }

  async deleteMovie(id: string, token: string) {
    await deleteMovie(id, token)
    await this.fetchMovies()
  }
}

export const movieStore = new MovieStore()
