<template>
  <PageLayout>
    <section id="cats" class="cats-hero page-container">
      <h1 class="display-heading">Our Cats</h1>
      <p>
        Meet the wonderful cats that call Purr & Pour home. Each one has their own unique personality and story.
      </p>
      <a class="team-link" href="#meet-team" @click.prevent="scrollToTeam">Meet the team caring for them</a>
    </section>

    <section v-if="isAdmin" class="page-container admin-editor" aria-label="Admin cat management">
      <h2 class="display-heading">Admin: Manage Cats</h2>

      <form class="admin-form" @submit.prevent="handleAddCat">
        <div class="admin-grid">
          <label>
            Name
            <input v-model="newCat.name" type="text" required />
          </label>
          <label>
            Age
            <select v-model="newCat.ageCategory">
              <option value="kitten">Kitten</option>
              <option value="adult">Adult</option>
              <option value="senior">Senior</option>
            </select>
          </label>
          <label>
            Breed
            <input v-model="newCat.breed" type="text" />
          </label>
          <label class="admin-span-2">
            Image URL
            <input v-model="newCat.image" type="url" placeholder="https://..." />
          </label>
          <label class="admin-span-2">
            Personality
            <input v-model="newCat.personality" type="text" />
          </label>
          <label class="admin-span-2">
            Description
            <textarea
              v-model="newCat.description"
              class="admin-textarea"
              rows="4"
              placeholder="Short bio shown in listings and match results…"
            />
          </label>
          <label class="admin-span-2">
            Habits &amp; routine
            <textarea
              v-model="newCat.habits"
              class="admin-textarea"
              rows="4"
              placeholder="Daily routine, favourite spots, social style…"
            />
          </label>
          <label class="admin-span-2">
            How to feed at the café
            <textarea
              v-model="newCat.feedingGuide"
              class="admin-textarea"
              rows="4"
              placeholder="Treat rules, feeding times, staff notes…"
            />
          </label>
          <label>
            Energy level
            <select v-model="newCat.energyLevel">
              <option value="calm">Calm</option>
              <option value="playful">Playful</option>
            </select>
          </label>
          <label>
            Affection level
            <select v-model="newCat.affectionLevel">
              <option value="cuddly">Cuddly</option>
              <option value="independent">Independent</option>
              <option value="social">Social</option>
            </select>
          </label>
          <label>
            Status
            <select v-model="newCat.status">
              <option value="Available">Available</option>
              <option value="Pending">Pending</option>
              <option value="Adopted">Adopted</option>
            </select>
          </label>
          <label>
            Popularity (0-100)
            <input v-model.number="newCat.popularity" type="number" min="0" max="100" />
          </label>
          <label class="admin-inline">
            <span>Available for booking</span>
            <input v-model="newCat.available" type="checkbox" />
          </label>
        </div>

        <button class="btn-primary-cat" type="submit">Add Cat</button>
      </form>

      <div class="admin-list">
        <div v-for="cat in cats" :key="cat.id" class="admin-item">
          <div class="admin-item-head">
            <strong>#{{ cat.id }} — {{ cat.name }}</strong>
            <button class="btn-outline-cat" type="button" @click="removeCat(cat.id)">Remove</button>
          </div>

          <div class="admin-grid">
            <label>
              Name
              <input :value="cat.name" type="text" @input="updateCat(cat.id, { name: $event.target.value })" />
            </label>
            <label>
              Age
              <select
                :value="getAgeCategory(cat)"
                @change="updateCatAge(cat.id, $event.target.value)"
              >
                <option value="kitten">Kitten</option>
                <option value="adult">Adult</option>
                <option value="senior">Senior</option>
              </select>
            </label>
            <label>
              Breed
              <input :value="cat.breed" type="text" @input="updateCat(cat.id, { breed: $event.target.value })" />
            </label>
            <label class="admin-span-2">
              Image URL
              <input :value="cat.image" type="url" @input="updateCat(cat.id, { image: $event.target.value })" />
            </label>
            <label class="admin-span-2">
              Personality
              <input :value="cat.personality" type="text" @input="updateCat(cat.id, { personality: $event.target.value })" />
            </label>
            <label class="admin-span-2">
              Description
              <textarea
                :value="cat.description"
                class="admin-textarea"
                rows="4"
                @input="updateCat(cat.id, { description: $event.target.value })"
              />
            </label>
            <label class="admin-span-2">
              Habits &amp; routine
              <textarea
                :value="cat.habits"
                class="admin-textarea"
                rows="4"
                @input="updateCat(cat.id, { habits: $event.target.value })"
              />
            </label>
            <label class="admin-span-2">
              How to feed at the café
              <textarea
                :value="cat.feedingGuide"
                class="admin-textarea"
                rows="4"
                @input="updateCat(cat.id, { feedingGuide: $event.target.value })"
              />
            </label>
            <label>
              Energy level
              <select
                :value="cat.energyLevel || 'calm'"
                @change="updateCat(cat.id, { energyLevel: $event.target.value })"
              >
                <option value="calm">Calm</option>
                <option value="playful">Playful</option>
              </select>
            </label>
            <label>
              Affection level
              <select
                :value="cat.affectionLevel || 'cuddly'"
                @change="updateCat(cat.id, { affectionLevel: $event.target.value })"
              >
                <option value="cuddly">Cuddly</option>
                <option value="independent">Independent</option>
                <option value="social">Social</option>
              </select>
            </label>
            <label>
              Status
              <select :value="cat.status" @change="updateCat(cat.id, { status: $event.target.value })">
                <option value="Available">Available</option>
                <option value="Pending">Pending</option>
                <option value="Adopted">Adopted</option>
              </select>
            </label>
            <label>
              Popularity
              <input :value="cat.popularity" type="number" min="0" max="100" @input="updateCat(cat.id, { popularity: Number($event.target.value) })" />
            </label>
            <label class="admin-inline">
              <span>Available for booking</span>
              <input
                :checked="Boolean(cat.available)"
                type="checkbox"
                @change="updateCat(cat.id, { available: $event.target.checked })"
              />
            </label>
          </div>
        </div>
      </div>
    </section>

    <section class="page-container controls-panel" aria-label="Cat filters">
      <label>
        Search by name
        <input v-model="searchTerm" type="search" placeholder="Try Luna or Mochi" />
      </label>

      <label>
        Breed
        <select v-model="selectedBreed">
          <option value="all">All breeds</option>
          <option v-for="breed in breeds" :key="breed" :value="breed">{{ breed }}</option>
        </select>
      </label>

      <label>
        Age
        <select v-model="selectedAge">
          <option value="all">All ages</option>
          <option value="kitten">Kitten</option>
          <option value="adult">Adult</option>
          <option value="senior">Senior</option>
        </select>
      </label>

      <label>
        Availability
        <select v-model="selectedStatus">
          <option value="all">All statuses</option>
          <option v-for="status in statuses" :key="status" :value="status">{{ status }}</option>
        </select>
      </label>

      <label>
        Sort by
        <select v-model="sortBy">
          <option value="name">Name (A–Z)</option>
          <option value="age-asc">Age: kitten → senior</option>
          <option value="age-desc">Age: senior → kitten</option>
        </select>
      </label>
    </section>

    <section class="page-container results-summary" aria-live="polite">
      <p>
        Showing {{ paginatedCats.length }} of {{ filteredCats.length }} cats
        <span v-if="favoriteIds.length">({{ favoriteIds.length }} favourited)</span>
      </p>
      <div class="results-actions">
        <button class="btn-outline-cat" type="button" @click="copyShareLink">
          {{ shareCopied ? 'Link copied!' : 'Copy share link' }}
        </button>
        <button class="btn-outline-cat" type="button" @click="resetFilters">Reset filters</button>
      </div>
    </section>

    <section class="page-container cats-grid" aria-label="Rescue cats">
      <CatCard
        v-for="cat in paginatedCats"
        :key="cat.id"
        :cat="cat"
        :is-favorite="isFavorite(cat.id)"
        @toggle-favorite="toggleFavorite"
        @open-detail="openCatDetail"
      />
    </section>

    <p v-if="filteredCats.length === 0" class="page-container empty-state">
      No cats match those filters yet. Try a different search or reset the filters.
    </p>

    <nav
      v-if="totalPages > 1"
      class="page-container pagination"
      aria-label="Cat results pagination"
    >
      <button
        class="btn-outline-cat"
        type="button"
        :disabled="currentPage === 1"
        @click="currentPage -= 1"
      >
        Previous
      </button>

      <span>Page {{ currentPage }} of {{ totalPages }}</span>

      <button
        class="btn-outline-cat"
        type="button"
        :disabled="currentPage === totalPages"
        @click="currentPage += 1"
      >
        Next
      </button>
    </nav>

    <CatDetailModal :cat="selectedCat" @close="closeCatDetail" />

    <TeamSection :members="team" />
  </PageLayout>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import PageLayout from '../../components/layout/PageLayout.vue'
