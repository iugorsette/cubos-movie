import { useState, useEffect } from 'react'
import { Flex, Button } from '@radix-ui/themes'
import MovieCard from '../Movie/MovieCard'
import MyButton from '../Button'
import type { Movie } from '../../types/movie'
import { useSearchParams } from 'react-router-dom'
import ListState from './ListState'
import { ChevronLeftIcon, ChevronRightIcon } from '@radix-ui/react-icons'
import { movieStore, type MovieFilters } from '../../stores/movie.store'

export default function MovieList() {
  const [movies, setMovies] = useState<Movie[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const perPage = 10

  const [searchParams, setSearchParams] = useSearchParams()
  const totalPages = Math.ceil(total / perPage)

  useEffect(() => {
    const params = Object.fromEntries([...searchParams])
    const pageParam = Number(params.page) || 1

    setPage(pageParam)

    const filters: MovieFilters = {
      take: perPage,
      skip: (pageParam - 1) * perPage,
      sortBy: params.sortBy as any,
      order: params.order as any,
      minDuration: params.minDuration ? Number(params.minDuration) : undefined,
      maxDuration: params.maxDuration ? Number(params.maxDuration) : undefined,
      startDate: params.startDate || undefined,
      endDate: params.endDate || undefined,
      classificacoesIndicativas: params.classificacoesIndicativas
        ? String(params.classificacoesIndicativas).split(',')
        : undefined,
      minPopularity: params.minPopularity
        ? Number(params.minPopularity)
        : undefined,
      generos: params.generos ? String(params.generos).split(',') : undefined,
    }

    movieStore.setFilters(filters)
  }, [])

  useEffect(() => {
    const subMovies = movieStore.movies$.subscribe(setMovies)
    const subTotal = movieStore.total$.subscribe(setTotal)
    return () => {
      subMovies.unsubscribe()
      subTotal.unsubscribe()
    }
  }, [])

  const goToPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return
    setPage(newPage)
    setSearchParams({
      ...Object.fromEntries([...searchParams]),
      page: newPage.toString(),
    })
    movieStore.setPage(newPage)
  }

  const getPageButtons = () => {
    const buttons: (number | string)[] = []
    const maxButtons = window.innerWidth <= 480 ? 2 : 5
    const startPage = Math.max(1, page - 2)
    const endPage = Math.min(totalPages, startPage + maxButtons - 1)

    if (startPage > 1) buttons.push(1, '...')
    for (let i = startPage; i <= endPage; i++) buttons.push(i)
    if (endPage < totalPages) buttons.push('...', totalPages)

    return buttons
  }

  return (
    <div>
      <Flex
        style={{
          backgroundColor: 'rgba(235, 234, 248, 0.08)',
          padding: 24,
          minHeight: '75vh',
        }}
        wrap='wrap'
        gap='4'
        justify='center'>
        <ListState loading={loading} emptyMessage='Nenhum filme encontrado'>
          {movies.map((movie) => (
            <MovieCard
              key={movie.id}
              title={movie.titulo}
              generos={movie.generos}
              popularidade={movie.popularidade}
              id={movie.id as string}
              cover={movie.capaUrl}
            />
          ))}
        </ListState>
      </Flex>

      {totalPages > 1 && (
        <Flex justify='center' gap='2' mt='4' wrap='wrap'>
          <Button
            disabled={page === 1}
            onClick={() => goToPage(page - 1)}
            variant='outline'>
            <ChevronLeftIcon />
          </Button>

          {getPageButtons().map((p, i) =>
            typeof p === 'number' ? (
              <MyButton
                key={i}
                colorVariant={p === page ? 'primary' : 'secondary'}
                onClick={() => goToPage(p)}>
                {p}
              </MyButton>
            ) : (
              <span key={i} style={{ padding: '0 6px', alignSelf: 'center' }}>
                {p}
              </span>
            )
          )}

          <Button
            disabled={page === totalPages}
            onClick={() => goToPage(page + 1)}
            variant='outline'>
            <ChevronRightIcon />
          </Button>
        </Flex>
      )}
    </div>
  )
}
