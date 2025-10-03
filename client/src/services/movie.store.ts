import { BehaviorSubject } from 'rxjs'
import type { Movie, ClassificacaoIndicativa } from '../types/movie'
import {
  getMovies,
  createMovie,
  updateMovie,
  deleteMovie,
} from './movies.service'

type MovieFilters = {
  search?: string
  generos?: string[]
  classificacoesIndicativas?: ClassificacaoIndicativa[]
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

  private totalSubject = new BehaviorSubject<number>(0)
  public total$ = this.totalSubject.asObservable()

  private filters: MovieFilters = { take: 5, skip: 0 }

  setFilters(filters: MovieFilters) {
    this.filters = { ...this.filters, ...filters, skip: 0 } // reset page ao mudar filtro
    this.fetchMovies()
  }

  async fetchMovies() {
    const data = await getMovies(this.filters)
    this.moviesSubject.next(data.movies)
    this.totalSubject.next(data.total)
  }

  async addMovie(movie: Movie, token: string) {
    const newMovie = await createMovie(movie, token)
    await this.fetchMovies()
    return newMovie
  }

  async updateMovie(id: string, movie: Partial<Movie>, token: string) {
    const updated = await updateMovie(id, movie, token)
    await this.fetchMovies()
    return updated
  }

  async deleteMovie(id: string, token: string) {
    await deleteMovie(id, token)
    await this.fetchMovies()
  }

  setPage(page: number) {
    this.filters.skip = (page - 1) * (this.filters.take ?? 5)
    this.fetchMovies()
  }
}

export const movieStore = new MovieStore()
