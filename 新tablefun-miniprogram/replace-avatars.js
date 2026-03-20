const fs = require('fs');

const filePath = 'c:/Users/夏雪/Desktop/新tablefun-miniprogram/pages/script-detail/script-detail.js';
let content = fs.readFileSync(filePath, 'utf-8');

// 替换所有 avatar[1-9].png 为 default-avatar.png
content = content.replace(/\/images\/avatar\d+\.png/g, '/images/default-avatar.png');

fs.writeFileSync(filePath, content, 'utf-8');
console.log('替换完成');
