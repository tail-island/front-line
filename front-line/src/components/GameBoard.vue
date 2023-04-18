<script setup>
import { watch } from 'vue'
import { useGameStateStore } from '@/stores/gameState'
import BattleFlags from './BattleFlags.vue'
import HandCards from './HandCards.vue'
import LayoutCards from './LayoutCards.vue'

const store = useGameStateStore()

watch(
  () => [store.gameState?.turn, store.player],
  ([turn, player]) => {
    if (store.gameState.winner != null || turn === player) {
      document.body.style.cursor = 'auto'
    } else {
      document.body.style.cursor = 'wait'

      const action =
        (() => {
          const self = turn
          const other = (self + 1) % 2

          return store.enemyModule.getAction(
            store.gameState.layouts[self],
            store.gameState.layouts[other],
            store.gameState.flags,
            store.gameState.hands[self],
            store.gameState.hands[other].length,
            store.gameState.stock.length,
            turn === 0)
        })()

      if (!store.isLegalAction(action)) {
        console.log('action is illegal...')
        return
      }

      store.nextGameState(action)
    }
  }
)

const onAction = (action) => {
  if (store.gameState.winner != null || store.gameState.turn !== store.player) {
    return
  }

  if (!store.isLegalAction(action)) {
    console.log('action is illegal...')
    return
  }

  store.nextGameState(action)
}
</script>

<template>
  <div class="board">
    <div class="board grid">
      <LayoutCards :cards="store.gameState?.layouts[(store.player + 1) % 2]" :isEnemySide="true" style="grid-row=1" />
      <BattleFlags :player="store.player" :flags="store.gameState?.flags" style="grid-row=2" />
      <LayoutCards :cards="store.gameState?.layouts[store.player]" :isEnemySide="false" @action="onAction" style="grid-row=3" />
      <hr class="delimiter" style="grid-row=4" />
      <HandCards :player="store.player" :turn="store.gameState?.turn" :cards="store.gameState?.hands[store.player]" style="grid-row=5" />
    </div>
    <div class="result">
      {{
        store.gameState?.winner == null
          ? ''
          : store.gameState?.winner === store.player
            ? 'You win!'
            : 'You loss...'
      }}
    </div>
  </div>
</template>

<style scoped>
.board {
  position: relative;
  width: 880px;
}

.result {
  font-size: 56px;
  font-weight: bold;
  -webkit-text-stroke: 1px white;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

hr.delimiter {
  width: 880px;
  border-top: 2px dashed gray;
}
</style>
