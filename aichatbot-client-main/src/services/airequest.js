import axios from './axios'

export const queryToAI = async (userId, content, conversationId) => {
  try {
    const response = await axios.post('/ai', {
      userId,
      content,
      conversationId,
    })
    const output = response.data?.output
    return output
  } catch (err) {
    console.error('Query to AI failed:', err.response?.data || err.message)
    throw err
  }
}
