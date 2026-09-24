const fs = require('node:fs')
let content = fs.readFileSync('src/pages/AdminPOSView.vue', 'utf8')

const regexConfig = /onPrimary: typeof config\.onPrimary === 'function' \? config\.onPrimary : null,/
const replaceConfig = `onPrimary: typeof config.onPrimary === 'function' ? config.onPrimary : null,
        onSecondary: typeof config.onSecondary === 'function' ? config.onSecondary : null,`

content = content.replace(regexConfig, replaceConfig)
fs.writeFileSync('src/pages/AdminPOSView.vue', content, 'utf8')
