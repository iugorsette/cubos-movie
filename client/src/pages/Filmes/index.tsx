import { useEffect, useState } from 'react'
import { Flex } from '@radix-ui/themes'
import MyInput from '../../components/Input'
import MyButton from '../../components/Button'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import MovieList from '../../components/MovieList'
import MovieModal from '../../components/MovieModal'
import { getMovies } from '../../services/movies.service'
import type { Movie } from '../../types/movie'

export default function Filmes() {
  const [search, setSearch] = useState('')
  const [movies, setMovies] = useState<Movie[]>([])
  const [modalOpen, setModalOpen] = useState(false)
  const [token] = useState(localStorage.getItem('token') || '')

  // carregar filmes
  useEffect(() => {
    async function fetchMovies() {
      const data = await getMovies({ search, take: 50, skip: 0 })
      setMovies(data)
    }
    fetchMovies()
  }, [search])

  function handleOpenFilters() {
    console.log('Abrir modal de filtros')
  }

  function handleAddMovie() {
    setModalOpen(true)
  }

  return (
    <Flex direction='column' style={{ padding: '24px', gap: '24px' }}>
      <Flex align='center' justify='between' gap='3'>
        <MyInput
          style={{ maxWidth: '300px' }}
          placeholder='Pesquisar filmes...'
          value={search}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          icon={<MagnifyingGlassIcon />}
        />

        <Flex gap='2' ml='4' style={{ padding: '0 36px'}}>
          <MyButton variant='secondary' onClick={handleOpenFilters}>
            Filtros
          </MyButton>
          <MyButton variant='primary' onClick={handleAddMovie}>
            Adicionar Filme
          </MyButton>
        </Flex>
      </Flex>

      {/* Lista de filmes */}
      <MovieList movies={movies} perPage={6} />

      {/* Modal de adicionar/editar filme */}
      <MovieModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        token={token}
        onSaved={() => {
          setModalOpen(false)
          // Recarrega filmes após salvar
          getMovies({ search, take: 50, skip: 0 }).then(setMovies)
        }}
      />
    </Flex>
  )
}
