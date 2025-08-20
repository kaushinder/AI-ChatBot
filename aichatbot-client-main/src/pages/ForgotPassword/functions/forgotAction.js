import { forgotPassword } from '@/services/auth'

export const action = async ({ request }) => {
  try {
    const formData = await request.formData()
    const email = formData.get('email')
    const response = await forgotPassword(email)
    return { success: response.msg }
  } catch (err) {
    return { error: err.message }
  }
}
