<template>
  <section class="admin-section">
    <span class="admin-badge">ADMIN TOOLS</span>
    <h3>Adoption Management</h3>
    <p>Add, edit, and manage cats available for adoption.</p>

    <div class="admin-actions">
      <button>Add Cat</button>
      <button>Edit Cat</button>
      <button>Remove Cat</button>
      <button>View Requests</button>
    </div>
  </section>
</template>

<style scoped>
.admin-section {
  background: linear-gradient(135deg, rgba(182, 92, 104, 0.1), rgba(255, 107, 138, 0.1));
  border: 2px solid rgba(182, 92, 104, 0.3);
  border-radius: 2rem;
  padding: 2rem;
}

.admin-badge {
  display: inline-block;
  background: var(--color-primary);
  color: white;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 700;
}

.admin-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
}

button {
  border: none;
  border-radius: 999px;
  background: var(--color-primary);
  color: white;
  padding: 0.8rem 1rem;
  cursor: pointer;
  font-weight: 700;
}
</style>