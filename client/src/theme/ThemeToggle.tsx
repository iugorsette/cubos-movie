import { MoonIcon, SunIcon } from '@radix-ui/react-icons'
import MyButton from '../components/Button'
import { useTheme } from '../hooks/useTheme'

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <MyButton
      colorVariant='secondary'
      iconButton
      icon={isDark ? <SunIcon /> : <MoonIcon />}
      onClick={() => toggleTheme()}
    />
  )
}
