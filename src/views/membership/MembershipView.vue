<template>
  <PageLayout>
    <section class="section-space">
      <div class="page-container">
        <h1 class="display-heading">Membership</h1>
        <p>
          Join our membership program for exclusive perks, priority booking,
          and special cat-themed benefits.
        </p>

        <!-- Admin Controls -->
        <div v-if="isAdmin" class="admin-controls">
          <h2>Admin: Manage Plans</h2>

          <form @submit.prevent="addPlan" class="admin-form">
            <div class="form-row">
              <input
                v-model="newPlan.name"
                type="text"
                placeholder="Plan name"
                required
              />

              <input
                v-model.number="newPlan.price"
                type="number"
                placeholder="Price"
                step="0.01"
                required
              />

              <textarea
                v-model="newPlan.description"
                placeholder="Description"
                required
              ></textarea>

              <button type="submit" class="add-plan-btn">
                Add Plan
              </button>
            </div>
          </form>

          <!-- User Management Table -->
          <h2>Registered Users</h2>

          <table class="user-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Membership Plan</th>
                <th>Prize Won</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              <tr v-for="(user, index) in users" :key="index">
                <td>{{ user.name }}</td>
                <td>{{ user.email }}</td>
                <td>{{ user.plan }}</td>
                <td>{{ user.prize }}</td>
                <td>
                  <button
                    @click="deleteUser(index)"
                    class="delete-btn"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Membership Cards -->
        <div class="cards-grid">
          <div
            v-for="plan in plans"
            :key="plan.id"
            class="soft-card"
            :class="{ selected: selectedPlan?.id === plan.id }"
            @click="selectPlan(plan)"
          >
            <div class="card-header">
              <div>
                <h3>{{ plan.name }}</h3>
                <p class="plan-price">
                  ${{ plan.price }}/month
                </p>
              </div>

              <button
                v-if="isAdmin"
                @click.stop="deletePlan(plan.id)"
                class="delete-btn"
                title="Delete plan"
              >
                ✕
              </button>
            </div>

            <p>{{ plan.description }}</p>

            <button
              class="select-btn"
              @click.stop="selectPlan(plan)"
            >
              {{
                selectedPlan?.id === plan.id
                  ? 'Selected'
                  : 'Select Plan'
              }}
            </button>
          </div>
        </div>

        <!-- Signup Form -->
        <div v-if="selectedPlan" class="signup-form">
          <h2>Sign Up for {{ selectedPlan.name }}</h2>

          <form @submit.prevent="submitForm">
            <div class="form-group">
              <label for="name">Name</label>

              <input
                id="name"
                v-model="user.name"
                type="text"
                required
                placeholder="Enter your name"
              />
            </div>

            <div class="form-group">
              <label for="email">Email</label>

              <input
                id="email"
                v-model="user.email"
                type="email"
                required
                placeholder="Enter your email"
              />
            </div>

            <button type="submit" class="submit-btn">
              Join Now
            </button>
          </form>
        </div>

        <PrizeWheel
          v-if="showPrizeWheel"
          @close="showPrizeWheel = false"
          @prizeWon="handlePrizeWin"
        />
      </div>
    </section>
  </PageLayout>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useAuth } from '../../stores/auth'
import PageLayout from '../../components/layout/PageLayout.vue'
import PrizeWheel from '../../views/membership/PrizeWheel.vue'

const { isAdmin } = useAuth()

// Default plans
const defaultPlans = [
  {
    id: 1,
    name: 'Basic Plan',
    description:
      'Access to the cafe and one free drink every 5 visits.',
    price: 10
  },
  {
    id: 2,
    name: 'Premium Plan',
    description:
      'Access to the cafe, two free drinks, and a cat toy.',
    price: 20
  },
  {
    id: 3,
    name: 'VIP Plan',
    description:
      'Unlimited access, free meal including drink 5 visits, and a monthly cat grooming session.',
    price: 30
  }
]

// Load plans from localStorage if available
const savedPlans = localStorage.getItem('membershipPlans')

const plans = ref(
  savedPlans ? JSON.parse(savedPlans) : defaultPlans
)

// Load users from localStorage if available
const savedUsers = localStorage.getItem('registeredUsers')

const users = ref(
  savedUsers ? JSON.parse(savedUsers) : []
)

