<template>
  <div
    class="retail-shell text-[#111418]  font-display overflow-x-hidden antialiased"
  >
    <div class="relative flex h-auto min-h-screen w-full flex-col">
      <MainTopBar />

      <transition name="fade-scale">
        <div
          v-if="showAuthRequiredPopup"
          class="fixed inset-0 z-[120] flex items-center justify-center px-4 py-6"
        >
          <button
            aria-label="Đóng thông báo đăng nhập"
            class="absolute inset-0 bg-black/45 backdrop-blur-sm"
            type="button"
            @click="closeAuthRequiredPopup"
          />

          <article
            class="relative w-full max-w-md rounded-2xl border border-[#e5e7eb] bg-white p-6 shadow-2xl  "
          >
            <h3 class="text-xl font-bold text-[#111418] ">
              Bạn cần đăng nhập để mua hàng
            </h3>
            <p
              class="mt-3 text-sm leading-6 text-[#4f5b69] "
            >
              Bạn phải có tài khoản để thêm sản phẩm vào giỏ và tiến hành thanh
              toán.
            </p>

            <div class="mt-6 flex flex-wrap gap-3">
              <button
                class="flex-1 rounded-lg border border-[#d1d5db] px-4 py-2.5 text-sm font-semibold text-[#111418] transition-colors hover:bg-[#f3f4f6]   :bg-[#283039]"
                type="button"
                @click="closeAuthRequiredPopup"
              >
                Hủy
              </button>
              <button
                class="flex-1 rounded-lg border border-primary px-4 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary/10"
                type="button"
                @click="goToRegisterFromPopup"
              >
                Đăng ký
              </button>
              <button
                class="flex-1 rounded-lg bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
                type="button"
                @click="goToLoginFromPopup"
              >
                Đăng nhập
              </button>
            </div>
          </article>
        </div>
      </transition>

      <transition name="fade-scale">
        <div
          v-if="showStockWarning"
          class="fixed inset-0 z-[120] flex items-center justify-center px-4 py-6"
        >
          <button
            aria-label="Đóng thông báo tồn kho"
            class="absolute inset-0 bg-black/45 backdrop-blur-sm"
            type="button"
            @click="closeStockWarning"
          />

          <article
            class="relative w-full max-w-md rounded-2xl border border-[#fecaca] bg-white p-6 shadow-2xl  "
          >
            <h3 class="text-xl font-bold text-red-600 ">
              Không đủ hàng trong kho
            </h3>
            <p
              class="mt-3 text-sm leading-6 text-[#4f5b69] "
            >
              {{ stockWarningMessage }}
            </p>

            <div class="mt-6 flex justify-end">
              <button
                class="rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-600"
                type="button"
                @click="closeStockWarning"
              >
                Đóng
              </button>
            </div>
          </article>
        </div>
      </transition>

      <main class="layout-container flex h-full grow flex-col">
        <div class="px-4 md:px-10 lg:px-40 flex flex-1 justify-center py-5">
          <div
            class="layout-content-container flex flex-col max-w-[1200px] flex-1"
          >
            <div class="flex flex-wrap gap-2 p-4 mb-4">
              <router-link
                class="text-[#9cabba] text-sm font-medium leading-normal hover:underline"
                to="/"
              >Trang chủ</router-link>
              <span class="text-[#9cabba] text-sm font-medium leading-normal">/</span>
              <router-link
                class="text-[#9cabba] text-sm font-medium leading-normal hover:underline"
                to="/shop"
              >Cửa hàng</router-link>
              <template v-if="categoryName && categoryName !== 'San pham'">
                <span class="text-[#9cabba] text-sm font-medium leading-normal">/</span>
                <span
                  class="text-[#9cabba] text-sm font-medium leading-normal"
                >{{ categoryName }}</span>
              </template>
              <span class="text-[#9cabba] text-sm font-medium leading-normal">/</span>
              <span
                class="text-[#111418]  text-sm font-medium leading-normal"
              >{{ productName }}</span>
            </div>

            <div class="flex flex-col lg:flex-row gap-10 px-4 py-6">
              <div class="flex flex-col gap-4 flex-1 lg:max-w-[60%]">
                <div
                  class="w-full bg-slate-100  aspect-[4/3] rounded-xl border border-[#e5e7eb]  overflow-hidden"
                >
                  <img
                    :alt="productName"
                    class="w-full h-full object-cover object-center"
                    :src="mainImageUrl"
                    @error="handleImgError"
                  >
                </div>
                <div class="grid grid-cols-5 gap-3">
                  <button
                    v-for="(url, idx) in thumbnailUrls"
                    :key="`${idx}-${url}`"
                    class="cursor-pointer w-full bg-center bg-no-repeat aspect-square bg-cover rounded-lg hover:opacity-80 transition-opacity"
                    :class="
                      idx === activeImageIndex
                        ? 'border-2 border-primary'
                        : 'border border-[#e5e7eb]  opacity-70 hover:opacity-100'
                    "
                    data-alt="Product thumbnail"
                    :style="{ backgroundImage: `url('${url}')` }"
                    type="button"
                    @click="activeImageIndex = idx"
                  />
                </div>
              </div>

              <div class="flex flex-col gap-6 flex-1">
                <div class="flex flex-col gap-2">
                  <div class="flex items-center gap-2">
                    <span
                      class="px-2 py-1 rounded text-xs font-bold uppercase tracking-wider"
                      :class="
                        inStock
                          ? 'bg-green-500/20 text-green-600 '
                          : 'bg-red-500/20 text-red-600 '
                      "
                    >{{ inStock ? "Còn hàng" : "Hết hàng" }}</span>
                    <span
                      class="flex items-center text-yellow-500 gap-1 text-sm font-medium"
                    >
                      <span
                        class="material-symbols-outlined text-[18px] fill-current"
                      >star</span>
                      <template v-if="averageRating !== null">
                        {{ averageRating.toFixed(1) }} ({{ reviewCount }} đánh
                        giá)
                      </template>
                      <template v-else> Chưa có đánh giá </template>
                    </span>
                  </div>
                  <h1
                    class="text-[#111418]  tracking-tight text-3xl md:text-4xl font-black leading-tight"
                  >
                    {{ productName }}
                  </h1>
                  <p class="text-[#111418]  text-2xl font-bold">
                    {{ displayPrice }}
                  </p>
                  <p class="text-sm font-semibold text-slate-600 ">
                    Số lượng:
                    <span
                      :class="inStock ? 'text-green-600 ' : 'text-red-600 '"
                    >
                      {{ selectedStockQuantity === null ? 'Không rõ' : selectedStockQuantity }}
                    </span>
                  </p>
                  <p class="text-sm font-semibold text-slate-600 ">
                    Biến thể:
                    <span
                      :class="inStock ? 'text-green-600 ' : 'text-red-600 '"
                    >
                      {{ selectedVariantStatusLabel }}
                    </span>
                  </p>
                </div>

                <div class="flex flex-col gap-4">
                  <div class="grid grid-cols-2 gap-4">
                    <label class="flex flex-col flex-1 gap-2">
                      <p
                        class="text-[#111418]  text-sm font-bold"
                      >
                        Màu sắc
                      </p>
                      <div class="relative">
                        <select
                          v-model="selectedColorId"
                          class="appearance-none w-full cursor-pointer rounded-lg border border-[#d1d5db]  bg-[#f9fafb]  text-[#111418]  h-12 px-4 pr-10 text-base focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                        >
                          <option
                            v-if="colorOptions.length === 0"
                            disabled
                            value=""
                          >
                            Không có màu
                          </option>
                          <option
                            v-for="c in colorOptions"
                            :key="c.value"
                            :value="c.value"
                          >
                            {{ c.label }}
                          </option>
                        </select>
                        <div
                          class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#9cabba]"
                        >
                          <span class="material-symbols-outlined">expand_more</span>
                        </div>
                      </div>
                    </label>
                    <label class="flex flex-col flex-1 gap-2">
                      <p
                        class="text-[#111418]  text-sm font-bold"
                      >
                        Size (US)
                      </p>
                      <div class="relative">
                        <select
                          v-model="selectedSizeId"
                          class="appearance-none w-full cursor-pointer rounded-lg border border-[#d1d5db]  bg-[#f9fafb]  text-[#111418]  h-12 px-4 pr-10 text-base focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none"
                        >
                          <option
                            v-if="sizeOptions.length === 0"
                            disabled
                            value=""
                          >
                            Không có size
                          </option>
                          <option
                            v-for="s in sizeOptions"
                            :key="s.value"
                            :value="s.value"
                          >
                            {{ s.label }}
                          </option>
                        </select>
                        <div
                          class="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-[#9cabba]"
                        >
                          <span class="material-symbols-outlined">expand_more</span>
                        </div>
                      </div>
                    </label>
                  </div>
                  <router-link
                    class="text-primary text-sm font-medium hover:underline"
                    to="/size-guide"
                  >Bảng size</router-link>
                </div>

                <div class="flex flex-col sm:flex-row gap-3 mt-4">
                  <button
                    class="flex-1 flex items-center justify-center gap-2 rounded-lg h-12 px-5 bg-primary hover:bg-blue-600 text-white text-base font-bold transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    :disabled="!canAddToCart"
                    @click="handleAddToCart"
                  >
                    <span class="material-symbols-outlined">shopping_cart</span>
                    <span>Thêm vào giỏ</span>
                  </button>

                  <button
                    class="flex-1 flex items-center justify-center gap-2 rounded-lg h-12 px-5 bg-transparent border-2 border-[#d1d5db] text-[#111418] hover:border-primary hover:bg-primary/5 text-base font-bold transition-colors"
                    :class="
                      isCompared
                        ? 'border-primary text-primary '
                        : ''
                    "
                    type="button"
                    @click="handleCompare"
                  >
                    <span class="material-symbols-outlined">compare_arrows</span>
                    <span>{{ isCompared ? "Đã so sánh" : "So sánh" }}</span>
                  </button>
                </div>

                <div class="flex gap-6 mt-2">
                  <div
                    class="flex items-center gap-2 text-[#4f5b69] "
                  >
                    <span class="material-symbols-outlined text-[20px]">local_shipping</span>
                    <span class="text-sm">Miễn phí vận chuyển</span>
                  </div>
                  <div
                    class="flex items-center gap-2 text-[#4f5b69] "
                  >
                    <span class="material-symbols-outlined text-[20px]">sync</span>
                    <span class="text-sm">Đổi trả trong 30 ngày</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="px-4 py-10 mt-10 border-t border-[#e5e7eb] ">
              <h2 class="text-[#111418] text-2xl font-bold mb-6">
                Thông tin chi tiết sản phẩm
              </h2>
              <div class="prose max-w-none text-[#4f5b69]">
                <p class="whitespace-pre-line text-base leading-relaxed" v-html="productDescription" />
              </div>
            </div>

            <div
              class="px-4 py-10 border-t border-[#e5e7eb] "
            >
              <h2
                class="text-[#111418]  text-2xl font-bold mb-6"
              >
                Đánh giá sản phẩm
              </h2>
              <div class="grid md:grid-cols-[300px_1fr] gap-10">
                <div class="flex flex-col gap-4">
                  <div
                    class="flex flex-col p-6 rounded-xl bg-[#f0f2f5] "
                  >
                    <span
                      class="text-5xl font-black text-[#111418] "
                    >
                      {{
                        averageRating !== null ? averageRating.toFixed(1) : "--"
                      }}
                    </span>
                    <div class="flex text-yellow-500 my-2">
                      <span class="material-symbols-outlined fill-current">star</span>
                      <span class="material-symbols-outlined fill-current">star</span>
                      <span class="material-symbols-outlined fill-current">star</span>
                      <span class="material-symbols-outlined fill-current">star</span>
                      <span class="material-symbols-outlined fill-current">star_half</span>
                    </div>
                    <span class="text-[#4f5b69]  text-sm">
                      {{
                        reviewCount > 0
                          ? `Được tổng hợp từ ${reviewCount} đánh giá`
                          : "Chưa có đánh giá"
                      }}
                    </span>
                    <router-link
                      class="mt-6 w-full py-2 px-4 border border-[#d1d5db]  rounded-lg text-center text-[#111418]  font-medium hover:bg-gray-200 :bg-[#283039] transition-colors"
                      :to="
                        isLoggedIn ? `/product/${productId}/review` : '/login'
                      "
                    >
                      Viết đánh giá
                    </router-link>
                  </div>
                </div>
                <div class="flex flex-col gap-6">
                  <div
                    v-for="review in reviews"
                    :key="review.id"
                    class="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm  "
                  >
                    <div class="flex justify-between items-start">
                      <div>
                        <p
                          class="text-[#111418]  font-bold text-sm"
                        >
                          {{ getReviewAuthorName(review) }}
                        </p>
                        <div class="flex text-yellow-500 text-[14px] mt-1">
                          <span
                            v-for="n in 5"
                            :key="n"
                            class="material-symbols-outlined"
                            :class="
                              n <= review.rating
                                ? 'fill-current text-[16px]'
                                : 'text-[#d1d5db]  text-[16px]'
                            "
                          >star</span>
                        </div>
                      </div>
                      <span class="text-[#9cabba] text-xs">
                        {{ formatReviewDate(review.createdAt) }}
                      </span>
                    </div>
                    <p
                      v-if="review.title"
                      class="text-[#111418]  font-semibold text-sm"
                    >
                      {{ review.title }}
                    </p>
                    <p
                      class="text-[#4f5b69]  text-sm leading-relaxed"
                    >
                      {{ review.comment }}
                    </p>
                  </div>
                  <div
                    v-if="reviews.length === 0"
                    class="text-sm text-[#4f5b69] "
                  >
                    Chưa có đánh giá nào cho sản phẩm này. Bạn có thể là người
                    đầu tiên viết đánh giá.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
  import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useCartStore } from '@/stores/cart'
  import { useCompareStore } from '@/stores/compare'
  import { useProductStore } from '@/stores/products'
  import { useReviewsStore } from '@/stores/reviews'
  import { getProductImageUrl } from '@/utils/productImages'
  import {
    resolveColorFromVariant,
    resolveSizeFromVariant,
  } from '@/utils/variantValues'

  const route = useRoute()
  const router = useRouter()
  const productStore = useProductStore()
  const cartStore = useCartStore()
  const reviewsStore = useReviewsStore()
  const compareStore = useCompareStore()

  const activeImageIndex = ref(0)
  const selectedColorId = ref('')
  const selectedSizeId = ref('')
  const isLoggedIn = ref(false)
  const showAuthRequiredPopup = ref(false)
  const showStockWarning = ref(false)
  const stockWarningMessage = ref('')
  const showUserMenu = ref(false)

  const productId = computed(() => Number.parseInt(route.params.id, 10))

  const productRef = ref(null)
  const product = computed(() => productRef.value)
  const isCompared = computed(
    () => Number.isFinite(productId.value) && compareStore.has(productId.value),
  )

  const variants = ref([])

  const productName = computed(() => product.value?.name || 'Sản phẩm')
  const productDescription = computed(
    () =>
      product.value?.description || 'Sản phẩm này hiện chưa có mô tả chi tiết.',
  )
  const categoryName = computed(
    () => product.value?.category?.name || 'Sản phẩm',
  )

  const reviews = computed(() => reviewsStore.getByProductId(productId.value))
  const reviewCount = computed(() => reviews.value.length)
  const averageRating = computed(() =>
    reviewsStore.getAverageRating(productId.value),
  )

  function getVariantColorId (variant) {
    return resolveColorFromVariant(variant).id
  }

  function getVariantSizeId (variant) {
    return resolveSizeFromVariant(variant).id
  }

  function getVariantNumericPrice (variant) {
    const parsed = Number(variant?.price)
    return Number.isFinite(parsed) && parsed >= 0 ? parsed : null
  }

  function normalizeVariantStatus (variant) {
    const rawStock = variant?.stockQuantity ?? variant?.stock_quantity
    const hasKnownStock = rawStock !== null && rawStock !== undefined && rawStock !== ''
    const stock = Number(rawStock)
    const raw = String(
      variant?.status || variant?.variantStatus || variant?.variant_status || '',
    )
      .trim()
      .toUpperCase()

    if (['HIDDEN', 'INACTIVE', 'DISCONTINUED', 'STOP_SELLING'].includes(raw)) {
      return 'HIDDEN'
    }
    if (['OUT_OF_STOCK', 'SOLD_OUT', 'OUTOFSTOCK'].includes(raw)) {
      return 'OUT_OF_STOCK'
    }
    return !hasKnownStock || (Number.isFinite(stock) && stock > 0)
      ? 'SELLING'
      : 'OUT_OF_STOCK'
  }

  function isVariantSellable (variant) {
    return normalizeVariantStatus(variant) === 'SELLING'
  }

  function getLowestPriceVariant (list) {
    if (!Array.isArray(list) || list.length === 0) return null

    let lowest = null
    let lowestPrice = null

    const visibleList = list.filter(variant => normalizeVariantStatus(variant) !== 'HIDDEN')
    const sellableList = visibleList.filter(isVariantSellable)
    const candidates = sellableList.length > 0 ? sellableList : visibleList

    for (const variant of candidates) {
      const price = getVariantNumericPrice(variant)
      if (price === null) continue
      if (lowestPrice === null || price < lowestPrice) {
        lowest = variant
        lowestPrice = price
      }
    }

    return lowest || candidates[0] || null
  }

  const colorOptions = computed(() => {
    const mapped = new Map()
    for (const variant of variants.value || []) {
      if (normalizeVariantStatus(variant) === 'HIDDEN') continue
      const colorMeta = resolveColorFromVariant(variant)
      const id = colorMeta.id
      if (id === null || mapped.has(id)) continue

      mapped.set(id, {
        value: String(id),
        label: colorMeta.name || `Màu ${id}`,
      })
    }

    return [...mapped.values()]
  })

  const sizeOptions = computed(() => {
    const colorId = selectedColorId.value
      ? Number.parseInt(selectedColorId.value, 10)
      : null

    const mapped = new Map()
    for (const variant of variants.value || []) {
      if (normalizeVariantStatus(variant) === 'HIDDEN') continue
      const variantColorId = getVariantColorId(variant)
      if (colorId !== null && variantColorId !== colorId) continue

      const sizeMeta = resolveSizeFromVariant(variant)
      const id = sizeMeta.id
      if (id === null || mapped.has(id)) continue

      mapped.set(id, {
        value: String(id),
        label: `${sizeMeta.name || `Size ${id}`}${isVariantSellable(variant) ? '' : ' - Hết hàng'}`,
      })
    }

    return [...mapped.values()]
  })

  const selectedVariant = computed(() => {
    if (!variants.value || variants.value.length === 0) return null
    const colorId = selectedColorId.value
      ? Number.parseInt(selectedColorId.value, 10)
      : null
    const sizeId = selectedSizeId.value
      ? Number.parseInt(selectedSizeId.value, 10)
      : null

    // Prefer exact match (color+size), then fallback to a product variant.
    return (
      variants.value.find(v => {
        const variantColorId = getVariantColorId(v)
        const variantSizeId = getVariantSizeId(v)
        const colorMatch = colorId === null || variantColorId === colorId
        const sizeMatch = sizeId === null || variantSizeId === sizeId
        return colorMatch && sizeMatch
      })
      || getLowestPriceVariant(variants.value)
      || null
    )
  })

  const inStock = computed(() => {
    const v = selectedVariant.value
    if (!v) return false
    const qty = Number(v.stockQuantity ?? v.stock_quantity ?? 0)
    return isVariantSellable(v) && (Number.isFinite(qty) ? qty > 0 : false)
  })

  const selectedStockQuantity = computed(() => {
    const qty = Number(
      selectedVariant.value?.stockQuantity ?? selectedVariant.value?.stock_quantity,
    )
    return Number.isFinite(qty) ? Math.max(0, qty) : null
  })

  const selectedVariantStatusLabel = computed(() => {
    const status = normalizeVariantStatus(selectedVariant.value)
    if (status === 'HIDDEN') return 'Ngừng bán'
    if (status === 'OUT_OF_STOCK') return 'Hết hàng'
    return 'Đang bán'
  })

  const displayPrice = computed(() => {
    const price = selectedVariant.value?.price ?? product.value?.price
    if (price === null || price === undefined) return 'Liên hệ'
    const n = Number(price)
    if (!Number.isFinite(n)) return String(price)
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(n)
  })

  const baseImageUrl = computed(() => {
    if (selectedVariant.value?.imageUrl) {
      return selectedVariant.value.imageUrl
    }
    return getProductImageUrl({
      product: product.value,
      variants: variants.value,
      width: 800,
      height: 600,
    })
  })

  // 1. CẬP NHẬT LẠI DANH SÁCH ẢNH THUMBNAIL (ẢNH NHỎ)
  const thumbnailUrls = computed(() => {
    const urls = []

    // Thêm ảnh chính vào đầu tiên
    if (baseImageUrl.value) {
      urls.push(baseImageUrl.value)
    }

    // Thêm mảng ảnh phụ (extraImages) từ Backend trả về
    if (
      selectedVariant.value
      && selectedVariant.value.extraImages
      && selectedVariant.value.extraImages.length > 0
    ) {
      urls.push(...selectedVariant.value.extraImages)
    }

    return [...new Set(urls)].slice(0, 5)
  })

  // 2. CẬP NHẬT ẢNH CHÍNH (THAY ĐỔI KHI BẤM VÀO ẢNH NHỎ)
  const mainImageUrl = computed(() => {
    if (thumbnailUrls.value.length > 0) {
      // Trả về ảnh dựa trên cái index người dùng đang bấm
      return (
        thumbnailUrls.value[activeImageIndex.value] || thumbnailUrls.value[0]
      )
    }
    return getProductImageUrl({
      product: product.value,
      variants: variants.value,
      width: 800,
      height: 600,
    })
  })

  // 3. THÊM ĐOẠN NÀY ĐỂ RESET LẠI ẢNH CHÍNH KHI ĐỔI MÀU Áo KHÁC
  watch(selectedVariant, () => {
    activeImageIndex.value = 0
  })

  watch(selectedColorId, () => {
    const options = sizeOptions.value
    if (options.length === 0) {
      selectedSizeId.value = ''
      return
    }

    const hasCurrentSize = options.some(opt => opt.value === selectedSizeId.value)
    if (!hasCurrentSize) {
      selectedSizeId.value = options[0].value
    }
  })

  const canAddToCart = computed(
    () => !!product.value && !!selectedVariant.value && inStock.value,
  )

  function getAccountIdFromUser (user) {
    const source = user && typeof user === 'object' ? user : null
    if (!source) {
      return null
    }

    const candidate
      = source.accountId !== undefined && source.accountId !== null
        ? source.accountId
        : (source.account_id !== undefined && source.account_id !== null
          ? source.account_id
          : source.id)

    const parsed = Number(candidate)
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null
  }

  async function load () {
    if (!Number.isFinite(productId.value)) {
      router.replace('/shop')
      return
    }

    // Ensure base lists exist (brand/category enrichment + variant lookups).
    // Fetch the specific product by id to ensure name/category are correct.
    productRef.value = await productStore.fetchProductById(productId.value)

    // Chặn truy cập sản phẩm đã ngừng bán qua URL trực tiếp
    if (!productRef.value) {
      router.replace('/shop')
      return
    }
    const productStatus = String(productRef.value?.status || '').toUpperCase()
    if (productStatus === 'HIDDEN' || productStatus === 'INACTIVE' || productStatus === 'DISCONTINUED') {
      router.replace('/shop')
      return
    }

    // Backfill lists if needed for other pages/components.
    if (productStore.products.length === 0) await productStore.fetchProducts()
    if (productStore.variants.length === 0) {
      await productStore.fetchVariants()
    }
    if (productStore.brands.length === 0) {
      await productStore.fetchBrands()
    }
    if (productStore.categories.length === 0) {
      await productStore.fetchCategories()
    }

    // Load variants for this product.
    try {
      variants.value = await productStore.fetchVariantsByProductId(
        productId.value,
      )
    } catch {
      variants.value = productStore.variants.filter(
        v => v.productId === productId.value,
      )
    }

    await reviewsStore.fetchAccounts()
    await reviewsStore.fetchReviews({ force: true })

    // Default selections based on the lowest-priced variant.
    const lowestVariant = getLowestPriceVariant(variants.value)
    if (lowestVariant) {
      const lowestColorId = getVariantColorId(lowestVariant)
      const lowestSizeId = getVariantSizeId(lowestVariant)
      if (lowestColorId !== null) selectedColorId.value = String(lowestColorId)
      if (lowestSizeId !== null) selectedSizeId.value = String(lowestSizeId)
    }
    activeImageIndex.value = 0
  }

  // Đồng bộ tồn kho real-time: cập nhật số kho hiện tại mà không thay đổi lựa chọn/ảnh
  async function refreshLiveStock () {
    if (document.hidden || !Number.isFinite(productId.value)) return
    try {
      const fresh = await productStore.fetchVariantsByProductId(productId.value)
      const stockMap = new Map(fresh.map(v => [Number(v.id), Number(v.stockQuantity ?? v.stock_quantity ?? 0)]))
      for (const v of variants.value) {
        const nextStock = stockMap.get(Number(v.id))
        if (nextStock !== undefined) v.stockQuantity = nextStock
      }
    } catch {
      // bỏ qua lỗi làm mới tồn kho
    }
  }

  let stockSyncTimer = null
  function startStockSync () {
    stockSyncTimer = setInterval(refreshLiveStock, 20_000)
    window.addEventListener('focus', refreshLiveStock)
    document.addEventListener('visibilitychange', refreshLiveStock)
  }

  function stopStockSync () {
    if (stockSyncTimer) clearInterval(stockSyncTimer)
    window.removeEventListener('focus', refreshLiveStock)
    document.removeEventListener('visibilitychange', refreshLiveStock)
  }

  async function handleAddToCart () {
    if (!canAddToCart.value) return

    if (!isLoggedIn.value) {
      showAuthRequiredPopup.value = true
      return
    }

    const added = await cartStore.addToCart(product.value, selectedVariant.value, 1)
    if (added === false) {
      // Show stock / failure warning immediately instead of redirecting
      const stockMsg = cartStore.error
      if (stockMsg && /hàng|kho|stock|tồn/i.test(stockMsg)) {
        stockWarningMessage.value = stockMsg
        showStockWarning.value = true
      } else {
        showAuthRequiredPopup.value = true
      }
      return
    }

    router.push('/cart')
  }

  function closeStockWarning () {
    showStockWarning.value = false
  }

  function handleCompare () {
    if (!Number.isFinite(productId.value)) return
    compareStore.toggle(productId.value)
  }

  function checkLoginStatus () {
    const user = localStorage.getItem('user')

    let parsedUser = null
    if (user) {
      try {
        parsedUser = JSON.parse(user)
      } catch {
        parsedUser = null
      }
    }

    const parsedAccountId = getAccountIdFromUser(parsedUser)
    isLoggedIn.value = parsedAccountId !== null

    if (parsedAccountId !== null) {
      cartStore.accountId = parsedAccountId
      return
    }

    cartStore.accountId = null
    showUserMenu.value = false
  }

  function closeAuthRequiredPopup () {
    showAuthRequiredPopup.value = false
  }

  function goToLoginFromPopup () {
    showAuthRequiredPopup.value = false
    router.push({
      name: 'login',
      query: {
        redirect: route.fullPath,
      },
    })
  }

  function goToRegisterFromPopup () {
    showAuthRequiredPopup.value = false
    router.push({
      name: 'register',
      query: {
        redirect: route.fullPath,
      },
    })
  }

  function toggleUserMenu (event) {
    event.stopPropagation()
    showUserMenu.value = !showUserMenu.value
  }

  function handleLogout () {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    isLoggedIn.value = false
    showUserMenu.value = false
    router.push('/')
  }

  function handleClickOutside (event) {
    const target = event.target
    if (!(target instanceof Element) || !target.closest('.account-menu')) {
      showUserMenu.value = false
    }
  }

  function handleImgError (e) {
    // Always fall back to a placeholder if the backend image is missing.
    e.target.src
      = 'https://via.placeholder.com/800x600?text='
        + encodeURIComponent(productName.value)
  }

  function formatReviewDate (iso) {
    if (!iso) return ''
    const d = new Date(iso)
    if (Number.isNaN(d.getTime())) return ''
    return d.toLocaleDateString('vi-VN')
  }

  function getReviewAuthorName (review) {
    return reviewsStore.getAuthorName(review)
  }

  onMounted(() => {
    checkLoginStatus()
    load()
    document.addEventListener('click', handleClickOutside)
    window.addEventListener('storage', checkLoginStatus)
    startStockSync()
  })

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
    window.removeEventListener('storage', checkLoginStatus)
    stopStockSync()
  })

  watch(
    () => route.fullPath,
    () => {
      checkLoginStatus()
      showUserMenu.value = false
    },
  )

  watch(
    () => route.params.id,
    () => {
      load()
    },
  )
</script>
