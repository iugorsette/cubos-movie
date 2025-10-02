import { useState } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import * as Select from '@radix-ui/react-select'
import * as Checkbox from '@radix-ui/react-checkbox'
import { Flex } from '@radix-ui/themes'
import MyButton from '../Button'
import {
  Cross2Icon,
  CheckIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@radix-ui/react-icons'
import { movieStore } from '../../services/movie.store'
import { useTheme } from '../../context/useTheme'
import MyInput from '../Input'

type FilterModalProps = {
  isOpen: boolean
  onClose: () => void
}

const allGenres = ['acao', 'superheroi', 'ficcao', 'comedia', 'drama']

export default function FilterModal({ isOpen, onClose }: FilterModalProps) {
  const { isDark } = useTheme()
  const themeClass = isDark ? 'dark' : 'light'

  const [selectedGenres, setSelectedGenres] = useState<string[]>([])
  const [sortBy, setSortBy] = useState<
    'titulo' | 'dataLancamento' | 'popularidade'
  >('titulo')
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')

  // Novos filtros obrigatórios
  const [duration, setDuration] = useState<{ min: number; max: number }>({
    min: 0,
    max: 300,
  })
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: '',
  })

  // Filtro extra sugerido
  const [minRating, setMinRating] = useState<number>(0)

  function toggleGenre(genre: string) {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    )
  }

  function applyFilters() {
    movieStore.setFilters({
      generos: selectedGenres,
      sortBy,
      order,
      duration,
      dateRange,
      minRating,
      skip: 0,
      take: 50,
    })
    onClose()
  }

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay
          style={{
            backgroundColor: 'rgba(0,0,0,0.5)',
            position: 'fixed',
            inset: 0,
          }}
        />

        <Dialog.Content
          style={{
            backgroundColor: isDark
              ? 'rgba(0,0,0,0.9)'
              : 'rgba(255,255,255,0.9)',
            padding: 24,
            width: '50vw',
            height: '55vh',
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: 12,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0px 10px 30px rgba(0,0,0,0.2)',
          }}>
          <Flex justify='between' align='center' mb='3'>
            <Dialog.Title style={{ fontSize: 20 }}>
              Filtros de Filmes
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                style={{
                  all: 'unset',
                  cursor: 'pointer',
                  borderRadius: '100%',
                  height: 25,
                  width: 25,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: isDark ? '#333' : '#ccc',
                  color: isDark ? '#f5f5f5' : '#111',
                }}
                aria-label='Close'>
                <Cross2Icon />
              </button>
            </Dialog.Close>
          </Flex>
          <Flex
            direction='row'
            wrap='wrap'
            style={{
              flex: 1,
              overflowY: 'auto',
              gap: 16,
              alignItems: 'flex-start', // alinha os itens ao topo
            }}>
            {/* Gêneros */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 12,
                width: '100%',
              }}>
              <strong style={{ width: '100%' }}>Gêneros:</strong>
              {allGenres.map((genre) => (
                <label
                  key={genre}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 14,
                    color: isDark ? '#f5f5f5' : '#111',
                    width: 'calc(33% - 8px)', // 3 por linha
                    minWidth: 80,
                  }}>
                  <Checkbox.Root
                    checked={selectedGenres.includes(genre)}
                    onCheckedChange={() => toggleGenre(genre)}
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 4,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      border: `1px solid ${isDark ? '#444' : '#ccc'}`,
                      backgroundColor: isDark ? '#222' : '#fff',
                      flexShrink: 0,
                    }}>
                    <Checkbox.Indicator>
                      <CheckIcon />
                    </Checkbox.Indicator>
                  </Checkbox.Root>
                  {genre}
                </label>
              ))}
            </div>

            {/* Duração */}
            <div
              style={{
                display: 'flex',
                gap: 12,
                flexWrap: 'wrap',
                width: '100%',
              }}>
              <strong style={{ width: '100%' }}>Duração (minutos):</strong>
              <MyInput
                type='number'
                label='Mín'
                width='48%'
                value={duration.min}
                onChange={(e) =>
                  setDuration({ ...duration, min: Number(e.target.value) })
                }
              />
              <MyInput
                type='number'
                label='Máx'
                width='48%'
                value={duration.max}
                onChange={(e) =>
                  setDuration({ ...duration, max: Number(e.target.value) })
                }
              />
            </div>

            {/* Data de lançamento */}
            <div
              style={{
                display: 'flex',
                gap: 12,
                flexWrap: 'wrap',
                width: '100%',
              }}>
              <strong style={{ width: '100%' }}>Data de lançamento:</strong>
              <MyInput
                type='date'
                width='48%'
                value={dateRange.start}
                onChange={(e) =>
                  setDateRange({ ...dateRange, start: e.target.value })
                }
              />
              <MyInput
                type='date'
                width='48%'
                value={dateRange.end}
                onChange={(e) =>
                  setDateRange({ ...dateRange, end: e.target.value })
                }
              />
            </div>

            {/* Filtro extra */}
            <div
              style={{
                display: 'flex',
                gap: 12,
                flexWrap: 'wrap',
                width: '100%',
              }}>
              <strong style={{ width: '100%' }}>Avaliação mínima:</strong>
              <MyInput
                type='number'
                min={0}
                max={10}
                step={0.1}
                width='100%'
                value={minRating}
                onChange={(e) => setMinRating(Number(e.target.value))}
              />
            </div>

            {/* Ordenar por */}
            <div
              style={{
                display: 'flex',
                gap: 12,
                flexWrap: 'wrap',
                width: '100%',
              }}>
              <strong style={{ width: '100%' }}>Ordenar por:</strong>
              <Select.Root
                value={sortBy}
                onValueChange={(val) => setSortBy(val as any)}>
                <Select.Trigger
                  style={{
                    height: 36,
                    fontSize: 14,
                    padding: '0 12px',
                    borderRadius: 6,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: isDark ? '#222' : '#fff',
                    color: isDark ? '#f5f5f5' : '#111',
                    border: `1px solid ${isDark ? '#444' : '#ccc'}`,
                    cursor: 'pointer',
                    width: '48%',
                  }}>
                  <Select.Value placeholder='Selecionar...' />
                  <Select.Icon>
                    <ChevronDownIcon />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content
                    style={{
                      backgroundColor: isDark ? '#222' : '#fff',
                      borderRadius: 6,
                      border: `1px solid ${isDark ? '#444' : '#ccc'}`,
                    }}>
                    <Select.ScrollUpButton>
                      <ChevronUpIcon />
                    </Select.ScrollUpButton>
                    <Select.Viewport>
                      <Select.Item value='titulo'>
                        <Select.ItemText>Título</Select.ItemText>
                        <Select.ItemIndicator>
                          <CheckIcon />
                        </Select.ItemIndicator>
                      </Select.Item>
                      <Select.Item value='dataLancamento'>
                        <Select.ItemText>Data de Lançamento</Select.ItemText>
                        <Select.ItemIndicator>
                          <CheckIcon />
                        </Select.ItemIndicator>
                      </Select.Item>
                      <Select.Item value='popularidade'>
                        <Select.ItemText>Popularidade</Select.ItemText>
                        <Select.ItemIndicator>
                          <CheckIcon />
                        </Select.ItemIndicator>
                      </Select.Item>
                    </Select.Viewport>
                    <Select.ScrollDownButton>
                      <ChevronDownIcon />
                    </Select.ScrollDownButton>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>

              <Select.Root
                value={order}
                onValueChange={(val) => setOrder(val as any)}>
                <Select.Trigger
                  style={{
                    height: 36,
                    fontSize: 14,
                    padding: '0 12px',
                    borderRadius: 6,
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: isDark ? '#222' : '#fff',
                    color: isDark ? '#f5f5f5' : '#111',
                    border: `1px solid ${isDark ? '#444' : '#ccc'}`,
                    cursor: 'pointer',
                    width: '48%',
                  }}>
                  <Select.Value placeholder='Selecionar...' />
                  <Select.Icon>
                    <ChevronDownIcon />
                  </Select.Icon>
                </Select.Trigger>
                <Select.Portal>
                  <Select.Content
                    style={{
                      backgroundColor: isDark ? '#222' : '#fff',
                      borderRadius: 6,
                      border: `1px solid ${isDark ? '#444' : '#ccc'}`,
                    }}>
                    <Select.Viewport>
                      <Select.Item value='asc'>
                        <Select.ItemText>Ascendente</Select.ItemText>
                        <Select.ItemIndicator>
                          <CheckIcon />
                        </Select.ItemIndicator>
                      </Select.Item>
                      <Select.Item value='desc'>
                        <Select.ItemText>Descendente</Select.ItemText>
                        <Select.ItemIndicator>
                          <CheckIcon />
                        </Select.ItemIndicator>
                      </Select.Item>
                    </Select.Viewport>
                  </Select.Content>
                </Select.Portal>
              </Select.Root>
            </div>
          </Flex>

          {/* Footer */}
          <Flex justify='end' gap='2' mt='3'>
            <Dialog.Close asChild>
              <MyButton variant='secondary'>Cancelar</MyButton>
            </Dialog.Close>
            <MyButton variant='primary' onClick={applyFilters}>
              Aplicar
            </MyButton>
          </Flex>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
