import { Flex } from '@radix-ui/themes'
import MyInput from '../Input'
import { CLASSIFICACAO_INDICATIVA, type MovieFormData } from '../../types/movie'
import { useState } from 'react'
import MySelect from '../Select'
import GenerosField from './GeneroFields'

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

  const classificacaoOptions = CLASSIFICACAO_INDICATIVA.map((val) => ({
    value: val,
    label:
      {
        LIVRE: 'Livre',
        DEZ: '10 anos',
        DOZE: '12 anos',
        CATORZE: '14 anos',
        DEZESSEIS: '16 anos',
        DEZOITO: '18 anos',
      }[val] || val,
  }))

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
          type='textarea'
          value={form.sinopse}
          onChange={(e) => handleChange('sinopse', e.target.value)}
        />
        <MyInput
          label='Data de Lançamento'
          type='date'
          width='49.5%'
          value={form.dataLancamento}
          error={errorFields.dataLancamento}
          onChange={(e) => handleChange('dataLancamento', e.target.value)}
        />
        <MyInput
          label='Duração'
          type='duration'
          width='49.5%'
          value={form.duracao}
          error={errorFields.duracao}
          onChange={(e) => handleChange('duracao', e.target.value)}
        />

        <GenerosField
          generos={generos}
          setGeneros={(updated) => {
            setGeneros(updated)
            setForm((prev: any) => ({ ...prev, generos: updated }))
          }}
        />

        <MyInput
          label='Idioma'
          width='49.5%'
          value={form.idioma || ''}
          onChange={(e) => handleChange('idioma', e.target.value)}
        />
        <MyInput
          label='Orçamento'
          width='49.5%'
          type='currency'
          value={form.orcamento}
          onChange={(e) => handleChange('orcamento', Number(e.target.value))}
        />
        <MyInput
          label='Lucro'
          width='49.5%'
          type='currency'
          value={form.lucro}
          onChange={(e) => handleChange('lucro', Number(e.target.value))}
        />
        <MyInput
          label='Receita'
          width='49.5%'
          type='currency'
          value={form.receita || ''}
          onChange={(e) => handleChange('receita', Number(e.target.value))}
        />

        <MySelect
          label='Classificação Indicativa'
          value={form.classificacaoIndicativa}
          onChange={(val) => handleChange('classificacaoIndicativa', val)}
          options={classificacaoOptions}
          width='49.5%'
          error={errorFields.classificacaoIndicativa}
        />
        <MyInput
          label='Popularidade'
          type='percentage'
          width='20.5%'
          value={form.popularidade}
          onChange={(e) =>
            handleChange('popularidade', Math.min(Number(e.target.value), 100))
          }
        />
        <MyInput
          label='Votos'
          width='28%'
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
      </Flex>
    </Flex>
  )
}
