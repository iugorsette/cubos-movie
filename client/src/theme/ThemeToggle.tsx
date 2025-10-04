import { MoonIcon, SunIcon } from '@radix-ui/react-icons'
import MyButton from '../components/Button'
import { useTheme } from '../hooks/useTheme'

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()

  return (
    <MyButton
      colorVariant='secondary'
      iconButton
      icon={
        isDark ? (
          <SunIcon width={20} height={20} />
        ) : (
          <MoonIcon width={20} height={20} />
        )
      }
      onClick={() => toggleTheme()}
    />
  )
}
