import { useTheme } from '../../context/useTheme'

export default function GenerosChips({ generos }: { generos: string[] }) {
  const { isDark } = useTheme()
  const genreBg = isDark ? '#8457AA' : '#8E4EC6'
  return (
    <div>
      {' '}
      <strong>Gêneros :</strong> <br />
      {generos?.length > 0 && (
        <div
          style={{
            marginBottom: '16px',
            display: 'flex',
            flexWrap: 'wrap',
            gap: '8px',
          }}>
          {generos.map((genero) => (
            <span
              key={genero}
              style={{
                background: genreBg,
                padding: '8px 18px',
                marginRight: '8px',
                fontSize: '0.85rem',
                fontWeight: 'bold',
                color: '#fff',
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
