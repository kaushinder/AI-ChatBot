import { signup } from '@/services/auth'

export const action = async ({ request }) => {
  try {
    const formData = await request.formData()
    const name = formData.get('name')
    const email = formData.get('email')
    const password = formData.get('password')
    const response = await signup(name, email, password)
    return { success: 'Signup Successful!', response }
  } catch (err) {
    return { error: 'Signup Failed!' }
  }
}
