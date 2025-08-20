import User from '../models/user.js'
import Conversation from '../models/conversation.js'
import jwt from 'jsonwebtoken'
import { sendEmail } from '../services/sendEmail.js'
import crypto from 'crypto'

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME,
  })
}

// signup controller
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body
    console.log('name, email, password', name, email, password)

    // check if user already exists
    const userExists = await User.findOne({ email })
    if (userExists) {
      return res.status(400).json({ msg: 'User already exists' })
    }

    const user = await User.create({ name, email, password })
    const token = createToken(user._id)

    // start a new conversation immediately after signup
    const conversation = await Conversation.create({ userId: user._id })

    res.status(201).json({
      msg: 'Signup Successful',
      user,
      token,
      conversationId: conversation._id,
    })
  } catch (err) {
    console.log('signup error', err)
    res.status(500).json({ error: 'signup failed' })
  }
}

// login controller
export const login = async (req, res) => {
  try {
    const { email, password } = req.body
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ msg: 'Invalid Credentials' })
    }
    const isPasswordCorrect = await user.comparePassword(
      password,
      user.password
    )
    if (!isPasswordCorrect) {
      return res.status(401).json({ msg: 'Invalid Credentials' })
    }

    const token = createToken(user._id)

    // mark all existing conversations as inactive
    await Conversation.updateMany(
      { userId: user._id },
      { $set: { isActive: false } }
    )

    // start a new conversation on login
    const conversation = await Conversation.create({ userId: user._id })

    res.status(200).json({
      msg: 'Login Successful',
      user,
      token,
      conversationId: conversation._id,
    })
  } catch (err) {
    console.log('login error', err)
    res.status(500).json({ error: 'login failed' })
  }
}

// forgot password controller
export const forgotPassword = async (req, res) => {
  const { email } = req.body
  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({ msg: 'User not found' })
    }

    const resetToken = user.createPasswordResetToken()
    await user.save()

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password.\nClick the link to reset your password: ${resetUrl}\nValid for only 10 minutes`

    await sendEmail(user.email, 'Password Reset Request', message)

    res.status(200).json({ msg: 'Password reset link sent to your email' })
  } catch (err) {
    console.log('forgot password error', err)
    res.status(500).json({ error: 'forgot password failed' })
  }
}

// reset password controller
export const resetPassword = async (req, res) => {
  const { resetToken, newPassword } = req.body
  const hashedToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex')
  try {
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    })
    if (!user) {
      return res.status(400).json({ msg: 'Invalid or expired token' })
    }
    user.password = newPassword
    user.passwordResetToken = undefined
    user.passwordResetExpires = undefined
    await user.save()
    res.status(200).json({ msg: 'Password reset successful. Please login' })
  } catch (err) {
    console.log('reset password error', err)
    res.status(500).json({ error: 'reset password failed' })
  }
}
