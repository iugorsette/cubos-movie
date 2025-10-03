import { useSearchParams } from 'react-router-dom'
import { Flex, Button } from '@radix-ui/themes'
import MovieCard from '../MovieCard'
import MyButton from '../Button'
import type { Movie } from '../../types/movie'

type MovieListProps = {
  movies: Movie[]
  perPage?: number
}

export default function MovieList({ movies, perPage = 6 }: MovieListProps) {
  const [searchParams, setSearchParams] = useSearchParams()
  const pageParam = parseInt(searchParams.get('page') ?? '1', 10)
  const totalPages = Math.ceil(movies.length / perPage)

  const start = (pageParam - 1) * perPage
  const currentMovies = movies.slice(start, start + perPage)

  const goToPage = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return
    setSearchParams({ page: String(newPage) })
  }

  return (
    <div>
      <Flex wrap='wrap' gap='3' justify='start'>
        {currentMovies.map((movie) => (
          <MovieCard
            key={movie.id}
            title={movie.titulo}
            generos={movie.generos}
            popularidade={movie.popularidade}
            id={movie.id as string}
            cover={movie.capaUrl}
          />
        ))}
      </Flex>

      <Flex justify='center' gap='2' mt='4'>
        <Button
          disabled={pageParam === 1}
          onClick={() => goToPage(pageParam - 1)}
          variant='outline'>
          Anterior
        </Button>

        {Array.from({ length: totalPages }, (_, i) => (
          <MyButton
            key={i}
            variant={i + 1 === pageParam ? 'primary' : 'secondary'}
            onClick={() => goToPage(i + 1)}>
            {i + 1}
          </MyButton>
        ))}

        <Button
          disabled={pageParam === totalPages}
          onClick={() => goToPage(pageParam + 1)}
          variant='outline'>
          Próxima
        </Button>
      </Flex>
    </div>
  )
}
