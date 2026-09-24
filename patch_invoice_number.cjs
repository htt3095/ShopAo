const fs = require('node:fs')
let content = fs.readFileSync('src/pages/AdminPOSView.vue', 'utf8')

// Replace `Tạm ${invoice.number}` with `Tạm ${invoices.indexOf(invoice) + 1}`
content = content.replace(
  '{{ invoice.orderId ? `#${invoice.orderId}` : `Tạm ${invoice.number}` }}',
  '{{ invoice.orderId ? `#${invoice.orderId}` : `Tạm ${invoices.indexOf(invoice) + 1}` }}',
)

// Update activeInvoiceTitle
const oldTitle = 'return `tạm ${invoice.number}`'
const newTitle = 'return `tạm ${invoices.value.indexOf(invoice) + 1}`'
content = content.replace(oldTitle, newTitle)

fs.writeFileSync('src/pages/AdminPOSView.vue', content, 'utf8')
console.log('Patched invoice numbers')
