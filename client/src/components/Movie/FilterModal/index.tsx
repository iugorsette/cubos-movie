import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import * as Checkbox from '@radix-ui/react-checkbox'
import { Flex } from '@radix-ui/themes'
import MyButton from '../../Button'
import { Cross2Icon, CheckIcon } from '@radix-ui/react-icons'
import { useTheme } from '../../../hooks/useTheme'
import MyInput from '../../Input'
import Slider from 'rc-slider'
import 'rc-slider/assets/index.css'
import { useSearchParams } from 'react-router-dom'
import './index.css'
import type { ClassificacaoIndicativa } from '../../../types/movie'
import { movieStore } from '../../../stores/movie.store'
import MySelect from '../../Select'
import GenerosField from '../GeneroFields'
type FilterModalProps = {
  isOpen: boolean
  onClose: () => void
}

type SortBy = 'titulo' | 'dataLancamento' | 'popularidade'
type SortOrder = 'asc' | 'desc'

const classificacoesIndicativas: {
  value: ClassificacaoIndicativa
  label: string
}[] = [
  { value: 'LIVRE', label: 'Livre' },
  { value: 'DEZ', label: '10 anos' },
  { value: 'DOZE', label: '12 anos' },
  { value: 'CATORZE', label: '14 anos' },
  { value: 'DEZESSEIS', label: '16 anos' },
  { value: 'DEZOITO', label: '18 anos' },
]

