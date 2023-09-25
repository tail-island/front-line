import { Combination } from 'js-combinatorics'
import { __, addIndex, adjust, all, always, any, aperture, apply, append, assoc, both, chain, concat, cond, descend, either, equals, filter, gte, identity, isEmpty, juxt, length, lensPath, map, over, pipe, prop, range, reduce, remove, repeat, sort, splitAt, subtract, sum, T } from 'ramda'
import { MersenneTwister19937 } from 'random-js'
import { shuffle } from './utility.js'

export class Game {
  getNewState (seed = null) {
    const rng = seed ? MersenneTwister19937.seed(seed) : MersenneTwister19937.autoSeed()

    const [hands, stock] =
      adjust(
        0, splitAt(7),
        splitAt(
          14,
          shuffle(
            rng,
            chain(
              color => map(
                number => ({ color, number }),
                range(1, 11)),
              range(1, 7)
            )
          )
        )
      )

    return {
      flags: repeat({ owner: null }, 9),
      layouts: repeat(repeat([], 9), 2),
      hands,
      stock,
      turn: 0
    }
  }

  getLegalActions (state) {
    return addIndex(chain)(
      (_, from) => addIndex(reduce)(
        (acc, flag, to) => flag.owner == null && state.layouts[state.turn][to].length < 3 ? append({ from, to }, acc) : acc,
        [],
        state.flags
      ),
      state.hands[state.turn]
    )
  }

  getNextState (prevState, action) {
    const doAction = state => {
      const play = pipe(
        over(lensPath(['hands', state.turn]), remove(action.from, 1)),
        over(lensPath(['layouts', state.turn, action.to]), append(state.hands[state.turn][action.from]))
      )

      const draw = isEmpty(state.stock)
        ? identity
        : pipe(
          over(lensPath(['stock']), remove(0, 1)),
          over(lensPath(['hands', state.turn]), append(state.stock[0]))
        )

      return pipe(
        play,
        draw
      )(state)
    }

    const updateFlags = state => {
      const isRanked = pipe(
        length,
        equals(3)
      )

      const getStrength = cards => {
        const isThreeCard = pipe(
          map(prop('number')),
          aperture(2),
          all(apply(equals))
        )

        const isFlush = pipe(
          map(prop('color')),
          aperture(2),
          all(apply(equals))
        )

        const isStraight = pipe(
          map(prop('number')),
          sort(descend(identity)),
          aperture(2),
          map(apply(subtract)),
          all(equals(1))
        )

        const getRankPower = cond([
          [both(isStraight, isFlush), always(5)],
          [isThreeCard, always(4)],
          [isFlush, always(3)],
          [isStraight, always(2)],
          [T, always(1)]]
        )

        const getNumberPower = pipe(
          map(prop('number')),
          sum()
        )

        return juxt([getRankPower, getNumberPower])(cards)
      }

      const isWinner = (strength, otherStrength) => {
        if (strength[0] === otherStrength[0]) {
          return strength[1] > otherStrength[1]
        }

        return strength[0] > otherStrength[0]
      }

      const player = state.turn
      const enemy = (player + 1) % 2

      return over(
        lensPath(['flags']),
        addIndex(map)(
          (flag, i) => {
            if (flag.owner != null) { // すでに旗が取られている場合はそのまま。
              return flag
            }

            if (isRanked(state.layouts[0][i]) && isRanked(state.layouts[1][i])) { // 双方で役ができている場合。
              const getOwner = cond([
                [apply(isWinner), always(player)],
                [T, always(enemy)] // 勝ちではない場合。引き分けの場合、先に役を作った方（＝敵）が旗を得ます。
              ])

              return assoc('owner', getOwner([getStrength(state.layouts[player][i]), getStrength(state.layouts[enemy][i])]), flag)
            }

            if (isRanked(state.layouts[player][i])) { // 自分だけ役ができた場合。
              const strength = getStrength(state.layouts[player][i])

              for (const cards of new Combination(concat(concat(state.hands[0], state.hands[1]), state.stock), 3 - state.layouts[enemy][i].length)) { // メモリ問題が発生しそうなので、Ramda.jsではなくforを使用します。
                if (isWinner(getStrength(concat(state.layouts[enemy][i], cards)), strength)) {
                  return flag
                }
              }

              return assoc('owner', player, flag) // 残りのカードの組み合わせに敵が勝つパターンがないなら、自分の勝ちのはず。
            }

            return flag
          }
        )
      )(state)
    }

    const updateWinner = state => {
      const isContinuousThreeOwner = player =>
        pipe(
          aperture(3),
          any(all(equals(player)))
        )

      const isFiveOwner = player =>
        pipe(
          filter(equals(player)),
          length(),
          gte(__, 5)
        )

      const winner = cond(
        [
          [either(isContinuousThreeOwner((state.turn + 0) % 2), isFiveOwner((state.turn + 0) % 2)), always((state.turn + 0) % 2)],
          [either(isContinuousThreeOwner((state.turn + 1) % 2), isFiveOwner((state.turn + 1) % 2)), always((state.turn + 1) % 2)],
          [T, always(null)]
        ]
      )(map(prop('owner'), state.flags))

      if (winner == null) {
        return state
      }

      return assoc('winner', winner, state)
    }

    const updateTurn = state => assoc('turn', (state.turn + 1) % 2, state)

    const nextState = pipe(
      doAction,
      updateFlags,
      updateWinner,
      updateTurn
    )(prevState)

    if (this.getLegalActions(nextState).length === 0) {
      return updateTurn(nextState)
    }

    return nextState
  }
}
