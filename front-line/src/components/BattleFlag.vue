<script setup>
defineProps(['player', 'owner'])
</script>

<template>
  <div class="flag">
    <div :style="`top: ${owner == null ? '30px' : (owner === player ? '50px' : '10px')}; background-color: ${owner == null ? 'white' : 'red'}`">
      &nbsp;
    </div>
  </div>
</template>

<style scoped>
.flag {
  width: 80px;
  height: 80px;
  position: relative;
}

.flag > div {
  width: 20px;
  height: 20px;
  position: absolute;
  left: 30px;
  background-color: red;
  border: solid 1px;
  border-radius: 50%;
}
</style>
