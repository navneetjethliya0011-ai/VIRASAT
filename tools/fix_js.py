#!/usr/bin/env python3
import re
import sys

def repair(path):
    s = open(path, encoding='utf-8').read()
    orig = s
    s = s.replace('\u200b', '')
    s = re.sub(r'\)\)+', ')', s)
    s = re.sub(r'\]\]+', ']', s)
    s = re.sub(r',{2,}', ',', s)
    s = re.sub(r'\n\s*\{\n', '\n', s)
    s = s.replace('this.state););', 'this.state);')
    s = re.sub(r';{2,}', ';', s)
    s = s.replace('localStorage.getItem(CONFIG.saveKey;;', 'localStorage.getItem(CONFIG.saveKey);')
    # collapse 'quests[questId]  { ... } }' double-brace at statement edges
    s = re.sub(r'\)\s*\{\s*\{', ') {', s)
    s = re.sub(r'(\S)\);', r'\1);', s)
    if s != orig:
        open(path, 'w', encoding='utf-8').write(s)
        print('REPAIRED', path)
    else:
        print('CLEAN', path)

if __name__ == '__main__':
    for p in sys.argv[1:]:
        repair(p)