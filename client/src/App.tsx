import { Theme } from '@radix-ui/themes'
import Header from './components/Header'
import { ThemeProvider } from './context/ThemeContext'
import AppRoutes from './routes/AppRoutes'
import BackGround from './assets/BACKGROUND.png'
import { AuthProvider } from './hooks/useAuth'
import { BrowserRouter } from 'react-router-dom'
import { useTheme } from './hooks/useTheme'
import BackgroundWithGradient from './components/Background'
import Footer from './components/Footer'
function AppContent() {
  const { isDark } = useTheme()

  return (
    <Theme
      appearance={isDark ? 'dark' : 'light'}
      accentColor='purple'
      grayColor='mauve'
      radius='small'
      scaling='100%'
      className='inter'>
      <AuthProvider>
        <BrowserRouter>
          <BackgroundWithGradient imageUrl={BackGround}>
            <Header />
            <AppRoutes />
            <Footer />
          </BackgroundWithGradient>
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
