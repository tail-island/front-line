// 初期化します。ゲームのエンジンから呼ばれます。
export function initialize () {
  console.error('*** ファランクス作戦 ***', '初期化') // 標準出力は通信で使用するので、標準エラー出力にログを出力します。
}

// 合法手の集合を取得します。
function * getLegalActions (layout, hand, flags) { // function *なので、ジェネレーターです。
  // 手札の枚数だけループします。
  for (const [from, _] of hand.entries()) { // eslint-disable-line no-unused-vars
    // 旗の数だけループします。
    for (const [to, flag] of flags.entries()) {
      // 旗が誰のものでもなくて、場に3枚までしか出ていない場合にのみ、カードを出せます。
      if (flag.owner == null && layout[to].length < 3) {
        // from番目の手札をto番目の旗に出す手を返します。
        yield { from, to } // ジェネレーターなので、yieldできます。
      }
    }
  }
}

// 手を取得します。ゲームのエンジンから呼ばれます。
export function getAction (layout, otherLayout, flags, hand, otherHandLength, stockLength, playFirst) { // eslint-disable-line no-unused-vars
  // 合法手かどうかを判断するラムダ式です。
  const isLegal = (from, to) => from < hand.length && layout[to].length < 3 && flags[to].owner == null

  // カードの数字からfromを取得するラムダ式です。
  const getFrom = number => hand.map(card => card.number).indexOf(number)

  // カードの数字からtoを取得するラムダ式です。
  const getTo = number => layout.map(line => line.length === 0 ? 0 : line[0].number).indexOf(number)

  // 手札に、数字枚に何枚のカードがあるのかを調べます。
  const handNumberSizes = hand.reduce(
    (acc, card) => {
      acc[card.number - 1]++
      return acc
    },
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  )
  console.error('手札', handNumberSizes)

  // ファランクスを構成できる（数字が揃っている）場のカードの、数字枚に何枚のカードがあるのかを調べます。
  const layoutNumberSizes = layout.reduce(
    (acc, line) => {
      if (line.length === 0) { // 空のラインは無視します。
        return acc
      }

      if (new Set(line.map(card => card.number)).size > 1) { // 揃っていない（Setにしたときに要素数が1を超える）場合は無視します。
        return acc
      }

      acc[line[0].number - 1]++
      return acc
    },
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
  )
  console.error('場札', layoutNumberSizes)

  // 自分の場札が空の場合で、相手の場札が空ではない場合は、相手の場札の最初のカードより数字が大きいカードを置きます。
  for (let to = 0; to < 9; ++to) {
    if (layout[to].length > 0 || otherLayout[to].length === 0 || flags[to].owner != null) {
      continue
    }

    for (let i = otherLayout[to][0].number + 1; i <= 10; ++i) {
      console.error('相手よりも大きな数を出す', `${i}がファランクスを揃えようとしている数字か調査`)

      if (layoutNumberSizes[i - 1] > 0) { // ファランクスを揃えようとしている数字は無視します。
        continue
      }

      console.error('相手よりも大きな数を出す', `${i}が手札にあるか調査`)

      const from = getFrom(i)
      if (from === -1) {
        continue
      }

      console.error('相手よりも大きな数を出す', '合法手か調査')

      if (!isLegal(from, to)) {
        continue
      }

      console.error('相手よりも大きな数を出す')

      return { from, to }
    }
  }

  // ファランクスを育てられる場合、ファランクスを育てます。
  for (let i = 1; i <= 10; ++i) {
    console.error('ファランクスを育てる', `${i}がファランクス構築中か調査`)

    if (layoutNumberSizes[i - 1] === 0) {
      continue
    }

    console.error('ファランクスを育てる', `${i}が手札にあるか調査`)

    if (handNumberSizes[i - 1] === 0) {
      continue
    }

    const from = getFrom(i)
    const to = getTo(i)

    console.error('ファランクスを育てる', `${from} -> ${to}が合法手か調査`)

    if (layout[to].length >= 3 || flags[to].owner != null) {
      continue
    }

    console.error('ファランクスを育てる', '合法手か調査')

    if (!isLegal(from, to)) {
      continue
    }

    console.error('ファランクスを育てる')

    return { from, to }
  }

  // できるだけ大きいカードを、空いている場所に出します。
  for (let i = 10; i >= 1; --i) {
    console.error('大きいカードを出す', `${i}がファランクス構築中か調査`)

    if (layoutNumberSizes[i - 1] > 0) {
      continue
    }

    console.error('大きいカードを出す', `${i}が手札にあるか調査`)

    if (handNumberSizes[i - 1] === 0) {
      continue
    }

    for (let to = 0; to < 9; ++to) {
      console.error('大きいカードを出す', `${to}が空いているか調査`)

      if (layout[to].length > 0) {
        continue
      }

      console.error('大きいカードを出す', '合法手か調査')

      const from = getFrom(i)

      if (!isLegal(from, to)) {
        continue
      }

      console.error('大きいカードを出す')

      return { from, to }
    }
  }

  // 諦めて、合法手の中からランダムに手を選択します。
  const legalActions = Array.from(getLegalActions(layout, hand, flags))

  console.error('ランダムにカードを出す')

  return legalActions[Math.floor(Math.random() * legalActions.length)]
}

// 終了します。ゲームのエンジンから呼ばれます。
export function finalize () {
  console.error('*** ファランクス作戦 ***', '終了')
}
