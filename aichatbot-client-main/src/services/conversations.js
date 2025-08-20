import axios from './axios'

export const getAllConversations = async (userId) => {
  try {
    const res = await axios.get(`/conversations/${userId}`)
    return res.data
  } catch (err) {
    console.log('error fetching conversations', err)
  }
}

export const getConversationChats = async (conversationId) => {
  try {
    const res = await axios.get(`/messages/${conversationId}`)
    return res.data
  } catch (err) {
    console.log('error fetching conversations', err)
  }
}

export const createConversation = async (userId) => {
  try {
    const res = await axios.post('/conversations', { userId })
    return res.data
  } catch (err) {
    console.log('error creating conversation', err)
  }
}

export const updateConversationTitle = async (conversationId, newTitle) => {
  const res = await axios.patch(`/conversations/rename/${conversationId}`, {
    newTitle,
  })
  return res.data
}

export const deleteConversation = async (conversationId) => {
  const res = await axios.delete(`/conversations/remove/${conversationId}`)
  return res.data
}
