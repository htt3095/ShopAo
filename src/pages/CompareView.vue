<template>
  <div class="compare-page bg-background-light text-slate-900 font-display antialiased selection:bg-primary selection:text-white">
    <div class="relative flex h-auto min-h-screen w-full flex-col overflow-x-hidden">

      <MainTopBar />

      <main class="flex-1 flex flex-col items-center py-10 px-4 md:px-10 lg:px-40">
        <div class="w-full max-w-[1200px] flex flex-col gap-8">
          <div class="flex flex-col gap-4 text-center md:text-left md:flex-row md:justify-between md:items-end">
            <div class="flex flex-col gap-2">
              <h1 class="text-slate-900 text-3xl md:text-4xl lg:text-5xl font-black leading-tight tracking-[-0.033em]">So sánh sản phẩm</h1>
              <p class="text-text-secondary text-base md:text-lg font-normal leading-normal max-w-2xl">Đặt các mẫu cạnh nhau để xem nhanh mô tả, thương hiệu, khoảng giá và các thông tin cơ bản trước khi quyết định.</p>
            </div>
            <router-link class="text-primary hover:text-primary/80 font-medium text-sm flex items-center gap-1 self-center md:self-end"to="/shop">
              <span class="material-symbols-outlined text-lg">arrow_back</span>
              Quay lại cửa hàng
            </router-link>
          </div>

          <div class="w-full overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm @container">
            <div class="overflow-x-auto">
              <table class="w-full min-w-[800px] border-collapse">
                <thead>
                  <tr class="bg-slate-50">
                    <th class="p-6 text-left w-1/4 min-w-[200px] border-b border-slate-200">
                      <span class="text-text-secondary text-sm font-bold uppercase tracking-wider">Tiêu chí</span>
                    </th>
                    <th
                      v-for="(p, idx) in comparedProducts"
                      :key="p.id"
                      class="p-6 text-left w-1/4 min-w-[240px] border-b border-l border-slate-200"
                      :class="idx === 1 ?'bg-orange-50/40':''"
                    >
                      <div class="flex flex-col gap-4">
                        <div class="aspect-[4/3] w-full overflow-hidden rounded-lg bg-slate-100 relative group">
                          <img :alt="p.name"class="h-full w-full object-cover object-center transition-transform duration-500 group-hover:scale-110":src="p.imageUrl ||'https://via.placeholder.com/400x300'">
                        </div>
                        <div class="flex items-start justify-between gap-3">
                          <div>
                            <h3 class="text-slate-800 text-lg font-bold">{{ p.name }}</h3>
                          </div>
                          <button
                            class="text-text-secondary hover:text-slate-800 transition-colors"
                            title="Bỏ khỏi bảng so sánh"
                            type="button"
                            @click="compareStore.remove(p.id)"
                          >
                            <span class="material-symbols-outlined">close</span>
                          </button>
                        </div>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody class="text-sm">
                  <tr class="hover:bg-surface-dark/50 transition-colors">
                    <td class="p-4 px-6 text-text-secondary font-medium border-b border-border-dark bg-surface-dark/20">Danh mục</td>
                    <td
                      v-for="(p, idx) in comparedProducts"
                      :key="`cat-${p.id}`"
                      class="p-4 px-6 text-slate-800 font-medium border-b border-border-dark border-l border-border-dark/50"
                      :class="idx === 1 ?'bg-surface-dark-highlight/5':''"
                    >
                      {{ p.category?.name ||'--' }}
                    </td>
                  </tr>
                  <tr class="hover:bg-surface-dark/50 transition-colors">
                    <td class="p-4 px-6 text-text-secondary font-medium border-b border-border-dark bg-surface-dark/20">Thương hiệu</td>
                    <td
                      v-for="(p, idx) in comparedProducts"
                      :key="`brand-${p.id}`"
                      class="p-4 px-6 text-slate-800 border-b border-border-dark border-l border-border-dark/50"
                      :class="idx === 1 ?'bg-surface-dark-highlight/5':''"
                    >
                      {{ p.brand?.name ||'--' }}
                    </td>
                  </tr>
                  <tr class="hover:bg-surface-dark/50 transition-colors">
                    <td class="p-4 px-6 text-text-secondary font-medium border-b border-border-dark bg-surface-dark/20">Giá</td>
                    <td
                      v-for="(p, idx) in comparedProducts"
                      :key="`price-${p.id}`"
                      class="p-4 px-6 text-slate-800 text-base font-bold border-b border-border-dark border-l border-border-dark/50"
                      :class="idx === 1 ?'bg-surface-dark-highlight/5':''"
                    >
                      {{ getDisplayPriceLabel(p) }}
                    </td>
                  </tr>
                  <tr class="hover:bg-surface-dark/50 transition-colors">
                    <td class="p-4 px-6 text-text-secondary font-medium border-b border-border-dark bg-surface-dark/20">Màu sắc</td>
                    <td
                      v-for="(p, idx) in comparedProducts"
                      :key="`color-${p.id}`"
                      class="p-4 px-6 border-b border-border-dark border-l border-border-dark/50"
                      :class="idx === 1 ?'bg-surface-dark-highlight/5':''"
                    >
                      <div v-if="getProductColors(p).length > 0"class="flex flex-wrap gap-2">
                        <div
                          v-for="color in getProductColors(p)"
                          :key="`color-token-${p.id}-${color.id ?? color.name}`"
                          class="compare-color-token inline-flex items-center gap-2 rounded-full border px-2 py-1"
                          :style="getColorTokenStyle(color)"
                          :title="color.name"
                        >
                          <span class="text-xs font-medium">{{ color.name }}</span>
                        </div>
                      </div>
                      <span v-else class="text-text-secondary">--</span>
                    </td>
                  </tr>
                  <tr class="hover:bg-surface-dark/50 transition-colors">
                    <td class="p-4 px-6 text-text-secondary font-medium border-b border-border-dark bg-surface-dark/20">Size có sẵn</td>
                    <td
                      v-for="(p, idx) in comparedProducts"
                      :key="`size-${p.id}`"
                      class="p-4 px-6 text-slate-800 border-b border-border-dark border-l border-border-dark/50"
                      :class="idx === 1 ?'bg-surface-dark-highlight/5':''"
                    >
                      <div v-if="getProductSizes(p).length > 0"class="flex flex-wrap gap-2">
                        <span
                          v-for="sizeName in getProductSizes(p)"
                          :key="`size-token-${p.id}-${sizeName}`"
                          class="compare-size-token inline-flex items-center rounded-md border px-2 py-1 text-xs"
                        >
                          {{ sizeName }}
                        </span>
                      </div>
                      <span v-else class="text-text-secondary">--</span>
                    </td>
                  </tr>
                  <tr class="hover:bg-surface-dark/50 transition-colors">
                    <td class="p-4 px-6 text-text-secondary font-medium border-b border-border-dark bg-surface-dark/20">Mô tả</td>
                    <td
                      v-for="(p, idx) in comparedProducts"
                      :key="`description-${p.id}`"
                      class="p-4 px-6 text-slate-800/80 border-b border-border-dark border-l border-border-dark/50 leading-relaxed"
                      :class="idx === 1 ?'bg-surface-dark-highlight/5':''"
                    >
                      {{ getProductDescription(p) }}
                    </td>
                  </tr>
                  <tr>
                    <td class="p-4 px-6 bg-surface-dark/20 border-t border-border-dark" />
                    <td
                      v-for="(p, idx) in comparedProducts"
                      :key="`cta-${p.id}`"
                      class="p-6 border-t border-border-dark border-l border-border-dark/50"
                      :class="idx === 1 ?'bg-surface-dark-highlight/5':''"
                    >
                      <router-link
                        class="w-full flex cursor-pointer items-center justify-center rounded-lg h-12 px-6 bg-primary hover:bg-primary/90 text-white text-sm font-bold tracking-[0.015em] transition-all transform active:scale-95 shadow-lg shadow-primary/20"
                        :to="`/product/${p.id}`"
                      >
                        Xem chi tiết
                      </router-link>
                    </td>
                  </tr>
                </tbody>
              </table>
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
  import { colorsApi } from '@/services/api'
  import { useCompareStore } from '@/stores/compare'
  import { useProductStore } from '@/stores/products'
  import {
    normalizeHexColor,
    resolveColorFromVariant,
    resolveSizeFromVariant,
    toVariantId,
  } from '@/utils/variantValues'

  const compareStore = useCompareStore()
  const productStore = useProductStore()
  const router = useRouter()
  const route = useRoute()
  const inventoryColors = ref([])
  const isLoggedIn = ref(false)
  const showUserMenu = ref(false)

  const comparedProducts = computed(() => {
    return compareStore.compareIds
      .map(id => productStore.getProductById(id))
      .filter(Boolean)
  })

  const inventoryColorsById = computed(() => {
    const map = new Map()
    for (const color of inventoryColors.value) {
      const id = toVariantId(color && color.id)
      if (id !== null) map.set(id, color)
    }
    return map
  })

  function getProductVariants (productId) {
    const id = toVariantId(productId)
    if (id === null) return []
    return productStore.variants.filter(v => toVariantId(v.productId) === id)
  }

  function getDisplayPrice (product) {
    const prices = getProductVariants(product?.id)
      .map(v => Number(v?.price))
      .filter(Number.isFinite)

    if (prices.length > 0) {
      return Math.min(...prices)
    }

    const fallback = Number(product?.price)
    return Number.isFinite(fallback) ? fallback : null
  }

  function getDisplayPriceLabel (product) {
    const prices = getProductVariants(product?.id)
      .map(v => Number(v?.price))
      .filter(Number.isFinite)

    if (prices.length === 0) {
      return formatMoney(getDisplayPrice(product))
    }

    const min = Math.min(...prices)
    const max = Math.max(...prices)
    if (min === max) {
      return formatMoney(min)
    }
    return `${formatMoney(min)} - ${formatMoney(max)}`
  }

  function formatMoney (value) {
    const n = Number(value)
    if (!Number.isFinite(n)) return '--'
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(n)
  }

  function getProductColors (product) {
    const deduped = new Map()

    for (const variant of getProductVariants(product?.id)) {
      const colorMeta = resolveColorFromVariant(variant)
      const inventoryColor = colorMeta.id === null ? null : inventoryColorsById.value.get(colorMeta.id)
      const variantColor = variant && variant.color ? variant.color : {}
      const name = (inventoryColor && inventoryColor.name) || variantColor.name || variant.colorName || variant.color_name || colorMeta.name
      if (!name) continue
      const hexCode = normalizeHexColor(
        (inventoryColor && (inventoryColor.hexCode || inventoryColor.hex_code || inventoryColor.hexCode1 || inventoryColor.hex || inventoryColor.value))
        || variantColor.hexCode
          || variantColor.hex_code
        || variant.colorHexCode
          || variant.color_hex_code,
      )

      const key = colorMeta.id === null ? `name-${name}` : `id-${colorMeta.id}`
      if (deduped.has(key)) continue

      deduped.set(key, {
        id: colorMeta.id,
        name,
        hexCode,
      })
    }

    return [...deduped.values()]
  }

  function getColorTokenStyle (color) {
    const hex = normalizeHexColor(color?.hexCode)
    if (!hex) return null

    const red = Number.parseInt(hex.slice(1, 3), 16)
    const green = Number.parseInt(hex.slice(3, 5), 16)
    const blue = Number.parseInt(hex.slice(5, 7), 16)
    const luminance = (red * 299 + green * 587 + blue * 114) / 1000
    return {
      backgroundColor: hex,
      borderColor: luminance > 235 ? '#94a3b8' : 'rgba(15, 23, 42, 0.38)',
      color: luminance > 165 ? '#1e293b' : '#ffffff',
    }
  }

  function normalizeInventoryList (response) {
    if (Array.isArray(response)) return response
    if (response && Array.isArray(response.content)) return response.content
    if (response && Array.isArray(response.list)) return response.list
    if (response && Array.isArray(response.data)) return response.data
    return []
  }

  function getProductSizes (product) {
    const deduped = new Map()

    for (const variant of getProductVariants(product?.id)) {
      const sizeMeta = resolveSizeFromVariant(variant)
      if (!sizeMeta.name) continue

      const key = sizeMeta.id === null ? `name-${sizeMeta.name}` : `id-${sizeMeta.id}`
      if (deduped.has(key)) continue
      deduped.set(key, sizeMeta.name)
    }

    return [...deduped.values()]
  }

  function getProductDescription (product) {
    const raw = product?.description
    if (!raw) return '--'
    const text = String(raw).trim()
    return text || '--'
  }

  function checkLoginStatus () {
    const user = localStorage.getItem('user')
    const token = localStorage.getItem('token')
    isLoggedIn.value = Boolean(user || token)
    if (!isLoggedIn.value) showUserMenu.value = false
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

  onMounted(async () => {
    checkLoginStatus()
    document.addEventListener('click', handleClickOutside)
    window.addEventListener('storage', checkLoginStatus)

    if (productStore.products.length === 0) await productStore.fetchProducts()
    if (productStore.variants.length === 0) await productStore.fetchVariants()
    if (productStore.brands.length === 0) await productStore.fetchBrands()
    if (productStore.categories.length === 0) await productStore.fetchCategories()
    try {
      inventoryColors.value = normalizeInventoryList(await colorsApi.getAll())
    } catch {
      inventoryColors.value = []
    }
  })

  onUnmounted(() => {
    document.removeEventListener('click', handleClickOutside)
    window.removeEventListener('storage', checkLoginStatus)
  })

  watch(() => route.fullPath, () => {
    checkLoginStatus()
    showUserMenu.value = false
  })
</script>

<style scoped>
.compare-page {
	background: #f8fafc;
}

.compare-page .bg-surface-dark,
.compare-page .bg-background-dark,
.compare-page .bg-surface-dark-highlight\/20,
.compare-page .bg-surface-dark-highlight\/5,
.compare-page .bg-surface-dark\/20 {
	background-color: #f8fafc;
}

.compare-page .border-border-dark,
.compare-page .border-l-border-dark\/50 {
	border-color: #e2e8f0;
}

.compare-page .hover\:bg-surface-dark\/50:hover {
	background-color: #fff7ed;
}

.compare-page .bg-surface-dark-highlight {
	background-color: #f1f5f9;
}

.compare-page .text-text-secondary {
	color: #64748b;
}

.compare-page .compare-size-token {
	border-color: #cbd5e1;
	background-color: #fff;
	color: #334155;
}

.compare-page .compare-color-token {
	min-height: 30px;
	box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.18);
}

.compare-page tbody td:first-child {
	color: #475569;
}

/* Custom scrollbar */
::-webkit-scrollbar {
 width: 8px;
 height: 8px;
}
::-webkit-scrollbar-track {
 background: #f1f5f9;
}
::-webkit-scrollbar-thumb {
 background: #cbd5e1;
 border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
 background: #94a3b8;
}
</style>
