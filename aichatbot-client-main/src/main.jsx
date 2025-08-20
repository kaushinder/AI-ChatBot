import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from '@/components/ui/theme-provider'
import { AuthProvider } from './contexts/Auth/AuthProvider'
import { ChatProvider } from './contexts/Chats/ChatProvider'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      <ChatProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ChatProvider>
    </ThemeProvider>
  </StrictMode>
)
