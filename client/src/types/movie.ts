export interface Movie {
  id?: string
  titulo: string
  tituloOriginal?: string
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
  capaFile?: File
  capaFundoFile?: File
  trailerUrl?: string
  createdBy?: string
  createdAt?: string
}

export type MovieFormData = {
  id?: string
  titulo: string
  tituloOriginal?: string
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
}