import CatCard from '../../components/cats & teams/CatCard.vue'
import CatDetailModal from '../../components/cats & teams/CatDetailModal.vue'
import TeamSection from '../../components/cats & teams/TeamSection.vue'
import { useCats } from '../../composables/useCats.js'
import { useTeam } from '../../composables/useTeam.js'
import { useCatDiscoveryUrl } from '../../composables/useCatDiscoveryUrl.js'
import { useCatFavorites } from '../../composables/useCatFavorites.js'
import { useAuth } from '../../stores/auth'
import { getAgeCategory, compareAgeCats } from '../../utils/catDisplay.js'

const { cats, addCat, updateCat, removeCat } = useCats()
const { team } = useTeam()
const { isAdmin } = useAuth()

const AGE_LABELS = { kitten: 'Kitten', adult: 'Adult', senior: 'Senior' }

const newCat = ref({
  name: '',
  ageCategory: 'adult',
  breed: '',
  personality: '',
  description: '',
  habits: '',
  feedingGuide: '',
  energyLevel: 'calm',
  affectionLevel: 'cuddly',
  status: 'Available',
  popularity: 80,
  image: '',
  available: true
})

function ageLabelFromCategory(category) {
  return AGE_LABELS[category] ?? 'Adult'
}

function updateCatAge(id, ageCategory) {
  updateCat(id, {
    ageCategory,
    age: ageLabelFromCategory(ageCategory)
  })
}

