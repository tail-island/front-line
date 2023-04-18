import { createInterface } from 'readline'

import(`../../public/${process.argv[2]}.js`).then(({ getAction }) => {
  createInterface({ input: process.stdin }).on('line', line => {
    const { layout, otherLayout, flags, hand, otherHandLength, stockLength, playFirst } = JSON.parse(line)

    console.log(JSON.stringify(getAction(layout, otherLayout, flags, hand, otherHandLength, stockLength, playFirst)))
  })
})
