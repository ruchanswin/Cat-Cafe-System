<template>
  <PageLayout>
    <PageHeader
      title="Book Your Visit"
      subtitle="Reserve a table or schedule a one-on-one cat session"
    />

    <AppContainer>
      <BookingForm @booking-confirmed="handleConfirmed" />
    </AppContainer>

    <BookingConfirmation
      v-if="confirmedBooking"
      :booking="confirmedBooking"
      @close="closeConfirmation"
    />
  </PageLayout>
</template>

<script setup>
import { ref } from 'vue'
import PageLayout from '../../components/layout/PageLayout.vue'
import PageHeader from '../../components/ui/PageHeader.vue'
import AppContainer from '../../components/ui/AppContainer.vue'
import BookingForm from '../../components/booking/BookingForm.vue'
import BookingConfirmation from '../../components/booking/BookingConfirmation.vue'

const confirmedBooking = ref(null)

const handleConfirmed = (booking) => {
  confirmedBooking.value = booking
}

const closeConfirmation = () => {
  confirmedBooking.value = null
}
</script>

<style scoped>
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.owner-info {
  font-size: 0.8rem;
  color: var(--color-border);
  margin-top: 2rem;
}
</style>
