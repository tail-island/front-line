const webSocket = new WebSocket('ws://localhost:8000')

export function getAction (layout, otherLayout, flags, hand, otherHandLength, stockLength, playFirst) {
  webSocket.send(JSON.stringify({ layout, otherLayout, flags, hand, otherHandLength, stockLength, playFirst }))

  return new Promise(resolve => {
    webSocket.addEventListener(
      'message',
      event => {
        resolve(JSON.parse(event.data))
      },
      { once: true }
    )
  })
}

export function finish () {
  webSocket.send(JSON.stringify({ command: 'finish' }))
}
