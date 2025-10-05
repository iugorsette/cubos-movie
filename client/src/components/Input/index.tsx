import { forwardRef, useState, useEffect, useRef } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { EyeOpenIcon, EyeClosedIcon } from '@radix-ui/react-icons'
import { useTheme } from '../../hooks/useTheme'

export type MyInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  showLabel?: boolean
  error?: string | null
  icon?: ReactNode
  type?:
    | 'text'
    | 'number'
    | 'date'
    | 'file'
    | 'currency'
    | 'url'
    | 'email'
    | 'textarea'
    | 'password'
    | 'percentage'
    | 'duration'
  onFileChange?: (file: File | undefined) => void
  width?: string | number
}

const formatCurrency = (value: string | number) => {
  if (value === '' || value === null || value === undefined) return ''
  const numeric =
    typeof value === 'number'
      ? value
      : parseFloat(value.replace(/\D/g, '')) / 100
  if (isNaN(numeric)) return ''
  return numeric.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

const formatDuration = (minutes: number) => {
  if (minutes === ('' as any) || minutes === null || minutes === undefined)
    return ''
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const remaining = minutes % 60
  return remaining > 0 ? `${hours}h ${remaining}min` : `${hours}h`
}

function rawToMinutes(raw: string): number {
  if (!raw) return 0
  if (raw.length <= 2) return parseInt(raw, 10) || 0
  const h = parseInt(raw.slice(0, -2), 10) || 0
  const m = parseInt(raw.slice(-2), 10) || 0
  return h * 60 + m
}

function minutesToRaw(minutes: number): string {
  if (!minutes && minutes !== 0) return ''
  const m = Math.max(0, Math.floor(minutes))
  if (m < 60) return String(m)
  const h = Math.floor(m / 60)
  const rem = m % 60
  return `${h}${String(rem).padStart(2, '0')}`
}

function parsePastedToRaw(s: string): string {
  if (!s) return ''
  const str = String(s).trim().toLowerCase()

  // format like "2:50" or "02:50"
  if (str.includes(':')) {
    const parts = str.split(':').map((p) => p.replace(/\D/g, ''))
    if (parts.length >= 2) {
      const h = parseInt(parts[0] || '0', 10) || 0
      const m = parseInt(parts[1] || '0', 10) || 0
      return h === 0 ? String(m) : `${h}${String(m).padStart(2, '0')}`
    }
  }

  // format like "2h50m" or "2h 50m"
  const hMatch = str.match(/(\d+)\s*h/)
  const mMatch = str.match(/(\d+)\s*m/)
  if (hMatch) {
    const h = parseInt(hMatch[1], 10) || 0
    const m = mMatch ? parseInt(mMatch[1], 10) || 0 : 0
    return h === 0 ? String(m) : `${h}${String(m).padStart(2, '0')}`
  }

  const digits = str.replace(/\D/g, '')
  return digits
}

const MyInput = forwardRef<HTMLInputElement, MyInputProps>(
  (
    {
      label,
      showLabel = true,
      placeholder,
      type = 'text',
      error = null,
      icon,
      onFileChange,
      width,
      value,
      onChange,
      ...rest
    },
    ref
  ) => {
    const { isDark } = useTheme()
    const [focused, setFocused] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [displayValue, setDisplayValue] = useState<string>('')

    // rawDigits stores the sequence of digits the user typed (e.g. '254')
    const rawRef = useRef<string>('')
    const [, forceRerender] = useState(0) // used only if needed to force update

    // initialize display + raw when `value` prop (minutes) changes (edit mode)
    useEffect(() => {
      if (type === 'duration') {
        const minutesNum = typeof value === 'number' ? value : Number(value)
        if (isNaN(minutesNum)) {
          rawRef.current = ''
          setDisplayValue('')
        } else {
          rawRef.current = minutesToRaw(minutesNum)
          setDisplayValue(formatDuration(minutesNum))
        }
      } else if (type === 'currency') {
        setDisplayValue(formatCurrency(value as any))
      } else if (type === 'percentage') {
        setDisplayValue(
          value === null || value === undefined || value === ''
            ? ''
            : `${value}%`
        )
      } else {
        setDisplayValue(
          value === undefined || value === null ? '' : String(value)
        )
      }
    }, [value, type])

    // helper to update display and call onChange with minutes (string)
    const updateFromRaw = (newRaw: string) => {
      rawRef.current = newRaw
      if (!newRaw) {
        setDisplayValue('')
        onChange?.({ target: { value: '' } } as any)
        return
      }
      const minutes = rawToMinutes(newRaw)
      setDisplayValue(formatDuration(minutes))
      onChange?.({ target: { value: String(minutes) } } as any)
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (type === 'file') {
        const file = e.target.files?.[0]
        onFileChange?.(file)
        setDisplayValue(file?.name || '')
        return
      }

      if (type === 'currency') {
        let val = e.target.value
        val = val.replace(/\D/g, '')
        const formatted = formatCurrency(val)
        setDisplayValue(formatted)
        const numericValue = parseFloat(val) / 100
        onChange?.({
          ...e,
          target: { ...e.target, value: numericValue.toString() },
        } as any)
        return
      }

      if (type === 'percentage') {
        let val = e.target.value
        val = val.replace(/\D/g, '')
        let num = parseFloat(val)
        if (isNaN(num)) num = 0
        if (num > 100) num = 100
        setDisplayValue(num.toString() + '%')
        onChange?.({
          ...e,
          target: { ...e.target, value: num.toString() },
        } as any)
        return
      }

      if (type === 'duration') {
        const digits = String(e.target.value).replace(/\D/g, '')
        if (!digits) {
          updateFromRaw('')
          return
        }
        updateFromRaw(digits)
        return
      }

      setDisplayValue(e.target.value)
      onChange?.(e)
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (type !== 'duration') return

      const k = e.key

      const navKeys = [
        'ArrowLeft',
        'ArrowRight',
        'ArrowUp',
        'ArrowDown',
        'Tab',
        'Home',
        'End',
        'Enter',
      ]
      if (navKeys.includes(k)) {
        return
      }

      if (k === 'Backspace') {
        e.preventDefault()
        const prev = rawRef.current || ''
        const next = prev.slice(0, -1)
        updateFromRaw(next)
        return
      }

      if (k === 'Delete') {
        e.preventDefault()
        updateFromRaw('')
        return
      }

      if (/^[0-9]$/.test(k)) {
        e.preventDefault()
        const prev = rawRef.current || ''
        const next = prev + k
        const capped = next.length > 6 ? next.slice(-6) : next
        updateFromRaw(capped)
        return
      }

      e.preventDefault()
    }

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
      if (type !== 'duration') return
      e.preventDefault()
      const text = e.clipboardData.getData('text') || ''
      const parsed = parsePastedToRaw(text)
      if (!parsed) {
        updateFromRaw('')
      } else {
        updateFromRaw(parsed)
      }
    }

    const isPassword = type === 'password'
    const inputType = isPassword
      ? showPassword
        ? 'text'
        : 'password'
      : ['currency', 'percentage', 'duration'].includes(type)
      ? 'text'
      : type

    const borderDefault = '#3C393F'
    const borderFocus = '#8E4EC6'
    const bgLight = '#FFFFFF'
    const bgDark = '#1A191B'
    const textLight = '#0B0B0B'
    const textDark = '#F5F5F7'

    const commonStyles = {
      width: '100%',
      padding: icon || isPassword ? '10px 36px 10px 12px' : '10px 12px',
      borderRadius: '4px',
      border: `1px solid ${focused ? borderFocus : borderDefault}`,
      backgroundColor: isDark ? bgDark : bgLight,
      color: isDark ? textDark : textLight,
      outline: 'none',
      transition: 'border-color 0.15s ease',
      boxSizing: 'border-box',
      fontSize: 14,
    }

    return (
      <label
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          width: width ?? '100%',
        }}>
        {label && showLabel && (
          <span
            style={{
              color: isDark ? textDark : textLight,
              fontSize: 13,
              lineHeight: 1,
            }}>
            {label}
          </span>
        )}

        <div style={{ position: 'relative', width: '100%' }}>
          <input
            ref={ref}
            type={inputType as any}
            placeholder={placeholder}
            aria-label={label ?? placeholder}
            aria-invalid={!!error}
            value={type === 'file' ? undefined : displayValue} 
            {...rest}
            onFocus={(e) => {
              setFocused(true)
              rest.onFocus?.(e as any)
            }}
            onBlur={(e) => {
              setFocused(false)
              rest.onBlur?.(e as any)
            }}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            onPaste={handlePaste}
            style={commonStyles}
          />

          {icon && (
            <span
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                color: isDark ? textDark : textLight,
                pointerEvents: 'none',
              }}>
              {icon}
            </span>
          )}

          {isPassword && (
            <button
              type='button'
              onClick={() => setShowPassword((prev) => !prev)}
              style={{
                position: 'absolute',
                right: 10,
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: isDark ? textDark : textLight,
              }}>
              {showPassword ? (
                <EyeClosedIcon width={20} height={20} />
              ) : (
                <EyeOpenIcon width={20} height={20} />
              )}
            </button>
          )}
        </div>

        {error && (
          <span style={{ color: '#E11D48', fontSize: 12, marginTop: 4 }}>
            {error}
          </span>
        )}
      </label>
    )
  }
)

MyInput.displayName = 'MyInput'
export default MyInput
