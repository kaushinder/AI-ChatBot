import { handleChatMessage } from '../services/chatService.js'

export const askAI = async (req, res) => {
  try {
    const { userId, content, conversationId } = req.body

    if (!userId || !content) {
      return res.status(400).json({ error: 'Missing userId or content' })
    }

    const { response, error } = await handleChatMessage(
      userId,
      content,
      conversationId
    )
    if (error) {
      return res.status(400).json({ error })
    }

    res.status(200).json({ output: response })
  } catch (err) {
    console.log('askAI error', err)
    res.status(500).json({ error: err.message })
  }
}
