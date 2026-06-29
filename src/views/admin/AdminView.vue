<template>
  <PageLayout>
    <section class="admin-users-page">
      <div class="page-container">
        <div class="page-heading">
          <h1 class="display-heading">Admin Users</h1>
          <p>
            Each team member can use this page to describe their individual advanced feature.
          </p>
        </div>

        <div class="users-grid">
          <div
            v-for="member in teamMembers"
            :key="member.id"
            class="user-card"
            @click="selectedMember = selectedMember === member.id ? null : member.id"
          >
            <h2>{{ member.name }}</h2>
            <p>{{ member.role }}</p>

            <div v-if="selectedMember === member.id" class="feature-box">
              <p>{{ member.feature }}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </PageLayout>
</template>

<script setup>
import { ref } from 'vue'
import PageLayout from '../../components/layout/PageLayout.vue'

const selectedMember = ref(null)

const teamMembers = [
  {
    id: 1,
    name: 'Ovy',
    role: 'Adopt a Cat / Advanced Feature',
    feature:
      'Ovy has integrated an advanced feature that uses an external API and personality-based matching. The feature allows users to answer questions and receive a suggested cat match based on their preferences.'
  },
  {
    id: 2,
    name: 'Abhinav',
    role: 'Home Page',
    feature: 'Add your advanced feature description here.'
  },
  {
    id: 3,
    name: 'Patrick',
    role: 'Visit Us / Reviews / Profile',
    feature: 'Patrick has implemeneted a generative AI system used by the admin to reply to reviews. When replying, the admin can press "reply with AI". This feature will generate a response to each individual comment. This uses an Anthropic API key to generate a response.'
  },
  {
    id: 4,
    name: 'Teagen',
    role: 'Menu / Membership',
    feature: 'Teagan has implemented a dynamic pricing system for the membership plans as well as a prize wheel feature. This feature allows users to spin a virtual wheel for a chance to win various prizes, such as discounts, free items, or exclusive perks. The wheel is designed with engaging visuals and smooth animations to enhance the user experience.'
  },
  {
    id: 5,
    name: 'Akshita',
    role: 'Booking / Play',
    feature: 'Add your advanced feature description here.'
  },
  {
    id: 6,
    name: 'Justin',
    role: 'Meet the Cats / Meet the Team',
    feature: 'Justin has created a custom composable to keep filters, pagination, and the selected cat in sync with the URL query string, so views are bookmarkable and shareable. Cat details in a modal rendered to document\'s body, with transitions, focus management, and accessibility attributes. When users match with a cat, they can browse matching cats directly.'
  }
]
</script>

<style scoped>
.admin-users-page {
  min-height: 100vh;
  padding: 3rem 1rem 4rem;
  background: var(--color-cream);
  color: var(--color-text);
}

.page-heading {
  margin-bottom: 2rem;
}

.page-heading h1 {
  font-size: clamp(3rem, 5vw, 5rem);
  margin: 0;
}

.page-heading p {
  max-width: 650px;
  line-height: 1.7;
  color: rgba(75, 44, 45, 0.75);
}

.users-grid {
  display: grid;
  gap: 1.5rem;
}

@media (min-width: 800px) {
  .users-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.user-card {
  background: white;
  border-radius: 2rem;
  padding: 1.5rem;
  box-shadow: var(--shadow-soft);
  cursor: pointer;
  transition: 0.2s ease;
}

.user-card:hover {
  transform: translateY(-4px);
}

.user-card h2 {
  margin: 0;
  font-size: 1.5rem;
  color: var(--color-primary);
}

.user-card p {
  margin-bottom: 0;
  line-height: 1.6;
}

.feature-box {
  margin-top: 1rem;
  padding: 1rem;
  border-radius: 1.25rem;
  background: rgba(232, 166, 161, 0.2);
  border: 1px solid rgba(182, 92, 104, 0.2);
}
</style>