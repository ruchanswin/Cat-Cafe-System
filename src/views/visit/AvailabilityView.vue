<script setup>
import PageLayout from '../../components/layout/PageLayout.vue'
import PageHeader from '../../components/ui/PageHeader.vue'
import AppContainer from '../../components/ui/AppContainer.vue'
import AvailabilityGrid from '../../components/availability/AvailabilityGrid.vue'
</script>

<template>
  <PageLayout>
    <PageHeader
      title="Cat Availability"
      subtitle="See which cats are free this week — click an open slot to book it"
    />

    <AppContainer>
      <AvailabilityGrid />
    </AppContainer>
  </PageLayout>
</template>