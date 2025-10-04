import { BehaviorSubject } from 'rxjs'
import { useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import type { Movie, ClassificacaoIndicativa } from '../types/movie'
import * as movieService from '../services/movies.service'

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

export function useMovieStore() {
  const { token } = useAuth()

  useEffect(() => {
    movieService.setGetToken(() => token)
  }, [token])

  const moviesSubject = new BehaviorSubject<Movie[]>([])
  const totalSubject = new BehaviorSubject<number>(0)
  const loadingSubject = new BehaviorSubject<boolean>(false)

  let filters: MovieFilters = { take: 10, skip: 0 }

  const fetchMovies = async () => {
    if (loadingSubject.value) return
    loadingSubject.next(true)
    try {
      const data = await movieService.getMovies(filters)
      moviesSubject.next(data.movies)
      totalSubject.next(data.total)
    } catch (err) {
      console.error('Erro ao buscar filmes:', err)
    } finally {
      loadingSubject.next(false)
    }
  }

  const setFilters = (newFilters: MovieFilters) => {
    filters = { ...filters, ...newFilters }
    fetchMovies()
  }

  const setPage = (page: number) => {
    const take = filters.take ?? 10
    filters.skip = (page - 1) * take
    fetchMovies()
  }

  const addMovie = async (movie: Movie) => {
    const newMovie = await movieService.createMovie(movie)
    await fetchMovies()
    return newMovie
  }

  const updateMovie = async (id: string, movie: Partial<Movie>) => {
    const updated = await movieService.updateMovie(id, movie as Movie)
    await fetchMovies()
    return updated
  }

  const deleteMovie = async (id: string) => {
    await movieService.deleteMovie(id)
    await fetchMovies()
  }

  return {
    movies$: moviesSubject.asObservable(),
    total$: totalSubject.asObservable(),
    loading$: loadingSubject.asObservable(),
    fetchMovies,
    setFilters,
    setPage,
    addMovie,
    updateMovie,
    deleteMovie,
  }
}
