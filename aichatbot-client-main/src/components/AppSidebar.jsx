import { X, Check, Pencil, Plus, User2, Trash } from 'lucide-react'

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar'
import { useEffect, useState } from 'react'
import {
  createConversation,
  deleteConversation,
  getAllConversations,
  getConversationChats,
  updateConversationTitle,
} from '@/services/conversations'
import { useChats } from '@/hooks/useChats'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'

export default function AppSidebar() {
  const [editingChat, setEditingChat] = useState(null) // { id, title }
  const [activeId, setActiveId] = useState(
    localStorage.getItem('conversationId')
  )

  const { userId, setConversationId, isLoggedIn, user, conversationId } =
    useAuth()
  const { setMessages, chats, setChats } = useChats()

  const navigate = useNavigate()

  const handleChats = async (item) => {
    const conversationId = item._id
    localStorage.setItem('conversationId', conversationId)
    setConversationId(conversationId)
    setActiveId(conversationId)

    try {
      const res = await getConversationChats(conversationId)
      setMessages(res.messages)
    } catch (err) {
      console.log('error fetching chat messages', err)
      if (err.response.status === 404) {
        setMessages([])
      }
    }
  }

  const handleNewChat = async () => {
    try {
      const res = await createConversation(userId)
      const newChat = { title: res.title, _id: res.conversationId }
      setChats((prev) => [newChat, ...prev])
      handleChats(newChat)
      localStorage.setItem('conversationId', res.conversationId)
      setConversationId(res.conversationId)
      setActiveId(res.conversationId)
    } catch (err) {
      console.log('error creating new chat', err)
    }
  }

  const handleRename = async () => {
    if (!editingChat) return
    const { id, title } = editingChat

    try {
      await updateConversationTitle(id, title)
      const updatedChats = chats.map((chat) =>
        chat._id === id ? { ...chat, title } : chat
      )
      setChats(updatedChats)
      setEditingChat(null)

      // Optionally refresh messages if editing the active chat
      if (id === activeId) {
        const res = await getConversationChats(id)
        setMessages(res.messages)
      }
    } catch (err) {
      console.log('error renaming chat', err)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteConversation(id)

      const remainingChats = chats.filter((chat) => chat._id !== id)
      setChats(remainingChats)

      if (remainingChats.length > 0) {
        const next = remainingChats[0]
        setActiveId(next._id)
        setConversationId(next._id)
        localStorage.setItem('conversationId', next._id)
        handleChats(next)
      } else {
        setActiveId(null)
        setConversationId(null)
        localStorage.removeItem('conversationId')
        setMessages([])
      }
    } catch (err) {
      console.log('error deleting chat', err)
    }
  }

  useEffect(() => {
    if (!userId) return
    const fetchChats = async () => {
      try {
        const res = await getAllConversations(userId)
        setChats(res.conversations)
      } catch (err) {
        console.log('error fetching chats', err)
      }
    }
    fetchChats()
  }, [userId, setChats])

  useEffect(() => {
    if (conversationId) setActiveId(conversationId)
  }, [conversationId])

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="flex items-center justify-between mt-10">
            <span className="text-primary font-semibold text-lg">
              Chat History
            </span>
            <button
              onClick={() => {
                if (isLoggedIn) {
                  handleNewChat()
                  // toggleSidebar()
                } else {
                  navigate('/login')
                }
              }}
              title="New Chat"
            >
              <Plus className="w-4 h-4 text-muted-foreground hover:text-foreground transition cursor-pointer" />
            </button>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {chats.length === 0 ? (
                <div className="text-sm text-muted-foreground px-3 py-2">
                  No chats yet
                </div>
              ) : (
                chats.map((item) => {
                  const isThisEditing = editingChat?.id === item._id

                  return (
                    <SidebarMenuItem
                      key={item._id}
                      className="flex items-center justify-between"
                    >
                      <SidebarMenuButton
                        onClick={() => handleChats(item)}
                        className={`truncate flex cursor-pointer justify-between items-center ${
                          item._id === activeId
                            ? 'bg-accent text-accent-foreground font-semibold border-l-2 border-primary'
                            : ''
                        }`}
                      >
                        {isThisEditing ? (
                          <input
                            autoFocus
                            value={editingChat.title}
                            onChange={(e) =>
                              setEditingChat({
                                ...editingChat,
                                title: e.target.value,
                              })
                            }
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleRename()
                              else if (e.key === 'Escape') setEditingChat(null)
                            }}
                            className="w-full bg-transparent outline-none text-foreground"
                          />
                        ) : (
                          <span className="truncate">{item.title}</span>
                        )}
                      </SidebarMenuButton>

                      {isThisEditing ? (
                        <div className="ml-2 flex gap-1">
                          <button
                            onClick={handleRename}
                            className="text-green-500 hover:text-green-600 cursor-pointer"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setEditingChat(null)}
                            className="text-red-500 hover:text-red-600 cursor-pointer"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleChats(item) // select the chat
                              setEditingChat({
                                id: item._id,
                                title: item.title,
                              })
                            }}
                            className="ml-2 text-muted-foreground hover:text-foreground cursor-pointer"
                            title="Rename Chat"
                          >
                            <Pencil className="w-3 h-3" />
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleDelete(item._id)
                            }}
                            className="ml-2 text-muted-foreground hover:text-foreground cursor-pointer"
                          >
                            <Trash className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </SidebarMenuItem>
                  )
                })
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton>
              <User2 /> {user || 'Username'}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
