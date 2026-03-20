import re
import os

file_path = 'c:/Users/夏雪/Desktop/新tablefun-miniprogram/pages/script-detail/script-detail.js'

with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

content = re.sub(r'/images/avatar\d+\.png', '/images/default-avatar.png', content)

with open(file_path, 'w', encoding='utf-8') as f:
    f.write(content)

print('替换完成')