export default function FilterModal({ isOpen, onClose }: FilterModalProps) {
  const { isDark } = useTheme()
  const [classificacoes, setClassificacoes] = useState<
    ClassificacaoIndicativa[]
  >([])
  const [sortBy, setSortBy] = useState<SortBy>('titulo')
  const [order, setOrder] = useState<SortOrder>('asc')
  const [duration, setDuration] = useState({ min: 0, max: 300 })
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [searchParams, setSearchParams] = useSearchParams()
  const [generos, setGeneros] = useState<string[]>([])
  const SLIDER_MIN = 0
  const SLIDER_MAX = 300
  const [minPopularity, setMinPopularity] = useState(0)
  const POPULARITY_MAX = 100

  function formatDurationLabel(minutes: number) {
    if (minutes === null || minutes === undefined || isNaN(minutes)) return '-'
    const m = Math.max(0, Math.floor(minutes))
    if (m < 60) return `${m} min`
    const h = Math.floor(m / 60)
    const rem = m % 60
    return rem > 0 ? `${h}h ${rem}min` : `${h}h`
  }

  function toggleClassificacao(value: ClassificacaoIndicativa) {
    setClassificacoes((prev) =>
      prev.includes(value) ? prev.filter((c) => c !== value) : [...prev, value]
    )
  }
  useEffect(() => {
    if (isOpen) {
      const params = Object.fromEntries([...searchParams])

      setSortBy((params.sortBy as SortBy) || 'dataLancamento')
      setOrder((params.order as SortOrder) || 'desc')
      setDuration({
        min: params.minDuration ? Number(params.minDuration) : 0,
        max: params.maxDuration ? Number(params.maxDuration) : 300,
      })
      setDateRange({
        start: params.startDate || '',
        end: params.endDate || '',
      })
      setClassificacoes(
        params.classificacoesIndicativas
          ? Array.isArray(params.classificacoesIndicativas)
            ? params.classificacoesIndicativas.map(
                (v: string) => v as ClassificacaoIndicativa
              )
            : String(params.classificacoesIndicativas)
                .split(',')
                .map((v) => v as ClassificacaoIndicativa)
          : []
      )
      setGeneros(params.generos ? String(params.generos).split(',') : [])
      setMinPopularity(params.minPopularity ? Number(params.minPopularity) : 0)
    }
  }, [isOpen])
  function resetFilters() {
    setSortBy('dataLancamento')
    setOrder('desc')
    setDuration({ min: 0, max: 300 })
    setDateRange({ start: '', end: '' })
    setClassificacoes([])
    movieStore.clearFilters()
    setSearchParams({})
    onClose()
  }
  const DEFAULT_TAKE = 10

  function applyFilters() {
    const filters = {
      sortBy,
      order,
      skip: 0,
      take: DEFAULT_TAKE,
      classificacoesIndicativas: classificacoes,
      minDuration: duration.min,
      maxDuration: duration.max,
      minPopularity,
      startDate: dateRange.start,
      endDate: dateRange.end,
      generos,
    }

    movieStore.setFilters(filters)

    const params: any = {
      sortBy,
      order,
      minDuration: duration.min,
      maxDuration: duration.max,
      startDate: dateRange.start,
      endDate: dateRange.end,
    }
    if (classificacoes.length > 0)
      params.classificacoesIndicativas = classificacoes.join(',')
    if (generos.length) params.generos = generos.join(',')
    if (minPopularity > 0) params.minPopularity = minPopularity
    setSearchParams(params)
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
              ? 'rgba(35, 34, 37, 1)'
              : 'rgba(255,255,255,0.9)',
            padding: '4px 24px',
            width: '50vw',
            height: '65vh',
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            borderRadius: 4,
            display: 'flex',
            flexDirection: 'column',
            boxShadow: '0px 10px 30px rgba(0,0,0,0.2)',
          }}
          className='filter-modal'>
          <Flex justify='between' align='center' mb='2'>
            <Dialog.Title style={{ fontSize: 20 }}>Filtros</Dialog.Title>
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
            <div style={{ width: '95%', margin: '0 auto' }}>
              <strong style={{ display: 'block', marginBottom: 8 }}>
                Duração (minutos):
              </strong>
              <div style={{ position: 'relative', padding: '12px 0' }}>
                <Slider
                  style={{ margin: '12px 0' }}
                  range
                  min={SLIDER_MIN}
                  max={SLIDER_MAX}
                  step={10}
                  value={[duration.min, duration.max]}
                  onChange={(val) =>
                    setDuration({
                      min: val[0] as number,
                      max: val[1] as number,
                    })
                  }
                  trackStyle={[
                    {
                      backgroundColor: isDark ? '#8457AA' : '#8E4EC6',
                      height: 8,
                    },
                  ]}
                  railStyle={{
                    backgroundColor: isDark ? '#444' : '#ccc',
                    height: 8,
                  }}
                  handleStyle={[
                    {
                      borderColor: isDark ? '#8457AA' : '#8E4EC6',
                      backgroundColor: 'white',
                      height: 20,
                      width: 20,
                    },
                    {
                      borderColor: isDark ? '#8457AA' : '#8E4EC6',
                      backgroundColor: 'white',
                      height: 20,
                      width: 20,
                    },
                  ]}
                />
              </div>

              <Flex justify='between' style={{ marginTop: 8 }}>
                <span>{formatDurationLabel(duration.min)}</span>
                <span>{formatDurationLabel(duration.max)}</span>
              </Flex>
            </div>

            <div style={{ width: '100%' }}>
              <strong style={{ display: 'block', marginBottom: 8 }}>
                Data de lançamento:
              </strong>
              <div
                style={{
                  display: 'flex',
                  gap: 12,
                  flexWrap: 'wrap',
                  width: '100%',
                }}>
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
              </div>
            </div>
            <GenerosField
              generos={generos}
              setGeneros={setGeneros}
              maxGeneros={10}
            />

            <div style={{ width: '95%', margin: '0 auto' }}>
              <strong style={{ display: 'block', marginBottom: 8 }}>
                Popularidade mínima:
              </strong>
              <Slider
                min={0}
                max={POPULARITY_MAX}
                step={1}
                value={minPopularity}
                onChange={(val) => setMinPopularity(val as number)}
                trackStyle={{
                  backgroundColor: isDark ? '#8457AA' : '#8E4EC6',
                  height: 8,
                }}
                handleStyle={{
                  borderColor: isDark ? '#8457AA' : '#8E4EC6',
                  backgroundColor: 'white',
                  height: 20,
                  width: 20,
                }}
                railStyle={{
                  backgroundColor: isDark ? '#444' : '#ccc',
                  height: 8,
                }}
              />
              <Flex justify='between' style={{ marginTop: 8 }}>
                <span>{minPopularity}</span>
              </Flex>
            </div>

            <div style={{ marginTop: 16 }}>
              <strong style={{ display: 'block', marginBottom: 8 }}>
                Classificação indicativa:
              </strong>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  gap: 12,
                  flexWrap: 'wrap',
                }}>
                {classificacoesIndicativas.map((item) => (
                  <label
                    key={item.value}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      cursor: 'pointer',
                      fontSize: 14,
                      color: isDark ? '#f5f5f5' : '#111',
                    }}>
                    <Checkbox.Root
                      checked={classificacoes.includes(item.value)}
                      onCheckedChange={() => toggleClassificacao(item.value)}
                      style={{
                        width: 18,
                        height: 18,
                        borderRadius: 4,
                        border: `1px solid ${isDark ? '#666' : '#aaa'}`,
                        backgroundColor: classificacoes.includes(item.value)
                          ? isDark
                            ? '#8457AA'
                            : '#8E4EC6'
                          : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}>
                      <Checkbox.Indicator>
                        <CheckIcon style={{ color: '#fff' }} />
                      </Checkbox.Indicator>
                    </Checkbox.Root>
                    {item.label}
                  </label>
                ))}
              </div>
            </div>

            <div
              style={{
                display: 'flex',
                gap: 12,
                flexWrap: 'wrap',
                width: '100%',
              }}>
              <strong style={{ width: '100%' }}>Ordenar por:</strong>
              <MySelect
                label='Ordenar por'
                value={sortBy}
                onChange={(val) => setSortBy(val as SortBy)}
                options={[
                  { value: 'titulo', label: 'Título' },
                  { value: 'dataLancamento', label: 'Data de Lançamento' },
                  { value: 'popularidade', label: 'Popularidade' },
                ]}
                width='48%'
              />

              <MySelect
                label='Ordem'
                value={order}
                onChange={(val) => setOrder(val as SortOrder)}
                options={[
                  { value: 'asc', label: 'Ascendente' },
                  { value: 'desc', label: 'Descendente' },
                ]}
                width='48%'
              />
            </div>
          </Flex>

          <Flex
            justify='end'
            style={{
              gap: 8,
            }}
            mt='3'>
            <MyButton colorVariant='secondary' onClick={resetFilters}>
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
