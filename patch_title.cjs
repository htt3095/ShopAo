const fs = require('node:fs')
let content = fs.readFileSync('src/pages/AdminPOSView.vue', 'utf8')

content = content.replace(
  'return `Hóa đơn tạm ${invoice.number}`',
  'return `Hóa đơn tạm ${invoices.value.indexOf(invoice) + 1}`',
)

fs.writeFileSync('src/pages/AdminPOSView.vue', content, 'utf8')
console.log('Patched title')
