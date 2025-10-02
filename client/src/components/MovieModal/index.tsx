import { useState, useEffect } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Flex } from '@radix-ui/themes'
import MyInput from '../Input'
import MyButton from '../Button'
import { createMovie, updateMovie } from '../../services/movies.service'
import { useTheme } from '../../context/useTheme'
import { Cross2Icon } from '@radix-ui/react-icons'
import type { MovieFormData } from '../../types/movie'

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
    ...initialData,
  })

  const [capaFile, setCapaFile] = useState<File | undefined>()
  const [capaFundoFile, setCapaFundoFile] = useState<File | undefined>()
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (initialData) setForm(initialData)
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
          <Dialog.Title style={{ fontSize: 20, marginBottom: 16 }}>
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
                position: 'absolute',
                top: 10,
                right: 10,
                backgroundColor: 'var(--gray-3)',
              }}
              aria-label='Close'>
              <Cross2Icon />
            </button>
          </Dialog.Close>

          <form onSubmit={handleSubmit}>
            <MyInput
              label='Capa do Filme'
              type='file'
              onFileChange={setCapaFile}
            />
            <MyInput
              label='Capa de Fundo'
              type='file'
              onFileChange={setCapaFundoFile}
            />

            <Flex direction='column' style={{ gap: 5, marginTop: 10 }}>
              <MyInput
                label='Título'
                value={form.titulo}
                onChange={(e) => handleChange('titulo', e.target.value )}
                required
              />
              <MyInput
                label='Título Original'
                value={form.tituloOriginal}
                onChange={(e) => handleChange('tituloOriginal', e.target.value)}
              />
              <MyInput
                label='Sinopse'
                value={form.sinopse}
                onChange={(e) => handleChange('sinopse', e.target.value)}
              />
              <MyInput
                label='Data de Lançamento'
                type='date'
                value={form.dataLancamento}
                onChange={(e) => handleChange('dataLancamento', e.target.value)}
              />
              <MyInput
                label='Duração'
                value={form.duracao}
                onChange={(e) => handleChange('duracao', e.target.value)}
              />
              <MyInput
                label='Gêneros'
                placeholder='Separados por vírgula'
                value={form.generos.join(',')}
                onChange={(e) =>
                  handleChange(
                    'generos',
                    e.target.value.split(',').map((g) => g.trim())
                  )
                }
              />

              <MyInput
                label='Idioma'
                value={form.idioma || ''}
                onChange={(e) => handleChange('idioma', e.target.value)}
              />
              <MyInput
                label='Orçamento'
                type='number'
                value={form.orcamento || ''}
                onChange={(e) =>
                  handleChange('orcamento', Number(e.target.value))
                }
              />
              <MyInput
                label='Lucro'
                type='number'
                value={form.lucro || ''}
                onChange={(e) => handleChange('lucro', Number(e.target.value))}
              />
              <MyInput
                label='Receita'
                type='currency'
                value={form.receita || ''}
                onChange={(e) =>
                  handleChange('receita', Number(e.target.value))
                }
              />
              <MyInput
                label='Popularidade'
                type='number'
                value={form.popularidade || ''}
                onChange={(e) =>
                  handleChange('popularidade', Number(e.target.value))
                }
              />
              <MyInput
                label='Votos'
                type='number'
                value={form.votos || ''}
                onChange={(e) => handleChange('votos', Number(e.target.value))}
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

              <Flex justify='end' style={{ marginTop: 10, gap: 5 }}>
                <Dialog.Close asChild>
                  <MyButton type='button' variant='secondary'>
                    Cancelar
                  </MyButton>
                </Dialog.Close>
                <MyButton type='submit' disabled={loading}>
                  {initialData?.id ? 'Salvar' : 'Adicionar'}
                </MyButton>
              </Flex>
            </Flex>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
