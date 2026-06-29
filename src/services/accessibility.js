// accessibility.js
// This file handles all communication with the ElevenLabs Text to Speech API.
// It is used by AccessibilityWidget.vue to convert page text into audio.

// The voice used for reading — Rachel voice from ElevenLabs (clear and neutral)
const VOICE_ID = '21m00Tcm4TlvDq8ikWAM'

// textToSpeech(text)
// Sends the given text to ElevenLabs and returns a URL to the audio file.
// The API key is stored in the .env file as VITE_ELEVENLABS_KEY.
export async function textToSpeech(text) {
  const apiKey = import.meta.env.VITE_ELEVENLABS_KEY
  if (!apiKey) throw new Error('VITE_ELEVENLABS_KEY not set in .env')

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: 'POST',
      headers: {
        'xi-api-key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg',
      },
      body: JSON.stringify({
        text,
        model_id: 'eleven_multilingual_v2',
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.75,
          style: 0,
          use_speaker_boost: true,
        },
      }),
    }
  )

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    throw new Error(err.detail?.message || `ElevenLabs error ${response.status}`)
  }

  // Convert the audio response into a playable URL
  const blob = await response.blob()
  return URL.createObjectURL(blob)
}

// getPageText()
// Grabs the visible text from the current page (inside <main> only).
// Removes buttons, forms, and scripts so only readable content is sent.
// Cuts off at 4000 characters for the free tier limit.
export function getPageText() {
  const main = document.querySelector('main') || document.body
  const clone = main.cloneNode(true)
  clone.querySelectorAll('script, style, button, input, textarea, form').forEach(el => el.remove())
  const text = clone.textContent.replace(/\s+/g, ' ').trim()
  return text.length > 4000 ? text.slice(0, 4000) + '…' : text
}
