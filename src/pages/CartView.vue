<template>
  <div
    class="retail-shell flex min-h-screen flex-col text-slate-900  font-display antialiased selection:bg-primary selection:text-white"
  >
    <MainTopBar />

    <main class="flex-grow container mx-auto px-4 py-8 lg:px-8 xl:px-40">
      <div class="flex flex-col lg:flex-row gap-12">
        <div class="flex-1 flex flex-col gap-6">
          <div class="pb-4 border-b border-slate-200 ">
            <h1 class="text-3xl font-black tracking-tight mb-2">
              Giỏ hàng của bạn
            </h1>
            <p class="text-slate-500 ">
              {{ cartCount }} sản phẩm trong giỏ
            </p>
          </div>

          <div
            v-if="cartStore.notice"
            class="flex items-start gap-3 rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-800 "
          >
            <span class="material-symbols-outlined text-[20px] mt-0.5">info</span>
            <div class="flex-1">
              <p class="font-semibold">Giỏ hàng tạm khôi phục</p>
              <p class="mt-0.5">{{ cartStore.notice }}</p>
            </div>
            <button
              aria-label="Đóng thông báo"
              class="text-amber-500 hover:text-amber-700"
              type="button"
              @click="cartStore.notice = ''"
            >
              <span class="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>

          <div
            v-if="stockError"
            class="flex items-start gap-3 rounded-lg border border-red-300 bg-red-50 px-4 py-3 text-sm text-red-700 "
          >
            <span class="material-symbols-outlined text-[20px] mt-0.5">warning</span>
            <div class="flex-1">
              <p class="font-semibold">Không đủ hàng trong kho</p>
              <p class="mt-0.5">{{ stockError }}</p>
            </div>
            <button
              aria-label="Đóng cảnh báo"
              class="text-red-400 hover:text-red-600"
              type="button"
              @click="stockError = ''"
            >
              <span class="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
          <div class="flex flex-col gap-4">
            <div
              v-for="item in cartItems"
              :key="item.id"
              class="group flex flex-col sm:flex-row gap-5 p-4 rounded-xl bg-white  border border-slate-200  shadow-sm hover:border-primary/50 transition-colors"
            >
              <div class="shrink-0">
                <div
                  class="bg-center bg-no-repeat bg-cover rounded-lg w-full sm:w-[120px] aspect-square bg-slate-100 "
                  data-alt="Product image"
                  :style="{
                    backgroundImage: item.imageUrl
                      ? `url('${item.imageUrl}')`
                      : undefined,
                  }"
                />
              </div>
              <div class="flex flex-1 flex-col justify-between">
                <div class="flex justify-between items-start gap-4">
                  <div>
                    <h3
                      class="text-lg font-bold text-slate-900 "
                    >
                      {{ item.productName }}
                    </h3>
                    <p class="text-sm text-slate-500  mt-1">
                      Mã SP: {{ item.productCode || "--" }}
                    </p>
                    <div class="flex gap-3 mt-2">
                      <span
                        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100  text-slate-800 "
                      >Size: {{ getSizeLabel(item) }}</span>
                      <span
                        class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100  text-slate-800 "
                      >Màu: {{ getColorLabel(item) }}</span>
                    </div>
                  </div>
                  <div class="text-right">
                    <p class="text-lg font-bold text-slate-900 ">
                      {{ formatMoney(item.price * item.quantity) }}
                    </p>
                    <p
                      v-if="item.quantity > 1"
                      class="text-xs text-slate-400 mt-1"
                    >
                      {{ formatMoney(item.price) }} / đôi
                    </p>
                  </div>
                </div>
                <div class="flex justify-between items-end mt-4">
                  <button
                    class="text-sm font-medium text-red-500 hover:text-red-600 flex items-center gap-1"
                    type="button"
                    @click="removeItem(item)"
                  >
                    <span class="material-symbols-outlined text-[18px]">delete</span>
                    Xóa
                  </button>
                  <div class="flex items-center gap-2">
                    <label class="text-sm text-slate-500 ">SL:</label>
                    <input
                      class="w-16 rounded-lg border border-slate-300  bg-transparent text-center text-sm font-medium text-slate-900  focus:border-primary focus:ring-primary/30 focus:outline-none p-1.5"
                      :max="item.stockAvailable || item.stockQuantity || undefined"
                      min="1"
                      type="number"
                      :value="item.quantity"
                      @change="(e) => setQuantity(item, e.target.value)"
                    >
                    <span class="text-xs text-slate-400 ">/ {{ item.stockAvailable || item.stockQuantity || '--' }}</span>
                    <p
                      v-if="item.quantity > Number(item.stockAvailable || item.stockQuantity || 0)"
                      class="mt-1 rounded bg-red-50 px-2 py-1 text-xs font-medium text-red-600"
                    >
                      Chỉ còn {{ item.stockAvailable || item.stockQuantity }} trong kho (giảm do được bán tại cửa hàng / khách khác mua trước). Vui lòng giảm số lượng để đặt hàng.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div
              v-if="cartItems.length === 0"
              class="py-12 text-center text-slate-500 "
            >
              Giỏ hàng của bạn đang trống.
            </div>
          </div>
        </div>
        <div class="w-full lg:w-[360px] xl:w-[400px] shrink-0">
          <div class="sticky top-24 flex flex-col gap-6">
            <div
              class="bg-white  rounded-xl border border-slate-200  shadow-sm p-6"
            >
              <h2 class="text-xl font-bold mb-6">Tóm tắt đơn hàng</h2>
              <div class="mb-6">
                <p
                  v-if="voucherMessage"
                  class="text-xs mt-2 font-medium"
                  :class="isVoucherError ? 'text-red-500' : 'text-green-500'"
                >
                  {{ voucherMessage }}
                </p>
              </div>

              <div
                class="space-y-3 pb-6 border-b border-slate-200 "
              >
                <div
                  class="flex justify-between text-slate-600 "
                >
                  <span>Tạm tính</span>
                  <span class="font-medium text-slate-900 ">{{
                    formatMoney(subtotal)
                  }}</span>
                </div>

                <div class="rounded-lg bg-slate-50 px-3 py-2 text-xs text-slate-500  ">
                  Phí vận chuyển sẽ được hệ thống tính tự động ở bước thanh toán theo địa chỉ nhận hàng.
                </div>

                <div
                  v-if="discountAmount > 0"
                  class="flex justify-between text-green-500 animate-pulse"
                >
                  <span>Giảm giá</span>
                  <span class="font-bold">-{{ formatMoney(discountAmount) }}</span>
                </div>
              </div>
              <div class="flex justify-between items-center py-6">
                <span class="text-lg font-bold text-slate-900 ">Tổng thanh toán</span>
                <span
                  class="text-2xl font-black text-slate-900 "
                >{{ formatMoney(total) }}</span>
              </div>
              <button
                class="w-full bg-primary hover:bg-blue-600 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-blue-500/20 transition-all transform active:scale-[0.98] flex justify-center items-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
                :disabled="isLoadingCheckout"
                type="button"
                @click="proceedToCheckout"
              >
                <span class="material-symbols-outlined text-[20px]">lock</span>
                {{ isLoadingCheckout ? 'Đang kiểm tra tồn kho...' : checkoutButtonLabel }}
              </button>

              <div class="mt-4 text-center">
                <p class="text-xs text-slate-400">
                  Thanh toán an toàn, thông tin được bảo mật
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
  import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { stockApi } from '@/services/api'
  import { orderUtils, voucherAPI } from '@/services/orders'
  import { useCartStore } from '@/stores/cart'
  import { resolveColorMeta, resolveSizeMeta } from '@/utils/variantValues'
  import { normalizeAppliedVoucher } from '@/utils/voucherValues'

  const router = useRouter()
  const cartStore = useCartStore()
  const currentUser = ref(null)
  const currentAccountId = ref(null)
  const isLoading = ref(false)
  const isLoadingCheckout = ref(false)

  function getAccountId (user) {
    const source = user && typeof user === 'object' ? user : {}
    const candidate
      = source.accountId !== undefined && source.accountId !== null
        ? source.accountId
        : (source.account_id !== undefined && source.account_id !== null
          ? source.account_id
          : source.id)
    const n = Number(candidate)
    return Number.isFinite(n) && n > 0 ? n : null
  }

  let cartStockTimer = null
  async function syncCartStockLive () {
    if (document.hidden) return
    await cartStore.refreshCartStockLive()
  }

  function startCartStockSync () {
    cartStockTimer = setInterval(syncCartStockLive, 20_000)
    window.addEventListener('focus', syncCartStockLive)
    document.addEventListener('visibilitychange', syncCartStockLive)
  }

  function stopCartStockSync () {
    if (cartStockTimer) clearInterval(cartStockTimer)
    window.removeEventListener('focus', syncCartStockLive)
    document.removeEventListener('visibilitychange', syncCartStockLive)
  }

  onMounted(() => {
    startCartStockSync()
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        currentUser.value = JSON.parse(userData)
      } catch {
        currentUser.value = null
      }

      currentAccountId.value = getAccountId(currentUser.value)
      if (currentAccountId.value !== null) {
        cartStore.accountId = currentAccountId.value
        cartStore.loadCartFromBackend(currentAccountId.value)
        return
      }
    }

    currentAccountId.value = null
    cartStore.accountId = null
    cartStore.clearCart()
  })

  onUnmounted(stopCartStockSync)

  const voucherInput = ref('')
  const voucherData = ref(null)
  const voucherMessage = ref('')
  const isVoucherError = ref(false)
  const stockError = ref('')

  const cartItems = computed(() => cartStore.cartItems)
  const cartCount = computed(() => cartStore.cartCount)

  const subtotal = computed(() => cartStore.cartTotal)
  const shipping = computed(() => 0)
  const discountAmount = computed(() => {
    return voucherData.value?.discountAmount || 0
  })
  const total = computed(() =>
    Math.max(
      0,
      subtotal.value + shipping.value - discountAmount.value,
    ),
  )

  const checkoutButtonLabel = computed(() => {
    return currentAccountId.value === null
      ? 'Đăng nhập để thanh toán'
      : 'Tiến hành thanh toán'
  })

  function getSizeLabel (item) {
    return resolveSizeMeta({ id: item.sizeId, name: item.sizeName }).name || '--'
  }

  function getColorLabel (item) {
    return (
      resolveColorMeta({
        id: item.colorId,
        name: item.colorName,
        hexCode: item.colorHexCode,
      }).name || '--'
    )
  }

  async function applyVoucherByCode (codeOverride = '', options = {}) {
    const code = String(codeOverride || voucherInput.value || '').trim()
    if (!code) {
      if (!options.silent) {
        voucherMessage.value = 'Vui lòng nhập mã giảm giá'
        isVoucherError.value = true
      }
      return
    }

    try {
      isLoading.value = true
      const response = await voucherAPI.applyVoucher(code, subtotal.value)
      const normalized = normalizeAppliedVoucher(response, code)

      voucherData.value = normalized
      voucherInput.value = normalized.code || code

      if (!options.silent) {
        voucherMessage.value = `Đã áp dụng mã ${voucherInput.value} thành công!`
      }
      isVoucherError.value = false
    } catch (error) {
      voucherData.value = null
      if (!options.silent) {
        voucherMessage.value = error.message || 'Mã không hợp lệ'
        isVoucherError.value = true
      }
    } finally {
      isLoading.value = false
    }
  }

  async function applyVoucher () {
    await applyVoucherByCode(voucherInput.value, { silent: false })
  }

  watch(subtotal, async (next, previous) => {
    if (next === previous) return

    const code = voucherData.value?.code
    if (!code) return

    if (next <= 0) {
      voucherData.value = null
      voucherMessage.value = ''
      isVoucherError.value = false
      return
    }

    await applyVoucherByCode(code, { silent: true })
  })

  function formatMoney (n) {
    return orderUtils.formatPrice(n)
  }

  function shouldUseBackendItem (item) {
    return Boolean(currentAccountId.value && !item.isLocalOnly)
  }

  async function removeItem (item) {
    if (shouldUseBackendItem(item)) {
      await cartStore.removeFromCartBackend(item.cartItemId || item.id)
    } else {
      cartStore.removeFromCart(item.variantId)
    }
  }

  async function setQuantity (item, raw) {
    const qty = Number.parseInt(raw, 10)
    if (!Number.isFinite(qty) || qty <= 0) {
      stockError.value = ''
      await cartStore.loadCartFromBackend(currentAccountId.value)
      return
    }

    const available = Number(item.stockAvailable || item.stockQuantity || 0)
    if (available > 0 && qty > available) {
      stockError.value = `Số lượng của "${item.productName}" vượt quá tồn kho (chỉ còn ${available}). Vui lòng giảm số lượng.`
      isVoucherError.value = true
      // Reject the change: keep the previous quantity in cart
      if (shouldUseBackendItem(item)) {
        await cartStore.loadCartFromBackend(currentAccountId.value)
      } else {
        cartStore.updateCartItemQuantity(item.variantId, item.quantity)
      }
      return
    }

    if (shouldUseBackendItem(item)) {
      await cartStore.updateCartItemBackend(item.cartItemId || item.id, qty)
    } else {
      cartStore.updateCartItemQuantity(item.variantId, qty)
    }
    stockError.value = ''
    isVoucherError.value = false
  }

  async function proceedToCheckout () {
    if (currentAccountId.value === null) {
      router.push({ name: 'login', query: { redirect: '/checkout' } })
      return
    }

    if (cartStore.cartItems.length === 0) return

    // Validate real-time stock before moving to checkout
    isLoadingCheckout.value = true
    stockError.value = ''
    try {
      const items = cartStore.cartItems.map(item => ({
        variantId: item.variantId || item.variant_id || (item.variant && item.variant.id),
        quantity: item.quantity,
        productName: item.productName,
      }))
      const result = await stockApi.checkStock(items)

      if (!result.valid) {
        const messages = result.errors.map(e => e.message).join(' ')
        stockError.value = messages
        isVoucherError.value = true
        // Refresh to get correct available stock numbers
        await cartStore.loadCartFromBackend(currentAccountId.value)
        return
      }

      const code = voucherData.value?.code || ''
      router.push({ name: 'checkout', query: code ? { voucher: code } : {} })
    } catch (error) {
      console.error('Stock check before checkout failed:', error)
      stockError.value = error?.message || 'Không thể kiểm tra tồn kho, vui lòng thử lại.'
      isVoucherError.value = true
    } finally {
      isLoadingCheckout.value = false
    }
  }
</script>
