import { useContext } from 'react'
import { AuthContext } from '../contexts/Auth/AuthContext'

function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('AuthContext was used outside of its Provider')
  }
  return context
}

export { useAuth }
