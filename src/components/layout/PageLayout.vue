<template>
  <div>
    <AppNavbar />

    <main>
      <slot />
    </main>

    <AppFooter />
  </div>
</template>

<script setup>
import AppNavbar from './AppNavbar.vue'
import AppFooter from './AppFooter.vue'
</script>