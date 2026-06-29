<template>
  <PageLayout>
    <PageHeader title="Reviews"
      subtitle="Read what our visitors say about their experiences at Purr & Pour Cat Café." />
    <AppContainer>
      <section class="section-space reviews-page">
        <div class="page-container">

          <!-- Admin Tools Section -->
          <div v-if="isAdmin" class="admin-tools-section">
            <div class="admin-banner">
              <span class="admin-badge">ADMIN TOOLS</span>
              <h3>Review Management</h3>
              <p>Monitor and manage customer reviews and feedback.</p>
            </div>
            <div class="admin-actions">
              <div class="sort-wrapper">
                <button class="admin-btn" @click="showSortDropdown = !showSortDropdown">
                  🔃 Sort Reviews ▾
                </button>
                <div v-if="showSortDropdown" class="sort-dropdown">
                  <button class="sort-option" @click="setSortOrder('rating-high')">⭐ Rating: High to Low</button>
                  <button class="sort-option" @click="setSortOrder('rating-low')">⭐ Rating: Low to High</button>
                  <button class="sort-option" @click="setSortOrder('date-new')">📅 Date: New to Old</button>
                  <button class="sort-option" @click="setSortOrder('date-old')">📅 Date: Old to New</button>
                </div>
              </div>
            </div>
          </div>

          <label class="search-label">
            Search reviews
            <input v-model="search" type="search" class="search-input" placeholder="Name, rating, date, text…" />
          </label>

          <h2 class="display-heading">Recent Reviews</h2>

          <p v-if="filtered.length === 0" class="reviews-empty">
            No reviews match your search yet. Try a different keyword or reset the search.
          </p>

          <div v-else class="reviews-list">
            <div v-for="r in paginated" :key="r.id" class="review-card" :class="`rating-${r.rating}`">
              <div class="review-avatar">{{ r.name[0] }}</div>
              <div class="review-body">
                <div class="review-header">
                  <strong class="review-name">{{ r.name }}</strong>
                  <span class="review-stars">
                    <span v-for="i in 5" :key="i" :class="i <= Number(r.rating) ? 'star filled' : 'star empty'">★</span>
                  </span>
                </div>
                <span class="review-date">{{ formatDate(r.date) }}</span>
                <p class="review-content">{{ r.content }}</p>
                <button type="button" class="like-btn" :class="{ liked: likedIds.has(r.id) }" @click="toggleLike(r.id)">
                  ♥ {{ likeCounts[r.id] ?? 0 }}
                </button>

                <!-- Existing reply -->
                <div v-if="replies[r.id]" class="review-reply">
                  <span class="reply-label">Staff Reply</span>
                  <p class="reply-content">{{ replies[r.id].content }}</p>
                </div>

                <!-- Reply input -->
                <div v-if="isAdmin && replyingTo === r.id" class="reply-input-box">
                  <textarea class="form-input reply-textarea" v-model="replyText" placeholder="Write a reply..."
                    rows="2"></textarea>
                  <div class="reply-actions">
                    <button class="btn-primary-cat" @click="submitReply(r.id)">Submit Reply</button>
                    <button class="btn-outline-cat" @click="replyingTo = null; replyText = ''">Cancel</button>
                    <button class="btn-primary-cat" :disabled="aiLoading" @click="handleAiReply(r)">
                      {{ aiLoading ? 'Generating...' : 'Reply with AI' }}
                    </button>
                  </div>
                </div>

                <!-- Reply button -->
                <button v-if="isAdmin && !replies[r.id] && replyingTo !== r.id" class="reply-btn"
                  @click="replyingTo = r.id">
                  Reply
                </button>
              </div>
            </div>
          </div>

          <div class="reviews-pagination">
            <Paginate v-if="pageCount > 1" v-model="currentPage" :page-count="pageCount" prev-text="Prev"
              next-text="Next" container-class="pagination justify-content-center flex-wrap mt-3" page-class="page-item"
              page-link-class="page-link" prev-class="page-item" prev-link-class="page-link" next-class="page-item"
              next-link-class="page-link" />
          </div>

          <div class="review-form-block">
            <h2 class="display-heading">Leave a Review</h2>
            <div class="soft-card submit-review-card review-card-shell">
              <form class="review-form" @submit.prevent="handleSubmitReview">
                <div class="review-field">
                  <label for="review-name">Your name</label>
                  <input id="review-name" v-model.trim="reviewName" type="text" class="review-input" name="name"
                    autocomplete="name" maxlength="80" placeholder="How should we display your name?" />
                </div>

                <fieldset class="review-field review-field-rating">
                  <legend>Rating</legend>
                  <p class="rating-hint">
                    Tap a star — {{ reviewRating ? `${reviewRating} out of 5` : 'choose 1 to 5 stars' }}
                  </p>
                  <div class="star-rating" role="group" aria-label="Star rating, 1 to 5" @mouseleave="hoverRating = 0">
                    <button v-for="n in 5" :key="n" type="button" class="star-btn" :class="{ on: displayStars >= n }"
                      :aria-label="`Rate ${n} out of 5`" :aria-current="reviewRating === n ? 'true' : undefined"
                      @click="reviewRating = n" @mouseenter="hoverRating = n">
                      ★
                    </button>
                  </div>
                </fieldset>

                <div class="review-field">
                  <label for="review-comment">Comment</label>
                  <textarea id="review-comment" v-model.trim="reviewComment" class="review-textarea" name="comment"
                    rows="5" maxlength="800" placeholder="Tell others about your visit…" />
                </div>

                <p v-if="reviewFormError" class="review-form-error" role="alert">{{ reviewFormError }}</p>
                <p v-if="reviewFormSuccess" class="review-form-success" role="status">{{ reviewFormSuccess }}</p>

                <div class="review-actions">
                  <AppButton variant="primary" type="submit">Submit review</AppButton>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </AppContainer>
  </PageLayout>
