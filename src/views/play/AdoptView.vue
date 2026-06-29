<template>
  <PageLayout>
    <section class="adopt-page">
      <div class="adopt-shell">
        <div class="left-panel">
          <div class="mini-nav">
            <span class="mini-brand">ADOPT.</span>
            <button class="text-link">DONATE</button>
            <button class="quiz-button" @click="showQuiz = true">Take the Quiz</button>
          </div>

          <div class="side-links">
            <span>Dogs</span>
            <span>Cats</span>
            <span>About</span>
            <span>Contact</span>
          </div>

          <div class="hero-content">
            <h1 class="display-heading">
              Save a Life<br />
              <span>Adopt a Cat</span>
            </h1>

            <p>
              Adoption gives rescue cats a second chance and helps them find a safe,
              loving home.
            </p>

            <div class="adopt-actions">
              <button class="adopt-now">Adopt Now</button>
              <button class="arrow-button" @click="prevCat">←</button>
              <button class="arrow-button" @click="nextCat">→</button>
            </div>
          </div>

          <div class="cat-meta">
            <div>
              <small>Name</small>
              <strong>{{ currentCat.name }}</strong>
            </div>
            <div>
              <small>Gender</small>
              <strong>{{ currentCat.gender }}</strong>
            </div>
            <div>
              <small>Age</small>
              <strong>{{ currentCat.age }}</strong>
            </div>
          </div>

          <div class="counter">
            {{ formattedIndex }} / {{ formattedTotal }}
          </div>
        </div>

        <div class="right-panel">
          <img :src="currentCat.image" :alt="currentCat.name" class="cat-image" />
        </div>
      </div>

      <div class="swipe-card">
        <div>
          <p class="section-kicker">Cat Match</p>
          <h2 class="display-heading">{{ currentCat.name }}</h2>
          <p>{{ currentCat.personality }}</p>
          <p class="bio">{{ currentCat.shortBio }}</p>
        </div>

        <div class="swipe-actions">
          <button class="swipe-left" @click="prevCat">Swipe Left</button>
          <button class="swipe-right" @click="nextCat">Swipe Right</button>
        </div>
      </div>

      <div class="admin-placeholder">
        <h3>Admin Tools Placeholder</h3>
        <div>
          <button>Add Cat</button>
          <button>Edit Cat</button>
          <button>Remove Cat</button>
        </div>
      </div>

      <div v-if="showQuiz" class="quiz-overlay">
        <div class="quiz-modal">
          <button class="close-button" @click="showQuiz = false">×</button>

          <h2 class="display-heading">Find Your Match</h2>

          <div
            class="quiz-question"
            v-for="question in quizQuestions"
            :key="question.field"
          >
            <p>{{ question.label }}</p>
            <div class="quiz-options">
              <button
                type="button"
                v-for="option in question.options"
                :key="option.value"
                :class="{ active: answers[question.field] === option.value }"
                @click="answers[question.field] = option.value"
              >
                {{ option.label }}
              </button>
            </div>
          </div>

          <button class="match-button" @click="findMatch">See Match</button>

          <p v-if="matchedCat" class="match-result">
            Your match is {{ matchedCat.name }}.
          </p>
        </div>
      </div>
    </section>
  </PageLayout>
</template>

<script setup>
import { computed, reactive, ref } from 'vue'
import PageLayout from '@/components/layout/PageLayout.vue'

const showQuiz = ref(false)
const currentIndex = ref(0)
const matchedCat = ref(null)

const answers = reactive({
  energy: 'calm',
  age: 'adult',
  style: 'cuddly'
})

const quizQuestions = [
  {
    field: 'energy',
    label: 'Do you prefer a calm or playful cat?',
    options: [
      { label: 'Calm', value: 'calm' },
      { label: 'Playful', value: 'playful' }
    ]
  },
  {
    field: 'age',
    label: 'Do you want a kitten, adult, or senior cat?',
    options: [
      { label: 'Kitten', value: 'kitten' },
      { label: 'Adult', value: 'adult' },
      { label: 'Senior', value: 'senior' }
    ]
  },
  {
    field: 'style',
    label: 'Do you prefer cuddly or independent cats?',
    options: [
      { label: 'Cuddly', value: 'cuddly' },
      { label: 'Independent', value: 'independent' }
    ]
  }
]

