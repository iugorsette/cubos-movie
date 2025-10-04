import { BehaviorSubject } from 'rxjs'
import type { Movie, ClassificacaoIndicativa } from '../types/movie'
import {
  createMovie,
  deleteMovie,
  getMovies,
  updateMovie,
} from '../services/movies.service'

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

  private filters: MovieFilters = { take: 10, skip: 0 }

  clearFilters() {
    this.filters = { take: 10, skip: 0 }
    this.fetchMovies()
  }
  setFilters(filters: MovieFilters) {
    this.filters = { ...this.filters, ...filters }
    this.fetchMovies()
  }

  async fetchMovies() {
    const data = await getMovies(this.filters)
    this.moviesSubject.next(data.movies)
    this.totalSubject.next(data.total)
  }

  async addMovie(movie: Movie) {
    const newMovie = await createMovie(movie)
    await this.fetchMovies()
    return newMovie
  }

  async updateMovie(id: string, movie: Partial<Movie>) {
    const updated = await updateMovie(id, movie as Movie)
    await this.fetchMovies()
    return updated
  }

  async deleteMovie(id: string) {
    await deleteMovie(id)
    await this.fetchMovies()
  }

  setPage(page: number) {
    this.filters.skip = (page - 1) * (this.filters.take ?? 10)
    this.fetchMovies()
  }

  getFilters() {
    return { ...this.filters }
  }
}

export const movieStore = new MovieStore()
