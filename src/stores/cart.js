/**
 * Cart Store - Manages shopping cart state and operations
 */
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { resolveImageUrl, stockApi } from '@/services/api'
import { cartAPI } from '@/services/orders'
import {
  resolveColorMeta,
  resolveSizeMeta,
} from '@/utils/variantValues'

export const useCartStore = defineStore('cart', () => {
  // State
  const cartItems = ref([])
  const accountId = ref(null)
  const loading = ref(false)
  const error = ref(null)
  const notice = ref('')

  // Computed properties
  const cartCount = computed(() => {
    return cartItems.value.reduce((total, item) => total + item.quantity, 0)
  })

  const cartTotal = computed(() => {
    return cartItems.value.reduce((total, item) => {
      return total + (item.price * item.quantity)
    }, 0)
  })

  const isEmpty = computed(() => cartItems.value.length === 0)

  function setLoginRequiredError () {
    error.value = 'Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng'
  }

  function markCartPurchased () {
    cartItems.value = []
    saveCart()
    try {
      sessionStorage.setItem('cartPurchased', '1')
    } catch (error_) {
      console.warn('Không lưu được trạng thái mua hàng.', error_)
    }
  }

  function clearPurchaseFlag () {
    try {
      sessionStorage.removeItem('cartPurchased')
    } catch (error_) {
      console.warn('Không xóa được trạng thái mua hàng.', error_)
    }
  }

  function readPurchaseFlag () {
    try {
      return sessionStorage.getItem('cartPurchased') === '1'
    } catch {
      return false
    }
  }

  function parseAccountId (rawValue) {
    const source = rawValue && typeof rawValue === 'object' ? rawValue : null
    let candidate = rawValue

    if (source) {
      if (source.accountId !== undefined && source.accountId !== null) {
        candidate = source.accountId
      } else if (source.account_id !== undefined && source.account_id !== null) {
        candidate = source.account_id
      } else {
        candidate = source.id
      }
    }

    const n = Number(candidate)
    return Number.isFinite(n) && n > 0 ? n : null
  }

  function getStoredAccountId () {
    try {
      const rawUser = localStorage.getItem('user')
      if (!rawUser) {
        return null
      }

      const parsedUser = JSON.parse(rawUser)
      return parseAccountId(parsedUser)
    } catch {
      return null
    }
  }

  function normalizeCartImage (rawImage) {
    if (!rawImage) {
      return rawImage
    }

    let image = String(rawImage).trim()
    if (!image) {
      return image
    }

    const isAbsolute = /^https?:\/\//i.test(image)
    const isDataUrl = image.indexOf('data:') === 0
    const hasPath = image.includes('/')

    if (!isAbsolute && !isDataUrl) {
      if (!hasPath) {
        image = `/images/${image}`
      } else if (image.indexOf('images/') === 0) {
        image = `/${image}`
      }
    }

    return resolveImageUrl(image)
  }

  function normalizeProductCode (rawCode) {
    if (rawCode === null || rawCode === undefined) {
      return null
    }

    const code = String(rawCode).trim()
    if (!code) {
      return null
    }

    return code
  }

  // eslint-disable-next-line complexity
  function normalizeCartItem (item) {
    const productId = item.productId || item.product_id || null
    const variantObj = item.variant && typeof item.variant === 'object' ? item.variant : null
    const rawVariantId
      = item.variantId
        || item.variant_id
        || item.productVariantId
        || item.product_variant_id
        || (variantObj && (variantObj.id || variantObj.variantId || variantObj.variant_id))
        || null
    const rawCode
      = item.productCode
        || item.product_code
        || item.code
        || (item.product && (item.product.productCode || item.product.product_code || item.product.code))
        || null
    const rawName
      = item.productName
        || item.product_name
        || item.name
        || item.variantName
        || item.variant_name
        || item.title
        || (item.product && (item.product.name || item.product.productName || item.product.product_name || item.product.title))
        || (variantObj && (variantObj.name || variantObj.productName || variantObj.product_name || variantObj.title))
        || null
    const normalizedName = rawName === null || rawName === undefined ? '' : String(rawName).trim()
    const sizeSource = item.size > 0 && typeof item.size === 'object' ? item.size : null
    const colorSource = item.color && typeof item.color === 'object' ? item.color : null
    const rawImage = item.imageUrl || item.image_url || item.image || null
    const stock = item.stockAvailable || item.stock_available || item.stockQuantity || item.stock_quantity || 0
    const sizeMeta = resolveSizeMeta({
      id: item.sizeId || item.size_id || (sizeSource && sizeSource.id),
      name: item.sizeName
        || item.size_name
        || (typeof item.size === 'string' ? item.size : null)
        || (sizeSource && sizeSource.name),
    })
    const colorMeta = resolveColorMeta({
      id: item.colorId || item.color_id || (colorSource && colorSource.id),
      name: item.colorName
        || item.color_name
        || (typeof item.color === 'string' ? item.color : null)
        || (colorSource && colorSource.name),
      hexCode: item.colorHexCode
        || item.color_hex_code
        || (colorSource && (colorSource.hexCode || colorSource.hex_code)),
    })

    return {
      ...item,
      id: item.id || item.cartItemId,
      cartItemId: item.cartItemId || item.id,
      productId,
      variantId: rawVariantId,
      variant_id: rawVariantId,
      productName: normalizedName || 'Sản phẩm',
      productCode: normalizeProductCode(rawCode),
      imageUrl: normalizeCartImage(rawImage),
      sizeId: sizeMeta.id,
      sizeName: sizeMeta.name,
      colorId: colorMeta.id,
      colorName: colorMeta.name,
      colorHexCode: colorMeta.hexCode,
      stockAvailable: stock,
      stockQuantity: stock,
    }
  }

  // ============================================
  // BACKEND CART FUNCTIONS
  // ============================================

  async function syncLocalItemsToBackend (normalizedAccountId, localItems) {
    const source = Array.isArray(localItems) ? localItems : []
    let syncedCount = 0

    for (const item of source) {
      const variantId = Number(item && item.variantId)
      if (!Number.isFinite(variantId) || variantId <= 0) {
        continue
      }

      const quantityRaw = Number(item && item.quantity)
      const quantity = Number.isFinite(quantityRaw) && quantityRaw > 0 ? Math.floor(quantityRaw) : 1

      try {
        await cartAPI.addToCart(normalizedAccountId, variantId, quantity)
        syncedCount += 1
      } catch (error_) {
        console.warn('Skip unsynced local cart item:', error_)
      }
    }

    return syncedCount > 0
  }

  async function loadCartFromBackend (id, options = {}) {
    const accountCandidate = id !== undefined && id !== null ? id : accountId.value
    const normalizedAccountId = parseAccountId(accountCandidate)
    if (normalizedAccountId === null) {
      return
    }

    const allowLocalSync = options.allowLocalSync !== false
    const localSnapshot = Array.isArray(cartItems.value) ? cartItems.value.map(item => normalizeCartItem(item)) : []

    loading.value = true
    try {
      accountId.value = normalizedAccountId

      const response = await cartAPI.getCart(normalizedAccountId)
      const items = (response && response.items && Array.isArray(response.items)) ? response.items : []
      const normalizedRemoteItems = (await Promise.all(
        items.map(async item => {
          const normalized = normalizeCartItem(item)
          const variantId = Number(normalized.variantId || normalized.id)
          const stockValue = Number(normalized.stockAvailable || normalized.stockQuantity || 0)
          if (Number.isFinite(variantId) && variantId > 0 && stockValue <= 0) {
            try {
              const realStock = await stockApi.getVariantStock(variantId)
              if (Number(realStock) >= 0) {
                normalized.stockAvailable = Number(realStock)
                normalized.stockQuantity = Number(realStock)
              }
            } catch (error_) {
              console.warn('Cart stock enrich failed:', error_)
            }
          }
          return normalized
        }),
      ))

      if (normalizedRemoteItems.length === 0 && allowLocalSync) {
        const localOnlyItems = localSnapshot.filter(item => item && item.isLocalOnly)
        if (localOnlyItems.length > 0) {
          const didSync = await syncLocalItemsToBackend(normalizedAccountId, localOnlyItems)
          if (didSync) {
            await loadCartFromBackend(normalizedAccountId, { allowLocalSync: false })
            return
          }

          cartItems.value = localOnlyItems
          saveCart()
          error.value = null
          return
        }
      }

      if (normalizedRemoteItems.length === 0 && localSnapshot.length > 0) {
        const purchaseFlag = readPurchaseFlag()
        if (purchaseFlag) {
          clearPurchaseFlag()
          cartItems.value = []
        } else {
          cartItems.value = localSnapshot
          notice.value = 'Giỏ hàng trên máy chủ đã thay đổi (một số sản phẩm có thể vừa được mua tại cửa hàng hoặc khách khác đặt trước). Chúng tôi đã giữ lại sản phẩm trên máy bạn để bạn kiểm tra; nếu không còn đủ hàng, vui lòng giảm số lượng hoặc xóa bớt trước khi thanh toán.'
        }
        saveCart()
        error.value = null
        loading.value = false
        return
      }

      cartItems.value = normalizedRemoteItems
      saveCart()
      error.value = null
      notice.value = ''
    } catch (error_) {
      error.value = error_.message
      console.error('Error loading cart:', error_)

      if (localSnapshot.length > 0) {
        cartItems.value = localSnapshot
        saveCart()
      }
    } finally {
      loading.value = false
    }
  }

  // eslint-disable-next-line no-unused-vars
  async function addToCartBackend (variantId, quantity, _fallbackProduct = null, fallbackVariant = null) {
    const normalizedAccountId = parseAccountId(accountId.value)
    if (normalizedAccountId === null) {
      setLoginRequiredError()
      return false
    }

    // Chặn thêm biến thể đã ngừng bán (HIDDEN) vào giỏ
    const variantStatus = String(fallbackVariant?.status || '').toUpperCase()
    if (variantStatus === 'HIDDEN' || variantStatus === 'INACTIVE' || variantStatus === 'STOP_SELLING') {
      error.value = 'Sản phẩm này hiện đã ngừng bán.'
      return false
    }

    try {
      const availableStock = await stockApi.getVariantStock(variantId)
      const existingItem = cartItems.value.find(i => i.variantId === variantId)
      const currentQty = existingItem ? existingItem.quantity : 0
      const totalQty = currentQty + quantity
      if (availableStock <= 0) {
        error.value = 'Sản phẩm này đã hết hàng'
        return false
      }
      if (totalQty > availableStock) {
        error.value = `Chỉ còn ${availableStock} sản phẩm trong kho${existingItem ? ` (bạn đã có ${currentQty} trong giỏ)` : ''}`
        return false
      }
    } catch (error_) {
      console.warn('Stock check failed, proceeding with add:', error_)
    }

    loading.value = true
    try {
      await cartAPI.addToCart(normalizedAccountId, variantId, quantity)
      await loadCartFromBackend(normalizedAccountId)
      clearPurchaseFlag()
      error.value = null
      return true
    } catch (error_) {
      error.value = error_.message
      console.error('Error adding to cart:', error_)
      return false
    } finally {
      loading.value = false
    }
  }

  async function updateCartItemBackend (cartItemId, quantity) {
    const normalizedAccountId = parseAccountId(accountId.value)
    if (normalizedAccountId === null) {
      updateCartItemQuantity(cartItemId, quantity)
      return
    }

    if (quantity > 0) {
      const existingItem = cartItems.value.find(i => i.id === cartItemId || i.cartItemId === cartItemId)
      if (existingItem) {
        try {
          const availableStock = await stockApi.getVariantStock(existingItem.variantId)
          if (availableStock <= 0) {
            error.value = 'Sản phẩm này đã hết hàng'
            return
          }
          if (quantity > availableStock) {
            error.value = `Chỉ còn ${availableStock} sản phẩm trong kho`
            return
          }
        } catch (error_) {
          console.warn('Stock check failed for cart update:', error_)
        }
      }
    }

    loading.value = true
    try {
      await cartAPI.updateCartItem(cartItemId, quantity)
      await loadCartFromBackend(normalizedAccountId)
      clearPurchaseFlag()
      error.value = null
    } catch (error_) {
      error.value = error_.message
      console.error('Error updating cart:', error_)
    } finally {
      loading.value = false
    }
  }

  async function removeFromCartBackend (cartItemId) {
    const normalizedAccountId = parseAccountId(accountId.value)
    if (normalizedAccountId === null) {
      const item = cartItems.value.find(i => i.id === cartItemId)
      if (item) {
        removeFromCart(item.variantId)
      }
      return
    }
    loading.value = true
    try {
      await cartAPI.removeFromCart(cartItemId)
      await loadCartFromBackend(normalizedAccountId)
      error.value = null
    } catch (error_) {
      error.value = error_.message
      console.error('Error removing from cart:', error_)
    } finally {
      loading.value = false
    }
  }

  async function clearCartBackend () {
    const normalizedAccountId = parseAccountId(accountId.value)
    if (normalizedAccountId === null) {
      clearCart()
      return
    }
    loading.value = true
    try {
      await cartAPI.clearCart(normalizedAccountId)
      cartItems.value = []
      notice.value = ''
      saveCart()
      error.value = null
    } catch (error_) {
      error.value = error_.message
      console.error('Error clearing cart:', error_)
    } finally {
      loading.value = false
    }
  }

  async function refreshCartStock () {
    if (cartItems.value.length === 0) {
      return { valid: true, errors: [] }
    }
    const items = cartItems.value.map(item => ({
      variantId: item.variantId || item.variant_id || (item.variant && item.variant.id),
      quantity: item.quantity,
      productName: item.productName,
    }))
    return stockApi.checkStock(items)
  }

  async function refreshCartStockLive () {
    if (cartItems.value.length === 0) {
      return
    }
    await Promise.all(cartItems.value.map(async item => {
      const variantId = Number(item.variantId || item.variant_id || (item.variant && item.variant.id))
      if (!Number.isFinite(variantId) || variantId <= 0) {
        return item
      }
      try {
        const realStock = await stockApi.getVariantStock(variantId)
        item.stockAvailable = Math.max(0, Number(realStock) || 0)
      } catch (error_) {
        console.warn(`Cart stock sync failed for variant ${variantId}`, error_)
      }
      return item
    }))
    saveCart()
  }

  // ============================================
  // LOCAL CART FUNCTIONS (Fallback)
  // ============================================

  async function addToCart (product, variant, quantity = 1) {
    if (parseAccountId(accountId.value) !== null) {
      return addToCartBackend(variant.id, quantity, product, variant)
    }

    setLoginRequiredError()
    return false
  }

  function updateCartItemQuantity (variantId, quantity) {
    try {
      const item = cartItems.value.find(item => item.variantId === variantId)
      if (item) {
        if (quantity <= 0) {
          removeFromCart(variantId)
        } else if (quantity <= item.stockQuantity) {
          item.quantity = quantity
          saveCart()
        } else {
          error.value = 'Quantity exceeds available stock'
        }
      }
    } catch (error_) {
      error.value = error_.message
      console.error('Error updating cart item:', error_)
    }
  }

  function removeFromCart (variantId) {
    try {
      const index = cartItems.value.findIndex(item => item.variantId === variantId)
      if (index !== -1) {
        cartItems.value.splice(index, 1)
        saveCart()
      }
    } catch (error_) {
      error.value = error_.message
      console.error('Error removing from cart:', error_)
    }
  }

  function clearCart () {
    cartItems.value = []
    notice.value = ''
    saveCart()
  }

  // LocalStorage operations
  function saveCart () {
    try {
      localStorage.setItem('cart', JSON.stringify(cartItems.value))
    } catch (error_) {
      console.error('Error saving cart to localStorage:', error_)
    }
  }

  function loadCart () {
    try {
      const savedCart = localStorage.getItem('cart')
      if (savedCart) {
        const parsed = JSON.parse(savedCart)
        const items = Array.isArray(parsed) ? parsed : []
        cartItems.value = items.map(item => normalizeCartItem(item))
      }
    } catch (error_) {
      console.error('Error loading cart from localStorage:', error_)
    }
  }

  // Initialize cart from localStorage
  loadCart()
  accountId.value = getStoredAccountId()

  if (accountId.value === null && cartItems.value.length > 0) {
    cartItems.value = []
    saveCart()
  }

  return {
    // State
    cartItems,
    accountId,
    loading,
    error,
    notice,

    // Computed
    cartCount,
    cartTotal,
    isEmpty,

    // Local Actions
    addToCart,
    updateCartItemQuantity,
    removeFromCart,
    clearCart,
    saveCart,
    loadCart,
    markCartPurchased,

    // Backend Actions
    loadCartFromBackend,
    addToCartBackend,
    updateCartItemBackend,
    removeFromCartBackend,
    clearCartBackend,
    refreshCartStock,
    refreshCartStockLive,
  }
})
