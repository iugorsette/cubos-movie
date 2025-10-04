import { Theme } from '@radix-ui/themes'
import Header from './components/Header'
import { ThemeProvider } from './context/ThemeContext'
import AppRoutes from './routes/AppRoutes'
import BackGround from './assets/BACKGROUND.png'
import { AuthProvider } from './hooks/useAuth'
import { BrowserRouter } from 'react-router-dom'
import { useTheme } from './hooks/useTheme'
function AppContent() {
  const { isDark } = useTheme()

  return (
    <Theme
      appearance={isDark ? 'dark' : 'light'}
      accentColor='purple'
      grayColor='mauve'
      radius='none'
      scaling='100%'
      className='inter'>
      <AuthProvider>
        <BrowserRouter>
          <Header />
          <img
            src={BackGround}
            alt='Background'
            style={{
              width: '100%',
              opacity: 0.1,
              height: '50vh',
              objectFit: 'cover',
              position: 'absolute',
              zIndex: -1,
            }}
          />
          <AppRoutes />
        </BrowserRouter>
      </AuthProvider>
    </Theme>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}
