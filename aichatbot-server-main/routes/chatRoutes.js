import express from 'express'
import { getConversationMessage } from '../controllers/chatControllers.js'

const router = express.Router()

router.get('/messages/:conversationId', getConversationMessage)

export default router