</template>

<script setup>
import { watch, ref, reactive, onMounted, computed } from 'vue'
import Paginate from 'vuejs-paginate-next'
import PageLayout from '../../components/layout/PageLayout.vue'
import PageHeader from '../../components/ui/PageHeader.vue'
import AppContainer from '../../components/ui/AppContainer.vue'
import AppButton from '../../components/ui/AppButton.vue'
import { useAuth } from '../../stores/auth'
import { fetchReviews, submitReview, saveReply, fetchLikes, toggleLike as toggleLikeApi } from '../../services/reviewsApi.js'
import { generateReply } from '../../services/anthropicApi.js'

const { isAdmin, currentUser } = useAuth()

const reviewsData = ref([])
const search = ref('')
const currentPage = ref(1)
const perPage = ref(3)
const showSortDropdown = ref(false)
const sortOrder = ref(null)
const reviewName = ref('')
const reviewRating = ref(0)
const hoverRating = ref(0)
const reviewComment = ref('')
const reviewFormError = ref('')
const reviewFormSuccess = ref('')
const likedIds = reactive(new Set())
const likeCounts = ref({})
const replyingTo = ref(null)
const replyText = ref('')
const replies = ref({})
const aiLoading = ref(false)

const displayStars = computed(() => hoverRating.value || reviewRating.value)

async function submitReply(id) {
  if (!replyText.value.trim()) return
  try {
    await saveReply(id, replyText.value.trim())
    replies.value[id] = {
      reviewId: id,
      content: replyText.value.trim(),
      date: new Date().toISOString().split('T')[0]
    }
    replyText.value = ''
    replyingTo.value = null
  } catch (e) {
    alert('Failed to save reply: ' + e.message)
  }
}


onMounted(async () => {
  try {
    reviewsData.value = await fetchReviews()
    for (const r of reviewsData.value) {
      if (r.reply) {
        replies.value[r.id] = { reviewId: r.id, content: r.reply, date: r.date }
      }
    }
    const ids = reviewsData.value.map(r => r.id)
    const { counts, liked } = await fetchLikes(ids, currentUser.value?.email)
    likeCounts.value = counts
    liked.forEach(id => likedIds.add(id))
  } catch (e) {
    alert('Failed to load reviews')
  }
})

async function handleSubmitReview() {
  reviewFormError.value = ''
  reviewFormSuccess.value = ''

  if (!reviewName.value) {
    reviewFormError.value = 'Please enter your name.'
    return
  }
  if (reviewName.value.length < 2) {
    reviewFormError.value = 'Name should be at least 2 characters.'
    return
  }
  if (!reviewRating.value || reviewRating.value < 1 || reviewRating.value > 5) {
    reviewFormError.value = 'Please choose a star rating from 1 to 5.'
    return
  }
  if (!reviewComment.value) {
    reviewFormError.value = 'Please write a short comment.'
    return
  }
  if (reviewComment.value.length < 10) {
    reviewFormError.value = 'Comment should be at least 10 characters.'
    return
  }

  const saved = await submitReview({ // Saves review to db not locally
    name: reviewName.value,
    rating: reviewRating.value,
    content: reviewComment.value
  })
  reviewsData.value = [...reviewsData.value, saved]
  likeCounts.value = { ...likeCounts.value, [saved.id]: 0 }

  reviewName.value = ''
  reviewRating.value = 0
  hoverRating.value = 0
  reviewComment.value = ''
  reviewFormSuccess.value = 'Thanks — your review was added.'

  currentPage.value = pageCount.value
}

