import Timeout from 'await-timeout'
import { spawn } from 'child_process'
import { createWriteStream } from 'fs'
import { createInterface } from 'readline'
import { Game } from '../models/game.js'

function printState (state) {
  console.error('-------------------------------------------------------------------')
  console.error(state.hands[0].map(card => `${card.color}-${card.number}`).join('\t'))
  console.error()
  for (let i = 2; i >= 0; --i) {
    console.error(state.layouts[0].map(cards => cards.length > i ? `${cards[i].color}-${cards[i].number}` : '').join('\t'))
  }
  console.error(state.flags.map(flag => flag.owner === 0 ? ' *' : '').join('\t'))
  console.error(state.flags.map(flag => flag.owner === 1 ? ' *' : '').join('\t'))
  for (let i = 0; i < 3; ++i) {
    console.error(state.layouts[1].map(cards => cards.length > i ? `${cards[i].color}-${cards[i].number}` : '').join('\t'))
  }
  console.error()
  console.error(state.hands[1].map(card => `${card.color}-${card.number}`).join('\t'))
  console.error('-------------------------------------------------------------------')
}

function initialize (player) {
  return new Promise(resolve => {
    player.stdout.once('line', line => {
      resolve()
    })

    player.stdin.write(`${JSON.stringify({ command: 'initialize' })}\n`)
  })
}

function getAction (player, state) {
  return new Promise(resolve => {
    player.stdout.once('line', line => {
      resolve(JSON.parse(line))
    })

    player.stdin.write(`${JSON.stringify({ command: 'getAction', state })}\n`)
  })
}

function finalize (player) {
  return new Promise(resolve => {
    player.stdout.once('line', line => {
      resolve()
    })

    player.stdin.write(`${JSON.stringify({ command: 'finalize' })}\n`)
  })
}

const players = process.argv.slice(2, 4).map((command, i) => {
  const result = spawn(command.split(' ')[0], command.split(' ').slice(1))

  result.stdout = createInterface(result.stdout)

  const stream = createWriteStream(`player-${i}.log`)
  createInterface(result.stderr).on('line', line => { stream.write(`${line}\n`) })
  // createInterface(result.stderr).on('line', console.error)

  return result
})

const seed = process.argv[4] != null ? parseInt(process.argv[4]) : 0
const game = new Game()

let state = game.getNewState(seed)
printState(state)

for (const player of players) {
  await initialize(player)
}

while (state.winner == null) {
  const self = state.turn
  const other = (self + 1) % 2

  try {
    const action = await Timeout.wrap(getAction(
      players[self],
      {
        layout: state.layouts[self],
        otherLayout: state.layouts[other],
        flags: state.flags,
        hand: state.hands[self],
        otherHandLength: state.hands[other].length,
        stockLength: state.stock.length,
        playFirst: self === 0
      }
    ), 20_000, 'timeout...')

    console.error(action)

    if (!game.getLegalActions(state).find(legalAction => legalAction.from === action.from && legalAction.to === action.to)) {
      console.error('illegal action...')
      state.winner = other
      break
    }

    state = game.getNextState(state, action)
    printState(state)
  } catch (error) {
    console.error(error.message)
    state.winner = other

    break
  }
}

console.error(`Player ${state.winner} win!`)
console.log(state.winner)

for (const player of players) {
  await finalize(player)
  player.stdin.end()
}
