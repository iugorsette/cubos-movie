import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import * as Select from '@radix-ui/react-select'
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
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { useSearchParams } from 'react-router-dom'

type FilterModalProps = {
  isOpen: boolean
  onClose: () => void
}

export default function FilterModal({ isOpen, onClose }: FilterModalProps) {
  const { isDark } = useTheme()
  const [searchParams, setSearchParams] = useSearchParams()

  const [sortBy, setSortBy] = useState<
    'titulo' | 'dataLancamento' | 'popularidade'
  >('titulo')
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')
  const [duration, setDuration] = useState<{ min: number; max: number }>({
    min: 0,
    max: 300,
  })
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: '',
    end: '',
  })

  // Inicializa filtros a partir da URL
  useEffect(() => {
    const minDuration = searchParams.get('minDuration')
    const maxDuration = searchParams.get('maxDuration')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const sortByParam = searchParams.get('sortBy') as
      | 'titulo'
      | 'dataLancamento'
      | 'popularidade'
    const orderParam = searchParams.get('order') as 'asc' | 'desc'

    if (minDuration && maxDuration) {
      setDuration({ min: Number(minDuration), max: Number(maxDuration) })
    }

    if (startDate && endDate) {
      setDateRange({ start: startDate, end: endDate })
    }

    if (sortByParam) setSortBy(sortByParam)
    if (orderParam) setOrder(orderParam)

    // Aplica filtros na primeira consulta
    movieStore.setFilters({
      sortBy: sortByParam || 'titulo',
      order: orderParam || 'asc',
      skip: 0,
      take: 5,
      minDuration: minDuration ? Number(minDuration) : 0,
      maxDuration: maxDuration ? Number(maxDuration) : 300,
      startDate: startDate || '',
      endDate: endDate || '',
    })
  }, [])

  function applyFilters() {
    const filters = {
      sortBy,
      order,
      skip: 0,
      take: 5,
      minDuration: duration.min.toString(),
      maxDuration: duration.max.toString(),
      startDate: dateRange.start,
      endDate: dateRange.end,
    }

    // Atualiza a store e a URL
    movieStore.setFilters(filters)
    setSearchParams(filters)

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
            direction='column'
            style={{
              flex: 1,
              overflowY: 'auto',
              gap: 24,
            }}>
            {/* Duração */}
            <div style={{ width: '90%' }}>
              <strong style={{ display: 'block', marginBottom: 8 }}>
                Duração (minutos):
              </strong>
              <Slider
                style={{ margin: '12px' }}
                range
                min={0}
                max={300}
                step={10}
                value={[duration.min, duration.max]}
                onChange={(val) =>
                  setDuration({ min: val[0] as number, max: val[1] as number })
                }
              />
              <Flex justify='between' style={{ marginTop: 8 }}>
                <span>{duration.min} min</span>
                <span>{duration.max} min</span>
              </Flex>
            </div>

            {/* Data de lançamento */}
            <div style={{ width: '100%' }}>
              <strong style={{ display: 'block', marginBottom: 8 }}>
                Data de lançamento:
              </strong>
              <Flex gap='3' wrap='wrap'>
                <MyInput
                  type='date'
                  width='48%'
                  label='De'
                  value={dateRange.start}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, start: e.target.value })
                  }
                />
                <MyInput
                  type='date'
                  width='48%'
                  label='Até'
                  value={dateRange.end}
                  onChange={(e) =>
                    setDateRange({ ...dateRange, end: e.target.value })
                  }
                />
              </Flex>
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
          <Flex
            justify='end'
            style={{
              gap: 8,
            }}
            mt='3'>
            <MyButton
              colorVariant='secondary'
              onClick={() => {
                setSortBy('titulo')
                setOrder('asc')
                setDuration({ min: 0, max: 300 })
                setDateRange({ start: '', end: '' })
                movieStore.setFilters({
                  sortBy: 'titulo',
                  order: 'asc',
                  skip: 0,
                  take: 5,
                  minDuration: 0,
                  maxDuration: 300,
                  startDate: '',
                  endDate: '',
                })
                setSearchParams({})
                onClose()
              }}>
              Limpar filtros
            </MyButton>
            <Dialog.Close asChild>
              <MyButton colorVariant='secondary'>Cancelar</MyButton>
            </Dialog.Close>
            <MyButton colorVariant='primary' onClick={applyFilters}>
              Aplicar
            </MyButton>
          </Flex>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
