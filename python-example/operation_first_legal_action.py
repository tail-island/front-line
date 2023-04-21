import sys


# 初期化します。
def initialize():
    print('*** 最初の合法手作戦(Python) ***', '初期化', file=sys.stderr)  # 標準出力は通信で使用するので、標準エラー出力にログを出力します。


# 手を取得します。
def get_action(layout, other_layout, flags, hand, other_hand_length, stock_length, play_first):
    print('最初の合法手を選択します', file=sys.stderr)  # 標準出力は通信で使用するので、標準エラー出力にログを出力します。

    # 合法手の集合を取得します。
    def get_legal_actions():
        for i, _ in enumerate(hand):
            for j, (flag, layout_line) in enumerate(zip(flags, layout)):
                if flag['owner'] is None and len(layout_line) < 3:  # flag['owner']が0の場合、Pythonだと偽になってしまうので注意！
                    yield {'from': i, 'to': j}

    # 最初の合法手を選択します。
    return tuple(get_legal_actions())[0]


# 終了します。
def finalize():
    print('*** 最初の合法手作戦(Python) ***', '終了', file=sys.stderr)
