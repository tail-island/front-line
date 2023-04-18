<script setup>
import TrumpCard from './TrumpCard.vue'

defineProps(['player', 'turn', 'cards'])

function onDragStart (event, index) {
  event.dataTransfer.setData('application/json', JSON.stringify({ from: index }))
}
</script>

<template>
  <div class="hand grid">
    <div v-for="(card, index) in cards" :key="index" :style="`grid-column: ${index + 2}`">
      <TrumpCard :color="card.color" :number="card.number" @dragstart="onDragStart($event, index)" :draggable="turn == player" />
    </div>
  </div>
</template>

<style scoped>
.hand {
  grid-template-columns: 80px 80px 80px 80px 80px 80px 80px 80px 80px 80px;
  grid-template-rows: 120px;
}
</style>
