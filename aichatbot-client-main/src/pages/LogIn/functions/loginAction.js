import { login } from "@/services/auth"

export const action = async ({ request }) => {
  try {
    const formData = await request.formData()
    const email = formData.get('email')
    const password = formData.get('password')
    const response = await login(email, password)
    return { success: 'Login Successful!', response }
  } catch (err) {
    return { error: 'Login Failed!' }
  }
}
