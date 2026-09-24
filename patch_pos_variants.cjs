const fs = require('node:fs')
let content = fs.readFileSync('src/pages/AdminPOSView.vue', 'utf8')

const regex = / {8}const productGroup = new Map\(\)\n {8}for \(const variant of rawVariants\) \{/
const replacement = `        const productGroup = new Map()
        for (const variant of rawVariants) {
          const status = String(variant.status || '').trim().toUpperCase()
          if (['HIDDEN', 'INACTIVE', '0', 'DISCONTINUED', 'STOP_SELLING'].includes(status)) continue;`

content = content.replace(regex, replacement)
fs.writeFileSync('src/pages/AdminPOSView.vue', content, 'utf8')
