import { BehaviorSubject } from 'rxjs'
import type { Movie, ClassificacaoIndicativa } from '../types/movie'
import { getMovies, createMovie, updateMovie, deleteMovie } from './../services/movies.service'

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
  private loading = false

  setFilters(filters: MovieFilters) {
    this.filters = { ...this.filters, ...filters }
    this.fetchMovies()
  }

  setPage(page: number) {
    const take = this.filters.take ?? 10
    this.filters.skip = (page - 1) * take
    this.fetchMovies()
  }

  async fetchMovies() {
    if (this.loading) return
    this.loading = true
    try {
      const data = await getMovies(this.filters)
      this.moviesSubject.next(data.movies)
      this.totalSubject.next(data.total)
    } catch (err) {
      console.error('Erro ao buscar filmes:', err)
    } finally {
      this.loading = false
    }
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

  getFilters() {
    return { ...this.filters }
  }
}

export const movieStore = new MovieStore()
