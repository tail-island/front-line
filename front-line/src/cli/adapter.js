import { createInterface } from 'readline'

import(`../../public/${process.argv[2]}.js`).then(({ getAction, finish }) => {
  createInterface({ input: process.stdin }).on('line', line => {
    const message = JSON.parse(line)

    if (message.command === 'finish') {
      finish()
      return
    }

    const { layout, otherLayout, flags, hand, otherHandLength, stockLength, playFirst } = message
    console.log(JSON.stringify(getAction(layout, otherLayout, flags, hand, otherHandLength, stockLength, playFirst)))
  })
})