const filtered = computed(() => {
  let result = reviewsData.value.filter(r =>
    [r.name, r.content, r.rating, r.date].some(v =>
      String(v).toLowerCase().includes(search.value.toLowerCase())
    )
  )
  result.sort((a, b) => {
    if (sortOrder.value === 'rating-high') return b.rating - a.rating
    if (sortOrder.value === 'rating-low') return a.rating - b.rating
    if (sortOrder.value === 'date-new') return new Date(b.date) - new Date(a.date)
    if (sortOrder.value === 'date-old') return new Date(a.date) - new Date(b.date)
    return 0
  })
  return result
})

const paginated = computed(() => {
  const start = (currentPage.value - 1) * perPage.value
  return filtered.value.slice(start, start + perPage.value)
})

const pageCount = computed(() => Math.max(1, Math.ceil(filtered.value.length / perPage.value)))

watch(search, () => {
  currentPage.value = 1
})

watch(pageCount, (n) => {
  if (currentPage.value > n) currentPage.value = n
})

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-AU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

function setSortOrder(order) {
  sortOrder.value = order
  showSortDropdown.value = false
}

async function toggleLike(id) {
  if (!currentUser.value) return
  const result = await toggleLikeApi(id, currentUser.value.email)
  if (result === 'liked') {
    likedIds.add(String(id))
    likeCounts.value[id] = (likeCounts.value[id] ?? 0) + 1
  } else {
    likedIds.delete(String(id))
    likeCounts.value[id] = Math.max(0, (likeCounts.value[id] ?? 0) - 1)
  }
}

async function handleAiReply(review) {
  aiLoading.value = true
  try {
    replyText.value = await generateReply(review)
  } catch (e) {
    alert('Failed to generate reply')
  } finally {
    aiLoading.value = false
  }
}
</script>

<style scoped>
.reviews-page.section-space {
  padding-top: 1.5rem;
  padding-bottom: 4rem;
}

.review-form-block {
  margin-top: 2.5rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(182, 92, 104, 0.15);
}

.review-form-block .display-heading {
  margin-top: 0;
}

.reviews-pagination {
  margin-top: 0.5rem;
}

.reviews-pagination :deep(.pagination) {
  margin-top: 1rem;
  margin-bottom: 0;
}

.search-label {
  display: grid;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  color: var(--color-primary);
  font-size: 0.85rem;
  font-weight: 700;
}

.search-input {
  width: 100%;
  max-width: 28rem;
  padding: 0.75rem 1rem;
  border: 1px solid rgba(179, 156, 142, 0.55);
  border-radius: 1rem;
  font: inherit;
}

.submit-review-card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.reviews-empty {
  margin: 1rem 0 1.5rem;
  padding: 1.25rem;
  text-align: center;
  color: var(--color-text);
  opacity: 0.85;
  background: rgba(255, 255, 255, 0.7);
  border-radius: var(--radius-lg);
}

.reviews-list {
  display: grid;
  gap: 0;
  margin: 1.5rem 0 0;
}

.reviews-pagination :deep(.page-link) {
  cursor: pointer;
  color: var(--color-primary);
}

.reviews-pagination :deep(.page-item.active .page-link) {
  background-color: var(--color-primary);
  border-color: var(--color-primary);
  color: #fff;
}

.reviews-pagination :deep(.page-item.active .page-link:hover),
.reviews-pagination :deep(.page-item.active .page-link:focus) {
  background-color: var(--color-primary-hover);
  border-color: var(--color-primary-hover);
  color: #fff;
}

.reviews-pagination :deep(.page-item.disabled .page-link) {
  color: var(--color-text);
  opacity: 0.45;
}

.admin-tools-section {
  background: linear-gradient(135deg, rgba(182, 92, 104, 0.1), rgba(255, 107, 138, 0.1));
  border: 2px solid rgba(182, 92, 104, 0.3);
  border-radius: var(--radius-lg);
  padding: 2rem;
  margin: 2rem 0;
  backdrop-filter: blur(10px);
}

.admin-banner {
  margin-bottom: 1.5rem;
}

.admin-badge {
  display: inline-block;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  color: white;
  padding: 0.35rem 0.75rem;
  border-radius: var(--radius-pill);
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.admin-banner h3 {
  color: var(--color-primary);
  margin: 0.5rem 0;
}

.admin-banner p {
  margin: 0;
  color: var(--color-text);
  opacity: 0.8;
}

.admin-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.admin-btn {
  padding: 0.65rem 1.25rem;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(182, 92, 104, 0.2);
}

.admin-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(182, 92, 104, 0.3);
}

.admin-btn:active {
  transform: translateY(0);
}

.sort-wrapper {
  position: relative;
  /* Sets sort wrapper as anchor for dropdown */
}

