import json
from pprint import pprint

x = json.loads(json.load(open('gd.txt')))

print(type(x))