<template>
  <article
    class="cat-card"
    role="button"
    tabindex="0"
    :aria-label="`View details for ${cat.name}`"
    @click="$emit('open-detail', cat)"
    @keydown.enter="$emit('open-detail', cat)"
    @keydown.space.prevent="$emit('open-detail', cat)"
  >
    <img :src="cat.image || placeholderImage" :alt="`${cat.name} the ${cat.breed}`" />

    <div class="cat-content">
      <div class="cat-heading">
        <div>
          <p class="status">{{ cat.status }}</p>
          <h2>{{ cat.name }}</h2>
        </div>

        <button
          class="favorite-button"
          type="button"
          :aria-pressed="isFavorite"
          :aria-label="`${isFavorite ? 'Remove' : 'Add'} ${cat.name} as favourite`"
          @click.stop="$emit('toggle-favorite', cat.id)"
        >
          {{ isFavorite ? '♥' : '♡' }}
        </button>
      </div>

      <dl class="cat-details">
        <div>
          <dt>Age</dt>
          <dd>{{ formatAge(cat.age) }}</dd>
        </div>
        <div>
          <dt>Breed</dt>
          <dd>{{ cat.breed }}</dd>
        </div>
        <div>
          <dt>{{ cat.gender ? 'Gender' : 'Popularity' }}</dt>
          <dd>{{ cat.gender || `${cat.popularity}/100` }}</dd>
        </div>
      </dl>

      <p class="personality">{{ cat.personality }}</p>
    </div>
  </article>
</template>

<script setup>
import { formatAgeDisplay } from '../../utils/catDisplay.js'

const placeholderImage =
  'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=900&q=80'

function formatAge(age) {
  return formatAgeDisplay(age)
}

defineProps({
  cat: {
    type: Object,
    required: true
  },
  isFavorite: {
    type: Boolean,
    default: false
  }
})

defineEmits(['toggle-favorite', 'open-detail'])
</script>

<style scoped>
.cat-card {
  display: grid;
  overflow: hidden;
  height: 100%;
  background: white;
  border: 1px solid rgba(179, 156, 142, 0.24);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.cat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 28px rgba(182, 92, 104, 0.15);
}

.cat-card:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

img {
  width: 100%;
  height: 220px;
  object-fit: cover;
}

.cat-content {
  display: grid;
  gap: 1rem;
  padding: 1.25rem;
}

.cat-heading {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  justify-content: space-between;
}

.status {
  width: fit-content;
  margin: 0 0 0.45rem;
  padding: 0.25rem 0.7rem;
  color: var(--color-primary);
  background: var(--color-bg-blush);
  border-radius: var(--radius-pill);
  font-size: 0.8rem;
  font-weight: 700;
}

h2,
p,
dl,
dd {
  margin: 0;
}

h2 {
  color: var(--color-text);
}

.favorite-button {
  width: 2.75rem;
  height: 2.75rem;
  color: var(--color-primary);
  background: var(--color-bg-light);
  border: 1px solid rgba(179, 156, 142, 0.4);
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.4rem;
  line-height: 1;
}

.favorite-button[aria-pressed='true'] {
  color: white;
  background: var(--color-primary);
}

.cat-details {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.cat-details div {
  padding: 0.75rem;
  background: var(--color-bg-soft);
  border-radius: 1rem;
}

dt {
  color: var(--color-primary);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
}

dd {
  margin-top: 0.2rem;
  font-weight: 700;
}

.personality {
  line-height: 1.6;
}

@media (max-width: 520px) {
  .cat-details {
    grid-template-columns: 1fr;
  }
}
</style>
