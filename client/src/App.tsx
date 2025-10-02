import { Theme } from '@radix-ui/themes'
import Header from './components/Header'
import { ThemeProvider } from './context/ThemeContext'
import { useTheme } from './context/useTheme'
import AppRoutes from './routes'
import BackGround from "./assets/BACKGROUND.png";
function AppContent() {
  const { isDark } = useTheme()

  return (
    <Theme
      appearance={isDark ? 'dark' : 'light'}
      accentColor='purple'
      grayColor='mauve'
      // panelBackground="solid"
      radius='none'
      scaling='100%'
      className='inter'
      >
        
      <Header />
       <img
        src={BackGround}
        alt="Background"
        style={{
          width: "100%",
          opacity: 0.1,
          height: "50vh",
          objectFit: "cover",
          position: "absolute",
          zIndex: -1,
        }}
      />
      <AppRoutes/>
      {/* <main style={{ padding: '2rem' }}>
        <p>Bem-vindo ao Cubos Movies 🚀</p>
      </main> */}
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
