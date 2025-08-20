import axios from 'axios'

export const callAI = async (messages) => {
  try {
    const response = await axios.post(
      `${process.env.API_URL}`,
      {
        model: `${process.env.AI_MODEL}`,
        messages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    )

    const resData = response.data
    // console.log('OpenRouter response:', JSON.stringify(resData, null, 2))

    // If the response has an error field
    if (resData.error) {
      throw new Error(resData.error.message || 'AI provider returned an error')
    }

    // API compatible response
    if (resData.choices && resData.choices.length > 0) {
      return resData.choices[0].message.content
    }

    throw new Error('Invalid AI API response format')
  } catch (err) {
    console.error('callAI error:', err?.response?.data || err.message)
    throw err
  }
}
