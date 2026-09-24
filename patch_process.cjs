const fs = require('node:fs')
let content = fs.readFileSync('src/pages/AdminPOSView.vue', 'utf8')

const regex = / {6}\/\/ Reset giỏ hàng POS ngay sau khi thanh toán thành công \(không cần F5\)\n {6}invoice\.cart = \[\]\n {6}invoice\.customer = \{ \.\.\.POS_DEFAULT_CUSTOMER \}\n {6}invoice\.voucherInput = ''\n {6}invoice\.appliedVoucher = null\n {6}invoice\.voucherPreference = 'auto'\n {6}invoice\.customerPaid = 0\n {6}const freshInvoice = createNewInvoice\(\)\n {6}invoices\.value = \[\.\.\.invoices\.value, freshInvoice\]\n      activeInvoiceId\.value = freshInvoice\.id/
const replace = `      // Reset giỏ hàng POS ngay sau khi thanh toán thành công (không cần F5)
      invoice.cart = []
      removeInvoice(invoice.id)`

content = content.replace(regex, replace)
fs.writeFileSync('src/pages/AdminPOSView.vue', content, 'utf8')
console.log('Process order patched')
