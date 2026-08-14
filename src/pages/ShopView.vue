<template>
  <div
    class="retail-shell min-h-screen flex flex-col overflow-x-hidden font-display"
  >
    <MainTopBar />

    <div class="layout-container flex h-full grow flex-col">
      <div
        class="flex flex-1 justify-center py-5 px-4 md:px-8 lg:px-12 xl:px-40"
      >
        <div
          class="layout-content-container flex flex-col max-w-[1280px] flex-1"
        >
          <div class="flex flex-wrap gap-2 px-4 py-2">
            <router-link
              class="text-slate-500 text-sm font-medium leading-normal hover:text-primary transition-colors"
              to="/"
            >Trang chủ</router-link>
            <span
              class="text-slate-500 text-sm font-medium leading-normal"
            >/</span>
            <router-link
              class="text-slate-500 text-sm font-medium leading-normal hover:text-primary transition-colors"
              to="/shop"
            >Cửa hàng</router-link>
            <span
              class="text-slate-500 text-sm font-medium leading-normal"
            >/</span>
            <span
              class="text-slate-900 text-sm font-medium leading-normal"
            >Tất cả áo</span>
          </div>

          <div
            class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 p-4"
          >
            <div class="flex flex-col gap-2">
              <h1
                class="text-slate-900 text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]"
              >
                Tất cả sản phẩm áo
              </h1>
              <p
                class="text-slate-500 text-base font-normal leading-normal"
              >
                Tìm đôi áo hợp chân trong bộ sưu tập đang có tại cửa hàng.
              </p>
            </div>
            <div class="flex items-center gap-2">
              <span
                class="text-sm font-medium text-slate-500"
              >Sắp xếp:</span>
              <select
                v-model="sortBy"
                class="bg-transparent border border-slate-300 text-slate-900 text-sm rounded-lg focus:ring-primary focus:border-primary block w-full p-2.5"
              >
                <option value="newest">Mới nhất</option>
                <option value="price-asc">Giá: thấp đến cao</option>
                <option value="price-desc">Giá: cao đến thấp</option>
                <option value="name">Tên A-Z</option>
              </select>
            </div>
          </div>

          <div class="flex flex-col lg:flex-row gap-6 p-4">
            <aside class="w-full lg:w-64 flex-shrink-0">
              <div
                class="flex flex-col gap-6 bg-white rounded-xl border border-slate-200 p-5 h-fit sticky top-24 shadow-sm hover:shadow-lg hover:border-primary/40 transition-all duration-300"
              >
                <div
                  class="flex items-center justify-between pb-4 border-b border-slate-200"
                >
                  <h3 class="text-lg font-bold text-slate-900">
                    Bộ lọc
                  </h3>
                  <button
                    class="text-primary text-sm font-medium hover:underline"
                    @click="clearAllFilters"
                  >
                    Xóa hết
                  </button>
                </div>
                <div class="flex flex-col gap-3">
                  <button
                    class="flex items-center justify-between w-full group"
                  >
                    <span class="font-medium text-slate-900">Danh mục</span>
                    <span
                      class="material-symbols-outlined text-slate-400 text-sm group-hover:text-primary"
                    >expand_less</span>
                  </button>
                  <div class="flex flex-col gap-2 pl-1">
                    <label v-for="category in filterCategories" :key="category.id" class="flex items-center gap-3 cursor-pointer">
                      <input
                        :checked="selectedCategories.includes(category.id)"
                        class="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary bg-slate-100"
                        type="checkbox"
                        @change="toggleCategoryFilter(category.id, $event.target.checked)"
                      >
                      <span class="text-slate-600 text-sm">
                        {{ normalizeFilterLabel(category.name) }}
                      </span>
                    </label>
                  </div>
                </div>
                <div
                  class="flex flex-col gap-3 border-t border-slate-200 pt-4"
                >
                  <button
                    class="flex items-center justify-between w-full group"
                  >
                    <span class="font-medium text-slate-900">Thương hiệu</span>
                    <span
                      class="material-symbols-outlined text-slate-400 text-sm group-hover:text-primary"
                    >expand_less</span>
                  </button>
                  <div class="flex flex-col gap-2 pl-1">
                    <label v-for="brand in filterBrands" :key="brand.id" class="flex items-center gap-3 cursor-pointer">
                      <input
                        :checked="selectedBrands.includes(brand.id)"
                        class="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary bg-slate-100"
                        type="checkbox"
                        @change="toggleBrandFilter(brand.id, $event.target.checked)"
                      >
                      <span class="text-slate-600 text-sm">
                        {{ normalizeFilterLabel(brand.name) }}
                      </span>
                    </label>
                  </div>
                </div>
              </div>
            </aside>

            <main class="flex-1 flex flex-col gap-6">
              <div class="flex gap-3 flex-wrap items-center">
                <span class="text-sm text-slate-500">Bộ lọc đang dùng:</span>
                <template v-for="categoryId in selectedCategories" :key="`cat-${categoryId}`">
                  <div
                    class="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-slate-200 pl-3 pr-2 transition-colors hover:bg-slate-300 cursor-pointer group"
                  >
                    <p
                      class="text-slate-900 text-xs font-medium leading-normal"
                    >
                      {{ getCategoryName(categoryId) }}
                    </p>
                    <span
                      class="material-symbols-outlined text-slate-500 group-hover:text-red-500 text-[16px] cursor-pointer"
                      @click="removeCategory(categoryId)"
                    >close</span>
                  </div>
                </template>
                <template v-for="brandId in selectedBrands" :key="`brand-${brandId}`">
                  <div
                    class="flex h-8 shrink-0 items-center justify-center gap-x-2 rounded-full bg-slate-200 pl-3 pr-2 transition-colors hover:bg-slate-300 cursor-pointer group"
                  >
                    <p
                      class="text-slate-900 text-xs font-medium leading-normal"
                    >
                      {{ getBrandName(brandId) }}
                    </p>
                    <span
                      class="material-symbols-outlined text-slate-500 group-hover:text-red-500 text-[16px] cursor-pointer"
                      @click="removeBrand(brandId)"
                    >close</span>
                  </div>
                </template>
                <button
                  v-if="selectedCategories.length > 0 || selectedBrands.length > 0"
                  class="text-xs text-primary font-medium hover:underline ml-auto"
                  @click="clearAllFilters"
                >
                  Bỏ bộ lọc
                </button>
              </div>

              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <div
                  v-for="product in paginatedProducts"
                  :key="product.id"
                  class="group flex flex-col bg-white rounded-xl overflow-hidden border border-slate-200 transition-all duration-300 shadow-sm hover:shadow-lg hover:border-primary/40 transition-all duration-300"
                  :class="isProductOutOfStock(product) ? 'opacity-80 grayscale' : 'hover:border-primary/50 hover:shadow-lg hover:shadow-primary/10'"
                >
                  <div
                    class="relative aspect-[4/3] bg-slate-100 overflow-hidden"
                  >
                    <div
                      class="absolute top-3 right-3 z-10 flex flex-col gap-2"
                    >
                      <button
                        class="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-red-500 transition-colors"
                        :class="favoritesStore.isFavorite(product.id) ? 'bg-white text-red-500' : ''"
                        :title="favoritesStore.isFavorite(product.id) ? 'Bỏ khỏi yêu thích' : 'Thêm vào yêu thích'"
                        type="button"
                        @click.stop="favoritesStore.toggle(product.id)"
                      >
                        <span class="material-symbols-outlined text-[20px]">favorite</span>
                      </button>
                      <button
                        class="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm text-white hover:bg-white hover:text-primary transition-colors"
                        :class="compareStore.has(product.id) ? 'bg-white text-primary' : ''"
                        :title="compareStore.has(product.id) ? 'Đã thêm, mở bảng so sánh' : 'Thêm vào so sánh'"
                        type="button"
                        @click.stop="toggleCompare(product.id)"
                      >
                        <span class="material-symbols-outlined text-[20px]">compare_arrows</span>
                      </button>
                    </div>
                    <div class="absolute top-3 left-3 z-10 flex flex-col gap-1">
                      <span
                        class="bg-green-600/90 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider"
                      >{{ getSellingVariantCount(product) }} đang bán</span>
                      <span
                        v-if="getUnavailableVariantCount(product) > 0"
                        class="bg-red-600/90 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider"
                      >{{ getUnavailableVariantCount(product) }} hết/ngừng</span>
                    </div>
                    <router-link
                      :to="`/product/${product.id}`"
                      :class="isProductOutOfStock(product) ? 'pointer-events-none' : ''"
                    >
                      <img
                        :alt="product.name"
                        class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                        :class="isProductOutOfStock(product) ? 'blur-[1px] scale-105' : ''"
                        :src="getProductImage(product)"
                      >
                    </router-link>

                    <div
                      v-if="isProductOutOfStock(product)"
                      class="absolute inset-0 z-20 flex items-center justify-center bg-black/35 backdrop-blur-[1.5px]"
                    >
                      <span class="rounded-full bg-red-600/90 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white">
                        Tạm hết hàng
                      </span>
                    </div>
                  </div>
                  <div class="p-4 flex flex-col flex-1">
                    <p
                      class="text-sm font-medium text-slate-500"
                    >
                      {{ getBrandName(product.brandId) }}
                    </p>
                    <router-link
                      class="text-lg font-bold text-slate-900 mt-1 transition-colors line-clamp-2"
                      :class="isProductOutOfStock(product) ? 'pointer-events-none text-slate-500' : 'group-hover:text-primary'"
                      :to="`/product/${product.id}`"
                    >{{ product.name }}</router-link>
                    <div class="flex items-center gap-2 mt-2">
                      <div class="flex gap-0.5 text-yellow-500">
                        <span
                          class="material-symbols-outlined text-[16px] fill-current"
                        >star</span>
                        <span
                          class="material-symbols-outlined text-[16px] fill-current"
                        >star</span>
                        <span
                          class="material-symbols-outlined text-[16px] fill-current"
                        >star</span>
                        <span
                          class="material-symbols-outlined text-[16px] fill-current"
                        >star</span>
                        <span
                          class="material-symbols-outlined text-[16px] fill-current"
                        >star_half</span>
                      </div>
                      <span class="text-xs text-slate-500">(124)</span>
                    </div>
                    <div class="mt-auto pt-4 flex items-center justify-between">
                      <p
                        class="text-xl font-bold text-slate-900"
                      >
                        đ{{ getProductPrice(product) && getProductPrice(product) !== 'N/A' ? new Intl.NumberFormat('vi-VN').format(getProductPrice(product)) : 'N/A' }}
                      </p>
                    </div>
                    <p class="mt-2 text-sm font-medium text-slate-600">
                      Số lượng:
                      <span
                        :class="isProductOutOfStock(product) ? 'text-red-600' : 'text-green-600'"
                      >
                        {{ getProductStockDisplay(product) }}
                      </span>
                    </p>
                    <router-link
                      v-if="!isProductOutOfStock(product)"
                      class="mt-4 w-full bg-primary hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                      :to="`/product/${product.id}`"
                    >
                      <span class="material-symbols-outlined text-[20px]">shopping_cart</span>
                      Xem chi tiết
                    </router-link>
                    <button
                      v-else
                      type="button"
                      disabled
                      class="mt-4 w-full cursor-not-allowed rounded-lg bg-slate-300 py-2 px-4 font-medium text-slate-600"
                    >
                      Đã hết hàng
                    </button>
                  </div>
                </div>

                <div v-if="paginatedProducts.length === 0" class="col-span-full py-12 text-center">
                  <p class="text-slate-500 text-lg">Không tìm thấy sản phẩm phù hợp với bộ lọc hiện tại.</p>
                </div>
              </div>

              <div class="flex justify-center mt-8">
                <nav class="flex items-center gap-1">
                  <button
                    class="flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 disabled:opacity-50"
                    :disabled="currentPage === 1"
                    @click="previousPage"
                  >
                    <span class="material-symbols-outlined">chevron_left</span>
                  </button>
                  <template v-for="page in visiblePages" :key="page">
                    <button
                      v-if="page === '...'"
                      class="px-2 text-slate-500"
                      disabled
                    >
                      ...
                    </button>
                    <button
                      v-else
                      :class="[
                        'flex items-center justify-center w-10 h-10 rounded-lg font-medium',
                        page === currentPage
                          ? 'bg-primary text-white'
                          : 'border border-slate-200 bg-white text-slate-500 hover:bg-slate-100'
                      ]"
                      @click="goToPage(page)"
                    >
                      {{ page }}
                    </button>
                  </template>
                  <button
                    class="flex items-center justify-center w-10 h-10 rounded-lg border border-slate-200 bg-white text-slate-500 hover:bg-slate-100 disabled:opacity-50"
                    :disabled="currentPage === totalPages"
                    @click="nextPage"
                  >
                    <span class="material-symbols-outlined">chevron_right</span>
                  </button>
                </nav>
              </div>
            </main>
          </div>

          <footer
            class="mt-12 border-t border-slate-200 py-12 px-4"
          >
            <div class="max-w-3xl mx-auto">
              <div class="flex flex-col items-center gap-6 mb-8">
                <div class="flex items-center gap-3 text-slate-900">
                  <div class="size-8 flex items-center justify-center bg-primary text-white rounded-lg">
                    <span class="material-symbols-outlined text-xl">bolt</span>
                  </div>
                  <h2 class="text-xl font-bold">SportX</h2>
                </div>
                <p class="text-slate-500 text-sm text-center">
                  Đồng hành cùng bạn trong những buổi tập, buổi chạy và nhịp sống hằng ngày.
                </p>
              </div>
              <nav class="flex flex-wrap justify-center items-center gap-8">
                <router-link class="text-slate-600 hover:text-primary transition-colors font-medium" to="/shop">Xem tất cả</router-link>
                <router-link class="text-slate-600 hover:text-primary transition-colors font-medium" to="/size-guide">Bảng size</router-link>
                <router-link class="text-slate-600 hover:text-primary transition-colors font-medium" to="/about">Giới thiệu</router-link>
              </nav>
            </div>
            <div
              class="mt-8 pt-8 border-t border-slate-200 text-center text-slate-500 text-sm"
            >
              <p>© 2026 SportX. Mọi quyền được bảo lưu.</p>
            </div>
          </footer>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed, onMounted, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'
  import { useCompareStore } from '@/stores/compare'
  import { useFavoritesStore } from '@/stores/favorites'
  import { useProductStore } from '@/stores/products'
  import { getProductImageUrl } from '@/utils/productImages'

  const productStore = useProductStore()
  const favoritesStore = useFavoritesStore()
  const compareStore = useCompareStore()
  const router = useRouter()
  const route = useRoute()
  const currentUser = ref(null)

  onMounted(() => {
    const userData = localStorage.getItem('user')
    if (userData) {
      currentUser.value = JSON.parse(userData)
    }
  })

  // Pagination constants
  const PRODUCTS_PER_PAGE = 9

  // Filter and sort state
  const selectedCategories = ref([])
  const selectedBrands = ref([])
  const searchQuery = ref('')
  const sortBy = ref('newest')
  const currentPage = ref(1)

  function normalizeQueryIds (value) {
    const values = Array.isArray(value) ? value : value !== undefined ? [value] : []
    return [...new Set(values.map(item => Number(item)).filter(Number.isFinite))]
  }

  function areIdListsEqual (left, right) {
    if (left.length !== right.length) return false
    return left.every((item, index) => item === right[index])
  }

  function syncRouteQueryFilters (categories = selectedCategories.value, brands = selectedBrands.value) {
    const normalizedCategories = [...new Set(categories.map(Number).filter(Number.isFinite))]
    const normalizedBrands = [...new Set(brands.map(Number).filter(Number.isFinite))]
    const currentCategoryIds = normalizeQueryIds(route.query.categoryId)
    const currentBrandIds = normalizeQueryIds(route.query.brandId)

    if (areIdListsEqual(currentCategoryIds, normalizedCategories) && areIdListsEqual(currentBrandIds, normalizedBrands)) {
      return
    }

    const nextQuery = { ...route.query }

    if (normalizedCategories.length > 0) {
      nextQuery.categoryId = normalizedCategories.map(String)
    } else {
      delete nextQuery.categoryId
    }

    if (normalizedBrands.length > 0) {
      nextQuery.brandId = normalizedBrands.map(String)
    } else {
      delete nextQuery.brandId
    }

    router.replace({ query: nextQuery })
  }

  function applyRouteFilters () {
    const categoryIds = normalizeQueryIds(route.query.categoryId)
    const brandIds = normalizeQueryIds(route.query.brandId)

    if (!areIdListsEqual(selectedCategories.value, categoryIds)) {
      selectedCategories.value = categoryIds
    }

    if (!areIdListsEqual(selectedBrands.value, brandIds)) {
      selectedBrands.value = brandIds
    }

    currentPage.value = 1
  }

  // Get products and filter them
  const allFilteredProducts = computed(() => {
    const filtered = productStore.products.filter(product => {
      const productVariants = getProductVariants(product)
      const hasVisibleVariant = productVariants.length === 0 ||
        productVariants.some(v => normalizeVariantStatus(v) !== 'HIDDEN')
      const isNotHidden = product.status !== 'HIDDEN' && hasVisibleVariant
      
      const matchCategory = selectedCategories.value.length === 0
        || selectedCategories.value.includes(product.categoryId)
      const matchBrand = selectedBrands.value.length === 0
        || selectedBrands.value.includes(product.brandId)
      const matchSearch = searchQuery.value === ''
        || product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
        || product.description?.toLowerCase().includes(searchQuery.value.toLowerCase())

      return isNotHidden && matchCategory && matchBrand && matchSearch
    })

    // Apply sorting
    switch (sortBy.value) {
      case 'price-asc': {
        filtered.sort((a, b) => {
          const priceA = getProductPrice(a) === 'N/A' ? Infinity : getProductPrice(a)
          const priceB = getProductPrice(b) === 'N/A' ? Infinity : getProductPrice(b)
          return priceA - priceB
        })
        break
      }
      case 'price-desc': {
        filtered.sort((a, b) => {
          const priceA = getProductPrice(a) === 'N/A' ? 0 : getProductPrice(a)
          const priceB = getProductPrice(b) === 'N/A' ? 0 : getProductPrice(b)
          return priceB - priceA
        })
        break
      }
      case 'name': {
        filtered.sort((a, b) => a.name.localeCompare(b.name))
        break
      }
      case 'newest':
      default: {
        // Sort by creation date or keep original order
        filtered.sort((a, b) => b.id - a.id)
      }
    }

    return filtered
  })

  // Calculate total pages
  const totalPages = computed(() => {
    return Math.ceil(allFilteredProducts.value.length / PRODUCTS_PER_PAGE) || 1
  })

  // Get paginated products
  const paginatedProducts = computed(() => {
    const startIndex = (currentPage.value - 1) * PRODUCTS_PER_PAGE
    const endIndex = startIndex + PRODUCTS_PER_PAGE
    return allFilteredProducts.value.slice(startIndex, endIndex)
  })

  // Calculate visible page numbers with ellipsis
  const visiblePages = computed(() => {
    const pages = []
    const maxPagesToShow = 5

    if (totalPages.value <= maxPagesToShow) {
      // Show all pages if total is less than max
      for (let i = 1; i <= totalPages.value; i++) {
        pages.push(i)
      }
    } else {
      // Show first page
      pages.push(1)

      // Calculate range around current page
      const startPage = Math.max(2, currentPage.value - 1)
      const endPage = Math.min(totalPages.value - 1, currentPage.value + 1)

      // Add ellipsis if needed
      if (startPage > 2) {
        pages.push('...')
      }

      // Add middle pages
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }

      // Add ellipsis if needed
      if (endPage < totalPages.value - 1) {
        pages.push('...')
      }

      // Show last page
      if (totalPages.value > 1) {
        pages.push(totalPages.value)
      }
    }

    return pages
  })

  // Pagination methods
  function goToPage (page) {
    if (typeof page === 'number' && page >= 1 && page <= totalPages.value) {
      currentPage.value = page
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  function previousPage () {
    if (currentPage.value > 1) {
      goToPage(currentPage.value - 1)
    }
  }

  function nextPage () {
    if (currentPage.value < totalPages.value) {
      goToPage(currentPage.value + 1)
    }
  }

  // Helper to get category name from ID
  function getCategoryName (categoryId) {
    const category = productStore.categories.find(c => c.id === categoryId)
    return normalizeFilterLabel(category?.name) || 'Danh mục khác'
  }

  // Helper to get brand name from ID
  function getBrandName (brandId) {
    const brand = productStore.brands.find(b => b.id === brandId)
    return normalizeFilterLabel(brand?.name) || 'Thương hiệu khác'
  }

  function normalizeFilterLabel (label) {
    if (!label) return ''
    return String(label).replace(/-updated$/i, '').trim()
  }

  function dedupeByNormalizedName (items) {
    const map = new Map()
    for (const item of items || []) {
      if (!item) continue
      const key = normalizeFilterLabel(item.name).toLowerCase()
      if (!key) continue

      const existing = map.get(key)
      // Prefer the non "-updated" entry if both exist.
      if (!existing) {
        map.set(key, item)
        continue
      }
      const existingIsUpdated = /-updated$/i.test(existing.name || '')
      const currentIsUpdated = /-updated$/i.test(item.name || '')
      if (existingIsUpdated && !currentIsUpdated) {
        map.set(key, item)
      }
    }
    return [...map.values()]
  }

  const filterCategories = computed(() => dedupeByNormalizedName(productStore.categories))
  const filterBrands = computed(() => dedupeByNormalizedName(productStore.brands))

  function getLowestVariantPrice (productId) {
    const normalizedProductId = Number(productId)
    if (!Number.isFinite(normalizedProductId)) return null

    const related = productStore.variants.filter(v => Number(v.productId) === normalizedProductId && isVariantSellable(v))
    let minPrice = null

    for (const variant of related) {
      const price = Number(variant?.price)
      if (!Number.isFinite(price) || price < 0) continue
      if (minPrice === null || price < minPrice) {
        minPrice = price
      }
    }

    return minPrice
  }

  // Helper to get product price (lowest variant price > product price > N/A)
  function getProductPrice (product) {
    const lowestVariantPrice = getLowestVariantPrice(product?.id)
    if (lowestVariantPrice !== null) {
      return lowestVariantPrice
    }

    // Fall back to product base price
    const basePrice = Number(product?.price)
    if (Number.isFinite(basePrice) && basePrice >= 0) {
      return basePrice
    }

    return 'N/A'
  }

  function getProductStock (product) {
    const productId = Number(product && product.id)
    if (!Number.isFinite(productId)) return null

    const related = productStore.variants.filter(v => Number(v.productId) === productId)
    if (related.length === 0) return null

    return related.reduce((sum, variant) => {
      if (!isVariantSellable(variant)) return sum
      const qty = Number(
        variant && (variant.stockQuantity ?? variant.stock_quantity ?? variant.quantity ?? 0),
      )
      return sum + (Number.isFinite(qty) ? qty : 0)
    }, 0)
  }

  function getProductStockDisplay (product) {
    const stock = getProductStock(product)
    if (stock === null) return 'Không rõ'
    return new Intl.NumberFormat('vi-VN').format(Math.max(0, stock))
  }

  function isProductOutOfStock (product) {
    const stock = getProductStock(product)
    return stock !== null && stock <= 0
  }

  function normalizeVariantStatus (variant) {
    const rawStock = variant && (variant.stockQuantity ?? variant.stock_quantity ?? variant.quantity)
    const hasKnownStock = rawStock !== null && rawStock !== undefined && rawStock !== ''
    const stock = Number(rawStock)
    const raw = String((variant && (variant.status || variant.variantStatus || variant.variant_status)) || '').trim().toUpperCase()

    if (['HIDDEN', 'INACTIVE', 'DISCONTINUED', 'STOP_SELLING'].includes(raw)) return 'HIDDEN'
    if (['OUT_OF_STOCK', 'SOLD_OUT', 'OUTOFSTOCK'].includes(raw)) return 'OUT_OF_STOCK'
    return !hasKnownStock || (Number.isFinite(stock) && stock > 0) ? 'SELLING' : 'OUT_OF_STOCK'
  }

  function isVariantSellable (variant) {
    return normalizeVariantStatus(variant) === 'SELLING'
  }

  function getProductVariants (product) {
    const productId = Number(product && product.id)
    if (!Number.isFinite(productId)) return []
    return productStore.variants.filter(v => Number(v.productId) === productId)
  }

  function getSellingVariantCount (product) {
    return getProductVariants(product).filter(isVariantSellable).length
  }

  function getUnavailableVariantCount (product) {
    return getProductVariants(product).filter(v => normalizeVariantStatus(v) !== 'SELLING').length
  }

  // Helper to get product image
  function getProductImage (product) {
    return getProductImageUrl({
      product,
      variants: productStore.variants,
      width: 400,
      height: 300,
    })
  }

  function toggleCategoryFilter (categoryId, isChecked) {
    const normalizedId = Number(categoryId)
    if (!Number.isFinite(normalizedId)) return

    selectedCategories.value = isChecked
      ? [...new Set([...selectedCategories.value, normalizedId])]
      : selectedCategories.value.filter(id => id !== normalizedId)
    currentPage.value = 1
    syncRouteQueryFilters(selectedCategories.value, selectedBrands.value)
  }

  function toggleBrandFilter (brandId, isChecked) {
    const normalizedId = Number(brandId)
    if (!Number.isFinite(normalizedId)) return

    selectedBrands.value = isChecked
      ? [...new Set([...selectedBrands.value, normalizedId])]
      : selectedBrands.value.filter(id => id !== normalizedId)
    currentPage.value = 1
    syncRouteQueryFilters(selectedCategories.value, selectedBrands.value)
  }

  // Filter removal functions
  function removeCategory (categoryId) {
    selectedCategories.value = selectedCategories.value.filter(id => id !== categoryId)
    currentPage.value = 1 // Reset to first page
    syncRouteQueryFilters(selectedCategories.value, selectedBrands.value)
  }

  function removeBrand (brandId) {
    selectedBrands.value = selectedBrands.value.filter(id => id !== brandId)
    currentPage.value = 1 // Reset to first page
    syncRouteQueryFilters(selectedCategories.value, selectedBrands.value)
  }

  function clearAllFilters () {
    selectedCategories.value = []
    selectedBrands.value = []
    searchQuery.value = ''
    sortBy.value = 'newest'
    currentPage.value = 1 // Reset to first page
    syncRouteQueryFilters([], [])
  }

  // Initialize data on mount
  onMounted(() => {
    if (productStore.products.length === 0) {
      productStore.fetchProducts()
    }

    applyRouteFilters()
  })

  watch(
    () => [route.query.categoryId, route.query.brandId],
    () => {
      applyRouteFilters()
    },
  )

  function toggleCompare (productId) {
    compareStore.toggle(productId)
  }
</script>