.sort-dropdown {
  position: absolute;
  /* Dropdown does not push content out of way */
  left: 0;
  background: white;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  box-shadow: 0 8px 24px rgba(182, 92, 104, 0.2);
  overflow: hidden;
  /* Hover function does not go over edges */
}

.sort-option {
  display: block;
  /* Stacks buttons vertically */
  width: 100%;
  padding: 0.65rem 1rem;
  background: none;
  border: none;
  border-bottom: 1px solid var(--color-border);
  /* separates options */
  text-align: left;
  font-size: 0.9rem;
  color: var(--color-text);
  cursor: pointer;
}

.sort-option:hover {
  background: var(--color-soft-pink);
}

.soft-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-soft);
}

.review-card {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  background: rgba(255, 255, 255);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  margin-bottom: 1rem;
  border: 4px solid rgba(182, 92, 104, 0.3);
}

.review-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--color-primary);
  color: white;
  font-weight: 700;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  text-transform: uppercase;
}

.review-body {
  flex: 1;
}

.review-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.25rem;
}

.star {
  font-size: 1.1rem;
}

.star.filled {
  color: #f5a623;
}

.star.empty {
  color: #ddd;
}

.review-date {
  font-size: 0.8rem;
  color: var(--color-border);
  display: block;
  margin-bottom: 0.5rem;
}

.review-content {
  margin: 0;
  line-height: 1.6;
}

.like-btn {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  padding: 0.3rem 0.85rem;
  cursor: pointer;
  color: var(--color-text);
  font-size: 0.9rem;
  margin-top: 0.75rem;
}

.like-btn.liked {
  color: var(--color-primary);
  border-color: var(--color-primary);
  background: rgba(182, 92, 104, 0.08);
}

.like-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}

.review-reply {
  margin-top: 0.75rem;
  padding: 0.75rem 1rem;
  background: rgba(182, 92, 104, 0.06);
  border-left: 3px solid var(--color-primary);
  border-radius: 0 0.5rem 0.5rem 0;
}

.reply-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-primary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  display: block;
  margin-bottom: 0.25rem;
}

.reply-content {
  margin: 0 0 0.25rem 0;
  color: var(--color-text);
  line-height: 1.5;
}

.reply-date {
  font-size: 0.75rem;
  color: var(--color-border);
}

.reply-input-box {
  margin-top: 0.75rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.reply-textarea {
  resize: vertical;
}

.reply-actions {
  display: flex;
  gap: 0.5rem;
}

.reply-btn {
  background: none;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-pill);
  padding: 0.3rem 0.85rem;
  cursor: pointer;
  color: var(--color-text);
  font-size: 0.9rem;
  margin-top: 0.5rem;
  transition: all 0.2s ease;
}

.reply-btn:hover {
  border-color: var(--color-primary);
  color: var(--color-primary);
}


:deep(.pagination) {
  display: flex;
  list-style: none;
  padding: 0;
  margin: 0;
  gap: 0.4rem;
  justify-content: center;
}

:deep(.page-item a:hover) {
  background: var(--color-soft-pink);
  border-color: var(--color-primary);
}

:deep(.page-item.active a) {
  background: var(--color-primary);
  border-color: var(--color-primary);
  color: white;
}

:deep(.page-item a) {
  display: block;
  padding: 0.5rem 0.9rem;
  border-radius: 0.5rem;
  border: 1px solid var(--color-border);
  color: var(--color-text);
  cursor: pointer;
}

.review-form-block .submit-review-card {
  max-width: 600px;
}

.review-form {
  display: grid;
  gap: 1.25rem;
}

.review-field {
  display: grid;
  gap: 0.5rem;
}

.review-field label,
.review-field legend {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-text);
}

.review-field-rating {
  border: none;
  padding: 0;
  margin: 0;
}

.rating-hint {
  margin: 0;
  font-size: 0.85rem;
  opacity: 0.8;
}

.review-input,
.review-textarea {
  padding: 0.65rem 0.85rem;
  border: 1px solid var(--color-border);
  border-radius: 0.5rem;
  font: inherit;
  color: var(--color-text);
  width: 100%;
}

.review-input:focus,
.review-textarea:focus {
  border-color: var(--color-primary);
  outline: none;
}

.star-rating {
  display: flex;
  gap: 0.25rem;
}

.star-btn {
  border: none;
  background: transparent;
  font-size: 1.75rem;
  line-height: 1;
  color: #ddd;
  cursor: pointer;
  padding: 0.15rem;
}

.star-btn.on {
  color: #f5a623;
}

.review-form-error {
  margin: 0;
  color: #b42318;
  font-weight: 600;
}

.review-form-success {
  margin: 0;
  color: #2d6a4f;
  font-weight: 600;
}

.review-actions {
  margin-top: 0.25rem;
}
</style>
