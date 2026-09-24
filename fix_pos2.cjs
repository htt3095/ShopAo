const fs = require('node:fs')
let code = fs.readFileSync('src/pages/AdminPOSView.vue', 'utf8')
code = code.replace(/subtitle: '.*?', title: '.*?'/g, 'subtitle: \'C?nh b�o\', title: \'Th�ng b�o\'')
fs.writeFileSync('src/pages/AdminPOSView.vue', code)
