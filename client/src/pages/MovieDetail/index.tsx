import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Flex, Button, Text } from '@radix-ui/themes'
import { getMovieById } from '../../services/movies.service'
import type { Movie } from '../../types/movie'
import { useTheme } from '../../context/useTheme'
import MovieModal from '../../components/MovieModal'
import { useAuth } from '../../context/useAuth'

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
  const cardBg = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'
  const genreBg = isDark ? '#5b21b6' : '#2563eb'

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
              width: '50%',
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

            {/* Detalhes */}
            <div style={{ flex: 1 }}>
              {/* Sinopse */}
              <Info label='Sinopse' value={movie.sinopse} bg={cardBg} />
              {/* Gêneros */}
              <strong>Gêneros :</strong> <br />
              {movie.generos?.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  {movie.generos.map((genero) => (
                    <span
                      key={genero}
                      style={{
                        background: genreBg,
                        padding: '6px 12px',
                        borderRadius: '6px',
                        marginRight: '8px',
                        fontSize: '0.85rem',
                        color: '#fff',
                      }}>
                      {genero}
                    </span>
                  ))}
                </div>
              )}
              {/* Grid de informações + rating */}
            </div>
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
                label='Popularidade'
                value={movie.popularidade?.toString()}
                bg={cardBg}
              />
              <Info label='Votos' value={movie.votos?.toString()} bg={cardBg} />
              <Info
                label='Lançamento'
                value={movie.dataLancamento}
                bg={cardBg}
              />
              <Info label='Duração' value={movie.duracao} bg={cardBg} />
              <Info label='Idioma' value={movie.idioma} bg={cardBg} />
              <Info
                label='Orçamento'
                value={movie.orcamento ? `US$ ${movie.orcamento}` : '-'}
                bg={cardBg}
              />
              <Info
                label='Receita'
                value={movie.receita ? `US$ ${movie.receita}` : '-'}
                bg={cardBg}
              />
              <Info
                label='Lucro'
                value={movie.lucro ? `US$ ${movie.lucro}` : '-'}
                bg={cardBg}
              />

              {/* Rating circular */}
              {movie.popularidade && (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                  }}>
                  <div
                    style={{
                      width: '80px',
                      height: '80px',
                      borderRadius: '50%',
                      background: `conic-gradient(#facc15 ${
                        movie.popularidade % 100
                      }%, #e5e7eb ${movie.popularidade % 100}%)`,
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                      fontWeight: 'bold',
                      color: textColor,
                    }}>
                    {Math.round(movie.popularidade % 100)}%
                  </div>
                  <span style={{ marginTop: '8px', fontSize: '0.9rem' }}>
                    Rating
                  </span>
                </div>
              )}
            </div>
            <Flex gap='5'></Flex>
          </Flex>
        </Flex>
      </div>

      {movie.trailerUrl && (
        <div style={{ padding: '20px 30px' }}>
          <h2 style={{ marginBottom: '16px' }}>Trailer</h2>
          <div
            style={{
              position: 'relative',
              paddingBottom: '56.25%',
              height: 0,
            }}>
            <iframe
              src={getEmbedUrl(movie.trailerUrl)}
              title='Trailer'
              frameBorder='0'
              allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
              allowFullScreen
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '65%',
              }}></iframe>
          </div>
        </div>
      )}

      {/* Modal de edição */}
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
        borderRadius: '6px',
        fontSize: '0.9rem',
      }}>
      <strong>{label}:</strong> <br />
      <span>{value || '-'}</span>
    </div>
  )
}

function getEmbedUrl(url: string): string {
  try {
    const urlObj = new URL(url)
    if (urlObj.hostname.includes('youtube.com')) {
      const videoId = urlObj.searchParams.get('v')
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`
      }
    }
    if (urlObj.hostname.includes('youtu.be')) {
      const videoId = urlObj.pathname.slice(1)
      return `https://www.youtube.com/embed/${videoId}`
    }
    return url
  } catch {
    return url
  }
}
