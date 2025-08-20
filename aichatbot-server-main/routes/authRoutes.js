import express from 'express'
import {
  forgotPassword,
  login,
  resetPassword,
  signup,
} from '../controllers/authControllers.js'

const router = express.Router()

router.post('/signup', signup)
router.post('/login', login)
router.post('/forgotPassword', forgotPassword)
router.post('/resetPassword', resetPassword)

export default router
