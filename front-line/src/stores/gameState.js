import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Game } from '@/models/game'
import * as operationFirstLegalAction from '@/players/operationFirstLegalAction'
import * as operationPhalanx from '@/players/operationPhalanx'
import * as operationRandom from '@/players/operationRandom'
import * as useWebSocket from '@/players/useWebSocket'

const players = {
  operationFirstLegalAction,
  operationPhalanx,
  operationRandom,
  useWebSocket
}

export const useGameStateStore = defineStore(
  'gameState',
  () => {
    const game = new Game()
    const gameState = ref(null)
    const player = ref(0)
    const enemyModule = ref(null)

    const newGameState = async (enemyName, seed, playerValue) => {
      enemyModule.value = players[enemyName]
      await enemyModule.value.initialize()

      gameState.value = game.getNewState(seed)
      player.value = playerValue
    }

    const isLegalAction = action => game.getLegalActions(gameState.value).find(legalAction => legalAction.from === action.from && legalAction.to === action.to)

    const nextGameState = action => {
      gameState.value = game.getNextState(gameState.value, action)
    }

    const finalizeGame = async () => {
      await enemyModule.value.finalize()
    }

    return { gameState, player, enemyModule, newGameState, isLegalAction, nextGameState, finalizeGame }
  }
)
