import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import twilio from 'twilio'
import Anthropic from '@anthropic-ai/sdk'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000
const DEMO_OTP = '123456'

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:5175',
    'https://mercury.swin.edu.au'
  ]
}))

app.use(express.json())

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

const verifyServiceSid = process.env.TWILIO_VERIFY_SERVICE_SID

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
})

app.post('/api/send-admin-otp', async (req, res) => {
  try {
    const { email, password } = req.body

    if (email !== 'admin@catcafe.com' || password !== 'admin123') {
      return res.status(401).json({ message: 'Invalid admin credentials' })
    }

    console.log({
      sidExists: Boolean(process.env.TWILIO_ACCOUNT_SID),
      tokenExists: Boolean(process.env.TWILIO_AUTH_TOKEN),
      verifySid: process.env.TWILIO_VERIFY_SERVICE_SID,
      adminPhone: process.env.ADMIN_PHONE
    })

    try {
      const verification = await client.verify.v2
        .services(verifyServiceSid)
        .verifications.create({
          to: process.env.ADMIN_PHONE,
          channel: 'sms'
        })

      return res.json({
        success: true,
        demoMode: false,
        status: verification.status,
        message: 'OTP sent to admin phone'
      })
    } catch (twilioError) {
      console.error('Twilio failed, using demo OTP:', twilioError.message)

      return res.json({
        success: true,
        demoMode: true,
        otp: DEMO_OTP,
        message: 'Twilio SMS failed. Demo OTP generated instead.'
      })
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Failed to send OTP' })
  }
})
app.post('/api/verify-admin-otp', async (req, res) => {
  try {
    const { code } = req.body
    const cleanCode = String(code).trim()

    if (cleanCode === DEMO_OTP) {
      return res.json({
        success: true,
        demoMode: true,
        user: {
          name: 'Admin User',
          email: 'admin@catcafe.com',
          role: 'admin'
        }
      })
    }

    const verificationCheck = await client.verify.v2
      .services(verifyServiceSid)
      .verificationChecks.create({
        to: process.env.ADMIN_PHONE,
        code: cleanCode
      })

    if (verificationCheck.status !== 'approved') {
      return res.status(401).json({ message: 'Invalid OTP' })
    }

    return res.json({
      success: true,
      demoMode: false,
      user: {
        name: 'Admin User',
        email: 'admin@catcafe.com',
        role: 'admin'
      }
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Failed to verify OTP' })
  }
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