import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'
import PopularidadeRatio from '../Movie/PopularidadeRatio'

type MovieCardProps = {
  id: string
  title: string
  cover?: string
  generos?: string[]
  popularidade?: number
  trailerUrl?: string
}

function getEmbedUrl(url: string, autoplay = false): string {
  try {
    const urlObj = new URL(url)
    let videoId = ''
    if (urlObj.hostname.includes('youtube.com')) {
      videoId = urlObj.searchParams.get('v') || ''
    } else if (urlObj.hostname.includes('youtu.be')) {
      videoId = urlObj.pathname.slice(1)
    }
    if (!videoId) return url
    const base = `https://www.youtube.com/embed/${videoId}`
    return autoplay
      ? `${base}?autoplay=1&mute=1&controls=0&modestbranding=1`
      : `${base}?controls=0&modestbranding=1`
  } catch {
    return url
  }
}

export default function MovieCard({
  id,
  title,
  cover,
  generos,
  popularidade,
  trailerUrl,
}: MovieCardProps) {
  const navigate = useNavigate()
  const { isDark } = useTheme()

  const [isHovered, setIsHovered] = useState(false)
  const [showTrailer, setShowTrailer] = useState(false)
  const hoverTimer = useRef<NodeJS.Timeout | null>(null)
  const [isScaled, setIsScaled] = useState(false)

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null

    if (isHovered) {
      timeout = setTimeout(() => {
        setIsScaled(true)
      }, 3000)
    } else {
      setIsScaled(false)
      if (timeout) clearTimeout(timeout)
    }

    return () => {
      if (timeout) clearTimeout(timeout)
    }
  }, [isHovered])

  const formattedGenres = generos?.join(' / ')
  const truncatedGenres =
    formattedGenres && formattedGenres.length > 30
      ? formattedGenres.slice(0, 30) + '...'
      : formattedGenres

  const handleMouseEnter = () => {
    setIsHovered(true)
    if (trailerUrl) {
      hoverTimer.current = setTimeout(() => {
        setShowTrailer(true)
      }, 3000)
    }
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    if (hoverTimer.current) clearTimeout(hoverTimer.current)
    setShowTrailer(false)
  }

  return (
    <div
      onClick={() => navigate(`/filmes/${encodeURIComponent(id)}`)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        width: isScaled ? 470 : 235,
        height: 355,
        borderRadius: 6,
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#ddd',
        backgroundImage: !showTrailer && cover ? `url(${cover})` : undefined,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        transition: 'width 1.5s ease, box-shadow 1.5s ease',
        marginLeft: 'auto',
        marginRight: 'auto',
        boxShadow: isHovered
          ? '0px 8px 20px rgba(0,0,0,0.3)'
          : '0px 4px 10px rgba(0,0,0,0.15)',
      }}>
      {showTrailer && trailerUrl && (
        <iframe
          src={getEmbedUrl(trailerUrl, true)}
          title={`Trailer de ${title}`}
          frameBorder='0'
          allow='autoplay; fullscreen; encrypted-media'
          allowFullScreen
          style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            width: '190%',
            height: '100%',
            borderRadius: '8px',
            zIndex: 1,
            transition: 'all 2s ease',
          }}
        />
      )}

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          background: isDark
            ? 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'
            : 'linear-gradient(to top, rgba(255,255,255,0.8), transparent)',
          transition: 'height 0.3s',
          height: isHovered ? '30%' : '15%',
          zIndex: 2,
        }}
      />

      <p
        style={{
          position: 'absolute',
          bottom: isHovered ? '8%' : 0,
          width: '100%',
          padding: '8px',
          margin: 0,
          color: isDark ? '#fff' : '#000',
          textAlign: 'center',
          fontWeight: 600,
          zIndex: 3,
          fontFamily: 'Montserrat, sans-serif',
          textTransform: 'uppercase',
          transition: 'bottom 0.3s',
        }}>
        {title}
      </p>

      {isHovered && popularidade && !showTrailer && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 4,
            padding: '8px 12px',
            transition: 'all 0.3s',
          }}>
          <PopularidadeRatio popularidade={popularidade} />
        </div>
      )}

      {isHovered && generos && !showTrailer && (
        <p
          style={{
            position: 'absolute',
            bottom: 5,
            width: '100%',
            padding: '0 8px',
            margin: 0,
            color: isDark ? '#ddd' : '#333',
            textAlign: 'center',
            fontSize: 12,
            whiteSpace: 'nowrap',
            textTransform: 'uppercase',
            fontFamily: 'Montserrat',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            zIndex: 3,
          }}>
          {truncatedGenres}
        </p>
      )}
    </div>
  )
}
