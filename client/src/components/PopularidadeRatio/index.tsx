import { useTheme } from "../../context/useTheme"

export default function PopularidadeRatio({
  popularidade,
}: {
  popularidade: number
}) {

  const { isDark } = useTheme()
  const textColor = isDark ? '#fff' : '#111'
  return (
    <div
      style={{
        position: 'relative',
        width: '80px',
        height: '80px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <div
        style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          background: `conic-gradient(#facc15 ${popularidade % 100}%, #e5e7eb ${
            popularidade % 100
          }%)`,
          WebkitMask:
            'radial-gradient(circle 32px at center, transparent 99%, black 100%)',
          mask: 'radial-gradient(circle 32px at center, transparent 99%, black 100%)',
        }}></div>

      <span
        style={{
          position: 'absolute',
          fontWeight: 'bold',
          color: textColor,
        }}>
        {Math.round(popularidade % 100)}%
      </span>
    </div>
  )
}
