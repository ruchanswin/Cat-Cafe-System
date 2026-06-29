<template>
  <PageLayout>
    <section class="section-space">
      <div class="page-container">
        <!-- Not Logged In State -->
        <div v-if="!isLoggedIn" class="not-logged-in-box">
          <h1 class="display-heading">Please Log In</h1>
          <p>You need to log in to access your profile.</p>
          <RouterLink to="/login" class="btn-primary">Go to Login</RouterLink>
        </div>

        <!-- Admin Dashboard -->
        <div v-else-if="isAdmin" class="admin-dashboard">
          <div class="admin-header">
            <h1 class="display-heading">Advanced Features</h1>
            <p class="admin-subtitle">Welcome back, Admin! Manage the Purr & Pour café operations.</p>
          </div>

          <div class="user-info-card">
            <p><strong>Logged in as:</strong> {{ currentUser?.name }}</p>
            <p><strong>Email:</strong> {{ currentUser?.email }}</p>
            <p><strong>Role:</strong> <span class="badge-admin">Administrator</span></p>
          </div>

          <div class="admin-sections">
            <h2>Quick Access</h2>
            <div class="admin-grid">
              <RouterLink to="/admin" class="admin-link-card">
                <div class="icon">📊</div>
                <h3>Admin Panel</h3>
                <p>Full management dashboard</p>
              </RouterLink>

              <RouterLink to="/cats" class="admin-link-card">
                <div class="icon">🐱</div>
                <h3>Cat Management</h3>
                <p>Edit cat profiles and care info</p>
              </RouterLink>

              <RouterLink to="/cats/team" class="admin-link-card">
                <div class="icon">👥</div>
                <h3>Team Management</h3>
                <p>Manage staff members</p>
              </RouterLink>

              <RouterLink to="/reviews" class="admin-link-card">
                <div class="icon">⭐</div>
                <h3>Reviews</h3>
                <p>Monitor customer feedback</p>
              </RouterLink>

              <RouterLink to="/visit/menu" class="admin-link-card">
                <div class="icon">☕</div>
                <h3>Café Menu</h3>
                <p>Manage menu items and prices</p>
              </RouterLink>

              <RouterLink to="/cats/adopt" class="admin-link-card">
                <div class="icon">❤️</div>
                <h3>Adoption System</h3>
                <p>Manage adoption requests</p>
              </RouterLink>
            </div>
          </div>

          <button @click="handleLogout" class="btn-logout">Log Out</button>
        </div>

        <!-- Regular User Profile -->
        <div v-else class="user-profile">
          <div class="welcome-box">
            <h1 class="display-heading">Welcome, {{ currentUser?.name }}!</h1>
            <p>Manage your membership profile, view your visit history, and update your preferences.</p>
          </div>

          <div class="user-info-card">
            <p><strong>Email:</strong> {{ currentUser?.email }}</p>
            <p><strong>Role:</strong> <span class="badge-user">Regular Member</span></p>
          </div>

          <div class="cards-grid">
            <div class="soft-card">
              <h3>Personal Information</h3>
              <p>Update your contact details and preferences.</p>
            </div>
            <div class="soft-card">
              <h3>Visit History</h3>
              <p>Track your past visits and favorite cats.</p>
            </div>
            <div class="soft-card">
              <h3>Membership Status</h3>
              <p>View your current membership level and benefits.</p>
            </div>
          </div>

          <button @click="handleLogout" class="btn-logout">Log Out</button>
        </div>
      </div>
    </section>
  </PageLayout>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { useRouter } from 'vue-router'
import { useAuth } from '../../stores/auth'
import PageLayout from '../../components/layout/PageLayout.vue'

const router = useRouter()
const { currentUser, isLoggedIn, isAdmin, logout } = useAuth()

const handleLogout = () => {
  logout()
  router.push('/')
}
</script>

<style scoped>
.not-logged-in-box {
  text-align: center;
  padding: 3rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-soft);
}

.not-logged-in-box .btn-primary {
  display: inline-block;
  margin-top: 1rem;
  padding: 0.75rem 2rem;
  background: var(--color-primary);
  color: white;
  text-decoration: none;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.not-logged-in-box .btn-primary:hover {
  background: var(--color-primary-hover);
  transform: translateY(-2px);
}

.admin-dashboard {
  animation: fadeIn 0.3s ease;
}

.admin-header {
  margin-bottom: 2rem;
  text-align: center;
}

.admin-subtitle {
  font-size: 1.1rem;
  color: var(--color-primary);
  margin-bottom: 0;
}

.user-profile {
  animation: fadeIn 0.3s ease;
}

.welcome-box {
  margin-bottom: 2rem;
}

.user-info-card {
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  margin-bottom: 2rem;
  box-shadow: var(--shadow-soft);
}

.user-info-card p {
  margin: 0.75rem 0;
  font-size: 1rem;
}

.user-info-card strong {
  color: var(--color-primary);
}

.badge-admin {
  display: inline-block;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-pill);
  font-size: 0.85rem;
  font-weight: 600;
}

.badge-user {
  display: inline-block;
  background: var(--color-caramel);
  color: var(--color-text);
  padding: 0.25rem 0.75rem;
  border-radius: var(--radius-pill);
  font-size: 0.85rem;
  font-weight: 600;
}

.admin-sections {
  margin: 3rem 0;
}

.admin-sections h2 {
  color: var(--color-primary);
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}

.admin-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.admin-link-card {
  background: rgba(255, 255, 255, 0.9);
  border: 2px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  text-align: center;
  text-decoration: none;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: var(--shadow-soft);
}

.admin-link-card:hover {
  border-color: var(--color-primary);
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(182, 92, 104, 0.2);
}

.admin-link-card .icon {
  font-size: 2.5rem;
  margin-bottom: 0.75rem;
}

.admin-link-card h3 {
  margin: 0.5rem 0;
  color: var(--color-primary);
}

.admin-link-card p {
  margin: 0;
  font-size: 0.85rem;
  color: var(--color-text);
  opacity: 0.8;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.soft-card {
  background: rgba(255, 255, 255, 0.9);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
  box-shadow: var(--shadow-soft);
  transition: all 0.3s ease;
}

.soft-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 32px rgba(182, 92, 104, 0.15);
}

.soft-card h3 {
  color: var(--color-primary);
  margin-top: 0;
}

.btn-logout {
  padding: 0.75rem 2rem;
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: 0.5rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-top: 1rem;
}

.btn-logout:hover {
  background: var(--color-primary-hover);
  transform: translateY(-2px);
}

.btn-logout:active {
  transform: translateY(0);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .admin-grid {
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  }
}
</style>