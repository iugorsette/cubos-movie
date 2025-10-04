import { useEffect, useState } from 'react'
import { Flex } from '@radix-ui/themes'
import MyInput from '../../components/Input'
import MyButton from '../../components/Button'
import { MagnifyingGlassIcon } from '@radix-ui/react-icons'
import MovieList from '../../components/MovieList'
import MovieModal from '../../components/MovieModal'
import FilterModal from '../../components/FilterModal'
import { BehaviorSubject, debounceTime, distinctUntilChanged } from 'rxjs'
import { useMovieStore } from '../../stores/movie.store'

const searchSubject = new BehaviorSubject<string>('')

export default function Filmes() {
  const movieStore = useMovieStore()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [token] = useState(localStorage.getItem('token') || '')

  function handleAddMovie() {
    setModalOpen(true)
  }

  useEffect(() => {
    const sub = searchSubject
      .pipe(debounceTime(400), distinctUntilChanged())
      .subscribe((value) => {
        movieStore.setFilters({
          take: 10,
          skip: 0,
          search: value.trim() || undefined,
        })
      })

    return () => sub.unsubscribe()
  }, [])

  return (
    <Flex direction='column' style={{ padding: '24px', gap: '24px' }}>
      <Flex
        align='center'
        justify='end'
        gap='3'
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
        }}>
        <Flex style={{ flex: 1, minWidth: 200, maxWidth: 500 }}>
          <MyInput
            placeholder='Pesquise por filmes...'
            value={search}
            onChange={(e) => {
              setSearch(e.target.value)
              searchSubject.next(e.target.value)
            }}
            icon={<MagnifyingGlassIcon />}
          />
        </Flex>

        <Flex gap='2' style={{ flexWrap: 'wrap', marginTop: 8 }}>
          <MyButton
            colorVariant='secondary'
            onClick={() => setFiltersOpen(true)}>
            Filtros
          </MyButton>

          {filtersOpen && (
            <FilterModal
              isOpen={filtersOpen}
              onClose={() => setFiltersOpen(false)}
            />
          )}

          <MyButton colorVariant='primary' onClick={handleAddMovie}>
            Adicionar Filme
          </MyButton>
        </Flex>
      </Flex>

      <MovieList />

      <MovieModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        token={token}
        onSaved={() => setModalOpen(false)}
      />
    </Flex>
  )
}
