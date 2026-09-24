const fs = require('node:fs')
let content = fs.readFileSync('src/pages/AdminPOSView.vue', 'utf8')

const target = 'for (const variant of rawVariants) {'
const replacement = `for (const variant of rawVariants) {
          const status = String(variant.status || '').trim().toUpperCase()
          if (['HIDDEN', 'INACTIVE', '0', 'DISCONTINUED', 'STOP_SELLING'].includes(status)) continue;`

content = content.replace(target, replacement)

// And fix the window.confirm issue!
const confirmRemove = 'if (!window.confirm(\'Hóa đơn này đang có sản phẩm. Bạn có chắc chắn muốn xóa và hoàn lại tồn kho không?\')) return'
const confirmRemoveNew = `const confirmed = await new Promise(resolve => {
        showPaymentDialog({
          type: 'confirm',
          title: 'Xóa hóa đơn',
          message: 'Hóa đơn này đang có sản phẩm. Bạn có chắc chắn muốn xóa và hoàn lại tồn kho không?',
          primaryLabel: 'Xóa hóa đơn',
          secondaryLabel: 'Hủy bỏ',
          onConfirm: () => resolve(true),
          onCancel: () => resolve(false)
        })
      });
      if (!confirmed) return;`
content = content.replace(confirmRemove, confirmRemoveNew)

const confirmReset = 'if (!window.confirm(\'Bạn có chắc chắn muốn làm mới giỏ hàng và hoàn lại tồn kho không?\')) return'
const confirmResetNew = `const confirmed = await new Promise(resolve => {
        showPaymentDialog({
          type: 'confirm',
          title: 'Làm mới giỏ hàng',
          message: 'Bạn có chắc chắn muốn làm mới giỏ hàng và hoàn lại tồn kho không?',
          primaryLabel: 'Làm mới',
          secondaryLabel: 'Hủy bỏ',
          onConfirm: () => resolve(true),
          onCancel: () => resolve(false)
        })
      });
      if (!confirmed) return;`
content = content.replace(confirmReset, confirmResetNew)

// Make removeInvoice and resetInvoice async
content = content.replace('function removeInvoice (invoiceId) {', 'async function removeInvoice (invoiceId) {')
content = content.replace('function resetInvoice () {', 'async function resetInvoice () {')

fs.writeFileSync('src/pages/AdminPOSView.vue', content, 'utf8')
