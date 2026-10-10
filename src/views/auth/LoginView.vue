<template>
  <PageLayout>
    <section class="section-space login-section">
      <div class="page-container">
        <div class="login-container">
          <div class="login-card">
            <h1 class="display-heading login-title">Login to Purr & Pour</h1>
            <p class="login-subtitle">
              Access your membership account or admin features
            </p>

            <form @submit.prevent="handleLogin" class="login-form">
              <div class="form-group">
                <label for="email" class="form-label">Email Address</label>
                <input
                  id="email"
                  v-model="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  class="form-input"
                />
              </div>

              <div class="form-group">
                <label for="password" class="form-label">Password</label>
                <input
                  id="password"
                  v-model="password"
                  type="password"
                  placeholder="Enter your password"
                  required
                  class="form-input"
                />
              </div>

              <button type="submit" class="btn-login" :disabled="loading">
                {{ loading ? 'Checking...' : 'Sign In' }}
              </button>
            </form>

            <div v-if="errorMessage" class="error-message">
              {{ errorMessage }}
            </div>

            <div class="credentials-helper">
              <h4>Demo Credentials</h4>

              <div class="credential-item">
                <p><strong>Admin Account:</strong></p>
                <p>Email: <code>admin@catcafe.com</code></p>
                <p>Password: <code>admin123</code></p>
              </div>

              <div class="credential-item">
                <p><strong>Regular User:</strong></p>
                <p>Use any email and password to login as a regular user.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </PageLayout>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuth } from '../../stores/auth'
import PageLayout from '../../components/layout/PageLayout.vue'

const router = useRouter()
const { login } = useAuth()

const email = ref('')
const password = ref('')
const loading = ref(false)
const errorMessage = ref('')

async function handleLogin() {
  errorMessage.value = ''

  if (!email.value || !password.value) {
    errorMessage.value = 'Please fill in all fields'
    return
  }

  loading.value = true

  try {
    const user = login(email.value, password.value)
    await router.push(user.role === 'admin' ? '/admin' : '/profile')
  } catch (error) {
    errorMessage.value = error.message || 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-section {
  min-height: 100vh;
  display: flex;
  align-items: center;
}

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.login-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: var(--radius-lg);
  padding: 3rem;
  box-shadow: var(--shadow-soft);
  max-width: 450px;
  width: 100%;
  backdrop-filter: blur(10px);
}

.login-title {
  text-align: center;
  margin-bottom: 0.5rem;
  color: var(--color-accent);
}

.login-subtitle {
  text-align: center;
  color: var(--color-text);
  margin-bottom: 2rem;
  opacity: 0.8;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-weight: 600;
  color: var(--color-text);
  font-size: 0.95rem;
}

.form-input {
  padding: 0.75rem 1rem;
  border: 2px solid var(--color-border);
  border-radius: 0.75rem;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s ease;
  background: var(--color-cream);
  color: var(--color-text);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px rgba(182, 92, 104, 0.1);
  background: white;
}

.form-input::placeholder {
  color: var(--color-border);
}

.btn-login,
.btn-secondary {
  padding: 0.875rem 1.5rem;
  border: none;
  border-radius: 0.75rem;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-login {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(182, 92, 104, 0.25);
}

.btn-login:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(182, 92, 104, 0.35);
}

.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-message {
  background: #ffe0e0;
  color: #c41e3a;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1rem;
  border-left: 4px solid #c41e3a;
  text-align: center;
}

.credentials-helper {
  background: var(--color-cream);
  border-radius: 1rem;
  padding: 1.5rem;
  border: 2px solid var(--color-border);
}

.credentials-helper h4 {
  margin-top: 0;
  color: var(--color-primary);
  margin-bottom: 1rem;
}

.credential-item {
  margin-bottom: 1rem;
}

.credential-item:last-child {
  margin-bottom: 0;
}

.credential-item p {
  margin: 0.25rem 0;
  font-size: 0.9rem;
  color: var(--color-text);
}

.credential-item code {
  background: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-family: 'Courier New', monospace;
  color: var(--color-primary);
  font-weight: 600;
}

.small-note {
  font-size: 0.8rem;
  opacity: 0.75;
}

@media (max-width: 768px) {
  .login-card {
    padding: 2rem;
  }

  .login-title {
    font-size: 1.75rem;
  }
}
</style>