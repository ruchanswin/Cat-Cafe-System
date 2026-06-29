import { supabase } from '../lib/supabase.js'

  export async function fetchReviews() { // Async waits for database response
    const { data, error } = await supabase // Starts db request
      .from('reviews')
      .select('*') // Selects all
      .order('date', { ascending: false })

    if (error) throw error
    return data.map(row => ({ // Maps data if no errors
      id: String(row.id),
      name: row.name,
      rating: String(row.rating),
      content: row.content,
      date: row.date,
      reply: row.reply ?? null
    }))
  }

  export async function submitReview(review) { // Allows user to submit review
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        name: review.name,
        rating: Number(review.rating),
        content: review.content,
        date: new Date().toISOString().slice(0, 10)
      })
      .select()
      .single() // db only expects one row

    if (error) throw error
    return {
      id: String(data.id),
      name: data.name,
      rating: String(data.rating),
      content: data.content,
      date: data.date,
      reply: null
    }
  }

  export async function saveReply(reviewId, replyText) { // Allows admin to reply
    const { error } = await supabase
      .from('reviews')
      .update({ reply: replyText })
      .eq('id', reviewId)

    if (error) throw error
  }

  export async function fetchLikes(reviewIds, userEmail) {
    const { data, error } = await supabase
      .from('review_likes')
      .select('review_id, user_email')
      .in('review_id', reviewIds)

    if (error) throw error

    const counts = {}
    const liked = new Set()

    for (const id of reviewIds) counts[id] = 0
    for (const row of data) {
      counts[row.review_id] = (counts[row.review_id] || 0) + 1
      if (userEmail && row.user_email === userEmail) liked.add(String(row.review_id))
    }

    return { counts, liked }
  }

  export async function toggleLike(reviewId, userEmail) {
    const { data } = await supabase
      .from('review_likes')
      .select('id')
      .eq('review_id', reviewId)
      .eq('user_email', userEmail)
      .maybeSingle()

    if (data) {
      const { error } = await supabase
        .from('review_likes')
        .delete()
        .eq('id', data.id)
      if (error) throw error
      return 'unliked'
    } else {
      const { error } = await supabase
        .from('review_likes')
        .insert({ review_id: reviewId, user_email: userEmail })
      if (error) throw error
      return 'liked'
    }
  }