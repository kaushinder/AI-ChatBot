import { useState } from 'react'
import { ChatContext } from './ChatContext'

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([])
  const [chats, setChats] = useState([])
  return (
    <ChatContext.Provider value={{ messages, chats, setMessages, setChats }}>
      {children}
    </ChatContext.Provider>
  )
}