const cats = [
  {
    name: 'Nobbs',
    gender: 'Female',
    age: '2 years',
    personality: 'Calm, gentle, and affectionate.',
    shortBio: 'Nobbs loves quiet corners, soft blankets, and slow introductions.',
    image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Mochi',
    gender: 'Male',
    age: '1 year',
    personality: 'Playful, curious, and social.',
    shortBio: 'Mochi enjoys toys, attention, and visitors who want an active cat.',
    image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Luna',
    gender: 'Female',
    age: '3 years',
    personality: 'Independent but sweet once comfortable.',
    shortBio: 'Luna likes peaceful spaces and people who respect her boundaries.',
    image: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=900&q=80'
  },
  {
    name: 'Biscuit',
    gender: 'Male',
    age: '5 years',
    personality: 'Cuddly, relaxed, and friendly.',
    shortBio: 'Biscuit is perfect for someone wanting a calm companion.',
    image: 'https://images.unsplash.com/photo-1592194996308-7b43878e84a6?auto=format&fit=crop&w=900&q=80'
  }
]

const currentCat = computed(() => cats[currentIndex.value] || cats[0])
const formattedIndex = computed(() => String(currentIndex.value + 1).padStart(2, '0'))
const formattedTotal = computed(() => String(cats.length).padStart(2, '0'))

function nextCat() {
  currentIndex.value = (currentIndex.value + 1) % cats.length
}

function prevCat() {
  currentIndex.value = (currentIndex.value - 1 + cats.length) % cats.length
}

function findMatch() {
  const normalizedAnswers = {
    energy: answers.energy.toLowerCase(),
    age: answers.age.toLowerCase(),
    style: answers.style.toLowerCase()
  }

  matchedCat.value = cats.find((cat) => {
    const personality = cat.personality.toLowerCase()
    const age = cat.age.toLowerCase()

    return (
      personality.includes(normalizedAnswers.energy) &&
      personality.includes(normalizedAnswers.style) &&
      age.includes(normalizedAnswers.age)
    )
  }) || cats[0]

  currentIndex.value = cats.indexOf(matchedCat.value)
}
</script>

<style scoped>
.adopt-page {
  min-height: 100vh;
  padding: 2rem;
  background: #b9aea7;
}

.adopt-shell {
  max-width: 1250px;
  min-height: 680px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 1.25fr 1fr;
  background: #f7f5f0;
  box-shadow: 0 20px 50px rgba(75, 44, 45, 0.18);
}

.left-panel {
  position: relative;
  padding: 2rem 3rem;
  display: flex;
  flex-direction: column;
}

