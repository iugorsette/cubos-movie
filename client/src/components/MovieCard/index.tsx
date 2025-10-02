import { useNavigate } from 'react-router-dom'
import { useTheme } from '../../context/useTheme'

type MovieCardProps = {
  id: string
  title: string
  cover?: string
}

export default function MovieCard({ id, title, cover }: MovieCardProps) {
  const navigate = useNavigate()
  const { isDark } = useTheme()

  return (
    <div
      onClick={() => navigate(`/filmes/${encodeURIComponent(id)}`)}
      style={{
        width: 235,
        height: 355,
        borderRadius: 8,
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: '#ddd',
        backgroundImage: cover ? `url(${cover})` : undefined,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}>
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: '15%',
          background: isDark
            ? 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)'
            : 'linear-gradient(to top, rgba(255,255,255,0.8), transparent)',
        }}
      />

      <p
        style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          padding: '8px',
          margin: 0,
          color: isDark ? '#fff' : '#000',
          textAlign: 'center',
          fontWeight: 500,
          zIndex: 1,
        }}>
        {title}
      </p>
    </div>
  )
}
