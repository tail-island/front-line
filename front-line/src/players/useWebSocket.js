let webSocket = null

async function communicate (message) {
  await new Promise(resolve => {
    setTimeout(() => {
      if (webSocket.readyState) {
        resolve()
      }
    }, 100)
  })

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

export async function initialize () {
  if (!webSocket) {
    webSocket = new WebSocket('ws://localhost:8000')
  }

  await communicate({ command: 'initialize' })
}

export async function getAction (layout, otherLayout, flags, hand, otherHandLength, stockLength, playFirst) {
  return await communicate(
    {
      command: 'getAction',
      state: { layout, otherLayout, flags, hand, otherHandLength, stockLength, playFirst }
    }
  )
}

export async function terminate () {
  await communicate({ command: 'terminate' })
}
