export const CLASSIFICACAO_INDICATIVA = [
  'LIVRE',
  'DEZ',
  'DOZE',
  'CATORZE',
  'DEZESSEIS',
  'DEZOITO',
] as const
export type ClassificacaoIndicativa = (typeof CLASSIFICACAO_INDICATIVA)[number]

export interface MovieBase {
  id?: string
  titulo: string
  tituloOriginal?: string  
  subtitulo: string, 
  sinopse?: string
  dataLancamento: string
  duracao: string
  popularidade?: number
  votos?: number
  idioma?: string
  orcamento?: number
  receita?: number
  lucro?: number
  generos: string[]
  capaUrl?: string
  capaFundo?: string
  trailerUrl?: string
  createdBy?: string
  createdAt?: string
  classificacaoIndicativa: ClassificacaoIndicativa
}

export type Movie = MovieBase

export type MovieFormData = MovieBase & {
  capaFile?: File
  capaFundoFile?: File
}
