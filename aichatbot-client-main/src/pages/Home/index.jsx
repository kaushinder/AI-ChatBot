import React, { useEffect, useRef, useState } from 'react'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { queryToAI } from '@/services/airequest.js'
import { toast } from 'sonner'
import ReactMarkdown from 'react-markdown'
import { FaArrowUp } from 'react-icons/fa'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { useChats } from '@/hooks/useChats'

function Home() {
  const [query, setQuery] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const msgEndRef = useRef(null)

  const { isLoggedIn, conversationId } = useAuth()
  const { messages, setMessages } = useChats()
  const navigate = useNavigate()

  const handleSend = async () => {
    if (!query.trim()) return

    const content = query
    setQuery('')
    const userId = localStorage.getItem('userId')
    const conversationId = localStorage.getItem('conversationId')

    const newQuery = { role: 'user', content }
    setMessages((prev) => [...prev, newQuery])

    try {
      setIsLoading(true)
      const res = await queryToAI(userId, content, conversationId)
      const newResponse = { role: 'assistant', content: res }
      setMessages((prev) => [...prev, newResponse])
      // toast.success('AI responded!', { id })
    } catch (err) {
      console.error('Error sending query:', err)
      toast.error(err.response?.data?.error || err.message)
      setMessages((prev) => prev.slice(0, -1))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (messages.length > 0 && msgEndRef.current) {
      msgEndRef.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages])

  return (
    <div className="flex flex-col h-full bg-background text-foreground pt-10">
      <div
        className={`flex flex-col flex-grow px-4 ${
          messages.length === 0
            ? 'justify-center items-center'
            : 'pt-10 items-center'
        }`}
      >
        {messages.length === 0 && (
          <div className="animate-fadeIn">
            <h1 className="text-3xl sm:text-4xl md:text-5xl text-center font-extrabold mb-4 sm:mb-6 leading-tight">
              Welcome to <br />
              <span className="text-primary">AI CHATBOT</span>
            </h1>
            <div className="flex flex-col gap-2 p-2">
              <p className="text-center text-muted-foreground text-sm sm:text-base md:text-lg max-w-md mx-auto">
                Your Personal AI Assistant
              </p>
              <p className="text-center text-muted-foreground text-sm sm:text-base md:text-lg max-w-md mx-auto">
                Chat with your AI assistant and get answers to your questions.
              </p>
              {!isLoggedIn && (
                <p className="text-center font-bold text-destructive text-sm sm:text-base md:text-lg max-w-md mx-auto">
                  Please login to continue.
                </p>
              )}
              {isLoggedIn && !conversationId && (
                <p className="text-center font-bold text-destructive text-sm sm:text-base md:text-lg max-w-md mx-auto">
                  All your conversations are deleted. <br /> Please create a new
                  conversation.
                </p>
              )}
            </div>
          </div>
        )}

        {messages.length > 0 && (
          <div className="w-full max-w-4xl flex flex-col gap-5 pt-5">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`p-3 rounded-xl inline-block break-words ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground self-end text-right'
                    : 'self-start text-left'
                }`}
              >
                <ReactMarkdown>{msg.content}</ReactMarkdown>
              </div>
            ))}
            {isLoading && (
              <div className="flex space-x-5 items-center justify-center">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="inline-block w-3 h-3 rounded-full bg-primary animate-bounce"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  />
                ))}
              </div>
            )}
            <div ref={msgEndRef} />
          </div>
        )}
      </div>

      {/* Input box */}
      <div className="w-full max-w-2xl mx-auto px-4 pb-4 ">
        <div className="relative w-full">
          <Textarea
            placeholder="Ask me anything..."
            className="w-full pr-14 resize-none max-h-40 overflow-y-auto"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (!isLoggedIn) navigate('/login')
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                handleSend()
              }
            }}
          />
          <Button
            onClick={handleSend}
            className={`absolute bottom-2 right-2 p-2 ${
              !query ? 'opacity-50 pointer-events-none' : ''
            }`}
            disabled={!query || isLoading}
          >
            <FaArrowUp />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default Home
