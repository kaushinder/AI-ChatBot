import express from 'express'
import { askAI } from '../controllers/aiControllers.js'

const router = express.Router()

router.post('/ai', askAI)

export default router
