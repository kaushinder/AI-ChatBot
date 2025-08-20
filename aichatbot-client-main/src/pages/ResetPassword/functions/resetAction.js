import { resetPassword } from '@/services/auth'

export const action = async ({ request, params }) => {
  const { resetToken } = params
  const formData = await request.formData()
  const password = formData.get('password')
  try {
    const response = await resetPassword(resetToken, password)
    return { success: response.msg }
  } catch (err) {
    return { error: err.message }
  }
}
