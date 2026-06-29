<template>
  <div class="card">
    <slot />
  </div>
</template>

<style scoped>
.card {
  background: white;
  padding: 1.5rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
}
</style>