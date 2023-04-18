<script setup>
import { useGameStateStore } from '@/stores/gameState'
import GameBoard from '@/components/GameBoard.vue'

const store = useGameStateStore()

store.newGameState('operationPhalanx', 0, 0)

const newGameState = () => {
  store.newGameState(document.getElementById('enemyName').value, parseInt(document.getElementById('seed').value, 10), parseInt(document.getElementById('player').value, 10))
}
</script>

<template>
  <GameBoard />
  <br>
  <label for="enemyName">敵:</label>&nbsp;
  <select id="enemyName">
    <option value="operationPhalanx">ファランクス作戦</option>
    <option value="operationRandom">ランダム作戦</option>
    <option value="operationFirstLegalAction">最初の合法手作戦</option>
  </select>
  &nbsp;&nbsp;

  <label for="seed">乱数シード:</label>&nbsp;
  <input type="number" id="seed" value="0" />
  &nbsp;&nbsp;

  <label for="player">自分のターン:</label>&nbsp;
  <select id="player">
    <option value="0">先攻</option>
    <option value="1">後攻</option>
  </select>
  &nbsp;&nbsp;
  <button @click="newGameState">New Game</button>
</template>

<style>
.grid {
  display: grid;
  grid-gap: 10px 20px;
}
</style>
