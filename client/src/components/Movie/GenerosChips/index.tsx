import { useTheme } from '../../../hooks/useTheme'

export default function GenerosChips({ generos }: { generos: string[] }) {
  const { isDark } = useTheme()
  const genreBg = isDark ? 'rgba(193, 80, 255, 0.18)' : '#8E4EC6'
  const cardBg = isDark ? 'rgba(35, 34, 37, 0.75)' : '#f3f3f36c'
  const labelColor = isDark ? '#B5B2BC' : '#555'

  const valueColor = isDark ? '#eee' : '#111'
  return (
    <div
      style={{
        background: cardBg,
        padding: '16px',
        borderRadius: '6px',
        fontSize: '0.95rem',
        fontWeight: 700,
        display: 'flex',
        flexDirection: 'column',
      }}>
      {' '}
      <strong
        style={{
          fontFamily: "'Montserrat'",
          color: labelColor,
          fontSize: 16,
          marginBottom: '8px',
        }}>
        Gêneros
      </strong>
      {generos?.length > 0 && (
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
          }}>
          {generos.map((genero) => (
            <span
              key={genero}
              style={{
                background: genreBg,
                borderRadius: '2px',
                padding: '8px',
                marginRight: '8px',
                fontSize: '0.85rem',
                fontWeight: 400,
                color: valueColor,
                whiteSpace: 'nowrap',
              }}>
              {genero}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
