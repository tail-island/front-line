import { defineStore } from 'pinia'
import { ref } from 'vue'
import { Game } from '@/models/game'

export const useGameStateStore = defineStore(
  'gameState',
  (seed = null) => {
    const game = new Game()
    const gameState = ref(null)
    const player = ref(0)
    const enemyModule = ref(null)

    const newGameState = async (enemyName, seed, playerValue) => {
      enemyModule.value = await import(`/${enemyName}.js`)
      gameState.value = game.getNewState(seed)
      player.value = playerValue
    }

    const isLegalAction = action => game.getLegalActions(gameState.value).find(legalAction => legalAction.from === action.from && legalAction.to === action.to)

    const nextGameState = action => {
      gameState.value = game.getNextState(gameState.value, action)
    }

    return { gameState, player, enemyModule, newGameState, isLegalAction, nextGameState }
  }
)
