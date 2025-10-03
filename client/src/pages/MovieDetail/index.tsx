import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Flex, Button, Text } from '@radix-ui/themes'
import { getMovieById } from '../../services/movies.service'
import type { Movie } from '../../types/movie'
import { useTheme } from '../../context/useTheme'
import MovieModal from '../../components/MovieModal'
import { useAuth } from '../../context/useAuth'
import PopularidadeRatio from '../../components/PopularidadeRatio'
import TrailerFrame from '../../components/TrailerFrame'
import GenerosChips from '../../components/GenerosChips'
import Info from '../../components/Info'
import MyButton from '../../components/Button'

export default function MovieDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const { user, token } = useAuth()
  const [movie, setMovie] = useState<Movie | null>(null)
  const [editOpen, setEditOpen] = useState(false)

  const isOwner = user?.id === movie?.createdBy

  useEffect(() => {
    if (id) fetchMovie()
  }, [id])

  async function fetchMovie() {
    const data = await getMovieById(id!)
    setMovie(data as Movie)
  }

  if (!movie) return <p>Carregando...</p>

  const bgOverlay = isDark ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.6)'
  const textColor = isDark ? '#fff' : '#111'

  return (
    <div
      style={{
        width: '100%',
        minHeight: '100vh',
        background: isDark ? '#0f0f0f' : '#f9fafb',
        color: textColor,
      }}>
      <div
        style={{
          backgroundImage: `url(${movie.capaFundo})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '40px 60px',
          display: 'flex',
          flexDirection: 'column',
          gap: '32px',
          position: 'relative',
        }}>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: bgOverlay,
          }}
        />

        <Flex
          gap='5'
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
          }}>
          <Flex direction='column' style={{ minWidth: '250px' }}>
            <Text size='7'>{movie.titulo}</Text>
            <Text size='3'>Título original: {movie.tituloOriginal}</Text>
          </Flex>

          <Flex gap='3' style={{ flexWrap: 'wrap' }}>
            <MyButton
              colorVariant='secondary'
              disabled={!isOwner}
              onClick={() => alert('Deletar')}>
              Deletar
            </MyButton>
            <MyButton disabled={!isOwner} onClick={() => setEditOpen(true)}>
              Editar
            </MyButton>
            <MyButton variant='outline' onClick={() => navigate(-1)}>
              Voltar
            </MyButton>
          </Flex>
        </Flex>

        <Flex
          gap='5'
          wrap='wrap'
          style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            justifyContent: 'space-between',
          }}>
          <Flex
            gap='5'
            style={{
              position: 'relative',
              zIndex: 1,
              flex: '1 1 300px',
              maxWidth: '380px',
            }}>
            <div style={{ position: 'relative', width: '100%' }}>
              {movie.capaUrl && (
                <img
                  src={movie.capaUrl}
                  alt={movie.titulo}
                  style={{
                    width: '100%',
                    maxWidth: '380px',
                    borderRadius: '4px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.8)',
                  }}
                />
              )}
            </div>
          </Flex>

          <Flex
            direction='column'
            gap='2'
            style={{
              flex: '2 1 400px',
              minWidth: '280px',
              justifyContent: 'space-between',
              zIndex: 1,
            }}>
            <Flex direction='column' gap='8'>
              <Text
                size='4'
                style={{
                  margin: ' 0 24px',
                  fontFamily: 'Montserrat',
                  fontWeight: 400,
                }}>
                {movie.subtitulo}
              </Text>
              <Info label='SINOPSE' value={movie.sinopse} />
            </Flex>
            <GenerosChips generos={movie.generos} />
          </Flex>

          <Flex
            gap='5'
            direction='column'
            style={{
              flex: '1 1 300px',
              minWidth: '250px',
              zIndex: 1,
            }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
                gap: '12px',
              }}>
              <Info
                label='CLASSIFICAÇÃO INDICATIVA'
                value={movie.classificacaoIndicativa}
                type='ageRange'
              />
              <Info label='VOTOS' value={movie.votos?.toString()} />
              <PopularidadeRatio popularidade={movie.popularidade || 0} />
              <Info
                label='LANÇAMENTO'
                value={movie.dataLancamento}
                type='date'
              />
              <Info label='DURAÇÃO' value={movie.duracao} type='duration' />
              <Info label='IDIOMA' value={movie.idioma} />
              <Info label='ORÇAMENTO' value={movie.orcamento} type='currency' />
              <Info label='RECEITA' value={movie.receita} type='currency' />
              <Info label='LUCRO' value={movie.lucro} type='currency' />
            </div>
          </Flex>
        </Flex>
      </div>

      {movie.trailerUrl && <TrailerFrame trailerUrl={movie.trailerUrl} />}

      <MovieModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        initialData={movie}
        token={token as string}
        onSaved={fetchMovie}
      />
    </div>
  )
}
