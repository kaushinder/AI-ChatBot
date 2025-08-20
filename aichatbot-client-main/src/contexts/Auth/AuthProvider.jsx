import { useEffect, useState } from 'react'
import { AuthContext } from './AuthContext'
import { toast } from 'sonner'
import { useChats } from '@/hooks/useChats'

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null)
  const [userId, setUserId] = useState(null)
  const [conversationId, setConversationId] = useState(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [user, setUser] = useState(null)

  const { setMessages, setChats } = useChats()

  // load data from local storage on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('token')
    const storedUserId = localStorage.getItem('userId')
    const storedConversationId = localStorage.getItem('conversationId')
    const storedUser = localStorage.getItem('userName')
    if (storedToken && storedUserId && storedConversationId) {
      setToken(storedToken)
      setUserId(storedUserId)
      setConversationId(storedConversationId)
      setUser(storedUser)
      setIsLoggedIn(true)
    }
  }, [])

  const handleLogin = (token, userId, conversationId, userName) => {
    localStorage.setItem('token', token)
    localStorage.setItem('userId', userId)
    localStorage.setItem('conversationId', conversationId)
    localStorage.setItem('userName', userName)
    setToken(token)
    setUserId(userId)
    setConversationId(conversationId)
    setIsLoggedIn(true)
    setUser(userName)
  }

  const handleLogOut = () => {
    const id = toast.loading('Logging out...')
    setTimeout(() => {
      setToken(null)
      setUserId(null)
      setConversationId(null)
      setIsLoggedIn(false)
      setMessages([])
      setChats([])
      setUser(null)

      localStorage.removeItem('token')
      localStorage.removeItem('userId')
      localStorage.removeItem('conversationId')
      localStorage.removeItem('userName')
      toast.success('Log out successfull!', { id })
    }, 2000)
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        token,
        userId,
        conversationId,
        user,
        setUser,
        setToken,
        setUserId,
        setConversationId,
        setIsLoggedIn,
        handleLogin,
        handleLogOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
