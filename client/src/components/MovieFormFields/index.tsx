import { Flex } from '@radix-ui/themes'
import * as Select from '@radix-ui/react-select'
import { CheckIcon, ChevronDownIcon, PlusIcon } from '@radix-ui/react-icons'
import MyInput from '../Input'
import MyButton from '../Button'
import { CLASSIFICACAO_INDICATIVA, type MovieFormData } from '../../types/movie'
import { useState } from 'react'
import { useTheme } from '../../hooks/useTheme'

type MovieFormFieldsProps = {
  form: MovieFormData
  errorFields: Record<string, string>
  setForm: any
  handleChange: (field: keyof MovieFormData, value: any) => void
  capaFile: File | undefined
  setCapaFile: any
  capaPreview: string | null
  setCapaPreview: any
  capaFundoFile: File | undefined
  setCapaFundoFile: any
  capaFundoPreview: string | null
  setCapaFundoPreview: any
}

export default function MovieFormFields({
  form,
  setForm,
  errorFields,
  handleChange,
  setCapaFile,
  capaPreview,
  setCapaPreview,
  setCapaFundoFile,
  capaFundoPreview,
  setCapaFundoPreview,
}: MovieFormFieldsProps) {
  const [generos, setGeneros] = useState(form.generos || [])
  const [newGenero, setNewGenero] = useState('')
  const { isDark } = useTheme()

  function addGenero() {
    const g = newGenero.trim()
    if (!g || generos.includes(g) || generos.length >= 10) return
    setGeneros([...generos, g])
    setForm((prev: any) => ({ ...prev, generos: [...generos, g] }))
    setNewGenero('')
  }
  function removeGenero(g: string) {
    const updated = generos.filter((x) => x !== g)
    setGeneros(updated)
    setForm((prev: any) => ({ ...prev, generos: updated }))
  }

  return (
    <Flex direction='column' style={{ gap: 8 }}>
      {capaPreview && (
        <img
          src={capaPreview}
          alt='Preview'
          style={{ width: 150, borderRadius: 4 }}
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
          alt='Preview fundo'
          style={{ width: '100%', maxHeight: 180, borderRadius: 4 }}
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

      <Flex direction='row' wrap='wrap' style={{ gap: 5 }}>
        <MyInput
          label='Título'
          value={form.titulo}
          error={errorFields.titulo}
          onChange={(e) => handleChange('titulo', e.target.value)}
        />
        <MyInput
          label='Título Original'
          value={form.tituloOriginal}
          onChange={(e) => handleChange('tituloOriginal', e.target.value)}
        />
        <MyInput
          label='Subtítulo'
          placeholder='Digite um subtítulo ou frase'
          value={form.subtitulo}
          onChange={(e) => setForm({ ...form, subtitulo: e.target.value })}
        />
        <MyInput
          label='Sinopse'
          value={form.sinopse}
          onChange={(e) => handleChange('sinopse', e.target.value)}
        />
        <MyInput
          label='Data de Lançamento'
          type='date'
          width='48%'
          value={form.dataLancamento}
          error={errorFields.dataLancamento}
          onChange={(e) => handleChange('dataLancamento', e.target.value)}
        />
        <MyInput
          label='Duração'
          width='48%'
          value={form.duracao}
          error={errorFields.duracao}
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
              {CLASSIFICACAO_INDICATIVA.map((val) => (
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

        <div>
          <strong>Gêneros</strong>
          <Flex wrap='wrap' style={{ gap: 4 }}>
            {generos.map((g) => (
              <div
                key={g}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '4px 12px',
                  backgroundColor: '#8E4EC6',
                  color: '#fff',
                }}>
                {g}
                <button type='button' onClick={() => removeGenero(g)}>
                  ×
                </button>
              </div>
            ))}
            {generos.length < 10 && (
              <>
                <MyInput
                  value={newGenero}
                  onChange={(e) => setNewGenero(e.target.value)}
                  placeholder='Novo gênero'
                />
                <MyButton
                  type='button'
                  onClick={addGenero}
                  iconButton
                  icon={<PlusIcon />}
                />
              </>
            )}
          </Flex>
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
          onChange={(e) => handleChange('orcamento', Number(e.target.value))}
        />
        <MyInput
          label='Lucro'
          width='48%'
          type='number'
          value={form.lucro || ''}
          onChange={(e) => handleChange('lucro', Number(e.target.value))}
        />
        <MyInput
          label='Receita'
          width='48%'
          type='currency'
          value={form.receita || ''}
          onChange={(e) => handleChange('receita', Number(e.target.value))}
        />
        <MyInput
          label='Popularidade'
          width='48%'
          type='number'
          value={form.popularidade || ''}
          onChange={(e) => handleChange('popularidade', Number(e.target.value))}
        />
        <MyInput
          label='Votos'
          width='48%'
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

        {/* {error && <div style={{ color: '#E11D48', fontSize: 13 }}>{error}</div>} */}
      </Flex>
    </Flex>
  )
}
