import { spawn } from 'child_process'
import { createInterface } from 'readline'
import { WebSocketServer } from 'ws'

const player = spawn(process.argv[2].split(' ')[0], process.argv[2].split(' ').slice(1))

new WebSocketServer({ port: 8000 }).on('connection', (webSocket) => {
  webSocket.on('message', line => {
    player.stdin.write(`${line}\n`)
  })

  createInterface(player.stdout).on('line', line => { webSocket.send(line) })
  createInterface(player.stderr).on('line', console.error)
})
