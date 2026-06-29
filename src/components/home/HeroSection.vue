<template>
  <section id="home" class="hero section-space">
    <div class="page-container hero-grid">
      <div>
        <div class="tag">🐾 Cozy cat café website template</div>

        <h1 class="display-heading hero-title">
          Warm brews, soft paws, and a sweet caramel glow.
        </h1>

        <p class="hero-text">
          A soft, playful homepage for our cat café and rescue website.
        </p>

        <div class="hero-buttons">
          <button class="btn-primary-cat">Book a Visit</button>
          <button class="btn-outline-cat">Meet the Cats</button>
        </div>
      </div>

      <div class="soft-card hero-image">
        Hero image placeholder
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  align-items: center;
}

.hero-title {
  font-size: 4rem;
  line-height: 1.2;
}

.hero-text {
  font-size: 1.1rem;
  opacity: 0.8;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.hero-image {
  min-height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>