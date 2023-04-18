<script setup>
import TrumpCard from './TrumpCard.vue'

defineProps(['cards', 'isEnemySide'])
</script>

<template>
  <div class="layout-line grid">
    <div v-for="(card, index) in cards" :key="index" v-bind:style="`grid-row: ${isEnemySide ? 3 - index : index + 1}`">
      <TrumpCard :color="card.color" :number="card.number" />
    </div>
  </div>
</template>

<style scoped>
.layout-line {
  grid-template-rows: 120px 120px 120px;
}
</style>
