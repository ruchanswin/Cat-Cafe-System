<template>
  <PageLayout>
    <section class="section-space">
      <div class="page-container">
        <h1 class="display-heading">Frequently Asked Questions</h1>
        <p>Find answers to common questions about visiting Purr & Pour Cat Café.</p>
        <div class="cards-grid">
          <div class="soft-card">
            <h3>Cat Allergies</h3>
            <p>We recommend that visitors with cat allergies consult their doctor before visiting. Antihistamines are advised. Our café is not suitable for those with severe allergies as cats roam freely throughout the space.</p>
          </div>
          <div class="soft-card">
            <h3>Age Restrictions</h3>
            <p>Children under 12 must be accompanied by an adult at all times. We ask that young children are supervised closely to ensure the safety and comfort of our cats.</p>
          </div>
          <div class="soft-card">
            <h3>Pricing & Packages</h3>
            <p>Entry is $15 per person and includes one complimentary drink. Additional drinks and food items are available to purchase. Bookings are recommended but walk-ins are welcome during opening hours.</p>
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
</style>