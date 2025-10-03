
export default function Info({
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
        borderRadius: '4px',
        fontSize: '0.9rem',
      }}>
      <strong style={{ color: '#B5B2BC' }}>{label}</strong>
      <br />
      <span>{value || '-'}</span>
    </div>
  )
}