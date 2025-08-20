import { useContext } from 'react'
import { ChatContext } from '@/contexts/Chats/ChatContext'

function useChats() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error('ChatContext was used outside of its Provider')
  }
  return context
}

export { useChats }
