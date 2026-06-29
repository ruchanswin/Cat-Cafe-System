<template>
  <PageLayout>
    <section class="adopt-page">
      <div class="page-container adopt-grid">
        <div class="adopt-copy">
          <span class="hero-label">Adoption Matching</span>

          <h1 class="display-heading">
            Find Your Rescue Cat Match
          </h1>

          <p>
            Answer a few personality questions and we will suggest the top rescue cats
            from our café database that fit your lifestyle, home, and care preferences.
          </p>
        </div>

        <AdoptMatchForm @submit-match="handleMatch" />

        <div v-if="loading" class="loading-card">
          Matching your personality with our rescue cats...
        </div>

        <div v-else-if="error" class="error-card">
          {{ error }}
        </div>

        <AdoptMatchResult
          v-else-if="matches.length"
          :matches="matches"
          @browse-cats="browseFromMatch"
        />
      </div>

      <div ref="browserSectionRef" class="browser-section page-container">
        <div class="browser-panel">
          <div class="browser-header">
            <div class="browser-title">Featured Cat</div>
            <div class="browser-counter">{{ currentIndex + 1 }} / {{ cats.length }}</div>
          </div>

          <div class="browser-card">
            <div class="profile-image-frame">
              <img :src="currentCat.image" :alt="currentCat.name" />
            </div>
            <div class="profile-copy">
              <div class="profile-name">{{ currentCat.name }}</div>
              <div class="profile-meta">{{ currentCat.gender }} · {{ currentCat.age }}</div>
              <div class="profile-personality">{{ currentCat.personality }}</div>
              <p class="profile-bio">{{ currentCat.shortBio }}</p>
            </div>
          </div>

          <div class="swipe-controls">
            <button type="button" class="nav-button" @click="prevCat">←</button>
            <div class="swipe-actions">
              <button type="button" class="swipe-button" @click="prevCat">Previous</button>
              <button type="button" class="swipe-button primary" @click="nextCat">Next</button>
            </div>
            <button type="button" class="nav-button" @click="nextCat">→</button>
          </div>

          <div class="browser-actions">
            <button type="button" class="adopt-button" @click="goToCats">Meet all cats</button>
            <button type="button" class="adopt-button secondary" @click="goToBooking">Book a visit</button>
          </div>
        </div>
      </div>

      <div v-if="isAdmin" class="page-container admin-wrap">
        <div class="admin-panel">
          <div class="admin-heading">
            <span class="hero-label">Admin Tools</span>
            <h2 class="display-heading">Manage Adoptable Cats</h2>
            <p>
              Add or remove cats from the adoption database. These cats are used in
              the personality matching system.
            </p>
          </div>

          <div class="admin-form">
            <input v-model="newCat.name" placeholder="Cat name" />
            <input v-model="newCat.breed" placeholder="Breed" />
            <input v-model="newCat.gender" placeholder="Gender" />

            <select v-model="newCat.age">
              <option>Kitten</option>
              <option>Adult</option>
              <option>Senior</option>
            </select>

            <select v-model="newCat.energy_level">
              <option value="calm">Calm</option>
              <option value="playful">Playful</option>
            </select>

            <select v-model="newCat.affection_level">
              <option value="cuddly">Cuddly</option>
              <option value="independent">Independent</option>
              <option value="social">Social</option>
            </select>

            <input v-model="newCat.personality" placeholder="Personality" />
            <input v-model="newCat.image_url" placeholder="Image URL" />
            <textarea v-model="newCat.description" placeholder="Description"></textarea>

            <button type="button" @click="handleAddCat">
              Add Cat
            </button>
          </div>

          <div class="admin-list">
            <div
              v-for="cat in adminCats"
              :key="cat.id"
              class="admin-cat-row"
            >
              <div>
                <strong>{{ cat.name }}</strong>
                <span>{{ cat.breed }} · {{ cat.age }} · {{ cat.adoption_status }}</span>
              </div>

              <button @click="handleDeleteCat(cat.id)">Delete</button>
            </div>
          </div>
        </div>
      </div>

      <div
        v-if="showQuiz"
        class="modal-backdrop"
        role="presentation"
        @click.self="closeQuiz"
      >
        <div
          class="quiz-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="quiz-heading"
          @click.stop
        >
          <button type="button" class="quiz-close" @click="closeQuiz" aria-label="Close quiz">×</button>

          <div class="quiz-scroll">
            <h2 id="quiz-heading" class="quiz-title">Adoption quiz</h2>
            <p class="quiz-hint">
              Choose <strong>Browse matching cats</strong> to open Meet the Cats with filters, or preview a
              match below. Booking is optional on the next screen.
            </p>

            <div class="quiz-question">
              <span>Do you prefer a calm or playful cat?</span>
              <div class="quiz-options">
                <label>
                  <input v-model="quizAnswers.energy" type="radio" value="calm" />
                  Calm
                </label>
                <label>
                  <input v-model="quizAnswers.energy" type="radio" value="playful" />
                  Playful
                </label>
              </div>
            </div>

            <div class="quiz-question">
              <span>Do you want a kitten, adult, or senior cat?</span>
              <div class="quiz-options">
                <label>
                  <input v-model="quizAnswers.lifeStage" type="radio" value="kitten" />
                  Kitten
                </label>
                <label>
                  <input v-model="quizAnswers.lifeStage" type="radio" value="adult" />
                  Adult
                </label>
                <label>
                  <input v-model="quizAnswers.lifeStage" type="radio" value="senior" />
                  Senior
                </label>
              </div>
            </div>

            <div class="quiz-question">
              <span>Do you prefer cuddly or independent cats?</span>
              <div class="quiz-options">
                <label>
                  <input v-model="quizAnswers.affection" type="radio" value="cuddly" />
                  Cuddly
                </label>
                <label>
                  <input v-model="quizAnswers.affection" type="radio" value="independent" />
                  Independent
                </label>
              </div>
            </div>

            <div v-if="matchedCat" ref="matchResultRef" class="match-result">
              <div class="match-header">Suggested match</div>
              <div class="match-card">
                <img :src="matchedCat.image" :alt="matchedCat.name" />
                <div class="match-copy">
                  <div class="match-name">{{ matchedCat.name }}</div>
                  <div class="match-meta">{{ matchedCat.gender }} · {{ matchedCat.age }}</div>
                  <p>{{ matchedCat.shortBio }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="quiz-footer">
            <button type="button" class="quiz-submit" @click="browseMatchingCats()">
              Browse matching cats at the café
            </button>
            <button type="button" class="quiz-submit secondary" @click="seeMatch">
              Preview match on this page
            </button>
          </div>
        </div>
      </div>
    </section>
  </PageLayout>
</template>

<script setup>
import { computed, ref, nextTick, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import PageLayout from '../../components/layout/PageLayout.vue'
import { useAuth } from '../../stores/auth'
import { useCats } from '../../composables/useCats.js'
import { getPersonalityMatch } from '../../services/personalityMatchApi'
import { buildCatsDiscoveryQuery } from '../../utils/visitMatch.js'
import { addCat, deleteCat, getCats } from '../../services/catsDb'
import AdoptMatchForm from '../../components/adopt/AdoptMatchForm.vue'
import AdoptMatchResult from '../../components/adopt/AdoptMatchResult.vue'

const router = useRouter()
const route = useRoute()
const { isAdmin } = useAuth()
const { cats: supabaseCats, loadCatsFromSupabase } = useCats()

const browserSectionRef = ref(null)
const matchResultRef = ref(null)

const cats = [
  {
    name: 'Milo',
    age: 'Adult',
    gender: 'Male',
    personality: 'Calm and affectionate',
    image: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=1000&q=80',
    shortBio: 'A gentle companion who enjoys quiet afternoons and soft laps.'
  },
  {
    name: 'Luna',
    age: 'Kitten',
    gender: 'Female',
    personality: 'Playful and curious',
    image: 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?auto=format&fit=crop&w=1000&q=80',
    shortBio: 'A bright kitten with endless energy and a love for new toys.'
  },
  {
    name: 'Oliver',
    age: 'Senior',
    gender: 'Male',
    personality: 'Independent and mellow',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=1000&q=80',
    shortBio: 'A wise soul who prefers peaceful corners and gentle affection.'
  },
  {
    name: 'Nala',
    age: 'Adult',
    gender: 'Female',
    personality: 'Cuddly and social',
    image: 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?auto=format&fit=crop&w=1000&q=80',
    shortBio: 'A warm presence who loves cozy naps and close company.'
  }
]

const currentIndex = ref(0)
const showQuiz = ref(false)
const quizAnswers = ref({
  energy: 'calm',
  lifeStage: 'adult',
  affection: 'cuddly'
})
const matchedCat = ref(null)
const match = ref(null)
const loading = ref(false)
const error = ref('')
const matches = ref([])
const lastQuizAnswers = ref(null)
const adminCats = ref([])

const emptyCat = {
  name: '',
  age: 'Adult',
  breed: '',
  gender: '',
  personality: '',
  description: '',
  image_url: '',
  adoption_status: 'available',
  energy_level: 'calm',
  affection_level: 'cuddly'
}

const newCat = ref({ ...emptyCat })

onMounted(() => {
  if (route.query.quiz === '1' || route.query.quiz === 'open') {
    openQuiz()
  }
  if (isAdmin.value) {
    loadAdminCats()
  }
})

const currentCat = computed(() => cats[currentIndex.value])

function nextCat() {
  currentIndex.value = (currentIndex.value + 1) % cats.length
}

function prevCat() {
  currentIndex.value = (currentIndex.value - 1 + cats.length) % cats.length
}

function openQuiz() {
  showQuiz.value = true
  matchedCat.value = null
}

function closeQuiz() {
  showQuiz.value = false
}

function scrollToBrowser() {
  browserSectionRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

function goToCats() {
  router.push('/cats')
}

function goToMembership() {
  router.push('/membership')
}

function goToBooking() {
  router.push('/visit/book')
}

async function handleMatch(answers) {
  lastQuizAnswers.value = { ...answers }
  loading.value = true
  matches.value = []
  error.value = ''

  try {
    matches.value = await getPersonalityMatch(answers)

    if (!matches.value.length) {
      error.value = 'No available cat matches were found. Please try different answers.'
    }
  } catch (err) {
    console.error(err)
    error.value = 'Unable to find cat matches right now.'
  } finally {
    loading.value = false
  }
}

async function browseMatchingCats(answers, preferredCatId = null) {
  const payload = answers ?? lastQuizAnswers.value ?? quizAnswers.value
  if (!payload?.energy || !payload?.lifeStage || !payload?.affection) {
    return
  }

  const topMatchId = preferredCatId ?? matches.value[0]?.cat?.id ?? null

  await loadCatsFromSupabase()
  const query = buildCatsDiscoveryQuery(payload, supabaseCats.value, topMatchId)
  closeQuiz()
  router.push({ path: '/cats', query })
}

function browseFromMatch(catId) {
  browseMatchingCats(lastQuizAnswers.value, catId)
}

async function seeMatch() {
  const energyMatch = quizAnswers.value.energy === 'calm' ? 'calm' : 'playful'
  const lifeMatch = quizAnswers.value.lifeStage
  const affectionMatch = quizAnswers.value.affection === 'cuddly' ? 'cuddly' : 'independent'

  matchedCat.value =
    cats.find((cat) => {
      const personality = cat.personality.toLowerCase()
      const energyOk =
        energyMatch === 'calm' ? personality.includes('calm') : personality.includes('playful')
      const lifeOk = cat.age.toLowerCase() === lifeMatch
      const affectionOk =
        affectionMatch === 'cuddly'
          ? personality.includes('cuddly') || personality.includes('affection')
          : personality.includes('independent')
      return energyOk && lifeOk && affectionOk
    }) || cats[0]

  await nextTick()
  matchResultRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

async function loadAdminCats() {
  adminError.value = ''

  try {
    adminCats.value = await getCats()
  } catch (err) {
    console.error(err)
    adminError.value = 'Unable to load cats from the database.'
  }
}

async function handleAddCat() {
  adminError.value = ''

  if (!newCat.value.name.trim()) {
    adminError.value = 'Cat name is required.'
    return
  }

  try {
    await addCat(newCat.value)
    newCat.value = { ...emptyCat }
    await loadAdminCats()
  } catch (err) {
    console.error(err)
    adminError.value = 'Unable to add cat.'
  }
}

async function handleDeleteCat(id) {
  adminError.value = ''

  try {
    await deleteCat(id)
    await loadAdminCats()
  } catch (err) {
    console.error(err)
    adminError.value = 'Unable to delete cat.'
  }
}
</script>

<style scoped>
.adopt-page {
  min-height: 100vh;
  background: var(--color-cream);
  padding: 3rem 1rem 4rem;
  color: var(--color-text);
}

.adopt-grid {
  display: grid;
  gap: 2rem;
}

@media (min-width: 950px) {
  .adopt-grid {
    grid-template-columns: 0.9fr 1fr 1fr;
    align-items: start;
  }
}

.adopt-copy {
  padding: 1rem 0;
}

.hero-label {
  display: inline-block;
  margin-bottom: 1rem;
  padding: 0.55rem 0.9rem;
  border-radius: 999px;
  background: rgba(232, 166, 161, 0.25);
  font-size: 0.85rem;
  font-weight: 700;
}

.adopt-copy h1 {
  font-size: clamp(3rem, 5vw, 5rem);
  line-height: 0.95;
  margin: 0;
}

.adopt-copy p,
.admin-heading p {
  margin-top: 1.5rem;
  line-height: 1.8;
  color: rgba(75, 44, 45, 0.8);
}

.loading-card,
.error-card,
.empty-card {
  background: white;
  border-radius: 2rem;
  padding: 2rem;
  box-shadow: var(--shadow-soft);
  font-weight: 700;
  text-align: center;
}

.browser-section {
  margin-bottom: 2rem;
}

.browser-panel {
  background: rgba(255, 255, 255, 0.92);
  border-radius: 2rem;
  padding: 1.75rem;
  box-shadow: var(--shadow-soft);
}

.browser-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.25rem;
}

.browser-title {
  font-weight: 700;
  font-size: 1.1rem;
}

.browser-counter {
  opacity: 0.7;
  font-weight: 600;
}

.browser-card {
  display: grid;
  gap: 1.25rem;
  margin-bottom: 1.25rem;
}

@media (min-width: 640px) {
  .browser-card {
    grid-template-columns: 200px 1fr;
    align-items: start;
  }
}

.profile-image-frame img {
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 1.25rem;
}

.profile-name {
  font-size: 1.35rem;
  font-family: var(--font-display);
  font-weight: 700;
}

.profile-meta,
.profile-personality {
  margin-top: 0.35rem;
  opacity: 0.85;
}

.profile-bio {
  margin: 0.75rem 0 0;
  line-height: 1.6;
}

.swipe-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}

.nav-button {
  min-width: 3rem;
  min-height: 3rem;
  background: rgba(182, 92, 104, 0.12);
  color: var(--color-text);
  font-size: 1.2rem;
}

.swipe-actions {
  display: flex;
  gap: 0.75rem;
  flex: 1;
  justify-content: center;
}

.swipe-button {
  padding: 0.75rem 1rem;
  background: white;
  border: 1px solid rgba(182, 92, 104, 0.2);
  color: var(--color-text);
}

.swipe-button.primary {
  background: var(--color-primary);
  color: white;
  border-color: transparent;
}

.adopt-button {
  width: 100%;
  padding: 1rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 999px;
  font-weight: 700;
  cursor: pointer;
}

.browser-actions {
  display: grid;
  gap: 0.75rem;
}

.adopt-button.secondary {
  background: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.error-card {
  color: #b00020;
}

.admin-wrap {
  margin-top: 2rem;
}

.admin-panel {
  background: white;
  border-radius: 2rem;
  padding: 2rem;
  box-shadow: var(--shadow-soft);
}

.admin-heading {
  margin-bottom: 2rem;
}

.admin-heading h2 {
  margin: 0;
  font-size: clamp(2.2rem, 4vw, 3.2rem);
  color: var(--color-primary);
}

.admin-form {
  display: grid;
  gap: 1rem;
  margin-bottom: 2rem;
}

@media (min-width: 850px) {
  .admin-form {
    grid-template-columns: repeat(3, 1fr);
  }

  .admin-form textarea,
  .admin-form button {
    grid-column: 1 / -1;
  }
}

.admin-form input,
.admin-form select,
.admin-form textarea {
  width: 100%;
  padding: 0.85rem 1rem;
  border-radius: 1rem;
  border: 1px solid rgba(75, 44, 45, 0.15);
  font-family: inherit;
  background: var(--color-bg-light);
  color: var(--color-text);
}

.admin-form textarea {
  min-height: 120px;
  resize: vertical;
}

.admin-form button,
.admin-cat-row button {
  border: none;
  border-radius: 999px;
  color: white;
  font-weight: 700;
  cursor: pointer;
}

.admin-form button {
  background: var(--color-primary);
  padding: 0.9rem 1.2rem;
}

.admin-list {
  display: grid;
  gap: 1rem;
}

.admin-cat-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  background: rgba(232, 166, 161, 0.12);
  padding: 1rem;
  border-radius: 1rem;
}

.admin-cat-row div {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.admin-cat-row span {
  opacity: 0.75;
}

.admin-cat-row button {
  background: #d9534f;
  padding: 0.6rem 1rem;
}

.admin-error {
  margin-top: 1rem;
}

@media (max-width: 700px) {
  .admin-cat-row {
    flex-direction: column;
    align-items: flex-start;
  }
}

.modal-backdrop {
  position: fixed;
  inset: 0;
  z-index: 2000;
  overflow-y: auto;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 1rem 1rem 2rem;
  background: rgba(75, 44, 45, 0.45);
  backdrop-filter: blur(4px);
}

.quiz-modal {
  position: relative;
  width: min(100%, 640px);
  margin: 1rem auto 2rem;
  max-height: min(calc(100dvh - 2rem), 720px);
  display: flex;
  flex-direction: column;
  background: white;
  border-radius: 2rem;
  box-shadow: 0 28px 80px rgba(75, 44, 45, 0.2);
  overflow: hidden;
}

.quiz-scroll {
  flex: 1;
  min-height: 0;
  overflow-y: auto;
  padding: 2rem 2rem 1rem;
  display: grid;
  gap: 1.25rem;
}

.quiz-footer {
  flex-shrink: 0;
  padding: 1rem 2rem 1.5rem;
  border-top: 1px solid rgba(75, 44, 45, 0.1);
  display: grid;
  gap: 0.75rem;
}

.quiz-hint {
  margin: 0;
  font-size: 0.95rem;
  line-height: 1.5;
  color: rgba(75, 44, 45, 0.75);
}

.quiz-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  z-index: 2;
  width: 2.5rem;
  height: 2.5rem;
  border: none;
  border-radius: 999px;
  background: rgba(182, 92, 104, 0.14);
  font-size: 1.25rem;
  cursor: pointer;
}

.quiz-title {
  margin: 0;
  padding-right: 2.75rem;
  font-size: 1.6rem;
  font-family: var(--font-display);
}

.quiz-question {
  display: grid;
  gap: 0.85rem;
}

.quiz-question span {
  font-weight: 700;
}

.quiz-options {
  display: grid;
  gap: 0.65rem;
}

.quiz-options label {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.85rem 1rem;
  border-radius: 1.25rem;
  background: rgba(255, 245, 225, 0.95);
  cursor: pointer;
}

.quiz-options input {
  accent-color: var(--color-primary);
}

.quiz-submit {
  width: 100%;
  padding: 1rem 1.25rem;
  background: var(--color-primary);
  color: white;
  font-size: 1.05rem;
}

.quiz-submit:hover {
  background: var(--color-primary-hover);
}

.quiz-submit.secondary {
  background: transparent;
  color: var(--color-primary);
  border: 2px solid var(--color-primary);
}

.quiz-submit.secondary:hover {
  background: var(--color-bg-blush);
}

.match-result {
  display: grid;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(75, 44, 45, 0.1);
}

.match-header {
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: rgba(75, 44, 45, 0.7);
}

.match-card {
  display: grid;
  gap: 0.75rem;
  border-radius: 1.25rem;
  overflow: hidden;
  background: var(--color-bg-light);
}

.match-card img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.match-copy {
  padding: 1rem;
}

.match-name {
  font-size: 1.15rem;
  font-family: var(--font-display);
  font-weight: 700;
}

.match-meta {
  margin: 0.25rem 0 0.5rem;
  opacity: 0.75;
}

.match-copy p {
  margin: 0;
  line-height: 1.55;
}
</style>
