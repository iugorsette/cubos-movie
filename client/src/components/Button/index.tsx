import { Button, IconButton } from '@radix-ui/themes'
import type { ComponentProps } from 'react'
import { useTheme } from '../../context/useTheme'

type MyButtonProps = Omit<ComponentProps<typeof Button>, 'variant' | 'colorVariant'> & {
  colorVariant?: 'primary' | 'secondary' // agora repassaremos para o Radix
  icon?: React.ReactNode
  iconButton?: boolean
  variant?: 'solid' | 'soft' | 'outline'
}

export default function MyButton({
  colorVariant = 'primary',
  icon,
  iconButton = false,
  variant = 'solid',
  ...props
}: MyButtonProps) {
  const { isDark } = useTheme()

  const styles = {
    primary: {
      light: { default: '#8E4EC6', hover: '#9A5CD0', active: '#8457AA', disabled: '#6F6D78', color: '#FFF' },
      dark: { default: '#8457AA', hover: '#9A5CD0', active: '#8E4EC6', disabled: '#6F6D78', color: '#FFF' },
    },
    secondary: {
      light: { default: '#B744F708', hover: '#C150FF18', active: '#B412F904', disabled: '#EBEAF808', color: '#000' },
      dark: { default: '#B744F720', hover: '#C150FF33', active: '#B412F918', disabled: '#EBEAF833', color: '#FFF' },
    },
  }

  const theme = isDark ? 'dark' : 'light'
  const current = styles[colorVariant][theme]

  const sharedProps = {
    ...props,
    variant,
    colorVariant,
    style: {
      ...(variant === 'solid' && { backgroundColor: current.default, color: current.color }),
      cursor: props.disabled ? 'not-allowed' : 'pointer',
      border: 'none',
      padding: iconButton ? '0.5rem' : '0.5rem 1rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.2s ease',
      ...(props.style || {}),
    },
    onMouseEnter: (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!props.disabled && variant === 'solid') e.currentTarget.style.backgroundColor = current.hover
      if (props.onMouseEnter) props.onMouseEnter(e)
    },
    onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!props.disabled && variant === 'solid') e.currentTarget.style.backgroundColor = current.default
      if (props.onMouseLeave) props.onMouseLeave(e)
    },
    onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!props.disabled && variant === 'solid') e.currentTarget.style.backgroundColor = current.active
      if (props.onMouseDown) props.onMouseDown(e)
    },
    onMouseUp: (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!props.disabled && variant === 'solid') e.currentTarget.style.backgroundColor = current.hover
      if (props.onMouseUp) props.onMouseUp(e)
    },
  }

  if (iconButton) return <IconButton {...sharedProps}>{icon}</IconButton>
  return (
    <Button {...sharedProps}>
      {icon && <span style={{ marginRight: '0.5rem' }}>{icon}</span>}
      {props.children}
    </Button>
  )
}
