import * as Select from '@radix-ui/react-select'
import { CheckIcon, ChevronDownIcon } from '@radix-ui/react-icons'
import { useState } from 'react'
import { useTheme } from '../../hooks/useTheme'

export type MySelectProps = {
  label?: string
  value?: string
  placeholder?: string
  onChange: (value: string) => void
  options: { value: string; label: string }[]
  error?: string | null
  width?: string | number
}

export default function MySelect({
  label,
  value,
  placeholder = 'Selecione...',
  onChange,
  options,
  error = null,
  width,
}: MySelectProps) {
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
      {label && (
        <span
          style={{
            color: isDark ? textDark : textLight,
            fontSize: 13,
            lineHeight: 1,
          }}>
          {label}
        </span>
      )}

      <Select.Root
        value={value}
        onValueChange={onChange}
        onOpenChange={(open) => setFocused(open)}>
        <Select.Trigger
          style={{
            all: 'unset',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '10px 12px',
            borderRadius: 4,
            border: `1px solid ${focused ? borderFocus : borderDefault}`,
            backgroundColor: isDark ? bgDark : bgLight,
            color: isDark ? textDark : textLight,
            fontSize: 14,
            transition: 'border-color 0.15s ease',
          }}>
          <Select.Value placeholder={placeholder} />
          <Select.Icon>
            <ChevronDownIcon />
          </Select.Icon>
        </Select.Trigger>

        <Select.Content
          style={{
            overflow: 'hidden',
            backgroundColor: isDark ? '#2A2A2A' : '#fff',
            borderRadius: 6,
            border: '1px solid #ccc',
            zIndex: 1000,
          }}>
          <Select.Viewport>
            {options.map((opt) => (
              <Select.Item
                key={opt.value}
                value={opt.value}
                style={{
                  padding: '6px 10px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                }}>
                <Select.ItemText>{opt.label}</Select.ItemText>
                <Select.ItemIndicator>
                  <CheckIcon />
                </Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Viewport>
        </Select.Content>
      </Select.Root>

      {error && (
        <span
          style={{
            color: '#E11D48',
            fontSize: 12,
            marginTop: 4,
          }}>
          {error}
        </span>
      )}
    </label>
  )
}
