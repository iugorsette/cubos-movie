import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../hooks/useTheme'
import PopularidadeRatio from '../PopularidadeRatio'

type MovieCardProps = {
  id: string
  title: string
  cover?: string
  generos?: string[]
  popularidade?: number
}

export default function MovieCard({
  id,
  title,
  cover,
  generos,
  popularidade,
}: MovieCardProps) {
  const navigate = useNavigate()
  const { isDark } = useTheme()
  const [isHovered, setIsHovered] = useState(false)

  const formattedGenres = generos?.join(' / ')
  const truncatedGenres =
    formattedGenres && formattedGenres.length > 30
      ? formattedGenres.slice(0, 30) + '...'
      : formattedGenres

  return (
    <div
      onClick={() => navigate(`/filmes/${encodeURIComponent(id)}`)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        width: 235,
        height: 355,
        borderRadius: 4,
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#ddd',
        backgroundImage: cover ? `url(${cover})` : undefined,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        transition: 'transform 0.5s',
      }}>
      {/* Gradiente */}
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
        }}
      />

      {/* Título */}
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
          zIndex: 1,
          fontFamily: 'Montserrat, sans-serif',
          textTransform: 'uppercase',
          transition: 'bottom 0.3s',
        }}>
        {title}
      </p>

      {isHovered && popularidade && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 5,
            padding: '8px 12px',
            transition: 'all 0.3s',
          }}>
          {/* Aqui você pode renderizar o seu componente de popularidade */}
          <PopularidadeRatio popularidade={popularidade} />
        </div>
      )}

      {/* Gêneros */}
      {isHovered && generos && (
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
            zIndex: 1,
          }}>
          {truncatedGenres}
        </p>
      )}
    </div>
  )
}