const pageSize = 3
const searchTerm = ref('')
const selectedBreed = ref('all')
const selectedAge = ref('all')
const selectedStatus = ref('all')
const sortBy = ref('name')
const currentPage = ref(1)
const selectedCatId = ref(null)
const { favoriteIds, isFavorite, toggleFavorite } = useCatFavorites()
const shareCopied = ref(false)

const breeds = computed(() => [...new Set(cats.value.map((cat) => cat.breed))].sort())
const statuses = computed(() => [...new Set(cats.value.map((cat) => cat.status))].sort())

const { isSyncingFromRoute } = useCatDiscoveryUrl({
  searchTerm,
  selectedBreed,
  selectedAge,
  selectedStatus,
  sortBy,
  currentPage,
  selectedCatId,
  validBreeds: breeds,
  validStatuses: statuses
})

const selectedCat = computed(() => {
  if (selectedCatId.value == null) return null
  return cats.value.find((cat) => cat.id === selectedCatId.value) ?? null
})

const filteredCats = computed(() => {
  const normalizedSearch = searchTerm.value.trim().toLowerCase()

  return cats
    .value
    .filter((cat) => cat.name.toLowerCase().includes(normalizedSearch))
    .filter((cat) => selectedBreed.value === 'all' || cat.breed === selectedBreed.value)
    .filter((cat) => selectedStatus.value === 'all' || cat.status === selectedStatus.value)
    .filter((cat) => {
      if (selectedAge.value === 'all') return true
      return getAgeCategory(cat) === selectedAge.value
    })
    .sort((firstCat, secondCat) => {
      if (sortBy.value === 'age-asc') return compareAgeCats(firstCat, secondCat)
      if (sortBy.value === 'age-desc') return compareAgeCats(secondCat, firstCat)
      if (sortBy.value === 'name') return firstCat.name.localeCompare(secondCat.name)
      return secondCat.popularity - firstCat.popularity
    })
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredCats.value.length / pageSize)))

const paginatedCats = computed(() => {
  const startIndex = (currentPage.value - 1) * pageSize
  return filteredCats.value.slice(startIndex, startIndex + pageSize)
})

watch([searchTerm, selectedBreed, selectedAge, selectedStatus, sortBy], () => {
  if (isSyncingFromRoute.value) return
  currentPage.value = 1
})

watch(totalPages, (newTotalPages) => {
  if (currentPage.value > newTotalPages) currentPage.value = newTotalPages
})

function openCatDetail(cat) {
  selectedCatId.value = cat.id
}

function closeCatDetail() {
  selectedCatId.value = null
}

