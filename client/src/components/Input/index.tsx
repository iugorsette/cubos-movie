import { forwardRef, useState, useEffect } from 'react'
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
  onFileChange?: (file: File | undefined) => void
  width?: string | number
}

const formatCurrency = (value: string | number) => {
  if (value === '' || value === null || value === undefined) return ''
  const numeric =
    typeof value === 'number' ? value : parseFloat(value.replace(/\D/g, '')) / 100
  if (isNaN(numeric)) return ''
  return numeric.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
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
    const [displayValue, setDisplayValue] = useState(String(value ?? ''))

    useEffect(() => {
      if (value === null || value === undefined || value === '') {
        setDisplayValue('')
        return
      }

      if (type === 'currency') {
        const formatted = formatCurrency(value)
        setDisplayValue(formatted)
      } else if (type === 'percentage') {
        setDisplayValue(value + '%')
      } else {
        setDisplayValue(String(value))
      }
    }, [value, type])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let val = e.target.value

      if (type === 'currency') {
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

      setDisplayValue(val)
      onChange?.(e)
    }

    const isPassword = type === 'password'
    const inputType =
      type === 'currency' || type === 'percentage'
        ? 'text'
        : isPassword
        ? showPassword
          ? 'text'
          : 'password'
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
            type={inputType}
            placeholder={placeholder}
            aria-label={label ?? placeholder}
            aria-invalid={!!error}
            value={displayValue}
            {...rest}
            onFocus={(e) => {
              setFocused(true)
              rest.onFocus?.(e)
            }}
            onBlur={(e) => {
              setFocused(false)
              rest.onBlur?.(e)
            }}
            onChange={handleChange}
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
