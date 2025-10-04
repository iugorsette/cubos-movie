import { useTheme } from "../../hooks/useTheme"


export default function PopularidadeRatio({
  popularidade,
}: {
  popularidade: number
}) {

  const { isDark } = useTheme()
  const textColor = isDark ? '#fff' : '#111'
  const size = '100px'
  return (
    <div
      style={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: '50%',
        backgroundColor: isDark 
          ? 'rgba(0,0,0,0.4)' 
          : 'rgba(255,255,255,0.4)',
        backdropFilter: 'blur(1px)',
        WebkitBackdropFilter: 'blur(1px)',
        boxShadow: isDark 
          ? '0 4px 15px rgba(0,0,0,0.3)' 
          : '0 4px 15px rgba(0,0,0,0.1)',
      }}>
      <div
        style={{
          width: size,
          height: size,
          borderRadius: '50%',
          background: `conic-gradient(#facc15 ${popularidade % 100}%, #e5e7eb ${
            popularidade % 100
          }%)`,
          WebkitMask:
            'radial-gradient(circle 42px at center, transparent 99%, black 100%)',
          mask: 'radial-gradient(circle 42px at center, transparent 99%, black 100%)',
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