function scrollToTeam() {
  document.getElementById('meet-team')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

async function copyShareLink() {
  try {
    await navigator.clipboard.writeText(window.location.href)
    shareCopied.value = true
    setTimeout(() => {
      shareCopied.value = false
    }, 2000)
  } catch {
    // ignore
  }
}

function resetFilters() {
  searchTerm.value = ''
  selectedBreed.value = 'all'
  selectedAge.value = 'all'
  selectedStatus.value = 'all'
  sortBy.value = 'name'
  currentPage.value = 1
  selectedCatId.value = null
}

function handleAddCat() {
  if (!newCat.value.name.trim()) return
  const { ageCategory, ...rest } = newCat.value
  addCat({
    ...rest,
    age: ageLabelFromCategory(ageCategory),
    ageCategory,
    status: newCat.value.status,
    available: Boolean(newCat.value.available)
  })
  newCat.value = {
    name: '',
    ageCategory: 'adult',
    breed: '',
    personality: '',
    description: '',
    habits: '',
    feedingGuide: '',
    energyLevel: 'calm',
    affectionLevel: 'cuddly',
    status: 'Available',
    popularity: 80,
    image: '',
    available: true
  }
}
</script>

<style scoped>
.cats-hero {
  padding: 5rem 0 2rem;
  text-align: center;
}

.eyebrow {
  margin: 0 0 0.75rem;
  color: var(--color-primary);
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

h1 {
  max-width: 760px;
  margin: 0 auto 1rem;
  color: var(--color-text);
  font-size: clamp(2.2rem, 5vw, 4rem);
  line-height: 1;
}

.cats-hero p {
  max-width: 720px;
  margin: 0 auto;
  line-height: 1.7;
}

.team-link {
  display: inline-flex;
  margin-top: 1.25rem;
  color: var(--color-primary);
  font-weight: 700;
}

.controls-panel {
  display: grid;
  grid-template-columns: repeat(5, minmax(150px, 1fr));
  gap: 1rem;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.72);
  border: 1px solid rgba(179, 156, 142, 0.24);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
}

.admin-editor {
  margin: 1.5rem auto 0;
  padding: 1.25rem;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(179, 156, 142, 0.24);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
}

.admin-form {
  margin-top: 1rem;
}

.admin-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
  margin-bottom: 1rem;
}

.admin-span-2 {
  grid-column: span 2;
}

.admin-inline {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.admin-list {
  display: grid;
  gap: 1rem;
  margin-top: 1.25rem;
}

.admin-item {
  padding: 1rem;
  border: 1px solid rgba(179, 156, 142, 0.24);
  border-radius: 1rem;
  background: rgba(255, 255, 255, 0.75);
}

.admin-item-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  margin-bottom: 0.75rem;
}

@media (max-width: 800px) {
  .admin-grid {
    grid-template-columns: 1fr;
  }
  .admin-span-2 {
    grid-column: span 1;
  }
}
.owner-info {
  font-size: 0.8rem;
  color: var(--color-border);
  margin-top: 2rem;
}

label {
  display: grid;
  gap: 0.5rem;
  color: var(--color-primary);
  font-size: 0.85rem;
  font-weight: 700;
}

input,
select,
textarea {
  width: 100%;
  padding: 0.8rem 0.9rem;
  color: var(--color-text);
  background: white;
  border: 1px solid rgba(179, 156, 142, 0.55);
  border-radius: 1rem;
  font: inherit;
}

.admin-textarea {
  min-height: 6.5rem;
  resize: vertical;
  line-height: 1.5;
}

.results-summary {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 0;
}

.results-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.results-summary p {
  margin: 0;
  font-weight: 700;
}

.cats-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.25rem;
}

.empty-state {
  padding: 2rem 0 5rem;
  text-align: center;
}

.pagination {
  display: flex;
  gap: 1rem;
  align-items: center;
  justify-content: center;
  padding: 2rem 0;
}

button:disabled {
  cursor: not-allowed;
  opacity: 0.5;
}

@media (max-width: 960px) {
  .controls-panel {
    grid-template-columns: repeat(2, 1fr);
  }

  .cats-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .cats-grid {
    grid-template-columns: 1fr;
  }

  .controls-panel,
  .results-summary,
  .pagination {
    grid-template-columns: 1fr;
    flex-direction: column;
    align-items: stretch;
  }

  .results-summary,
  .pagination {
    text-align: center;
  }
}
</style>
