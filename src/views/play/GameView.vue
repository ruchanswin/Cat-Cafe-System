<template>
  <PageLayout>
    <section class="section-space">
      <div class="page-container">
        <h1 class="display-heading">Play Games</h1>
        <p>Enjoy fun cat-themed games and activities while you relax at Purr & Pour.</p>
        <div class="cards-grid">
          <div class="soft-card">
            <h3>Cat Trivia</h3>
            <p>Test your knowledge about cats with our fun quiz.</p>
            <span class="coming-soon">Coming soon</span>
          </div>

          <!-- Memory Match — owner: Akshita -->
          <router-link to="/play/memory-game" class="soft-card soft-card-active">
            <h3>🐱 Cat Memory Match</h3>
            <p>Flip cards to find matching pairs. Three difficulty levels and a leaderboard!</p>
            <span class="play-now">Play now →</span>
          </router-link>

          <div class="soft-card">
            <h3>Virtual Cat Care</h3>
            <p>Learn about cat care through interactive simulations.</p>
            <span class="coming-soon">Coming soon</span>
          </div>
        </div>
      </div>
    </section>
  </PageLayout>
</template>

<script setup>
import PageLayout from '../../components/layout/PageLayout.vue'
</script>

<style scoped>
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.owner-info {
  font-size: 0.8rem;
  color: var(--color-border);
  margin-top: 2rem;
}

/* Active (playable) game card — clickable router-link, no underline */
.soft-card-active {
  text-decoration: none;
  color: inherit;
  display: block;
  cursor: pointer;
  border: 2px solid #B65C68;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
}

.soft-card-active:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(182, 92, 104, 0.18);
}

.soft-card-active h3,
.soft-card-active p {
  color: inherit;
}

.play-now {
  display: inline-block;
  margin-top: 0.75rem;
  color: #B65C68;
  font-weight: 600;
  font-size: 0.9rem;
}

/* Inactive placeholders — make it clear they aren't playable yet */
.coming-soon {
  display: inline-block;
  margin-top: 0.75rem;
  font-size: 0.8rem;
  color: #8a6f70;
  font-style: italic;
}
</style>