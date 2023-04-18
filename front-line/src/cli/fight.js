import { spawn } from 'child_process'
import { createWriteStream } from 'fs'
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

const players = process.argv.slice(2, 4).map(command => spawn(command.split(' ')[0], command.split(' ').slice(1)))
const seed = process.argv[4] != null ? parseInt(process.argv[4]) : 0
const game = new Game()

let state = game.getNewState(seed)
printState(state)

function getAction () {
  const self = state.turn
  const other = (self + 1) % 2

  players[self].stdin.write(`${JSON.stringify({
    layout: state.layouts[self],
    otherLayout: state.layouts[other],
    flags: state.flags,
    hand: state.hands[self],
    otherHandLength: state.hands[other].length,
    stockLength: state.stock.length,
    playFirst: self === 0
  })}\n`)
}

function endPlayers () {
  for (const player of players) {
    player.stdin.end()
  }
}

function doAction (json) {
  const action = JSON.parse(json)

  if (!game.getLegalActions(state).find(legalAction => legalAction.from === action.from && legalAction.to === action.to)) {
    console.log('illegal action...')
    console.log(`Player ${(state.turn + 1) % 2} win!`)
    endPlayers()
    return
  }

  state = game.getNextState(state, action)
  printState(state)

  if (state.winner != null) {
    console.log(`Player ${state.winner} win!`)
    endPlayers()
    return
  }

  getAction()
}

for (const [i, player] of players.entries()) {
  createInterface(player.stdout).on('line', doAction)

  const stream = createWriteStream(`player-${i}.log`)
  createInterface(player.stderr).on('line', line => { stream.write(`${line}\n`) }) // TODO: ファイルに保存する方式に変更する
}

getAction()
