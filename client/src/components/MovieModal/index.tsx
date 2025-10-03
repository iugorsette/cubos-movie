import { useState, useEffect, useRef } from 'react'
import { CheckIcon, ChevronDownIcon } from '@radix-ui/react-icons'
import * as Select from '@radix-ui/react-select'
import * as Dialog from '@radix-ui/react-dialog'
import { Flex } from '@radix-ui/themes'
import MyInput from '../Input'
import MyButton from '../Button'
import { createMovie, updateMovie } from '../../services/movies.service'
import { useTheme } from '../../context/useTheme'
import { Cross2Icon, PlusIcon } from '@radix-ui/react-icons'
import { CLASSIFICACAO_INDICATIVA, type MovieFormData } from '../../types/movie'

type MovieModalProps = {
  isOpen: boolean
  onClose: () => void
  initialData?: MovieFormData
  token: string
  onSaved: () => void
}

export default function MovieModal({
  isOpen,
  onClose,
  initialData,
  token,
  onSaved,
}: MovieModalProps) {
  const { isDark } = useTheme()
  const [form, setForm] = useState<MovieFormData>({
    titulo: '',
    tituloOriginal: '',
    sinopse: '',
    dataLancamento: '',
    duracao: '',
    generos: [],
    popularidade: 0,
    votos: 0,
    idioma: '',
    orcamento: 0,
    receita: 0,
    lucro: 0,
    capaUrl: '',
    capaFundo: '',
    trailerUrl: '',
    classificacaoIndicativa: CLASSIFICACAO_INDICATIVA[0],
    ...initialData,
  })

  const [capaFile, setCapaFile] = useState<File | undefined>()
  const [capaFundoFile, setCapaFundoFile] = useState<File | undefined>()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [capaPreview, setCapaPreview] = useState<string | null>(
    initialData?.capaUrl || null
  )
  const [capaFundoPreview, setCapaFundoPreview] = useState<string | null>(
    initialData?.capaFundo || null
  )
  const [generos, setGeneros] = useState<string[]>(form.generos || [])
  const [newGenero, setNewGenero] = useState('')

  function addGenero() {
    const g = newGenero.trim()
    if (!g) return
    if (generos.includes(g)) return
    if (generos.length >= 10) return
    setGeneros([...generos, g])
    setNewGenero('')
  }
  function removeGenero(g: string) {
    setGeneros(generos.filter((x) => x !== g))
  }

  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (initialData) {
      const formattedData = initialData.dataLancamento
        ? new Date(initialData.dataLancamento).toISOString().split('T')[0]
        : ''
      setForm({
        ...initialData,
        dataLancamento: formattedData,
      })
      setCapaPreview(initialData.capaUrl || null)
      setCapaFundoPreview(initialData.capaFundo || null)
    }
  }, [initialData])

  function handleChange<K extends keyof MovieFormData>(
    field: K,
    value: MovieFormData[K]
  ) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      form.generos = generos
      const formData = new FormData()
      Object.entries(form).forEach(([key, value]) => {
        if (value === undefined || value === null) return
        if (Array.isArray(value)) {
          value.forEach((v) => formData.append(key, v))
        } else {
          formData.append(key, String(value))
        }
      })
      if (capaFile) formData.append('capaFile', capaFile)
      if (capaFundoFile) formData.append('capaFundoFile', capaFundoFile)

      if (initialData?.id) {
        await updateMovie(initialData.id, formData, token)
      } else {
        await createMovie(formData, token)
      }

      onSaved()
      onClose()
    } catch (err: any) {
      setError(err.message || 'Erro ao salvar filme')
    } finally {
      setLoading(false)
    }
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
            background: isDark ? 'black' : 'white',
            padding: '0 24px ',
            height: '100vh',
            width: '40%',
            position: 'fixed',
            top: 0,
            right: 0,
            boxShadow: '0px 10px 30px rgba(0,0,0,0.2)',
            transition: 'all 0.3s ease-in-out',
          }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}>
            <Dialog.Title style={{ fontSize: 20 }}>
              {initialData?.id ? 'Editar Filme' : 'Adicionar Filme'}
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                style={{
                  all: 'unset',
                  fontFamily: 'inherit',
                  borderRadius: '100%',
                  height: 25,
                  width: 25,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--violet-11)',
                  backgroundColor: 'var(--gray-3)',
                }}
                aria-label='Close'>
                <Cross2Icon />
              </button>
            </Dialog.Close>
          </div>

          <div
            style={{
              flex: 1,
              height: 'calc(100% - 130px)',
              overflowY: 'auto',
              marginTop: 16,
            }}>
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {capaPreview && (
                <img
                  src={capaPreview}
                  alt='Preview da capa'
                  style={{
                    width: 150,
                    height: 'auto',
                    marginTop: 8,
                    borderRadius: 4,
                  }}
                />
              )}
              <MyInput
                label='Capa do Filme'
                type='file'
                onFileChange={(file) => {
                  setCapaFile(file)
                  if (file) setCapaPreview(URL.createObjectURL(file))
                }}
              />
              {capaFundoPreview && (
                <img
                  src={capaFundoPreview}
                  alt='Preview da capa de fundo'
                  style={{
                    width: '100%',
                    maxHeight: 180,
                    marginTop: 8,
                    borderRadius: 4,
                  }}
                />
              )}
              <MyInput
                label='Capa de Fundo'
                type='file'
                onFileChange={(file) => {
                  setCapaFundoFile(file)
                  if (file) setCapaFundoPreview(URL.createObjectURL(file))
                }}
              />

              <Flex
                direction='row'
                justify='between'
                wrap='wrap'
                style={{ gap: 5, marginTop: 10 }}>
                <MyInput
                  label='Título'
                  value={form.titulo}
                  onChange={(e) => handleChange('titulo', e.target.value)}
                  required
                />
                <MyInput
                  label='Título Original'
                  value={form.tituloOriginal}
                  onChange={(e) =>
                    handleChange('tituloOriginal', e.target.value)
                  }
                />
                <MyInput
                  label='Sinopse'
                  value={form.sinopse}
                  onChange={(e) => handleChange('sinopse', e.target.value)}
                />
                <MyInput
                  label='Data de Lançamento'
                  width='48%'
                  type='date'
                  value={form.dataLancamento}
                  onChange={(e) =>
                    handleChange('dataLancamento', e.target.value)
                  }
                />
                <MyInput
                  label='Duração'
                  width='48%'
                  value={form.duracao}
                  onChange={(e) => handleChange('duracao', e.target.value)}
                />
                <Select.Root
                  value={form.classificacaoIndicativa}
                  onValueChange={(value) =>
                    handleChange('classificacaoIndicativa', value)
                  }>
                  <Select.Trigger
                    aria-label='Classificação Indicativa'
                    style={{
                      all: 'unset',
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0 10px',
                      fontSize: 13,
                      lineHeight: 1,
                      height: 35,
                      backgroundColor: isDark ? '#222' : '#fff',
                      color: isDark ? '#fff' : '#000',
                      borderRadius: 4,
                      border: '1px solid #ccc',
                      width: '100%',
                    }}>
                    <Select.Value placeholder='Selecione...' />
                    <Select.Icon>
                      <ChevronDownIcon />
                    </Select.Icon>
                  </Select.Trigger>

                  <Select.Content
                    style={{
                      overflow: 'hidden',
                      backgroundColor: isDark ? '#333' : '#fff',
                      borderRadius: 6,
                      border: '1px solid #ccc',
                      zIndex: 1000,
                    }}>
                    <Select.Viewport>
                      {[
                        'LIVRE',
                        'DEZ',
                        'DOZE',
                        'CATORZE',
                        'DEZESSEIS',
                        'DEZOITO',
                      ].map((val) => (
                        <Select.Item
                          key={val}
                          value={val}
                          style={{
                            padding: '5px 10px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                          }}>
                          <Select.ItemText>
                            {
                              {
                                LIVRE: 'Livre',
                                DEZ: '10 anos',
                                DOZE: '12 anos',
                                CATORZE: '14 anos',
                                DEZESSEIS: '16 anos',
                                DEZOITO: '18 anos',
                              }[val]
                            }
                          </Select.ItemText>
                          <Select.ItemIndicator>
                            <CheckIcon />
                          </Select.ItemIndicator>
                        </Select.Item>
                      ))}
                    </Select.Viewport>
                  </Select.Content>
                </Select.Root>

                <div style={{ marginBottom: 12, width: '100%' }}>
                  <strong>Gêneros:</strong>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: 8,
                      marginTop: 4,
                    }}>
                    {generos.map((g) => (
                      <div
                        key={g}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          backgroundColor: isDark ? '#8457AA' : '#8E4EC6',
                          color: '#eee',
                          padding: '4px 12px',
                          fontSize: 15,
                        }}>
                        {g}
                        <button
                          type='button'
                          onClick={() => removeGenero(g)}
                          style={{
                            marginLeft: 4,
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            color: 'red',
                            fontWeight: 'bold',
                          }}>
                          ×
                        </button>
                      </div>
                    ))}
                    {generos.length < 10 && (
                      <div
                        style={{
                          display: 'flex',
                          gap: 4,
                          alignItems: 'center',
                        }}>
                        <MyInput
                          type='text'
                          value={newGenero}
                          onChange={(e) => setNewGenero(e.target.value)}
                          placeholder='Novo gênero'
                        />
                        <MyButton
                          type='button'
                          iconButton
                          icon={<PlusIcon />}
                          onClick={addGenero}></MyButton>
                      </div>
                    )}
                  </div>
                </div>

                <MyInput
                  label='Idioma'
                  width='48%'
                  value={form.idioma || ''}
                  onChange={(e) => handleChange('idioma', e.target.value)}
                />
                <MyInput
                  label='Orçamento'
                  type='number'
                  width='48%'
                  value={form.orcamento || ''}
                  onChange={(e) =>
                    handleChange('orcamento', Number(e.target.value))
                  }
                />
                <MyInput
                  label='Lucro'
                  width='48%'
                  type='number'
                  value={form.lucro || ''}
                  onChange={(e) =>
                    handleChange('lucro', Number(e.target.value))
                  }
                />
                <MyInput
                  label='Receita'
                  width='48%'
                  type='currency'
                  value={form.receita || ''}
                  onChange={(e) =>
                    handleChange('receita', Number(e.target.value))
                  }
                />
                <MyInput
                  label='Popularidade'
                  width='48%'
                  type='number'
                  value={form.popularidade || ''}
                  onChange={(e) =>
                    handleChange('popularidade', Number(e.target.value))
                  }
                />
                <MyInput
                  label='Votos'
                  width='48%'
                  type='number'
                  value={form.votos || ''}
                  onChange={(e) =>
                    handleChange('votos', Number(e.target.value))
                  }
                />
                <MyInput
                  label='Trailer URL'
                  type='url'
                  value={form.trailerUrl || ''}
                  onChange={(e) => handleChange('trailerUrl', e.target.value)}
                />

                {error && (
                  <div style={{ color: '#E11D48', fontSize: 13 }}>{error}</div>
                )}
              </Flex>
            </form>
          </div>
          <Flex justify='end' style={{ marginTop: 10, gap: 5 }}>
            <Dialog.Close asChild>
              <MyButton type='button' colorVariant='secondary'>
                Cancelar
              </MyButton>
            </Dialog.Close>
            <MyButton
              type='button'
              disabled={loading}
              onClick={() => formRef.current?.requestSubmit()}>
              {initialData?.id ? 'Salvar' : 'Adicionar'}
            </MyButton>
          </Flex>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
