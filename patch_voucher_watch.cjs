const fs = require('node:fs')
let content = fs.readFileSync('src/pages/AdminPOSView.vue', 'utf8')

const target = 'const activeDiscount = computed(() => {'
const replacement = `watch(activeSubtotal, (newTotal) => {
    const invoice = activeInvoice.value
    if (!invoice || !invoice.appliedVoucher) return
    const minOrder = getVoucherMinOrder(invoice.appliedVoucher)
    if (newTotal < minOrder && invoice.voucherPreference !== 'auto') {
      // Auto remove manual voucher if it becomes ineligible
      invoice.appliedVoucher = null
      invoice.voucherInput = ''
      invoice.voucherPreference = 'none'
    } else if (invoice.voucherPreference === 'auto') {
      // Clear auto voucher if ineligible, it will be recalculated
      if (newTotal < minOrder) {
        invoice.appliedVoucher = null
        invoice.voucherInput = ''
      }
    }
  });

  watch([activeSubtotal, processedVouchers], () => {
    const invoice = activeInvoice.value
    if (!invoice || invoice.voucherPreference !== 'auto') return
    
    // Auto re-evaluate best voucher
    const bestVoucher = processedVouchers.value.find(voucher => voucher.isEligible && voucher.isActive)
    if (bestVoucher) {
      invoice.appliedVoucher = bestVoucher
      invoice.voucherInput = bestVoucher.code || ''
    } else {
      invoice.appliedVoucher = null
      invoice.voucherInput = ''
    }
  }, { deep: true });

  const activeDiscount = computed(() => {`

content = content.replace(target, replacement)
fs.writeFileSync('src/pages/AdminPOSView.vue', content, 'utf8')
console.log('Patched voucher watchers')
