import Conversation from '../models/conversation.js'
import ChatMessage from '../models/chatMessage.js'

export const startNewConversation = async (req, res) => {
  try {
    const { userId } = req.body
    if (!userId) return res.status(400).json({ error: 'userId is required' })

    // mark all existing conversations as inactive
    await Conversation.updateMany({ userId }, { $set: { isActive: false } })

    // create a new conversation
    const conversation = await Conversation.create({ userId })
    res.status(201).json({
      msg: 'New conversation started',
      conversationId: conversation._id,
      title: conversation.title,
    })
  } catch (err) {
    console.log('startNewConversation error', err)
    res.status(500).json({ error: 'error starting new conversation' })
  }
}

export const getAllConversations = async (req, res) => {
  try {
    const { userId } = req.params

    const conversations = await Conversation.find({ userId }).select(
      'title _id'
    )
    res.status(200).json({ conversations })
  } catch (err) {
    console.log('error fetching all conversations', err)
    res.status(500).json({ error: 'failed to fetch chat history' })
  }
}

export const renameConversation = async (req, res) => {
  try {
    const { conversationId } = req.params
    const { newTitle } = req.body

    if (!newTitle || newTitle.trim() === '')
      return res.status(400).json({ error: 'title is required' })

    const conversation = await Conversation.findById(conversationId)
    if (!conversation)
      return res.status(404).json({ error: 'conversation not found' })

    conversation.title = newTitle
    await conversation.save()
    res
      .status(200)
      .json({ msg: 'conversation renamed successfully', conversation })
  } catch (err) {
    console.log('error renaming conversation', err)
    res.status(500).json({ error: 'failed to rename conversation' })
  }
}

export const deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params
    await Conversation.findByIdAndDelete(conversationId)
    await ChatMessage.deleteMany({ conversationId })
    res.status(200).json({ msg: 'conversation deleted successfully' })
  } catch (err) {
    console.log('error deleting conversation', err)
    res.status(500).json({ error: 'failed to delete conversation' })
  }
}
