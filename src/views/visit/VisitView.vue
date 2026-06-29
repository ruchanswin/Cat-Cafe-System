<template>
  <PageLayout>

    <AppContainer>

      <h1 class="display-heading">Visit Us</h1>

      <!-- Opening Hours Section -->
      <section class="section-space">
        <h2 class="display-heading">Opening Hours</h2>
        <div class="hours-grid">
          <div class="hours-card">
            <span class="hours-day">Monday – Friday</span>
            <span class="hours-time">9:00 AM – 5:00 PM</span>
          </div>
          <div class="hours-card">
            <span class="hours-day">Saturday</span>
            <span class="hours-time">10:00 AM – 4:00 PM</span>
          </div>
          <div class="hours-card">
            <span class="hours-day">Sunday</span>
            <span class="hours-time">10:00 AM – 4:00 PM</span>
          </div>
        </div>
      </section>


      <!-- Location Section -->
      <section class="section-space">
        <h2 class="display-heading">Location</h2>
        <div class="location-row">
          <div class="soft-card location-map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4009.1346970912596!2d145.03164123632882!3d-37.82364190404133!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6ad642326bae5aaf%3A0x75e96bbd4988f769!2sSwinburne%20University%20of%20Technology!5e0!3m2!1sen!2sau!4v1777897710527!5m2!1sen!2sau"
              width="100%" height="300" style="border:0; border-radius:1rem;" allowfullscreen loading="lazy">
            </iframe>
          </div>
          <div class="soft-card location-info">
            <p class="location-address">John St, Hawthorn VIC 3122</p>
            <p class="location-subtext">Located at the Swinburne University Hawthorn campus</p>
          </div>
        </div>
      </section>

      <!-- What to Expect Section -->
      <section class="section-space">
        <h2 class="display-heading">What to Expect</h2>
        <div class="expect-grid">
          <div class="expect-card">
            <div class="expect-content">
              <h3 class="expect-title">Cats & Team</h3>
              <p class="expect-text">Meet our friendly resident cats and the passionate team who care for them every
                day.</p>
            </div>
            <RouterLink to="/cats/team">
              <button class="btn-primary-cat">View the Cats & Team</button>
            </RouterLink>
          </div>

          <div class="expect-card">
            <div class="expect-content">
              <h3 class="expect-title">The Menu</h3>
              <p class="expect-text">Enjoy a delightful selection of drinks and treats crafted to complement your café
                experience.</p>
            </div>
            <RouterLink to="/visit/menu">
              <button class="btn-primary-cat">View the Menu</button>
            </RouterLink>
          </div>

          <div class="expect-card">
            <div class="expect-content">
              <h3 class="expect-title">Come Visit Us Today</h3>
              <p class="expect-text">We'd love to have you. Drop in during opening hours or book a table to secure your
                spot.</p>
            </div>
            <RouterLink to="/visit/book">
              <button class="btn-primary-cat">Book a Table</button>
            </RouterLink>
          </div>

          <div class="expect-card">
            <div class="expect-content">
              <h3 class="expect-title">Frequently Asked Questions</h3>
              <p class="expect-text">Have questions before you visit? Find answers to our most common queries about the café.</p>
            </div>
            <RouterLink to="/visit/faq">
              <button class="btn-primary-cat">View FAQs</button>
            </RouterLink>
          </div>
        </div>
      </section>

    </AppContainer>
  </PageLayout>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import PageLayout from '../../components/layout/PageLayout.vue'
import AppContainer from '../../components/ui/AppContainer.vue'
</script>

<style scoped>
.section-space {
  padding: 2.5rem 0;
}

.hours-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  /* Sets 3 columns of equal width */
  gap: 1.25rem;
  margin-top: 1.5rem;
}

.hours-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.75rem 1.25rem;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, rgba(182, 92, 104, 0.12), rgba(255, 107, 138, 0.08));
  border: 2px solid rgba(182, 92, 104, 0.25);
  text-align: center;
}

.hours-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(182, 92, 104, 0.15);
  border-color: var(--color-primary);
}

.hours-day {
  font-weight: bold;
  color: var(--color-primary);
}

.hours-time {
  color: var(--color-text);
}

.location-row {
  display: flex;
  gap: 1.5rem;
}

.location-map {
  flex: 2;
}

.location-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 0.75rem;
}

.location-address {
  font-weight: bold;
  font-size: 1.25rem;
  color: var(--color-primary);
  margin: 0;
}

.location-subtext {
  color: var(--color-text);
  font-size: 0.95rem;
  line-height: 1.5;
  margin: 0;
}

.expect-grid {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin-top: 1.5rem;
}

.expect-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  padding: 1.75rem 1.25rem;
  border-radius: var(--radius-lg);
  background: linear-gradient(135deg, rgba(182, 92, 104, 0.12), rgba(255, 107, 138, 0.08));
  border: 2px solid rgba(182, 92, 104, 0.25);
}


.expect-content {
  flex: 1;
}

.expect-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(182, 92, 104, 0.15);
  border-color: var(--color-primary);
}

.expect-title {
  font-weight: bold;
  color: var(--color-primary);
  margin: 0 0 0.5rem 0;
}

.expect-text {
  color: var(--color-text);
  margin: 0;
}
</style>