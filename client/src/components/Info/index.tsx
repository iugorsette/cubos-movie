import { useTheme } from '../../context/useTheme'

export default function Info({
  label,
  value,
  type,
}: {
  label: string
  value?: string | number
  type?: 'currency' | 'date' | string
}) {
  const { isDark } = useTheme()
  const cardBg = isDark ? 'rgba(35, 34, 37, 0.75)' : '#f3f3f3'
  const labelColor = isDark ? '#B5B2BC' : '#555'
  const valueColor = isDark ? '#eee' : '#111'

  let displayValue: string = '-'

  if (value !== undefined && value !== null) {
    if (type === 'currency') {
      displayValue = formatCurrency(value)
    } else if (type === 'date') {
      displayValue = formatDateDDMMYYYY(value.toString())
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
      <span
        style={{
          color: labelColor,
          fontSize: 12,
          // whiteSpace: 'nowrap',
        }}>
        {label}
      </span>
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
  return number.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
  })
}
