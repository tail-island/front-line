import { append, update } from 'ramda'
import { integer } from 'random-js'

export function shuffle (rng, list) {
  return list.reduce(
    (acc, x, i) => {
      const j = integer(0, i)(rng)

      if (j === i) {
        return append(x, acc)
      } else {
        return update(j, x, append(acc[j], acc))
      }
    },
    []
  )
}
