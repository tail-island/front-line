import sys


# 初期化します。
def initialize():
    print('*** 最初の合法手作戦(Python) ***', '初期化', file=sys.stderr)  # 標準出力は通信で使用するので、標準エラー出力にログを出力します。


# 手を取得します。
def get_action(layout, other_layout, flags, hand, other_hand_length, stock_length, play_first):
    # 合法手の集合を取得します。
    def get_legal_actions():
        for i, _ in enumerate(hand):
            for j, flag in enumerate(flags):
                if ('owner' not in flag or flag['owner'] == None) and len(layout[j]) < 3:
                    yield {'from': i, 'to': j}

    return tuple(get_legal_actions())[0]


# 終了します。
def terminate():
    print('*** 最初の合法手作戦(Python) ***', '終了', file=sys.stderr)
