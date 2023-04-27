import json
import sys

from io import TextIOWrapper
from operation_first_legal_action import initialize, get_action, finalize

# AIと対戦環境とのインターフェースを取るモジュールです。

# node.jsからの起動で文字化けしたので、対策をします。
sys.stdout = TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

while True:
    try:
        # 標準入力からメッセージを受信します。
        message = json.loads(input())

        # 初期化処理なのか、ターンが回ってきたのか、終了処理なのかをPython3.10で追加されたmatchで分岐します。
        match message['command']:
            # 初期化処理。
            case 'initialize':
                initialize()
                print(json.dumps('OK'))

            # ターンが回ってきた時。
            case 'getAction':
                # AIに実行する手を作成させます。
                action = get_action(message['state']['layout'],
                                    message['state']['otherLayout'],
                                    message['state']['flags'],
                                    message['state']['hand'],
                                    message['state']['otherHandLength'],
                                    message['state']['stockLength'],
                                    message['state']['playFirst'])
                # 手を出力します。
                print(json.dumps(action))

            # 終了処理。
            case 'finalize':
                finalize()
                print(json.dumps('OK'))

    except EOFError:
        break
