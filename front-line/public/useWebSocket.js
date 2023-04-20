const webSocket = new WebSocket('ws://localhost:8000')

function communicate (message) {
  return new Promise(resolve => {
    webSocket.addEventListener(
      'message',
      event => {
        resolve(JSON.parse(event.data))
      },
      { once: true }
    )

    webSocket.send(JSON.stringify(message))
  })
}

export function initialize () {
  return communicate({ command: 'initialize' })
}

export function getAction (layout, otherLayout, flags, hand, otherHandLength, stockLength, playFirst) {
  return communicate(
    {
      command: 'getAction',
      state: { layout, otherLayout, flags, hand, otherHandLength, stockLength, playFirst }
    }
  )
}

export function terminate () {
  return communicate({ command: 'terminate' })
}
