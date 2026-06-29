<template>
  <section id="meet-team" class="team-section page-container">
    <div class="team-hero">
      <h1 class="display-heading">Our Team</h1>
      <p>
        Meet the dedicated team that makes Purr & Pour Cat Café a special place
        for both cats and visitors.
      </p>
    </div>

    <div class="team-grid" aria-label="Group members">
      <TeamMemberCard
        v-for="member in members"
        :key="member.id ?? member.name"
        :member="member"
        @open-detail="openMemberDetail"
      />
    </div>

    <TeamDetailModal :member="selectedMember" @close="closeMemberDetail" />
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import TeamMemberCard from './TeamMemberCard.vue'
import TeamDetailModal from './TeamDetailModal.vue'

const props = defineProps({
  members: {
    type: Array,
    default: () => []
  }
})

const selectedMemberId = ref(null)

const selectedMember = computed(() => {
  if (selectedMemberId.value == null) return null
  return props.members.find((m) => m.id === selectedMemberId.value) ?? null
})

function openMemberDetail(member) {
  selectedMemberId.value = member.id
}

function closeMemberDetail() {
  selectedMemberId.value = null
}
</script>

<style scoped>
.team-section {
  padding: 2rem 0 5rem;
}

.team-hero {
  margin-bottom: 2rem;
  text-align: center;
}

.team-hero h1 {
  max-width: 760px;
  margin: 0 auto 1rem;
  color: var(--color-text);
  font-size: clamp(2.2rem, 5vw, 4rem);
  line-height: 1;
}

.team-hero p {
  max-width: 720px;
  margin: 0 auto;
  line-height: 1.7;
}

.team-grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1.25rem;
}

@media (max-width: 960px) {
  .team-grid {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 640px) {
  .team-grid {
    grid-template-columns: 1fr;
  }
}
</style>
