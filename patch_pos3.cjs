const fs = require('node:fs')
let content = fs.readFileSync('src/pages/AdminPOSView.vue', 'utf8')

const removeFromCartExisting = `  function removeFromCart (cartItemId) {
    if (!activeInvoice.value) return
    const item = activeInvoice.value.cart.find(entry => entry.cartItemId === cartItemId)
    if (!item) return
    activeInvoice.value.cart = activeInvoice.value.cart.filter(entry => entry.cartItemId !== cartItemId)
  }`
const removeFromCartNew = `  function removeFromCart (cartItemId) {
    if (!activeInvoice.value) return
    const item = activeInvoice.value.cart.find(entry => entry.cartItemId === cartItemId)
    if (!item) return
    posApi.adjustStock(item.variantId, -Number(item.quantity || 0)).then(() => {
      adjustLocalStock(item.variantId, -Number(item.quantity || 0))
    }).catch(error => {
      console.warn('Không thể hoàn tồn kho sản phẩm POS.', error)
    })
    activeInvoice.value.cart = activeInvoice.value.cart.filter(entry => entry.cartItemId !== cartItemId)
  }`

content = content.replace(removeFromCartExisting, removeFromCartNew)
fs.writeFileSync('src/pages/AdminPOSView.vue', content, 'utf8')
