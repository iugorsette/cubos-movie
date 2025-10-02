import { forwardRef, useState } from 'react'
import type { InputHTMLAttributes, ReactNode } from 'react'
import { useTheme } from '../../context/useTheme'

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
  onFileChange?: (file: File | undefined) => void
  width?: string | number
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
      ...rest
    },
    ref
  ) => {
    const { isDark } = useTheme()
    const [focused, setFocused] = useState(false)

    const borderDefault = '#3C393F'
    const borderFocus = '#8E4EC6'
    const bgLight = '#FFFFFF'
    const bgDark = '#1A191B'
    const textLight = '#0B0B0B'
    const textDark = '#F5F5F7'

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
            type={type}
            placeholder={placeholder}
            aria-label={label ?? placeholder}
            aria-invalid={!!error}
            {...rest}
            onFocus={(e) => {
              setFocused(true)
              if (rest.onFocus) rest.onFocus(e)
            }}
            onBlur={(e) => {
              setFocused(false)
              if (rest.onBlur) rest.onBlur(e)
            }}
            onChange={(e) => {
              if (type === 'file' && onFileChange) {
                onFileChange(e.target.files?.[0])
              }
              if (rest.onChange) rest.onChange(e)
            }}
            style={{
              width: '100%',
              padding: icon ? '10px 36px 10px 12px' : '10px 12px',
              borderRadius: '4px',
              border: `1px solid ${focused ? borderFocus : borderDefault}`,
              backgroundColor: isDark ? bgDark : bgLight,
              color: isDark ? textDark : textLight,
              outline: 'none',
              transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
              boxSizing: 'border-box',
              fontSize: 14,
            }}
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
                display: 'flex',
                alignItems: 'center',
              }}>
              {icon}
            </span>
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
