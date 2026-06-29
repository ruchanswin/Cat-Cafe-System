<template>
  <section class="page-container page-section">
    <slot />
  </section>
</template>

<style scoped>
.page-container {
  width: min(100% - 2rem, 1200px);
  margin: 0 auto;
}

.page-section {
  padding: 2rem 0;
}
</style>