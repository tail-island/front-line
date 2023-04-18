<script setup>
import LayoutLineCards from './LayoutLineCards.vue'

defineProps(['cards', 'isEnemySide'])
const emits = defineEmits(['action'])

function onDragOver (event, to) {
  event.dataTransfer.dropEffect = 'move'
}

function onDrop (event, index) {
  emits('action', (() => {
    const result = JSON.parse(event.dataTransfer.getData('application/json'))

    result.to = index

    return result
  })())
}
</script>

<template>
  <div class="layout grid">
    <div v-for="(lineCards, index) in cards" :key="index" :style="`grid-column: ${index + 1}`">
      <LayoutLineCards v-if="isEnemySide" :cards="lineCards" :isEnemySide="isEnemySide" />
      <LayoutLineCards v-else :cards="lineCards" :isEnemySide="isEnemySide" @dragover.prevent="onDragOver($event, index)" @drop.prevent="onDrop($event, index)" />
    </div>
  </div>
</template>

<style scoped>
.layout {
  grid-template-columns: 80px 80px 80px 80px 80px 80px 80px 80px 80px;
}
</style>
