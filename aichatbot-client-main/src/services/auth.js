import axios from './axios'

export const login = async (email, password) => {
  try {
    const response = await axios.post('/auth/login', { email, password })
    const { token } = response.data
    localStorage.setItem('token', token)
    return response.data
  } catch (err) {
    console.error('Login failed:', err.response?.data || err.message)
    throw err
  }
}

export const signup = async (name, email, password) => {
  try {
    const response = await axios.post('/auth/signup', { name, email, password })
    const { token } = response.data
    localStorage.setItem('token', token)
    return response.data
  } catch (err) {
    console.error('Signup failed:', err.response?.data || err.message)
    throw err
  }
}

export const forgotPassword = async (email) => {
  try {
    const response = await axios.post('/auth/forgotPassword', { email })
    return response.data
  } catch (err) {
    console.error('Error sending email')
    throw err
  }
}

export const resetPassword = async (resetToken, newPassword) => {
  try {
    const response = await axios.post('/auth/resetPassword', {
      resetToken,
      newPassword,
    })
    return response.data
  } catch (err) {
    console.error('Error resetting password')
    throw err
  }
}
