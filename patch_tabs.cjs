const fs = require('node:fs')
let content = fs.readFileSync('src/pages/AdminPOSView.vue', 'utf8')

content = content.replace('<div v-if="invoices.length > 1" class="rounded-2xl border border-slate-200 bg-white px-3 py-2">', '<div class="rounded-2xl border border-slate-200 bg-white px-3 py-2">')

fs.writeFileSync('src/pages/AdminPOSView.vue', content, 'utf8')
console.log('Tabs patched')
