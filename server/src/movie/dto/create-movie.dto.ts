import {
  IsString,
  IsOptional,
  IsNumber,
  IsDate,
  IsArray,
  IsUrl,
} from 'class-validator';

export class CreateMovieDto {
  @IsString()
  titulo: string;

  @IsString()
  @IsOptional()
  tituloOriginal?: string;

  @IsString()
  @IsOptional()
  sinopse?: string;

  @IsDate()
  dataLancamento: Date;

  @IsNumber()
  duracao: number;

  @IsNumber()
  @IsOptional()
  popularidade?: number;

  @IsNumber()
  @IsOptional()
  votos?: number;

  @IsString()
  @IsOptional()
  idioma?: string;

  @IsNumber()
  @IsOptional()
  orcamento?: number;

  @IsNumber()
  @IsOptional()
  receita?: number;

  @IsNumber()
  @IsOptional()
  lucro?: number;

  @IsArray()
  @IsString({ each: true })
  generos: string[];

  @IsUrl()
  @IsOptional()
  capaUrl?: string | null;

  @IsUrl()
  @IsOptional()
  capaFundo?: string | null;

  @IsUrl()
  @IsOptional()
  trailerUrl?: string;

  classificacaoIndicativa;
}
