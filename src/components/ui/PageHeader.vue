<template>
  <section class="page-header">
    <h1>{{ title }}</h1>
    <p v-if="subtitle">{{ subtitle }}</p>
  </section>
</template>

<script setup>
defineProps({
  title: String,
  subtitle: String
})
</script>

<style scoped>
.page-header {
  text-align: center;
  padding: 1.25rem 0 1rem;
}

h1 {
  font-size: 2rem;
  margin: 0 0 0.35rem;
}

p {
  margin: 0;
  max-width: 42rem;
  margin-inline: auto;
  color: var(--color-text);
  opacity: 0.88;
  line-height: 1.55;
  font-size: 1rem;
}
</style>