.mini-nav {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.mini-brand,
.text-link {
  font-weight: 700;
}

.text-link {
  background: none;
  border: none;
  color: var(--color-text);
  border-bottom: 1px solid var(--color-text);
  cursor: pointer;
}

.quiz-button {
  border: none;
  background: var(--color-primary);
  color: white;
  border-radius: 999px;
  padding: 0.7rem 1rem;
  cursor: pointer;
  font-weight: 700;
}

.side-links {
  display: grid;
  gap: 0.4rem;
  margin-top: 2rem;
  font-size: 0.85rem;
  color: rgba(75, 44, 45, 0.65);
}

.hero-content {
  margin-top: 4rem;
  max-width: 520px;
}

.hero-content h1 {
  font-size: clamp(3rem, 7vw, 5.8rem);
  line-height: 0.95;
  margin: 0;
  text-transform: uppercase;
}

.hero-content h1 span {
  color: #8b7a72;
}

.hero-content p {
  max-width: 420px;
  margin-top: 1.7rem;
  color: rgba(75, 44, 45, 0.72);
  line-height: 1.7;
}

.adopt-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.adopt-now {
  background: none;
  border: none;
  border-bottom: 1px solid var(--color-text);
  text-transform: uppercase;
  font-weight: 800;
  cursor: pointer;
  padding: 0.4rem 0;
}

.arrow-button {
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 999px;
  border: 1px solid rgba(75, 44, 45, 0.2);
  background: white;
  cursor: pointer;
}

.cat-meta {
  display: flex;
  gap: 2rem;
  margin-top: auto;
  padding-bottom: 2rem;
}

.cat-meta div {
  display: grid;
  gap: 0.2rem;
}

.cat-meta small {
  text-transform: uppercase;
  font-size: 0.65rem;
  opacity: 0.6;
}

.cat-meta strong {
  font-size: 0.9rem;
}

.counter {
  position: absolute;
  right: 3rem;
  bottom: 4rem;
  font-size: 0.85rem;
  font-weight: 700;
}

.right-panel {
  min-height: 680px;
  background: #f2f1ed;
}

.cat-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.swipe-card,
.admin-placeholder {
  max-width: 1250px;
  margin: 1.5rem auto 0;
  background: #f7f5f0;
  border-radius: 2rem;
  padding: 2rem;
  box-shadow: 0 12px 30px rgba(75, 44, 45, 0.12);
}

.swipe-card {
  display: flex;
  justify-content: space-between;
  gap: 2rem;
  align-items: center;
}

.section-kicker {
  text-transform: uppercase;
  letter-spacing: 0.25em;
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 700;
}

.swipe-card h2 {
  font-size: 3rem;
  margin: 0.2rem 0;
}

.bio {
  color: rgba(75, 44, 45, 0.72);
}

.swipe-actions {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.swipe-left,
.swipe-right,
.admin-placeholder button,
.match-button,
.quiz-question button {
  border: none;
  border-radius: 999px;
  padding: 0.8rem 1.2rem;
  cursor: pointer;
  font-weight: 700;
}

.swipe-left {
  background: white;
  color: var(--color-text);
}

.swipe-right,
.match-button {
  background: var(--color-primary);
  color: white;
}

.admin-placeholder h3 {
  margin-top: 0;
}

.admin-placeholder div {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.admin-placeholder button {
  background: #fff;
  color: var(--color-text);
}

.quiz-overlay {
  position: fixed;
  inset: 0;
  background: rgba(75, 44, 45, 0.45);
  display: grid;
  place-items: center;
  z-index: 200;
  padding: 1rem;
}

.quiz-modal {
  position: relative;
  width: min(100%, 560px);
  background: #fffaf2;
  border-radius: 2rem;
  padding: 2rem;
  box-shadow: 0 24px 60px rgba(75, 44, 45, 0.25);
}

.quiz-modal h2 {
  font-size: 3rem;
  margin-top: 0;
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  border: none;
  background: var(--color-primary);
  color: white;
  border-radius: 999px;
  width: 2rem;
  height: 2rem;
  cursor: pointer;
}

.quiz-question {
  margin-bottom: 1.5rem;
}

.quiz-question p {
  font-weight: 700;
}

.quiz-question button {
  margin: 0.3rem;
  background: #f2e7df;
  color: var(--color-text);
}

.quiz-options button.active {
  background: var(--color-primary);
  color: white;
}

.match-result {
  margin-top: 1rem;
  font-weight: 800;
  color: var(--color-primary);
}

@media (max-width: 850px) {
  .adopt-page {
    padding: 1rem;
  }

  .adopt-shell {
    grid-template-columns: 1fr;
  }

  .left-panel {
    padding: 1.5rem;
  }

  .right-panel {
    min-height: 420px;
  }

  .swipe-card {
    flex-direction: column;
    align-items: flex-start;
  }

  .cat-meta {
    margin-top: 3rem;
    flex-direction: column;
    gap: 1rem;
  }

  .counter {
    position: static;
  }
}
</style>