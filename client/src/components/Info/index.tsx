import { useTheme } from '../../hooks/useTheme'

const classificacaoLabels: Record<string, string> = {
  LIVRE: 'Livre',
  DEZ: '10 anos',
  DOZE: '12 anos',
  QUATORZE: '14 anos',
  DEZESSEIS: '16 anos',
  DEZOITO: '18 anos',
}

export default function Info({
  label,
  value,
  type,
}: {
  label: string
  value?: string | number
  type?: 'currency' | 'date' | 'duration' | 'ageRange' | string
}) {
  const { isDark } = useTheme()
  const cardBg = isDark ? 'rgba(35, 34, 37, 0.75)' : '#f3f3f3'
  const labelColor = isDark ? '#B5B2BC' : '#555'
  const valueColor = isDark ? '#eee' : '#111'

  let displayValue: string = '-'

  if (value !== undefined && value !== null) {
    if (type === 'duration') {
      displayValue = `${value} min`
    } else if (type === 'currency') {
      displayValue = formatCurrency(value)
    } else if (type === 'date') {
      displayValue = formatDateDDMMYYYY(value.toString())
    } else if (type === 'ageRange') {
      displayValue = classificacaoLabels[value.toString()] ?? value.toString()
    } else {
      displayValue = value.toString()
    }
  }

  return (
    <div
      style={{
        background: cardBg,
        padding: '12px 16px',
        borderRadius: '6px',
        fontSize: '0.95rem',
        fontFamily: "'Montserrat'",
        fontWeight: 700,
        display: 'flex',
        flexDirection: 'column',
      }}>
      <span style={{ color: labelColor, fontSize: 12 }}>{label}</span>
      <span style={{ color: valueColor, marginTop: 4 }}>{displayValue}</span>
    </div>
  )
}

function formatDateDDMMYYYY(dateString: string) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return '-'
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()
  return `${day}-${month}-${year}`
}

function formatCurrency(value: string | number) {
  const number = typeof value === 'number' ? value : Number(value)
  if (isNaN(number)) return '-'

  const abs = Math.abs(number)

  if (abs >= 1_000_000_000_000) {
    return `${(number / 1_000_000_000_000).toFixed(1)}T`
  } else if (abs >= 1_000_000_000) {
    return `${(number / 1_000_000_000).toFixed(1)}B`
  } else if (abs >= 1_000_000) {
    return `${(number / 1_000_000).toFixed(1)}M`
  } else if (abs >= 1_000) {
    return `${(number / 1_000).toFixed(1)}K`
  } else {
    return number.toString()
  }
}
