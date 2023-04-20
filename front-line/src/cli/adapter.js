import { createInterface } from 'readline'

import(`../players/${process.argv[2]}.js`).then(({ initialize, getAction, terminate }) => {
  createInterface({ input: process.stdin }).on('line', line => {
    const message = JSON.parse(line)

    switch (message.command) {
      case 'initialize': {
        initialize()
        console.log(JSON.stringify('OK'))
        break
      }

      case 'getAction': {
        const { layout, otherLayout, flags, hand, otherHandLength, stockLength, playFirst } = message.state
        console.log(JSON.stringify(getAction(layout, otherLayout, flags, hand, otherHandLength, stockLength, playFirst)))
        break
      }

      case 'terminate': {
        terminate()
        console.log(JSON.stringify('OK'))
        break
      }
    }
  })
})
