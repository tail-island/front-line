// 合法手の集合を取得します。
function * getLegalActions (layout, hand, flags) {
  // 手札の枚数だけループします。
  for (const [from, _] of hand.entries()) { // eslint-disable-line no-unused-vars
    // 旗の数だけループします。
    for (const [to, flag] of flags.entries()) {
      // 旗が誰のものでもなくて、場に3枚までしか出ていない場合にのみ、カードを出せます。
      if (flag.owner == null && layout[to].length < 3) {
        // from番目の手札をto番目の旗に出す手を返します。
        yield { from, to }
      }
    }
  }
}

// 手を取得します。ゲームのエンジンから呼ばれます。
export function getAction (layout, otherLayout, flags, hand, otherHandLength, stockLength, playFirst) { // eslint-disable-line no-unused-vars
  // 合法手の集合を取得します。
  const legalActions = Array.from(getLegalActions(layout, hand, flags))

  // 合法手の中から、ランダムに手を選択します。
  return legalActions[Math.floor(Math.random() * legalActions.length)]
}

// ゲームを終了します。ゲームのエンジンから呼ばれます。
export function finish () {
  console.error('ゲーム終了')
}

// とりあえず、名前を表示しておきます。
console.error('*** ランダム作戦 ***')
