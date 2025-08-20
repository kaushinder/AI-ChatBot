import mongoose from 'mongoose'

const ConversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: 'New Chat',
  },
})

// method to get or create active conversation
ConversationSchema.statics.getOrCreateActive = async function (userId) {
  let conv = await this.findOne({ userId, isActive: true })
  if (!conv) {
    conv = await this.create({ userId })
  }
  return conv
}

const Conversation = mongoose.model('Conversation', ConversationSchema)
export default Conversation
