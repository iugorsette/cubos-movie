import { Button, IconButton } from '@radix-ui/themes'
import type { ComponentProps } from 'react'
import { useTheme } from '../../context/useTheme'

type MyButtonProps = Omit<ComponentProps<typeof Button>, 'variant'> & {
  variant?: 'primary' | 'secondary'
  icon?: React.ReactNode
  iconButton?: boolean
  //   isDark?: boolean
}

export default function MyButton({
  variant = 'primary',
  icon,
  iconButton = false,
  ...props
}: MyButtonProps) {
  const { isDark } = useTheme()
  // Paletas de cores customizadas
  const styles = {
    primary: {
      light: {
        default: '#8E4EC6',
        hover: '#9A5CD0',
        active: '#8457AA',
        disabled: '#6F6D78',
        color: '#FFF',
      },
      dark: {
        default: '#8457AA',
        hover: '#9A5CD0',
        active: '#8E4EC6',
        disabled: '#6F6D78',
        color: '#FFF',
      },
    },
    secondary: {
      light: {
        default: '#B744F708',
        hover: '#C150FF18',
        active: '#B412F904',
        disabled: '#EBEAF808',
        color: '#000',
      },
      dark: {
        default: '#B744F720',
        hover: '#C150FF33',
        active: '#B412F918',
        disabled: '#EBEAF833',
        color: '#FFF',
      },
    },
  }

  const theme = isDark ? 'dark' : 'light'
  const current = styles[variant][theme]

  const sharedProps = {
    ...props,
    style: {
      backgroundColor: current.default,
      color: current.color,
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
      if (!props.disabled) e.currentTarget.style.backgroundColor = current.hover
    },
    onMouseLeave: (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!props.disabled)
        e.currentTarget.style.backgroundColor = current.default
    },
    onMouseDown: (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!props.disabled)
        e.currentTarget.style.backgroundColor = current.active
    },
    onMouseUp: (e: React.MouseEvent<HTMLButtonElement>) => {
      if (!props.disabled) e.currentTarget.style.backgroundColor = current.hover
    },
  }

  if (iconButton) {
    return <IconButton {...sharedProps}>{icon}</IconButton>
  }

  return (
    <Button {...sharedProps}>
      {icon ? <span style={{ marginRight: '0.5rem' }}>{icon}</span> : null}
      {props.children}
    </Button>
  )
}
