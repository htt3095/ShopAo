const fs = require('node:fs')
let content = fs.readFileSync('src/pages/AdminPOSView.vue', 'utf8')

const oldBottom = `    invoices.value = invoices.value.filter(entry => entry.id !== invoiceId)
    if (invoices.value.length === 0) {
      const newInvoice = createNewInvoice()
      invoices.value = [newInvoice]
      activeInvoiceId.value = newInvoice.id
      return
    }
    if (activeInvoiceId.value === invoiceId) activeInvoiceId.value = invoices.value[0].id`

const newBottom = `    if (invoices.value.length === 1) {
      invoice.cart = [];
      invoice.customer = { ...POS_DEFAULT_CUSTOMER };
      invoice.voucherInput = '';
      invoice.appliedVoucher = null;
      invoice.voucherPreference = 'auto';
      invoice.customerPaid = 0;
      return;
    }

    invoices.value = invoices.value.filter(entry => entry.id !== invoiceId)
    if (activeInvoiceId.value === invoiceId) activeInvoiceId.value = invoices.value[0].id`

content = content.replace(oldBottom, newBottom)
fs.writeFileSync('src/pages/AdminPOSView.vue', content, 'utf8')
console.log('Patched bottom of removeInvoice')
