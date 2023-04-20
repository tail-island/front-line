// 初期化します。ゲームのエンジンから呼ばれます。
export function initialize () {
  console.error('*** 最初の合法手作戦 ***', '初期化') // 標準出力は通信で使用するので、標準エラー出力にログを出力します。
}

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

  // 最初の合法手を選択します。
  return legalActions[0]
}

// 終了します。ゲームのエンジンから呼ばれます。
export function terminate () {
  console.error('*** 最初の合法手作戦 ***', '終了')
}
