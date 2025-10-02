import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import "@radix-ui/themes/styles.css";

// Importa os pesos que você vai usar
import "@fontsource/inter/400.css"; // regular
import "@fontsource/inter/500.css"; // medium
import "@fontsource/inter/700.css"; // bold




createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
