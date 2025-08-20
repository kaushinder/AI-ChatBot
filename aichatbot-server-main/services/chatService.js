import ChatMessage from '../models/chatMessage.js'
import Conversation from '../models/conversation.js'
import { callAI } from './aiservice.js'

const MAX_MESSAGES = 5

export const handleChatMessage = async (userId, content, conversationId) => {
  // validate conversation
  const conversation = await Conversation.findOne({
    _id: conversationId,
    userId,
  })

  if (!conversation) {
    return { error: 'Conversation not found' }
  }

  // check message limit
  const messageCount = await ChatMessage.countDocuments({
    conversationId,
  })

  if (messageCount >= MAX_MESSAGES * 2) {
    conversation.isActive = false
    await conversation.save()
    return { error: 'Message limit reached. Please start a new session.' }
  }

  // save user message
  await ChatMessage.create({
    userId,
    conversationId: conversation._id,
    role: 'user',
    content,
  })

  // get full chat history for this conversation
  const history = await ChatMessage.find({
    conversationId: conversation._id,
  })
    .sort({ timestamp: 1 })
    .select('role content')

  // send to AI
  const aiResponse = await callAI(history)

  // save ai message
  await ChatMessage.create({
    userId,
    conversationId: conversation._id,
    role: 'assistant',
    content: aiResponse,
  })

  return { response: aiResponse }
}
