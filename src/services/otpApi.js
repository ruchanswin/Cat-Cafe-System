const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'https://cat-cafe-cos30043.onrender.com'

async function parseJsonResponse(response) {
  const text = await response.text()

  try {
    return JSON.parse(text)
  } catch {
    throw new Error('API returned non-JSON response. Check API_BASE_URL.')
  }
}

export async function sendAdminOtp(email, password) {
  const response = await fetch(`${API_BASE_URL}/api/send-admin-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  })

  const data = await parseJsonResponse(response)

  if (!response.ok) {
    throw new Error(data.message || 'Could not send OTP')
  }

  return data
}

export async function verifyAdminOtp(code) {
  const response = await fetch(`${API_BASE_URL}/api/verify-admin-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code })
  })

  const data = await parseJsonResponse(response)

  if (!response.ok) {
    throw new Error(data.message || 'Invalid OTP')
  }

  return data
}