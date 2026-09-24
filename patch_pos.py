import re

with open('src/pages/AdminPOSView.vue', 'r', encoding='utf-8') as f:
    content = f.read()

# Add posApi import
content = content.replace(
    "import { adminApi, colorsApi, sizesApi, stockApi } from '@/services/api'",
    "import { adminApi, colorsApi, posApi, sizesApi, stockApi } from '@/services/api'"
)

# Add adjustLocalStock function before getVariant
adjustLocalStockFunc = '''
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
'''
content = content.replace('  function getVariant (item) {', adjustLocalStockFunc)

# Change stockAlreadyDeducted
content = content.replace("stockAlreadyDeducted: false,", "stockAlreadyDeducted: true,")

# Add confirmations for removeInvoice
removeInvoiceNew = '''
  function removeInvoice (invoiceId) {
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

    invoices.value = invoices.value.filter(entry => entry.id !== invoiceId)
'''
content = re.sub(
    r"  function removeInvoice \(invoiceId\) \{\n    const invoice = invoices\.value\.find\(entry => entry\.id === invoiceId\)\n    if \(!invoice \|\| invoice\.orderId\) return\n\n    invoices\.value = invoices\.value\.filter\(entry => entry\.id !== invoiceId\)",
    removeInvoiceNew.strip('\n'),
    content
)

# Add confirmations for resetInvoice
resetInvoiceNew = '''
  function resetInvoice () {
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

    invoice.customer = { ...POS_DEFAULT_CUSTOMER }
'''
content = re.sub(
    r"  function resetInvoice \(\) \{\n    const invoice = activeInvoice\.value\n    if \(!invoice\) return\n    invoice\.customer = \{ \.\.\.POS_DEFAULT_CUSTOMER \}",
    resetInvoiceNew.strip('\n'),
    content
)

# addToCart diff
addToCartExisting = '''
      const nextQuantity = Math.min(existing.quantity + 1, maxStock)
      existing.quantity = nextQuantity
      return
    }

    activeInvoice.value.cart.push({
'''
addToCartNew = '''
      const nextQuantity = Math.min(existing.quantity + 1, maxStock)
      const diff = nextQuantity - Number(existing.quantity || 0)
      await posApi.adjustStock(variantId, diff)
      adjustLocalStock(variantId, diff)
      existing.quantity = nextQuantity
      return
    }

    await posApi.adjustStock(variantId, 1)
    adjustLocalStock(variantId, 1)
    activeInvoice.value.cart.push({
'''
content = content.replace(addToCartExisting, addToCartNew)

# removeCartItem
removeCartItemExisting = '''
  function removeCartItem (cartItemId) {
    if (!activeInvoice.value) return
    const item = activeInvoice.value.cart.find(entry => entry.cartItemId === cartItemId)
    if (!item) return
    activeInvoice.value.cart = activeInvoice.value.cart.filter(entry => entry.cartItemId !== cartItemId)
  }
'''
removeCartItemNew = '''
  function removeCartItem (cartItemId) {
    if (!activeInvoice.value) return
    const item = activeInvoice.value.cart.find(entry => entry.cartItemId === cartItemId)
    if (!item) return
    posApi.adjustStock(item.variantId, -Number(item.quantity || 0)).then(() => {
      adjustLocalStock(item.variantId, -Number(item.quantity || 0))
    }).catch(error => {
      console.warn('Không thể hoàn tồn kho sản phẩm POS.', error)
    })
    activeInvoice.value.cart = activeInvoice.value.cart.filter(entry => entry.cartItemId !== cartItemId)
  }
'''
content = content.replace(removeCartItemExisting, removeCartItemNew)

# incrementQuantity
incrementQuantityExisting = '''
    const newQty = Number(item.quantity || 0) + change
    if (newQty < 1) return
    if (newQty > maxStock) {
      showPaymentDialog({ type: 'error', subtitle: 'Cảnh báo', title: 'Thông báo', message: Không thêm được nữa, sản phẩm này chỉ còn  trong kho })
      item.quantity = maxStock
      return
    }
    item.quantity = newQty
'''
incrementQuantityNew = '''
    const newQty = Number(item.quantity || 0) + change
    if (newQty < 1) return
    if (newQty > maxStock) {
      showPaymentDialog({ type: 'error', subtitle: 'Cảnh báo', title: 'Thông báo', message: Không thêm được nữa, sản phẩm này chỉ còn  trong kho })
      item.quantity = maxStock
      return
    }
    const diff = newQty - Number(item.quantity || 0)
    await posApi.adjustStock(item.variantId, diff)
    adjustLocalStock(item.variantId, diff)
    item.quantity = newQty
'''
content = content.replace(incrementQuantityExisting, incrementQuantityNew)

# validateQuantity
validateQuantityExisting = '''
    const requestedQuantity = Math.max(1, Number(item.quantity) || 1)
    if (requestedQuantity > maxStock) {
      showPaymentDialog({ type: 'error', subtitle: 'Cảnh báo', title: 'Thông báo', message: Số lượng vượt quá tồn kho, chỉ còn  })
      item.quantity = maxStock
      return
    }
    item.quantity = requestedQuantity
'''
validateQuantityNew = '''
    const requestedQuantity = Math.max(1, Number(item.quantity) || 1)
    if (requestedQuantity > maxStock) {
      showPaymentDialog({ type: 'error', subtitle: 'Cảnh báo', title: 'Thông báo', message: Số lượng vượt quá tồn kho, chỉ còn  })
      item.quantity = maxStock
      return
    }
    const diff = requestedQuantity - Number(item.quantity || 0)
    await posApi.adjustStock(item.variantId, diff)
    adjustLocalStock(item.variantId, diff)
    item.quantity = requestedQuantity
'''
content = content.replace(validateQuantityExisting, validateQuantityNew)

with open('src/pages/AdminPOSView.vue', 'w', encoding='utf-8') as f:
    f.write(content)
print("Patch successful!")
