const fs = require('node:fs')

let content = fs.readFileSync('src/pages/AdminPOSView.vue', 'utf8')

// Add posApi import
content = content.replace(
  'import { adminApi, colorsApi, sizesApi, stockApi } from \'@/services/api\'',
  'import { adminApi, colorsApi, posApi, sizesApi, stockApi } from \'@/services/api\'',
)

// Add adjustLocalStock function before getVariant
const adjustLocalStockFunc = `
  function adjustLocalStock (variantId, reservedDelta) {
    if (!reservedDelta) return
    for (const product of inventoryVariants.value) {
      const variant = product.variants.find(v => v.variantId === variantId)
      if (variant) {
        variant.stockQuantity = Number(variant.stockQuantity || 0) - reservedDelta
        break
      }
    }
  }

  function getVariant (item) {
`
content = content.replace('  function getVariant (item) {', adjustLocalStockFunc)

// Change stockAlreadyDeducted
content = content.replace('stockAlreadyDeducted: false,', 'stockAlreadyDeducted: true,')

// Add confirmations for removeInvoice
const removeInvoiceRegex = / {2}function removeInvoice \(invoiceId\) \{\n {4}const invoice = invoices\.value\.find\(entry => entry\.id === invoiceId\)\n {4}if \(!invoice \|\| invoice\.orderId\) return\n\n {4}invoices\.value = invoices\.value\.filter\(entry => entry\.id !== invoiceId\)/
const removeInvoiceNew = `  function removeInvoice (invoiceId) {
    const invoice = invoices.value.find(entry => entry.id === invoiceId)
    if (!invoice || invoice.orderId) return

    if (invoice.cart.length > 0) {
      if (!window.confirm('Hóa đơn này đang có sản phẩm. Bạn có chắc chắn muốn xóa và hoàn lại tồn kho không?')) return;
      
      invoice.cart.forEach(item => {
        posApi.adjustStock(item.variantId, -Number(item.quantity || 0)).then(() => {
          adjustLocalStock(item.variantId, -Number(item.quantity || 0))
        }).catch(error => {
          console.warn('Không thể hoàn tồn kho hóa đơn POS.', error)
        })
      })
    }

    invoices.value = invoices.value.filter(entry => entry.id !== invoiceId)`
content = content.replace(removeInvoiceRegex, removeInvoiceNew)

// Add confirmations for resetInvoice
const resetInvoiceRegex = / {2}function resetInvoice \(\) \{\n {4}const invoice = activeInvoice\.value\n {4}if \(!invoice\) return\n {4}invoice\.customer = \{ \.\.\.POS_DEFAULT_CUSTOMER \}/
const resetInvoiceNew = `  function resetInvoice () {
    const invoice = activeInvoice.value
    if (!invoice) return

    if (invoice.cart.length > 0) {
      if (!window.confirm('Bạn có chắc chắn muốn làm mới giỏ hàng và hoàn lại tồn kho không?')) return;

      invoice.cart.forEach(item => {
        posApi.adjustStock(item.variantId, -Number(item.quantity || 0)).then(() => {
          adjustLocalStock(item.variantId, -Number(item.quantity || 0))
        }).catch(error => {
          console.warn('Không thể hoàn tồn kho POS.', error)
        })
      })
    }

    invoice.customer = { ...POS_DEFAULT_CUSTOMER }`
content = content.replace(resetInvoiceRegex, resetInvoiceNew)

// addToCart diff
const addToCartExisting = `      const nextQuantity = Math.min(existing.quantity + 1, maxStock)
      existing.quantity = nextQuantity
      return
    }

    activeInvoice.value.cart.push({`
const addToCartNew = `      const nextQuantity = Math.min(existing.quantity + 1, maxStock)
      const diff = nextQuantity - Number(existing.quantity || 0)
      await posApi.adjustStock(variantId, diff)
      adjustLocalStock(variantId, diff)
      existing.quantity = nextQuantity
      return
    }

    await posApi.adjustStock(variantId, 1)
    adjustLocalStock(variantId, 1)
    activeInvoice.value.cart.push({`
content = content.replace(addToCartExisting, addToCartNew)

// removeCartItem
const removeCartItemExisting = `  function removeCartItem (cartItemId) {
    if (!activeInvoice.value) return
    const item = activeInvoice.value.cart.find(entry => entry.cartItemId === cartItemId)
    if (!item) return
    activeInvoice.value.cart = activeInvoice.value.cart.filter(entry => entry.cartItemId !== cartItemId)
  }`
const removeCartItemNew = `  function removeCartItem (cartItemId) {
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
content = content.replace(removeCartItemExisting, removeCartItemNew)

// incrementQuantity
const incrementQuantityExisting = `    const newQty = Number(item.quantity || 0) + change
    if (newQty < 1) return
    if (newQty > maxStock) {
      showPaymentDialog({ type: 'error', subtitle: 'Cảnh báo', title: 'Thông báo', message: \`Không thêm được nữa, sản phẩm này chỉ còn \${maxStock} trong kho\` })
      item.quantity = maxStock
      return
    }
    item.quantity = newQty`
const incrementQuantityNew = `    const newQty = Number(item.quantity || 0) + change
    if (newQty < 1) return
    if (newQty > maxStock) {
      showPaymentDialog({ type: 'error', subtitle: 'Cảnh báo', title: 'Thông báo', message: \`Không thêm được nữa, sản phẩm này chỉ còn \${maxStock} trong kho\` })
      item.quantity = maxStock
      return
    }
    const diff = newQty - Number(item.quantity || 0)
    await posApi.adjustStock(item.variantId, diff)
    adjustLocalStock(item.variantId, diff)
    item.quantity = newQty`
content = content.replace(incrementQuantityExisting, incrementQuantityNew)

// validateQuantity
const validateQuantityExisting = `    const requestedQuantity = Math.max(1, Number(item.quantity) || 1)
    if (requestedQuantity > maxStock) {
      showPaymentDialog({ type: 'error', subtitle: 'Cảnh báo', title: 'Thông báo', message: \`Số lượng vượt quá tồn kho, chỉ còn \${maxStock}\` })
      item.quantity = maxStock
      return
    }
    item.quantity = requestedQuantity`
const validateQuantityNew = `    const requestedQuantity = Math.max(1, Number(item.quantity) || 1)
    if (requestedQuantity > maxStock) {
      showPaymentDialog({ type: 'error', subtitle: 'Cảnh báo', title: 'Thông báo', message: \`Số lượng vượt quá tồn kho, chỉ còn \${maxStock}\` })
      item.quantity = maxStock
      return
    }
    const diff = requestedQuantity - Number(item.quantity || 0)
    await posApi.adjustStock(item.variantId, diff)
    adjustLocalStock(item.variantId, diff)
    item.quantity = requestedQuantity`
content = content.replace(validateQuantityExisting, validateQuantityNew)

fs.writeFileSync('src/pages/AdminPOSView.vue', content, 'utf8')
console.log('Patch successful!')
