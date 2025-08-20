import express from 'express'
import {
  deleteConversation,
  getAllConversations,
  renameConversation,
  startNewConversation,
} from '../controllers/conversationControllers.js'

const router = express.Router()

// start a new chat session
router.post('/conversations', startNewConversation)

// get all conversations
router.get('/conversations/:userId', getAllConversations)

// rename conversation
router.patch('/conversations/rename/:conversationId', renameConversation)

// delete conversation
router.delete('/conversations/remove/:conversationId', deleteConversation)

export default router
