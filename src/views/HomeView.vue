<!--
  HomeView.vue — Homepage (Page owner: Abhinav)
-->

<template>
  <PageLayout>

    <!-- SECTION 1: Hero — full screen intro with animated particles -->
    <section class="hero-section" id="home">
      <div class="hero-overlay"></div>
      <div id="heroParticles" class="hero-particles"></div>
      <div class="page-container hero-content">
        <span class="hero-tag">🐾 Where every visit feels like home</span>
        <h1 class="display-heading hero-title">Purr &amp; Pour Cat Café</h1>
        <p class="hero-description">Sip, relax, and connect with our adorable feline family. A cosy escape where every cup comes with a purr.</p>
        <div class="hero-buttons">
          <RouterLink to="/visit/book"><button class="btn-primary-cat">Book a Visit</button></RouterLink>
          <RouterLink to="/cats"><button class="btn-outline-cat">Meet the Cats</button></RouterLink>
        </div>
        <div class="scroll-indicator">
          <span class="scroll-dot"></span>
        </div>
      </div>
    </section>

    <!-- SECTION 2: Cats — card grid, data comes from the cats[] array in script -->
    <section class="cats-section section-space" id="cats">
      <div class="page-container">
        <div class="section-header">
          <h2 class="display-heading section-title">Meet Our Cats</h2>
          <p class="section-subtitle">Each one with their own personality, waiting to make your day brighter.</p>
        </div>
        <div class="cats-grid">
          <article
            v-for="cat in cats"
            :key="cat.name"
            class="cat-card soft-card"
            :ref="el => { if (el) catCardRefs[cat.name] = el }"
            @mousemove="handleTilt($event, cat.name)"
            @mouseleave="resetTilt(cat.name)"
          >
            <div class="cat-image-area">
              <img :src="cat.image" :alt="cat.name" class="cat-photo" />
              <span class="cat-badge">{{ cat.badge }}</span>
            </div>
            <div class="cat-body">
              <h3 class="cat-name display-heading">{{ cat.name }}</h3>
              <p class="cat-desc">{{ cat.desc }}</p>
              <RouterLink to="/cats" class="cat-link">Get to know me →</RouterLink>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- SECTION 3: Menu — 4 category cards, data comes from the menuCategories[] array in script -->
    <section class="menu-section section-space" id="menu">
      <div class="page-container">
        <div class="section-header">
          <h2 class="display-heading section-title">Our Menu</h2>
          <p class="section-subtitle">Crafted with love, inspired by cats.</p>
        </div>
        <div class="menu-grid">
          <div v-for="category in menuCategories" :key="category.name" class="menu-category soft-card">
            <h3 class="menu-category-title display-heading">{{ category.icon }} {{ category.name }}</h3>
            <ul class="menu-list">
              <li v-for="item in category.items" :key="item.name" class="menu-item">
                <div class="menu-item-info">
                  <span class="menu-item-name">{{ item.name }}</span>
                  <span class="menu-item-desc">{{ item.desc }}</span>
                </div>
                <span class="menu-item-price">{{ item.price }}</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 4: Features — 4 highlight cards, data comes from the features[] array in script -->
    <section class="features-section section-space">
      <div class="page-container">
        <div class="features-grid">
          <div v-for="feature in features" :key="feature.title" class="feature-card soft-card">
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3 class="feature-title display-heading">{{ feature.title }}</h3>
            <p class="feature-text">{{ feature.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 5: Visit — opening hours, address, phone, entry fee from visitDetails[] array in script -->
    <section class="visit-section section-space" id="visit">
      <div class="page-container">
        <div class="section-header">
          <h2 class="display-heading section-title">Plan Your Visit</h2>
          <p class="section-subtitle">Everything you need to know before you come in.</p>
        </div>
        <div class="visit-grid">
          <div class="visit-info">
            <div v-for="detail in visitDetails" :key="detail.label" class="visit-detail">
              <span class="visit-icon">{{ detail.icon }}</span>
              <div>
                <strong class="visit-label">{{ detail.label }}</strong>
                <p class="visit-value">{{ detail.value }}</p>
              </div>
            </div>
            <RouterLink to="/visit/book">
              <button class="btn-primary-cat visit-cta">Book Your Spot</button>
            </RouterLink>
          </div>
          <div class="visit-map soft-card">
            <div class="map-placeholder">
              <span class="map-pin">📍</span>
              <p>Swinburne University of Technology, Hawthorn VIC 3122</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- SECTION 6: Newsletter — email subscribe form, handled by handleNewsletter() in script -->
    <section class="newsletter-section">
      <div class="page-container newsletter-content">
        <h2 class="display-heading newsletter-title">Stay in the Loop 🐾</h2>
        <p class="newsletter-subtitle">New cats, seasonal menus, and purr-fect deals — straight to your inbox.</p>
        <form class="newsletter-form" @submit.prevent="handleNewsletter">
          <input
            v-model="emailInput"
            type="email"
            placeholder="your@email.com"
            class="newsletter-input"
            required
          />
          <button type="submit" class="btn-primary-cat">Subscribe</button>
        </form>
      </div>
    </section>

  </PageLayout>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { RouterLink } from 'vue-router'
import PageLayout from '../components/layout/PageLayout.vue'

const emailInput = ref('')
const catCardRefs = {}

const cats = [
  { name: 'Luna',   badge: 'Gentle',  image: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=600&q=80', desc: 'Gentle and curious, happiest watching people from a sunny windowsill.' },
  { name: 'Mochi',  badge: 'Playful', image: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=600&q=80', desc: 'Soft-natured with a big love for feather toys and quiet cuddles.' },
  { name: 'Nala',   badge: 'Sweet',   image: 'https://images.unsplash.com/photo-1495360010541-f48722b34f7d?auto=format&fit=crop&w=600&q=80', desc: 'Independent but sweet, with a dramatic stretch for anyone who brings treats.' },
  { name: 'Biscuit',badge: 'Relaxed', image: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=600&q=80', desc: 'A relaxed senior who loves warm blankets, soft voices, and steady routines.' },
]

const menuCategories = [
  {
    name: 'Hot Drinks', icon: '☕',
    items: [
      { name: 'Purr-fect Latte',    desc: 'Oat milk, double shot, cat art',  price: '$6.50' },
      { name: 'Caramel Pawccino',   desc: 'Caramel, steamed milk, espresso', price: '$7.00' },
      { name: 'Chamomile Dream',    desc: 'Soothing chamomile blend',         price: '$5.00' },
    ],
  },
  {
    name: 'Cold Drinks', icon: '🧊',
    items: [
      { name: 'Iced Biscuit Brew',  desc: 'Cold brew over oat milk',         price: '$7.50' },
      { name: 'Melon Mochi Fizz',   desc: 'Sparkling melon + lychee jelly',  price: '$6.00' },
      { name: 'Matcha Paws',        desc: 'Iced matcha, oat milk',            price: '$7.00' },
    ],
  },
  {
    name: 'Treats', icon: '🍰',
    items: [
      { name: 'Cat Paw Cookies',    desc: 'Butter shortbread, glazed',        price: '$4.50' },
      { name: 'Mochi Cheesecake',   desc: 'Soft mochi base, cream cheese',   price: '$8.00' },
      { name: 'Croissant Kitty',    desc: 'Almond cream croissant',           price: '$6.00' },
    ],
  },
  {
    name: 'Cat-Friendly', icon: '🐟',
    items: [
      { name: 'Tuna Treats',        desc: 'For the café residents only!',     price: 'Free' },
      { name: 'Feather Wand',       desc: 'Borrow a toy for your visit',      price: 'Free' },
      { name: 'Lap Warming',        desc: 'Cannot be ordered. Happens naturally.', price: '💝' },
    ],
  },
]

const features = [
  { icon: '☕', title: 'Quality Coffee',    text: 'Single-origin beans roasted locally. Every cup is a little ritual.' },
  { icon: '🐱', title: 'Rescue Cats',       text: 'All our cats are rescues. Your visit supports their care directly.' },
  { icon: '🏡', title: 'Cosy Atmosphere',   text: 'Soft lighting, warm tones, and a corner for everyone.' },
  { icon: '💛', title: 'Cat-Positive',      text: 'Stress-free environment designed for both humans and cats.' },
]

const visitDetails = [
  { icon: '🕐', label: 'Hours',   value: 'Mon–Fri 9am–7pm · Sat–Sun 10am–8pm' },
  { icon: '📍', label: 'Address', value: 'Swinburne University of Technology, Hawthorn VIC 3122' },
  { icon: '📞', label: 'Phone',   value: '(03) 9000 0000' },
  { icon: '🎟️', label: 'Entry',   value: '$12 per hour · Includes one complimentary drink' },
]

function handleNewsletter() {
  emailInput.value = ''
}

function handleTilt(event, name) {
  const card = catCardRefs[name]
  if (!card) return
  const rect = card.getBoundingClientRect()
  const x = ((event.clientX - rect.left) / rect.width  - 0.5) * 2
  const y = ((event.clientY - rect.top)  / rect.height - 0.5) * 2
  card.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 8}deg) scale(1.03)`
}

function resetTilt(name) {
  const card = catCardRefs[name]
  if (!card) return
  card.style.transform = 'perspective(600px) rotateX(0) rotateY(0) scale(1)'
}

let revealObserver = null

onMounted(() => {
  // Floating particles
  const container = document.getElementById('heroParticles')
  if (container) {
    const symbols = ['🐾', '✦', '·', '✦', '·', '🐾']
    for (let i = 0; i < 12; i++) {
      const el = document.createElement('span')
      el.className = 'particle'
      el.textContent = symbols[i % symbols.length]
      el.style.cssText = `
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        font-size: ${0.6 + Math.random() * 1.4}rem;
        animation-duration: ${4 + Math.random() * 6}s;
        animation-delay: ${-Math.random() * 4}s;
        opacity: ${0.15 + Math.random() * 0.35};
      `
      container.appendChild(el)
    }
  }

  // Stagger grid children before observing
  ;['.cats-grid', '.menu-grid', '.features-grid'].forEach(sel => {
    const grid = document.querySelector(sel)
    if (!grid) return
    Array.from(grid.children).forEach((child, i) => {
      child.style.transitionDelay = `${i * 80}ms`
    })
  })

  // Scroll reveal
  const targets = document.querySelectorAll(
    '.cat-card, .menu-category, .feature-card, .visit-detail, .section-header'
  )
  targets.forEach(el => el.classList.add('reveal'))

  revealObserver = new IntersectionObserver(
    entries => entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
        revealObserver.unobserve(entry.target)
      }
    }),
    { threshold: 0.12 }
  )
  targets.forEach(el => revealObserver.observe(el))
})

onUnmounted(() => {
  if (revealObserver) revealObserver.disconnect()
})
</script>

<style scoped>
/* ── Hero ────────────────────────────────────────── */
.hero-section {
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  background: linear-gradient(135deg, var(--color-bg-light) 0%, var(--color-bg-blush) 60%, var(--color-cream) 100%);
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at 70% 50%, rgba(232, 166, 161, 0.2) 0%, transparent 70%);
  pointer-events: none;
}

.hero-particles {
  position: absolute;
  inset: 0;
  pointer-events: none;
  overflow: hidden;
}

.hero-content {
  position: relative;
  z-index: 1;
  padding: 6rem 0 4rem;
}

.hero-tag {
  display: inline-block;
  background: var(--color-caramel);
  color: var(--color-text);
  border-radius: var(--radius-pill);
  padding: 0.4rem 1.2rem;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  animation: fadeInUp 0.6s ease both;
}

.hero-title {
  font-size: clamp(2.8rem, 6vw, 5rem);
  line-height: 1.15;
  color: var(--color-text);
  margin: 0 0 1.2rem;
  animation: fadeInUp 0.7s 0.1s ease both;
}

.hero-description {
  font-size: 1.15rem;
  opacity: 0.72;
  max-width: 520px;
  line-height: 1.7;
  margin: 0;
  animation: fadeInUp 0.7s 0.2s ease both;
}

.hero-buttons {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
  animation: fadeInUp 0.7s 0.3s ease both;
}

.hero-buttons a { text-decoration: none; }

.scroll-indicator {
  margin-top: 3.5rem;
  display: flex;
  animation: fadeIn 1s 0.8s ease both;
}

.scroll-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: var(--color-soft-pink);
  animation: scrollPulse 2s ease-in-out infinite;
}

/* ── Particles (global — dynamically injected) ───── */
:global(.particle) {
  position: absolute;
  animation: floatParticle linear infinite;
  user-select: none;
  pointer-events: none;
}

/* ── Shared section helpers ──────────────────────── */
.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-title {
  font-size: clamp(1.8rem, 3.5vw, 2.8rem);
  color: var(--color-text);
  margin: 0 0 0.6rem;
}

.section-subtitle {
  margin: 0;
  opacity: 0.65;
  font-size: 1.05rem;
}

/* ── Cats ────────────────────────────────────────── */
.cats-section { background: var(--color-bg-soft); }

.cats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}

.cat-card {
  cursor: pointer;
  transition: transform 0.15s ease, box-shadow 0.15s ease;
  overflow: hidden;
  padding: 0;
}

.cat-image-area {
  position: relative;
  height: 200px;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  overflow: hidden;
}

.cat-photo {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.cat-badge {
  position: absolute;
  top: 0.75rem;
  right: 0.75rem;
  background: white;
  color: var(--color-primary);
  border-radius: var(--radius-pill);
  padding: 0.2rem 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  box-shadow: var(--shadow-soft);
}

.cat-body { padding: 1.2rem; }

.cat-name {
  font-size: 1.4rem;
  color: var(--color-text);
  margin: 0 0 0.4rem;
}

.cat-desc {
  font-size: 0.9rem;
  opacity: 0.7;
  line-height: 1.5;
  margin: 0 0 1rem;
}

.cat-link {
  color: var(--color-primary);
  text-decoration: none;
  font-size: 0.85rem;
  font-weight: 600;
}

/* ── Menu ────────────────────────────────────────── */
.menu-section { background: var(--color-bg-blush); }

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 1.5rem;
}

.menu-category-title {
  font-size: 1.3rem;
  color: var(--color-text);
  margin: 0 0 1.2rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid var(--color-caramel);
}

.menu-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
}

.menu-item-info { flex: 1; }

.menu-item-name {
  display: block;
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--color-text);
}

.menu-item-desc {
  display: block;
  font-size: 0.8rem;
  opacity: 0.6;
  margin-top: 0.15rem;
}

.menu-item-price {
  font-weight: 700;
  color: var(--color-primary);
  white-space: nowrap;
  font-size: 0.95rem;
}

/* ── Features ────────────────────────────────────── */
.features-section { background: var(--color-bg-light); }

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}

.feature-icon { font-size: 2.2rem; margin-bottom: 0.75rem; }

.feature-title {
  font-size: 1.2rem;
  color: var(--color-text);
  margin: 0 0 0.5rem;
}

.feature-text { font-size: 0.9rem; opacity: 0.7; line-height: 1.6; margin: 0; }

/* ── Visit ───────────────────────────────────────── */
.visit-section { background: var(--color-bg-soft); }

.visit-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
  align-items: start;
}

.visit-detail {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.visit-icon { font-size: 1.5rem; flex-shrink: 0; }

.visit-label {
  display: block;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.09em;
  color: var(--color-primary);
  margin-bottom: 0.2rem;
}

.visit-value { margin: 0; font-size: 0.95rem; opacity: 0.72; }

.visit-cta { margin-top: 0.5rem; }

.visit-map {
  min-height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  background: var(--color-cream);
}

.map-placeholder { opacity: 0.6; }

.map-pin {
  display: block;
  font-size: 3rem;
  margin-bottom: 0.5rem;
  animation: heartbeat 2.2s ease-in-out infinite;
}

/* ── Newsletter ──────────────────────────────────── */
.newsletter-section {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-soft-pink) 100%);
  padding: 5rem 0;
  text-align: center;
}

.newsletter-title {
  font-size: clamp(1.8rem, 3vw, 2.5rem);
  color: white;
  margin: 0 0 0.75rem;
}

.newsletter-subtitle {
  color: rgba(255, 255, 255, 0.85);
  font-size: 1.05rem;
  margin: 0 0 2rem;
}

.newsletter-form {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}

.newsletter-input {
  padding: 0.8rem 1.4rem;
  border-radius: var(--radius-pill);
  border: none;
  font-size: 1rem;
  width: 280px;
  outline: none;
  font-family: var(--font-body);
}

.newsletter-input:focus {
  box-shadow: 0 0 0 3px rgba(255, 255, 255, 0.45);
}

/* ── Scroll reveal ───────────────────────────────── */
.reveal {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.5s ease, transform 0.5s ease;
}

.reveal.visible {
  opacity: 1;
  transform: translateY(0);
}

/* ── Keyframe animations ─────────────────────────── */
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to   { opacity: 1; }
}

@keyframes heartbeat {
  0%, 100% { transform: scale(1); }
  50%       { transform: scale(1.18); }
}

@keyframes scrollPulse {
  0%, 100% { transform: translateY(0);   opacity: 1; }
  50%       { transform: translateY(7px); opacity: 0.35; }
}

@keyframes bounce {
  0%, 100% { transform: translateY(0); }
  50%       { transform: translateY(-8px); }
}

@keyframes floatParticle {
  0%   { transform: translateY(0)    rotate(0deg); }
  50%  { transform: translateY(-28px) rotate(180deg); }
  100% { transform: translateY(0)    rotate(360deg); }
}

/* ── Responsive ──────────────────────────────────── */
@media (max-width: 768px) {
  .visit-grid { grid-template-columns: 1fr; }
  .hero-title { font-size: 2.4rem; }
  .hero-buttons { flex-direction: column; align-items: flex-start; }
}
</style>
