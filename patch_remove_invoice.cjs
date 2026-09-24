const fs = require('node:fs')
let content = fs.readFileSync('src/pages/AdminPOSView.vue', 'utf8')

const oldRemove = `  async function removeInvoice (invoiceId) {
    const invoice = invoices.value.find(entry => entry.id === invoiceId)
    if (!invoice || invoice.orderId) return

    if (invoice.cart.length > 0) {
      const confirmed = await new Promise(resolve => {
        showPaymentDialog({
          type: 'confirm',
          title: 'Xóa hóa đơn',
          message: 'Hóa đơn này đang có sản phẩm. Bạn có chắc chắn muốn xóa và hoàn lại tồn kho không?',
          primaryLabel: 'Xóa hóa đơn',
          secondaryLabel: 'Hủy bỏ',
          onPrimary: () => resolve(true),
          onSecondary: () => resolve(false),
        })
      });
      if (!confirmed) return;

      for (const item of invoice.cart) {
        posApi.adjustStock(item.variantId, -Number(item.quantity || 0)).then(() => {
          adjustLocalStock(item.variantId, -Number(item.quantity || 0))
        }).catch(error => {
          console.warn('Không thể hoàn tồn kho hóa đơn POS.', error)
        })
      }
    }

    invoices.value = invoices.value.filter(entry => entry.id !== invoiceId)
    if (invoices.value.length === 0) {
      const newInvoice = createNewInvoice()
      invoices.value = [newInvoice]
      activeInvoiceId.value = newInvoice.id
      return
    }
    if (activeInvoiceId.value === invoiceId) activeInvoiceId.value = invoices.value[0].id
  }`

const newRemove = `  async function removeInvoice (invoiceId) {
    const invoice = invoices.value.find(entry => entry.id === invoiceId)
    if (!invoice || invoice.orderId) return

    if (invoice.cart.length > 0) {
      const confirmed = await new Promise(resolve => {
        showPaymentDialog({
          type: 'confirm',
          title: 'Xóa hóa đơn',
          message: 'Hóa đơn này đang có sản phẩm. Bạn có chắc chắn muốn xóa và hoàn lại tồn kho không?',
          primaryLabel: 'Xóa hóa đơn',
          secondaryLabel: 'Hủy bỏ',
          onPrimary: () => resolve(true),
          onSecondary: () => resolve(false),
        })
      });
      if (!confirmed) return;

      for (const item of invoice.cart) {
        posApi.adjustStock(item.variantId, -Number(item.quantity || 0)).then(() => {
          adjustLocalStock(item.variantId, -Number(item.quantity || 0))
        }).catch(error => {
          console.warn('Không thể hoàn tồn kho hóa đơn POS.', error)
        })
      }
    }

    if (invoices.value.length === 1) {
      invoice.cart = [];
      invoice.customer = { ...POS_DEFAULT_CUSTOMER };
      invoice.voucherInput = '';
      invoice.appliedVoucher = null;
      invoice.voucherPreference = 'auto';
      invoice.customerPaid = 0;
      return;
    }

    invoices.value = invoices.value.filter(entry => entry.id !== invoiceId)
    if (activeInvoiceId.value === invoiceId) activeInvoiceId.value = invoices.value[0].id
  }`

content = content.replace(oldRemove, newRemove)
fs.writeFileSync('src/pages/AdminPOSView.vue', content, 'utf8')
console.log('Patched removeInvoice')
