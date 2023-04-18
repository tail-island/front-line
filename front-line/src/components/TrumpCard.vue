<script setup>
defineProps(['color', 'number'])
</script>

<template>
  <div class="card" :class="`background-color-${color}`">
    <div class="color left top">
      {{ color }}
    </div>
    <div class="color right top">
      {{ color }}
    </div>
    <div class="color right bottom">
      {{ color }}
    </div>
    <div class="color left bottom">
      {{ color }}
    </div>
    <div class="number center">
      {{ number }}
    </div>
  </div>
</template>

<style scoped>
div.card > div {
  display: grid;
  place-items: center;
}

.card {
  width: 80px;
  height: 120px;
  margin: 0;
  padding: 0;
  display: grid;
  grid-template-columns: 20px 40px 20px;
  grid-template-rows: 30px 60px 30px;
  border: solid 1px;
  border-radius: 8px;
}

.color {
  font-size: 18px;
}

.number {
  font-size: 36px;
}

.background-color-1 {
  background-color: #d0d0ff;
}

.background-color-2 {
  background-color: #d0ffd0;
}

.background-color-3 {
  background-color: #d0ffff;
}

.background-color-4 {
  background-color: #ffd0d0;
}

.background-color-5 {
  background-color: #ffd0ff;
}

.background-color-6 {
  background-color: #ffffd0;
}

.left {
  grid-column: 1;
}

.right {
  grid-column: 3;
}

.top {
  grid-row: 1;
}

.bottom {
  grid-row: 3;
}

.center {
  grid-column: 2;
  grid-row: 2;
}
</style>
