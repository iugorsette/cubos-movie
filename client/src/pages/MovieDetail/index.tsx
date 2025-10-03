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
  const cardBg = isDark ? 'rgba(35, 34, 37, 0.75)' : 'rgba(0,0,0,0.05)'

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
          gap: '32px',
          alignItems: 'flex-start',
          flexDirection: 'column',
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
          }}>
          <Flex direction='column'>
            <Text size='8'>{movie.titulo}</Text>
            <Text size='3' style={{ marginBottom: '16px' }}>
              Título original: {movie.tituloOriginal}
            </Text>
          </Flex>
          <Flex gap='3' style={{ marginTop: '24px' }}>
            <Button
              disabled={!isOwner}
              onClick={() => setEditOpen(true)}
              style={{ background: '#9333ea' }}>
              Editar
            </Button>
            <Button
              disabled={!isOwner}
              onClick={() => alert('Deletar')}
              style={{ background: '#dc2626' }}>
              Deletar
            </Button>
            <Button variant='outline' onClick={() => navigate(-1)}>
              Voltar
            </Button>
          </Flex>
        </Flex>
        <Flex
          gap='5'
          style={{
            position: 'relative',
            zIndex: 1,
          }}>
          <Flex
            gap='5'
            style={{
              position: 'relative',
              zIndex: 1,
              width: '30%',
            }}>
            <div style={{ position: 'relative' }}>
              {movie.capaUrl && (
                <img
                  src={movie.capaUrl}
                  alt={movie.titulo}
                  style={{
                    width: '380px',
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
              justifyContent: 'space-between',
              zIndex: 1,
              width: '50%',
            }}>
            <Flex direction='column' gap='8'>
              <Text size='5'> Frase de impacto</Text>
              <Info label='Sinopse' value={movie.sinopse} bg={cardBg} />
            </Flex>
            <GenerosChips generos={movie.generos} />
          </Flex>
          <Flex
            gap='5'
            direction='column'
            style={{
              width: '50%',
            }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '12px',
                marginTop: '20px',
                alignItems: 'center',
              }}>
              <Info
                label='POPULARIDADE'
                value={movie.popularidade?.toString()}
                bg={cardBg}
              />
              <Info label='Votos' value={movie.votos?.toString()} bg={cardBg} />
              {movie.popularidade && (
                <PopularidadeRatio popularidade={movie.popularidade || 0} />
              )}

              <Info
                label='LANÇAMENTO'
                value={movie.dataLancamento}
                bg={cardBg}
              />

              <Info label='DURAÇÃO' value={movie.duracao} bg={cardBg} />
              <Info label='IDIOMA' value={movie.idioma} bg={cardBg} />
              <Info
                label='ORÇAMENTO'
                value={movie.orcamento ? `US$ ${movie.orcamento}` : '-'}
                bg={cardBg}
              />
              <Info
                label='RECEITA'
                value={movie.receita ? `US$ ${movie.receita}` : '-'}
                bg={cardBg}
              />
              <Info
                label='LUCRO'
                value={movie.lucro ? `US$ ${movie.lucro}` : '-'}
                bg={cardBg}
              />
            </div>
            <Flex gap='5'></Flex>
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

function Info({
  label,
  value,
  bg,
}: {
  label: string
  value?: string
  bg: string
}) {
  return (
    <div
      style={{
        background: bg,
        padding: '12px',
        borderRadius: '4px',
        fontSize: '0.9rem',
      }}>
      <strong
        style={{
          color: '#B5B2BC',
        }}>
        {label}
      </strong>{' '}
      <br />
      <span>{value || '-'}</span>
    </div>
  )
}
