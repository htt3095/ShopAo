const fs = require('node:fs')
let content = fs.readFileSync('src/pages/AdminPOSView.vue', 'utf8')

// Fix the input field
content = content.replace(
  '<input\n                          v-model.number="item.quantity"\n                          class="w-10 border-none bg-transparent p-0 text-center text-xs text-slate-900 focus:ring-0"\n                          min="1"\n                          type="number"\n                          @blur="validateQuantity(item)"\n                          @change="validateQuantity(item)"\n                        >',
  '<input\n                          :value="item.quantity"\n                          class="w-10 border-none bg-transparent p-0 text-center text-xs text-slate-900 focus:ring-0"\n                          min="1"\n                          type="number"\n                          @change="handleInputQuantity(item, $event)"\n                        >',
)

// Fix the select field
content = content.replace(
  '<select v-model="item.variantId" class="mt-1 block w-full rounded-md border border-slate-300 py-1 text-[11px] text-slate-700" @change="validateQuantity(item)">',
  '<select :value="item.variantId" class="mt-1 block w-full rounded-md border border-slate-300 py-1 text-[11px] text-slate-700" @change="handleVariantChange(item, $event)">',
)

// Replace the old validateQuantity with our new handlers
const validateBlock = `  async function validateQuantity (item) {
    const variant = getVariant(item)
    let maxStock = Number(variant.stockQuantity || 0)
    try {
      const realStock = await stockApi.getVariantStock(item.variantId)
      if (Number(realStock) >= 0) maxStock = Number(realStock)
    } catch (error) {
      console.warn('POS validateQuantity stock check failed, using local:', error)
    }
    const requestedQuantity = Math.max(1, Number(item.quantity) || 1)
    if (requestedQuantity > maxStock) {
      showPaymentDialog({ type: 'error', subtitle: 'Cảnh báo', title: 'Thông báo', message: \`Số lượng vượt quá tồn kho, chỉ còn \${maxStock}\` })
      item.quantity = maxStock
      return
    }
    const diff = requestedQuantity - Number(item.quantity || 0)
    await posApi.adjustStock(item.variantId, diff)
    adjustLocalStock(item.variantId, diff)
    item.quantity = requestedQuantity
  }`

const newHandlers = `  async function handleInputQuantity (item, event) {
    const inputQty = Number(event.target.value)
    if (isNaN(inputQty) || inputQty < 1) {
      event.target.value = item.quantity
      return
    }
    const diff = inputQty - item.quantity
    if (diff === 0) return

    const variant = getVariant(item)
    let maxStock = Number(variant.stockQuantity || 0) + item.quantity // available + what we already have
    try {
      const realStock = await stockApi.getVariantStock(item.variantId)
      if (Number(realStock) >= 0) maxStock = Number(realStock) + item.quantity
    } catch (error) {
      console.warn('POS handleInputQuantity stock check failed', error)
    }

    if (inputQty > maxStock) {
      showPaymentDialog({ type: 'error', subtitle: 'Cảnh báo', title: 'Thông báo', message: \`Số lượng vượt quá tồn kho, chỉ còn \${maxStock}\` })
      event.target.value = item.quantity
      return
    }

    try {
      await posApi.adjustStock(item.variantId, diff)
      adjustLocalStock(item.variantId, diff)
      item.quantity = inputQty
    } catch (error) {
      showPaymentDialog({ type: 'error', message: 'Không thể cập nhật tồn kho' })
      event.target.value = item.quantity
    }
  }

  async function handleVariantChange (item, event) {
    const newVariantId = event.target.value
    if (item.variantId === newVariantId) return

    const oldVariantId = item.variantId
    const newVariant = item.product.variants.find(v => v.variantId === newVariantId)
    
    if (!newVariant || Number(newVariant.stockQuantity || 0) < item.quantity) {
      showPaymentDialog({ type: 'error', message: 'Biến thể này không đủ tồn kho cho số lượng hiện tại!' })
      event.target.value = oldVariantId
      return
    }

    const existingItem = activeInvoice.value.cart.find(i => i !== item && i.variantId === newVariantId)
    if (existingItem) {
      showPaymentDialog({ type: 'error', message: 'Sản phẩm này đã có trong giỏ, vui lòng tăng số lượng thay vì đổi biến thể.' })
      event.target.value = oldVariantId
      return
    }

    try {
      await posApi.adjustStock(oldVariantId, -item.quantity)
      adjustLocalStock(oldVariantId, -item.quantity)

      await posApi.adjustStock(newVariantId, item.quantity)
      adjustLocalStock(newVariantId, item.quantity)

      item.variantId = newVariantId
    } catch (error) {
      showPaymentDialog({ type: 'error', message: 'Lỗi đồng bộ kho khi đổi biến thể' })
      event.target.value = oldVariantId
    }
  }`

content = content.replace(validateBlock, newHandlers)
fs.writeFileSync('src/pages/AdminPOSView.vue', content, 'utf8')
console.log('Patched handlers')
