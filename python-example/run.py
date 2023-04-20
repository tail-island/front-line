import json
import sys

from io import TextIOWrapper
from operation_first_legal_action import initialize, get_action, terminate

# node.jsからの起動で文字化けしたので、対策をします。
sys.stdout = TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.stderr = TextIOWrapper(sys.stderr.buffer, encoding='utf-8')

while True:
    try:
        message = json.loads(input())

        match message['command']:
            case 'initialize':
                initialize()
                print(json.dumps('OK'))

            case 'getAction':
                action = get_action(message['state']['layout'],
                                    message['state']['otherLayout'],
                                    message['state']['flags'],
                                    message['state']['hand'],
                                    message['state']['otherHandLength'],
                                    message['state']['stockLength'],
                                    message['state']['playFirst'])
                print(json.dumps(action))

            case 'terminate':
                terminate()
                print(json.dumps('OK'))

    except EOFError:
        break
