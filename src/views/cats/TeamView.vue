<template>
  <PageLayout>
    <section v-if="isAdmin" class="page-container admin-editor" aria-label="Admin team management">
      <h2 class="display-heading">Admin: Manage Team</h2>

      <form class="admin-form" @submit.prevent="handleAddMember">
        <div class="admin-grid">
          <label>
            Name
            <input v-model="newMember.name" type="text" required />
          </label>
          <label>
            Initials
            <input v-model="newMember.avatar" type="text" maxlength="3" placeholder="AR" />
          </label>
          <label class="admin-span-2">
            Role
            <input v-model="newMember.role" type="text" placeholder="Barista, Cat Care Lead…" />
          </label>
          <label class="admin-span-2">
            Bio
            <textarea
              v-model="newMember.bio"
              class="admin-textarea"
              rows="4"
              placeholder="Short intro shown on the team card…"
            />
          </label>
          <label class="admin-span-2">
            Experience
            <textarea
              v-model="newMember.experience"
              class="admin-textarea"
              rows="4"
              placeholder="Years in hospitality, cat care, or related work…"
            />
          </label>
          <label class="admin-span-2">
            Background
            <textarea
              v-model="newMember.background"
              class="admin-textarea"
              rows="4"
              placeholder="How they joined Purr &amp; Pour, passions, fun facts…"
            />
          </label>
          <label class="admin-span-2">
            Education
            <textarea
              v-model="newMember.education"
              class="admin-textarea"
              rows="4"
              placeholder="Courses, certifications, training…"
            />
          </label>
          <label class="admin-span-2">
            Worked on (comma separated)
            <input v-model="newMember.workedOnCsv" type="text" placeholder="coffee, tea, drinks" />
          </label>
        </div>

        <button class="btn-primary-cat" type="submit">Add Team Member</button>
      </form>

      <div class="admin-list">
        <div v-for="member in team" :key="member.id" class="admin-item">
          <div class="admin-item-head">
            <strong>#{{ member.id }} — {{ member.name }}</strong>
            <button class="btn-outline-cat" type="button" @click="removeMember(member.id)">Remove</button>
          </div>

          <div class="admin-grid">
            <label>
              Name
              <input :value="member.name" type="text" @input="updateMember(member.id, { name: $event.target.value })" />
            </label>
            <label>
              Initials
              <input
                :value="member.avatar"
                type="text"
                maxlength="3"
                @input="updateMember(member.id, { avatar: $event.target.value })"
              />
            </label>
            <label class="admin-span-2">
              Role
              <input :value="member.role" type="text" @input="updateMember(member.id, { role: $event.target.value })" />
            </label>
            <label class="admin-span-2">
              Bio
              <textarea
                :value="member.bio"
                class="admin-textarea"
                rows="4"
                @input="updateMember(member.id, { bio: $event.target.value })"
              />
            </label>
            <label class="admin-span-2">
              Experience
              <textarea
                :value="member.experience"
                class="admin-textarea"
                rows="4"
                @input="updateMember(member.id, { experience: $event.target.value })"
              />
            </label>
            <label class="admin-span-2">
              Background
              <textarea
                :value="member.background"
                class="admin-textarea"
                rows="4"
                @input="updateMember(member.id, { background: $event.target.value })"
              />
            </label>
            <label class="admin-span-2">
              Education
              <textarea
                :value="member.education"
                class="admin-textarea"
                rows="4"
                @input="updateMember(member.id, { education: $event.target.value })"
              />
            </label>
            <label class="admin-span-2">
              Worked on (comma separated)
              <input
                :value="Array.isArray(member.workedOn) ? member.workedOn.join(', ') : ''"
                type="text"
                placeholder="coffee, tea, drinks"
                @input="
                  updateMember(member.id, {
                    workedOn: $event.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                  })
                "
              />
            </label>
          </div>
        </div>
      </div>
    </section>

    <TeamSection :members="team" />
  </PageLayout>
</template>

<script setup>
import { reactive } from 'vue'
import PageLayout from '../../components/layout/PageLayout.vue'
import TeamSection from '../../components/cats & teams/TeamSection.vue'
import { useAuth } from '../../stores/auth'
import { useTeam } from '../../composables/useTeam.js'

const { isAdmin } = useAuth()
const { team, addMember, updateMember, removeMember } = useTeam()

const newMember = reactive({
  name: '',
  avatar: '',
  role: '',
  bio: '',
  experience: '',
  background: '',
  education: '',
  workedOnCsv: ''
})

function handleAddMember() {
  if (!newMember.name.trim()) return
  addMember({
    name: newMember.name.trim(),
    avatar: newMember.avatar.trim() || '??',
    role: newMember.role.trim(),
    bio: newMember.bio.trim(),
    experience: newMember.experience.trim(),
    background: newMember.background.trim(),
    education: newMember.education.trim(),
    workedOn: newMember.workedOnCsv
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)
  })
  newMember.name = ''
  newMember.avatar = ''
  newMember.role = ''
  newMember.bio = ''
  newMember.experience = ''
  newMember.background = ''
  newMember.education = ''
  newMember.workedOnCsv = ''
}
</script>

<style scoped>
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
</style>
