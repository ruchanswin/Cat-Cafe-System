import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import Anthropic from '@anthropic-ai/sdk'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'https://mercury.swin.edu.au'
  ]
}))

app.use(express.json())

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

app.get('/api/admin-analytics', (req, res) => {
  res.json({
    totalMatches: 42,
    visitReservations: 18,
    reviews: 27,
    donations: 620,
    topMatchedBreed: 'Ragdoll',
    weeklyMatches: [4, 7, 5, 9, 6, 8, 3],
    weeklyReservations: [2, 3, 4, 5, 2, 4, 1]
  })
})

app.post('/api/generate-reply', async (req, res) => {
  try {
    const { reviewerName, rating, content } = req.body

    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      messages: [
        {
          role: 'user',
          content: `You are a friendly staff member at Purr & Pour Cat Cafe. Write a warm, brief reply (1-2 sentences max) to this ${rating}-star review by ${reviewerName}: "${content}". Reply directly as staff, no intro.`
        }
      ]
    })

    res.json({ reply: message.content[0].text })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to generate reply' })
  }
})

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`)
})