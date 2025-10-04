import { useState, useEffect, useRef } from 'react'
import * as Dialog from '@radix-ui/react-dialog'
import { Flex } from '@radix-ui/themes'
import { Cross2Icon } from '@radix-ui/react-icons'
import { useTheme } from '../../../hooks/useTheme'
import { CLASSIFICACAO_INDICATIVA, type MovieFormData } from '../../../types/movie'
import { movieStore } from '../../../stores/movie.store'
import MyButton from '../../Button'
import MovieFormFields from '../MovieFormFields'

type MovieModalProps = {
  isOpen: boolean
  onClose: () => void
  initialData?: MovieFormData
  onSaved: () => void
}

export default function MovieModal({
  isOpen,
  onClose,
  initialData,
  onSaved,
}: MovieModalProps) {
  const { isDark } = useTheme()
  const [form, setForm] = useState<MovieFormData>({
    titulo: '',
    tituloOriginal: '',
    subtitulo: '',
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
  const [capaPreview, setCapaPreview] = useState<string | null>(
    initialData?.capaUrl || null
  )
  const [capaFundoPreview, setCapaFundoPreview] = useState<string | null>(
    initialData?.capaFundo || null
  )
  const [errorFields, setErrorFields] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  useEffect(() => {
    if (initialData) {
      const formattedData = initialData.dataLancamento
        ? new Date(initialData.dataLancamento).toISOString().split('T')[0]
        : ''
      setForm({ ...initialData, dataLancamento: formattedData })
      setCapaPreview(initialData.capaUrl || null)
      setCapaFundoPreview(initialData.capaFundo || null)
    }
  }, [initialData])

  function handleChange<K extends keyof MovieFormData>(
    field: K,
    value: MovieFormData[K]
  ) {
    setForm((prev) => ({ ...prev, [field]: value }))
    if (errorFields[field]) {
      setErrorFields((prev) => {
        const copy = { ...prev }
        delete copy[field]
        return copy
      })
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setErrorFields({})
    setLoading(true)

    const requiredFields: { field: keyof MovieFormData; label: string }[] = [
      { field: 'titulo', label: 'Título' },
      { field: 'dataLancamento', label: 'Data de Lançamento' },
      { field: 'duracao', label: 'Duração' },
      { field: 'classificacaoIndicativa', label: 'Classificação Indicativa' },
    ]

    const newErrors: Record<string, string> = {}
    for (const { field, label } of requiredFields) {
      const value = form[field]
      if (
        value === undefined ||
        value === null ||
        (typeof value === 'string' && !value.trim())
      ) {
        newErrors[field] = `${label} é obrigatório`
      }
    }

    if (form.dataLancamento && isNaN(new Date(form.dataLancamento).getTime())) {
      newErrors.dataLancamento = 'Data de Lançamento inválida'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrorFields(newErrors)
      setLoading(false)
      return
    }

    try {
      const formData = new FormData()
      Object.entries(form).forEach(([key, value]) => {
        if (value === undefined || value === null) return
        if (Array.isArray(value)) value.forEach((v) => formData.append(key, v))
        else formData.append(key, String(value))
      })
      if (capaFile) formData.append('capaFile', capaFile)
      if (capaFundoFile) formData.append('capaFundoFile', capaFundoFile)

      if (initialData?.id) {
        await movieStore.updateMovie(initialData.id, formData)
      } else {
        await movieStore.addMovie(formData)
      }

      onSaved()
      onClose()
    } catch (err: any) {
      setErrorFields({ global: err.message || 'Erro ao salvar filme' })
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
            padding: '0 24px',
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
                  borderRadius: '100%',
                  height: 25,
                  width: 25,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--violet-11)',
                  backgroundColor: 'var(--gray-3)',
                }}>
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
              <MovieFormFields
                form={form}
                errorFields={errorFields}
                setForm={setForm}
                capaFile={capaFile}
                setCapaFile={setCapaFile}
                capaPreview={capaPreview}
                setCapaPreview={setCapaPreview}
                capaFundoFile={capaFundoFile}
                setCapaFundoFile={setCapaFundoFile}
                capaFundoPreview={capaFundoPreview}
                setCapaFundoPreview={setCapaFundoPreview}
                handleChange={handleChange}
              />
              {errorFields.global && (
                <div style={{ color: '#E11D48', fontSize: 13 }}>
                  {errorFields.global}
                </div>
              )}
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
