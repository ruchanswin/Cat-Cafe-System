<template>
  <article
    class="team-card"
    role="button"
    tabindex="0"
    :aria-label="`View profile for ${member.name}`"
    @click="$emit('open-detail', member)"
    @keydown.enter="$emit('open-detail', member)"
    @keydown.space.prevent="$emit('open-detail', member)"
  >
    <div class="avatar" aria-hidden="true">{{ member.avatar }}</div>

    <div class="member-content">
      <p class="role">{{ member.role }}</p>
      <h2>{{ member.name }}</h2>
      <p class="bio">{{ member.bio }}</p>

      <div v-if="member.workedOn?.length" class="worked-on">
        <h3>Worked on</h3>
        <ul>
          <li v-for="task in member.workedOn" :key="task">{{ task }}</li>
        </ul>
      </div>

      <span class="view-profile">View profile</span>
    </div>
  </article>
</template>

<script setup>
defineProps({
  member: {
    type: Object,
    required: true
  }
})

defineEmits(['open-detail'])
</script>

<style scoped>
.team-card {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 1.25rem;
  height: 100%;
  padding: 1.4rem;
  background: white;
  border: 1px solid rgba(179, 156, 142, 0.24);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
  cursor: pointer;
  text-align: left;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.team-card:hover,
.team-card:focus-visible {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(182, 92, 104, 0.15);
  outline: none;
}

.team-card:focus-visible {
  box-shadow: 0 0 0 3px rgba(182, 92, 104, 0.35);
}

.avatar {
  display: grid;
  width: 5rem;
  height: 5rem;
  place-items: center;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-caramel), var(--color-soft-pink));
  font-size: 2rem;
  font-weight: 700;
}

.member-content {
  display: grid;
  gap: 0.55rem;
  align-content: start;
}

.role {
  display: inline-flex;
  align-self: start;
  justify-self: start;
  align-items: center;
  padding: 0.35rem 0.85rem;
  color: var(--color-primary);
  background: var(--color-bg-blush);
  border-radius: var(--radius-pill);
  box-shadow: inset 0 0 0 1px rgba(182, 92, 104, 0.08);
  font-size: 0.85rem;
  font-weight: 700;
  line-height: 1;
  white-space: nowrap;
}

h2,
p {
  margin: 0;
}

h2 {
  color: var(--color-text);
}

.bio {
  line-height: 1.6;
  color: rgba(75, 44, 45, 0.88);
}

.worked-on h3 {
  margin: 0 0 0.4rem;
  font-size: 0.95rem;
  color: var(--color-text);
}

.worked-on ul {
  display: grid;
  gap: 0.35rem;
  padding-left: 1.1rem;
  margin: 0;
}

.view-profile {
  margin-top: 0.25rem;
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--color-primary);
}

@media (max-width: 640px) {
  .team-card {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .avatar,
  .role,
  .view-profile {
    margin-inline: auto;
  }

  .worked-on ul {
    padding-left: 0;
    list-style-position: inside;
  }
}
</style>
