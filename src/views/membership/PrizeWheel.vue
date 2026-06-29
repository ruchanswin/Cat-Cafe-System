<template>
  <div class="prize-wheel-overlay">
    <div class="prize-wheel">
      <div class="wheel-ring">
        <div class="wheel" :style="{ transform: `rotate(${rotation}deg)` }">
          <div class="wheel-center">WIN</div>
        </div>
        <div class="pointer"></div>
      </div>
      <button @click="spinWheel" v-if="!spun" :disabled="spinning">
        {{ spinning ? 'Spinning...' : 'Spin the Wheel!' }}
      </button>
      <p v-if="spun">You won: {{ prize }}</p>
      <button @click="close" v-if="spun">Close</button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['close', 'prizeWon'])
const prizes = ['Free Cat Session', '$10 Voucher', 'Free Drink', 'Cat Toy', 'Discount on Next Visit']
const rotation = ref(0)
const spun = ref(false)
const spinning = ref(false)
const prize = ref('')

function spinWheel() {
  const randomIndex = Math.floor(Math.random() * prizes.length)
  spinning.value = true
  rotation.value = Math.floor(Math.random() * 360) + (360 * 3) // Spin 3 full rotations
  prize.value = prizes[randomIndex]

  setTimeout(() => {
    spun.value = true
    spinning.value = false
    emit('prizeWon', prize.value)
  }, 3000) // Wait for the spin to finish
}

function close() {
  emit('close')
}
</script>

<style scoped>
.prize-wheel-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.prize-wheel {
  background: white;
  padding: 2rem 2.5rem 2.5rem;
  border-radius: 14px;
  text-align: center;
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.18);
  min-width: 320px;
}

.wheel-ring {
  position: relative;
  width: 240px;
  height: 240px;
  margin: 0 auto 1.5rem;
}

.wheel {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: conic-gradient(
    #ff6b6b 0 20%,
    #fcd34d 20% 40%,
    #34d399 40% 60%,
    #60a5fa 60% 80%,
    #a78bfa 80% 100%
  );
  box-shadow: inset 0 0 0 8px rgba(255, 255, 255, 0.85),
    0 12px 35px rgba(0, 0, 0, 0.14);
  transition: transform 3s ease-out;
  display: flex;
  align-items: center;
  justify-content: center;
}

.wheel-center {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.95);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  color: #27272a;
  text-transform: uppercase;
  letter-spacing: 1px;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.12);
}

.pointer {
  position: absolute;
  top: -14px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 0;
  border-left: 18px solid transparent;
  border-right: 18px solid transparent;
  border-bottom: 28px solid #ef4444;
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.18));
}
</style>
