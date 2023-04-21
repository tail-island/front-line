import { spawn } from 'child_process'
// import { createWriteStream } from 'fs'
import { createInterface } from 'readline'
import { Game } from '../models/game.js'

function printState (state) {
  console.log('-------------------------------------------------------------------')
  console.log(state.hands[0].map(card => `${card.color}-${card.number}`).join('\t'))
  console.log()
  for (let i = 2; i >= 0; --i) {
    console.log(state.layouts[0].map(cards => cards.length > i ? `${cards[i].color}-${cards[i].number}` : '').join('\t'))
  }
  console.log(state.flags.map(flag => flag.owner === 0 ? ' *' : '').join('\t'))
  console.log(state.flags.map(flag => flag.owner === 1 ? ' *' : '').join('\t'))
  for (let i = 0; i < 3; ++i) {
    console.log(state.layouts[1].map(cards => cards.length > i ? `${cards[i].color}-${cards[i].number}` : '').join('\t'))
  }
  console.log()
  console.log(state.hands[1].map(card => `${card.color}-${card.number}`).join('\t'))
  console.log('-------------------------------------------------------------------')
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

  // const stream = createWriteStream(`player-${i}.log`)
  // createInterface(result.stderr).on('line', line => { stream.write(`${line}\n`) })
  createInterface(result.stderr).on('line', console.error)

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

  const action = await getAction(
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
  )

  if (!game.getLegalActions(state).find(legalAction => legalAction.from === action.from && legalAction.to === action.to)) {
    console.log('illegal action...')
    state.winner = other
    break
  }

  state = game.getNextState(state, action)
  printState(state)
}

console.log(`Player ${state.winner} win!`)

for (const player of players) {
  await finalize(player)
  player.stdin.end()
}
