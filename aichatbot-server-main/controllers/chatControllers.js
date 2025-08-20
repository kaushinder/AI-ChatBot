import ChatMessage from '../models/chatMessage.js'

export const getConversationMessage = async (req, res) => {
  try {
    const { conversationId } = req.params
    const messages = await ChatMessage.find({ conversationId }).sort({
      timestamp: 1,
    }).select('role content _id')
    res.status(200).json({ messages })
  } catch (err) {
    console.log('error fetching messages', err)
    res.status(500).json({ error: 'failed to fetch messages' })
  }
}
