 const API_BASE_URL = import.meta.env.VITE_API_BASE_URL

  export async function generateReply(review) {
    const response = await fetch(`${API_BASE_URL}/api/generate-reply`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        reviewerName: review.name,
        rating: review.rating,
        content: review.content
      })
    })
    const data = await response.json()
    if (!response.ok) throw new Error(data.message || 'Failed to generate reply')
    return data.reply
  }