import { useTheme } from '../../hooks/useTheme'
import './index.css'

export default function Footer() {
  const { isDark } = useTheme()

  return (
    <footer 
    style={{ borderTop: '1px solid var(--gray-a6)' }}
    className={`footer-container ${isDark ? 'dark-mode' : 'light-mode'}`}>
      <span>
        2025 © Todos os direitos reservados a <b>Cubos Movies</b>
      </span>
    </footer>
  )
}