// Automatically save whenever plans or users change
watch(
  plans,
  (newPlans) => {
    localStorage.setItem(
      'membershipPlans',
      JSON.stringify(newPlans)
    )
  },
  { deep: true }
)

watch(
  users,
  (newUsers) => {
    localStorage.setItem(
      'registeredUsers',
      JSON.stringify(newUsers)
    )
  },
  { deep: true }
)

const selectedPlan = ref(null)

const user = reactive({
  name: '',
  email: '',
  prize: ''
})

const showPrizeWheel = ref(false)

const newPlan = reactive({
  name: '',
  description: '',
  price: null
})

function selectPlan(plan) {
  selectedPlan.value = plan
}

function addPlan() {
  if (
    !newPlan.name ||
    !newPlan.description ||
    !newPlan.price
  ) {
    alert('Please fill in all fields')
    return
  }

  const id =
    Math.max(...plans.value.map((p) => p.id), 0) + 1

  plans.value.push({
    id,
    name: newPlan.name,
    description: newPlan.description,
    price: newPlan.price
  })

  newPlan.name = ''
  newPlan.description = ''
  newPlan.price = null

  alert('Plan added successfully!')
}

function deletePlan(planId) {
  if (
    confirm(
      'Are you sure you want to delete this plan?'
    )
  ) {
    plans.value = plans.value.filter(
      (p) => p.id !== planId
    )

    if (selectedPlan.value?.id === planId) {
      selectedPlan.value = null
    }

    alert('Plan deleted successfully!')
  }
}

function submitForm() {
  alert(
    `Thank you, ${user.name}! You have signed up for the ${selectedPlan.value.name}.`
  )

  users.value.push({
    name: user.name,
    email: user.email,
    plan: selectedPlan.value.name,
    prize: ''
  })

  showPrizeWheel.value = true

  user.name = ''
  user.email = ''
  selectedPlan.value = null
}

function deleteUser(index) {
  if (
    confirm(
      'Are you sure you want to delete this user?'
    )
  ) {
    users.value.splice(index, 1)

    alert('User deleted successfully!')
  }
}

function handlePrizeWin(prize) {
  alert(`Congratulations! You won: ${prize}`)

  // Update the last user's prize
  if (users.value.length > 0) {
    users.value[users.value.length - 1].prize = prize
  }
}
</script>

<style scoped>
.admin-controls {
  background: var(--color-primary);
  color: white;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.admin-controls h2 {
  margin-top: 0;
  margin-bottom: 1.5rem;
}

.admin-form .form-row {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.admin-form input,
.admin-form textarea {
  padding: 0.75rem;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  font-family: inherit;
}

.admin-form textarea {
  min-height: 80px;
  resize: vertical;
}

.add-plan-btn {
  padding: 0.75rem 2rem;
  background: white;
  color: var(--color-primary);
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.add-plan-btn:hover {
  transform: scale(1.05);
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(250px, 1fr)
  );
  gap: 1.5rem;
  margin: 2rem 0;
}

.soft-card {
  padding: 1.5rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
  cursor: pointer;
  transition: all 0.3s ease;
  background-color: rgb(255, 255, 255);
  border-color: rgb(0, 0, 0);
  position: relative;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.delete-btn {
  background: #ff4444;
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  font-size: 1.2rem;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.delete-btn:hover {
  background: #cc0000;
  transform: scale(1.1);
}

.soft-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  background-color: rgb(228, 194, 149);
}

.soft-card.selected {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px var(--color-primary);
  background-color: rgb(249, 211, 217);
}

.plan-price {
  font-size: 1.5rem;
  font-weight: bold;
  color: var(--color-primary);
  margin: 0.5rem 0;
}

.select-btn {
  margin-top: 1rem;
  padding: 0.5rem 1rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.signup-form {
  margin-top: 2rem;
  padding: 2rem;
  border: 1px solid var(--color-border);
  border-radius: 8px;
  background: var(--color-surface);
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 4px;
  font-size: 1rem;
}

.submit-btn {
  padding: 0.75rem 2rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}

.user-table th,
.user-table td {
  border: 1px solid var(--color-border);
  padding: 0.75rem;
  text-align: left;
}

.user-table th {
  background: var(--color-primary);
  color: white;
}

.owner-info {
  font-size: 0.8rem;
  color: var(--color-border);
  margin-top: 2rem;
}
</style>
