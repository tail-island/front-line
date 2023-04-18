<script setup>
import BattleFlag from './BattleFlag.vue'

defineProps(['player', 'flags'])
</script>

<template>
  <div class="flags grid">
    <div v-for="(flag, index) in flags" v-bind:key="index" :style="`grid-column: ${index + 1}`">
      <BattleFlag :player="player" :owner="flag.owner" />
    </div>
  </div>
</template>

<style scoped>
.flags {
  grid-template-columns: 80px 80px 80px 80px 80px 80px 80px 80px 80px;
  grid-template-rows: 80px;
}
</style>
