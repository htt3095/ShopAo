[Output too large (28KB). Full output saved to: c:\Users\Dell\AppData\Roaming\Code\copilot-terminal-output\copilot-terminal-output-2e858a0d-e4a1-4ddd-8a47-bf5e8d699081.txt]
[Use readFile or grep to examine the full output.]

<template>
  <AdminShell :wide="true">
    <template #header>
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p class="text-xs uppercase tracking-[0.18em] text-primary">
            Quản lý sản phẩm
          </p>
          <h2 class="mt-1 text-xl font-bold">Quản lý sản phẩm </h2>
        </div>

        <div class="flex flex-wrap items-center gap-2 lg:gap-3">
          <div class="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5">
            <span class="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">Product</span>
            <button
              class="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90"
              type="button"
              @click="openCreate"
            >
              <span class="material-symbols-outlined text-[18px]">add</span>
              Thêm sản phẩm
            </button>

            <button
              class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium hover:border-primary hover:text-primary"
              type="button"
              @click="loadProducts"
            >
              <span class="material-symbols-outlined text-[18px]">refresh</span>
              Làm mới SP
            </button>
          </div>

          <div class="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5">
            <span class="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">Inventory</span>
            <button
              class="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700"
              type="button"
              @click="openInventoryCreate"
            >
              <span class="material-symbols-outlined text-[18px]">add_box</span>
              Thêm biến thể
            </button>

            <button
              class="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-orange-600"
              type="button"
              @click="openInventoryBulkCreate"
            >
              <span class="material-symbols-outlined text-[18px]">library_add</span>
              Tạo hàng loạt
            </button>

            <button
              class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium hover:border-primary hover:text-primary"
              type="button"
              @click="refreshInventory"
            >
              <span class="material-symbols-outlined text-[18px]">sync</span>
              Làm mới BT
            </button>
          </div>
        </div>
      </div>
    </template>

    <section class="retail-card mb-4 w-full p-3">
      <div class="rounded-2xl border border-slate-200 bg-slate-50/80 p-2.5">
        <div class="mb-2 flex flex-wrap items-center justify-between gap-2">
          <div class="flex items-center gap-2">
            <span class="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">Search & Filter</span>
            <span class="rounded-md px-2 py-0.5 text-[11px] font-semibold" :class="filterScope === 'product' ? 'bg-primary/10 text-primary' : 'bg-emerald-100 text-emerald-700'">
              {{ filterScope === 'product' ? 'Product Mode' : 'Inventory Mode' }}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <button
              class="inline-flex h-8 items-center gap-1 rounded-full border border-slate-300 bg-white px-2.5 text-slate-600 hover:border-primary hover:text-primary"
              title="Chuyển bộ lọc"
              type="button"
              @click="toggleFilterScope"
            >
              <span class="material-symbols-outlined text-[16px]">swap_horiz</span>
              <span class="text-xs font-medium">Switch</span>
            </button>

            <button
              class="inline-flex h-8 items-center gap-1 rounded-full border border-slate-300 bg-white px-2.5 text-slate-600 hover:border-primary hover:text-primary"
              title="Xóa toàn bộ bộ lọc"
              type="button"
              @click="resetAllFilters"
            >
              <span class="material-symbols-outlined text-[16px]">filter_alt_off</span>
              <span class="text-xs font-medium">Reset all</span>
            </button>
          </div>
        </div>

        <div v-if="filterScope === 'product'" class="grid gap-2 xl:grid-cols-12">
          <label class="flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 xl:col-span-6">
            <span class="material-symbols-outlined text-[18px] text-slate-400">search</span>
            <input v-model="search" class="w-full bg-transparent text-sm outline-none" placeholder="Tìm theo tên, mã sản phẩm, thương hiệu" type="text">
          </label>

          <select v-model.number="filterBrandId" class="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm xl:col-span-3">
            <option :value="null">Tất cả thương hiệu</option>
            <option v-for="brand in brands" :key="brand.id" :value="Number(brand.id)">{{ brand.name }}</option>
          </select>

          <select v-model.number="filterCategoryId" class="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm xl:col-span-3">
            <option :value="null">Tất cả danh mục</option>
            <option v-for="category in categories" :key="category.id" :value="Number(category.id)">{{ category.name }}</option>
          </select>
        </div>

        <div v-else class="grid gap-2 xl:grid-cols-12">
          <label class="flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 xl:col-span-4">
            <span class="material-symbols-outlined text-[18px] text-slate-400">search</span>
            <input
              class="w-full bg-transparent text-sm outline-none"
              placeholder="Tìm theo ID, sản phẩm, màu, size"
              type="text"
              :value="inventoryFilterForm.keyword"
              @input="updateInventoryKeyword($event.target.value)"
            >
          </label>

          <select v-model.number="inventoryFilterForm.productId" class="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm xl:col-span-2" @change="updateInventoryFilter('productId', inventoryFilterForm.productId)">
            <option :value="null">Sản phẩm</option>
            <option v-for="product in inventoryOptionsProducts" :key="product.id" :value="Number(product.id)">{{ product.name }}</option>
          </select>

          <select v-model.number="inventoryFilterForm.colorId" class="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm xl:col-span-2" @change="updateInventoryFilter('colorId', inventoryFilterForm.colorId)">
            <option :value="null">Màu</option>
            <option v-for="color in inventoryOptionsColors" :key="color.id" :value="Number(color.id)">{{ color.name }}</option>
          </select>

          <select v-model.number="inventoryFilterForm.sizeId" class="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm xl:col-span-2" @change="updateInventoryFilter('sizeId', inventoryFilterForm.sizeId)">
            <option :value="null">Size</option>
            <option v-for="size in inventoryOptionsSizes" :key="size.id" :value="Number(size.id)">{{ size.name }}</option>
          </select>

          <select v-model="inventoryFilterForm.stockStatus" class="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm xl:col-span-2" @change="updateInventoryFilter('stockStatus', inventoryFilterForm.stockStatus)">
            <option :value="null">Trạng thái</option>
            <option value="selling">Đang bán</option>
            <option value="out_of_stock">Hết hàng</option>
            <option value="hidden">Ngừng bán</option>
            <option value="low_stock">Sắp hết</option>
            <option value="in_stock">Còn hàng</option>
          </select>
        </div>
      </div>
    </section>

    <div class="grid gap-4 xl:grid-cols-2 2xl:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)]">
      <section class="retail-card min-w-0 h-[calc(100vh-220px)] overflow-y-auto">
        <div class="sticky top-0 z-20 border-b border-slate-200 bg-white/95 p-3 backdrop-blur">
          <div class="mb-2 flex items-center justify-between gap-2">
            <h3 class="text-sm font-semibold text-slate-700">Danh sach san pham</h3>
            <span class="rounded-lg bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">{{ filteredProducts.length }} muc</span>
          </div>
        </div>

        <div class="p-3">
          <div v-if="error" class="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">{{ error }}</div>

          <div v-if="hiddenProducts.length > 0" class="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-slate-700">
            <div class="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p class="font-semibold">Sản phẩm ẩn tạm</p>
                <p class="text-xs text-slate-500">Những sản phẩm đã xóa mềm sẽ tạm ẩn khỏi danh sách. Bạn có thể khôi phục lại khi cần.</p>
              </div>
              <button class="rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-white hover:opacity-90" type="button" @click="restoreAllHiddenProducts">Khôi phục tất cả</button>
            </div>
            <div class="mt-3 space-y-2">
              <div v-for="product in hiddenProducts" :key="product.id" class="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
                <div class="text-sm"><span class="font-semibold">#{{ product.id }}</span><span class="ml-2">{{ product.name || 'Sản phẩm' }}</span></div>
                <div class="flex items-center gap-2">
                  <button class="rounded-xl bg-emerald-500 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-600" type="button" @click="restoreProduct(product)">Khôi phục</button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="loading" class="py-8 text-center text-sm text-slate-500">Đang tải danh sách sản phẩm...</div>

          <div v-else-if="filteredProducts.length === 0" class="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">Không tìm thấy sản phẩm.</div>

          <div v-else class="overflow-x-hidden">
            <table class="w-full table-fixed text-left text-sm">
              <colgroup>
                <col class="w-[8%]">
                <col class="w-[44%]">
                <col class="w-[22%]">
                <col class="w-[11%]">
                <col class="w-[15%]">
              </colgroup>
              <thead>
                <tr class="border-b border-slate-200 text-slate-500">
                  <th class="px-2 py-2 font-medium">STT</th>
                  <th class="px-2 py-2 font-medium">Sản phẩm</th>
                  <th class="px-2 py-2 font-medium">Danh mục</th>
                  <th class="px-2 py-2 text-right font-medium">Tồn</th>
                  <th class="px-2 py-2 text-right font-medium">Thao tác</th>
                </tr>
              </thead>
              <tbody>
                <tr
                  v-for="(product, index) in filteredProducts"
                  :key="product.id"
                  class="cursor-pointer border-b border-slate-100 last:border-none transition-colors"
                  :class="selectedProductId === product.id ? 'bg-primary/5' : 'hover:bg-slate-50'"
                  @click="selectProduct(product)"
                >
                  <td class="px-2 py-2 font-semibold text-slate-500">{{ index + 1 }}</td>
                  <td class="px-2 py-2 align-top">
                    <div class="flex items-center gap-2">
                      <div class="size-9 shrink-0 overflow-hidden rounded-md bg-slate-100">
                        <img v-if="product._imageUrl || product.imageUrl" alt="Product" class="h-full w-full object-cover" :src="product._imageUrl || product.imageUrl">
                      </div>
                      <div class="min-w-0">
                        <p class="truncate text-sm font-semibold" :title="product.name || 'Sản phẩm'">{{ product.name || 'Sản phẩm' }}</p>
                        <p class="truncate text-xs text-slate-500" :title="(product.productCode || ('ID: ' + product.id)) + ' · ' + brandName(product.brandId)">{{ product.productCode || ('ID: ' + product.id) }} · {{ brandName(product.brandId) }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-2 py-2 truncate" :title="categoryName(product.categoryId)">{{ categoryName(product.categoryId) }}</td>
                  <td class="px-2 py-2 text-right font-semibold">{{ getTotalStock(product.id) }}</td>
                  <td class="px-2 py-2 text-right" @click.stop>
                    <div class="flex items-center justify-end gap-1">
                      <button class="rounded-md p-1.5 hover:bg-slate-100" title="Chỉnh sửa" @click="openEdit(product)"><span class="material-symbols-outlined text-[18px] text-slate-500">edit</span></button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section class="retail-card relative min-w-0 h-[calc(100vh-220px)] overflow-y-auto p-3">
        <AdminInventoryView ref="inventoryPanelRef" :hide-filter-controls="true" :hide-header="true" />

        <!-- Overlay hướng dẫn khi chưa chọn sản phẩm nào ở bảng trái -->
        <div
          v-if="!selectedProductId"
          class="absolute inset-0 z-10 flex flex-col items-center justify-center gap-2 bg-white/95 p-6 text-center"
        >
          <span class="material-symbols-outlined text-[44px] text-slate-300">inventory_2</span>
          <p class="text-sm font-medium text-slate-500">Chưa chọn sản phẩm</p>
          <p class="text-xs text-slate-400">Nhấp vào một sản phẩm ở bảng bên trái để xem biến thể tương ứng.</p>
        </div>
      </section>

      <Teleport to="body">
        <div
          v-if="showModal"
          class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          @click.self="closeModal"
        >
          <div
            class="w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl "
          >
            <h3 class="mb-4 text-base font-bold">
              {{
                editingProductId
                  ? `Sửa sản phẩm #${editingProductId}`
                  : "Thêm sản phẩm mới"
              }}
            </h3>

            <div class="grid gap-3 md:grid-cols-2">
              <div class="md:col-span-2">
                <label class="mb-1 block text-xs font-medium text-slate-500">Tên sản phẩm *</label>
                <input
                  v-model.trim="form.name"
                  class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-1.5 text-sm "
                  placeholder="Nhập tên sản phẩm"
                  type="text"
                >
              </div>

              <div>
                <label class="mb-1 block text-xs font-medium text-slate-500">Mã sản phẩm</label>
                <input
                  v-model.trim="form.productCode"
                  class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-1.5 text-sm "
                  placeholder="VD: SNK-001"
                  type="text"
                  @input="isProductCodeManuallyEdited = true"
                >
              </div>

              <div>
                <label class="mb-1 block text-xs font-medium text-slate-500">Thương hiệu</label>
                <select
                  v-model.number="form.brandId"
                  class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-1.5 text-sm "
                >
                  <option :value="null">-- Chọn thương hiệu --</option>
                  <option
                    v-for="brand in brands"
                    :key="brand.id"
                    :value="Number(brand.id)"
                  >
                    {{ brand.name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="mb-1 block text-xs font-medium text-slate-500">Danh mục</label>
                <select
                  v-model.number="form.categoryId"
                  class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-1.5 text-sm "
                >
                  <option :value="null">-- Chọn danh mục --</option>
                  <option
                    v-for="category in categories"
                    :key="category.id"
                    :value="Number(category.id)"
                  >
                    {{ category.name }}
                  </option>
                </select>
              </div>

              <div class="md:col-span-2">
                <label class="mb-1 block text-xs font-medium text-slate-500">Mô tả chi tiết sản phẩm</label>
                <textarea
                  v-model="form.description"
                  class="w-full shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 text-sm rounded-xl border border-slate-200 outline-none focus:border-primary"
                  placeholder="Nhập thông tin chi tiết về chất liệu, kiểu dáng, tính năng, v.v. (Ví dụ: Áo thun thể thao nam mát lạnh, chất vải co giãn, thấm hút mồ hôi...)"
                  rows="10"
                />
              </div>

              <div class="md:col-span-2">
                <label class="mb-3 block text-xs font-medium text-slate-500">Ảnh sản phẩm</label>

                <!-- Image Preview -->
                <div v-if="form.imageUrl" class="mb-4 flex items-end gap-3">
                  <div
                    class="size-20 overflow-hidden rounded-lg border border-slate-200 "
                  >
                    <img
                      alt="Preview"
                      class="h-full w-full object-cover"
                      :src="form.imageUrl"
                    >
                  </div>
                  <button
                    class="rounded-lg bg-red-100 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-200  "
                    type="button"
                    @click="clearProductImage"
                  >
                    Xóa ảnh
                  </button>
                </div>

                <!-- Upload Status -->
                <div
                  v-if="productUploadStatus === 'uploading'"
                  class="mb-4 flex items-center gap-2 text-sm text-blue-600 "
                >
                  <span
                    class="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"
                  />
                  Đang tải lên...
                </div>
                <div
                  v-else-if="productUploadError"
                  class="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600   "
                >
                  {{ productUploadError }}
                </div>

                <!-- File Upload Input (Hidden) -->
                <input
                  ref="productImageInput"
                  accept="image/*"
                  class="hidden"
                  type="file"
                  @change="handleProductImageUpload"
                >

                <!-- Upload Button -->
                <button
                  class="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed "
                  :disabled="productUploadStatus === 'uploading'"
                  type="button"
                  @click="$refs.productImageInput?.click()"
                >
                  <span class="material-symbols-outlined text-[20px]">image</span>
                  Chọn ảnh từ máy tính
                </button>
              </div>
            </div>

            <p v-if="modalError" class="mt-3 text-xs text-red-500">
              {{ modalError }}
            </p>

            <div class="mt-4 flex justify-end gap-2">
              <button
                class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:border-slate-400 "
                type="button"
                @click="closeModal"
              >
                Hủy
              </button>

              <button
                class="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
                :disabled="saving"
                type="button"
                @click="saveProduct"
              >
                {{
                  saving
                    ? "Đang lưu..."
                    : editingProductId
                      ? "Cập nhật"
                      : "Thêm mới"
                }}
              </button>
            </div>
          </div>
        </div>
      </Teleport>

    </div>
  </AdminShell>
</template>

<script setup>
  import axios from 'axios'
  import { computed, onMounted, ref, watch } from 'vue'
  import AdminShell from '@/components/admin/AdminShell.vue'
  import AdminInventoryView from '@/pages/AdminInventoryView.vue'
  import { adminApi, brandsApi, categoriesApi, variantsApi } from '@/services/api'

  const isProductCodeManuallyEdited = ref(false)
  const autoGeneratedSessionId = ref('')

  function removeVietnameseTones (str) {
    if (!str) return ''; return str.normalize('NFD').replace(/[\u0300-\u036F]/g, '').replace(/đ/g, 'd').replace(/Đ/g, 'D')
  }

  function getInitials (str) {
    if (!str) return 'XX'
    const clean = removeVietnameseTones(str).toUpperCase().trim()
    const words = clean.split(/\s+/)
    if (words.length === 1) return words[0].slice(0, 3) || 'XX'
    return words.map(w => w[0]).join('')
  }

  const loading = ref(false)
  const error = ref('')
  const search = ref('')
  const filterBrandId = ref(null)
  const filterCategoryId = ref(null)
  const products = ref([])
  const brands = ref([])
  const categories = ref([])
  const hiddenProducts = ref([])
  const totalStockByProduct = ref(new Map())
  const inventoryPanelRef = ref(null)
  const selectedProductId = ref(null)
  const filterScope = ref('product')
  const inventoryFilterForm = ref({
    keyword: '',
    productId: null,
    colorId: null,
    sizeId: null,
    stockStatus: null,
  })

  const showModal = ref(false)
  const editingProductId = ref(null)
  const saving = ref(false)
  const modalError = ref('')
  const form = ref(emptyForm())

  watch([() => form.value.name, () => form.value.brandId], ([newName, newBrandId]) => {
    if (isProductCodeManuallyEdited.value) return
    if (!editingProductId.value && (newName || newBrandId)) {
      let bCode = 'XX'
      if (newBrandId) {
        const brand = brands.value.find(b => Number(b.id) === Number(newBrandId))
        if (brand) bCode = getInitials(brand.name).slice(0, 2)
      }
      const pCode = newName ? getInitials(newName) : 'XX'
      form.value.productCode = `${bCode}-${pCode}-${autoGeneratedSessionId.value}`
    }
  })

  const visibleProducts = computed(() => {
    return products.value.filter(
      product =>
        !hiddenProducts.value.some(
          hidden => Number(product.id) === Number(hidden.id),
        ),
    )
  })

  const productImageInput = ref(null)
  const productUploadStatus = ref('idle') // idle, uploading, success, error
  const productUploadError = ref('')
  const productImageFile = ref(null)

  const API_BASE_URL
    = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

  const brandMap = computed(() => {
    return brands.value.reduce((acc, item) => {
      const id = Number(item.id)
      if (Number.isFinite(id)) {
        acc[id] = item.name
      }
      return acc
    }, {})
  })

  const categoryMap = computed(() => {
    return categories.value.reduce((acc, item) => {
      const id = Number(item.id)
      if (Number.isFinite(id)) {
        acc[id] = item.name
      }
      return acc
    }, {})
  })

  const inventoryOptionsProducts = computed(() => {
    return inventoryPanelRef.value?.products || []
  })

  const inventoryOptionsColors = computed(() => {
    return inventoryPanelRef.value?.colors || []
  })

  const inventoryOptionsSizes = computed(() => {
    return inventoryPanelRef.value?.sizes || []
  })

  const filteredProducts = computed(() => {
    const keyword = search.value.trim().toLowerCase()
    const brandId = toNullableId(filterBrandId.value)
    const categoryId = toNullableId(filterCategoryId.value)

    return visibleProducts.value.filter(product => {
      if (brandId !== null && Number(product.brandId) !== brandId) {
        return false
      }

      if (categoryId !== null && Number(product.categoryId) !== categoryId) {
        return false
      }

      if (!keyword) {
        return true
      }

      const haystack = [
        product.name,
        product.productCode,
        brandName(product.brandId),
        categoryName(product.categoryId),
        product.id,
      ]
        .filter(item => item !== undefined && item !== null)
        .join(' ')
        .toLowerCase()

      return haystack.includes(keyword)
    })
  })

  function emptyForm () {
    autoGeneratedSessionId.value = Math.random().toString(36).slice(2, 5).toUpperCase(); isProductCodeManuallyEdited.value = false; return { name: '', productCode: '', brandId: null, categoryId: null, imageUrl: '', description: '' }
  }

  function toList (payload) {
    if (Array.isArray(payload)) {
      return payload
    }
    if (payload && typeof payload === 'object') {
      if (Array.isArray(payload.content)) return payload.content
      if (Array.isArray(payload.list)) return payload.list
      if (Array.isArray(payload.data)) return payload.data
    }
    return []
  }

  function toNullableId (value) {
    if (
      value === null
      || value === undefined
      || value === ''
      || value === 'null'
    ) {
      return null
    }
    const id = Number(value)
    return Number.isFinite(id) ? id : null
  }

  // Khi nhấp vào một sản phẩm ở bảng trái -> lọc bảng biến thể bên phải
  // chỉ hiển thị biến thể của sản phẩm đó.
  function selectProduct (product) {
    if (!product) return
    selectedProductId.value = product.id == null ? null : product.id
    inventoryPanelRef.value?.setExternalFilters?.({
      productId: selectedProductId.value,
    })
  }

  function brandName (brandId) {
    const id = Number(brandId)
    if (!Number.isFinite(id)) return '-'
    return brandMap.value[id] || `Brand #${id}`
  }

  function categoryName (categoryId) {
    const id = Number(categoryId)
    if (!Number.isFinite(id)) return '-'
    return categoryMap.value[id] || `Category #${id}`
  }

  function getTotalStock (productId) {
    const id = Number(productId)
    if (!Number.isFinite(id)) return 0
    return totalStockByProduct.value.get(id) || 0
  }

  function openCreate () {
    editingProductId.value = null
    form.value = emptyForm()
    modalError.value = ''
    showModal.value = true
  }

  function openEdit (product) {
    editingProductId.value = product.id
    form.value = {
      name: product.name || '',
      productCode: product.productCode || '',
      brandId: Number.isFinite(Number(product.brandId))
        ? Number(product.brandId)
        : null,
      categoryId: Number.isFinite(Number(product.categoryId))
        ? Number(product.categoryId)
        : null,
      imageUrl: product._imageUrl || product.imageUrl || '',
      description: product.description || '',
    }
    modalError.value = ''
    showModal.value = true
  }

  function closeModal () {
    showModal.value = false
  }

  function openInventoryCreate () {
    inventoryPanelRef.value?.openCreate?.()
  }

  function openInventoryBulkCreate () {
    inventoryPanelRef.value?.openBulkCreate?.()
  }

  function refreshInventory () {
    inventoryPanelRef.value?.loadInventory?.()
  }

  function resetInventoryPanelFilters () {
    inventoryFilterForm.value = {
      keyword: '',
      productId: null,
      colorId: null,
      sizeId: null,
      stockStatus: null,
    }
    selectedProductId.value = null
    inventoryPanelRef.value?.resetFilters?.()
  }

  function resetProductFilters () {
    search.value = ''
    filterBrandId.value = null
    filterCategoryId.value = null
  }

  function resetAllFilters () {
    resetProductFilters()
    resetInventoryPanelFilters()
  }

  function toggleFilterScope () {
    filterScope.value = filterScope.value === 'product' ? 'inventory' : 'product'
  }

  function syncInventoryFilters () {
    inventoryPanelRef.value?.setSearchKeyword?.(inventoryFilterForm.value.keyword)
    inventoryPanelRef.value?.setExternalFilters?.({
      productId: toNullableId(inventoryFilterForm.value.productId),
      colorId: toNullableId(inventoryFilterForm.value.colorId),
      sizeId: toNullableId(inventoryFilterForm.value.sizeId),
      stockStatus: inventoryFilterForm.value.stockStatus || null,
    })
  }

  function updateInventoryKeyword (value) {
    inventoryFilterForm.value.keyword = value ?? ''
    syncInventoryFilters()
  }

  function updateInventoryFilter (key, value) {
    inventoryFilterForm.value[key] = value
    syncInventoryFilters()
  }

  async function saveProduct () {
    const f = form.value
    modalError.value = ''

    if (!f.name) {
      modalError.value = 'Vui lòng nhập tên sản phẩm.'
      return
    }

    saving.value = true
    try {
      let imageUrl = f.imageUrl
      let productIdForUpload = editingProductId.value

      // If creating new product, create it first
      if (!editingProductId.value) {
        const payload = {
          name: f.name,
          productCode: f.productCode || null,
          brandId: Number.isFinite(Number(f.brandId)) ? Number(f.brandId) : null,
          categoryId: Number.isFinite(Number(f.categoryId))
            ? Number(f.categoryId)
            : null,
          description: f.description || null,
          imageUrl: null, // Don't set image URL yet
        }

        const createdProduct = await adminApi.createProduct(payload)
        productIdForUpload = createdProduct.id || createdProduct.data?.id
      }

      // Upload image if there's a file selected
      if (productImageFile.value && productIdForUpload) {
        try {
          imageUrl = await uploadProductImage(productIdForUpload)
        } catch (error_) {
          // Image upload failed, but if it's a new product, we already created it
          // For editing, we'll just warn the user
          console.warn('Image upload failed:', error_)
          modalError.value = 'Tải ảnh lên thất bại, nhưng sản phẩm đã được lưu.'
        }
      }

      // Update product with final image URL if editing or if we uploaded new image
      if (editingProductId.value || (imageUrl && imageUrl !== f.imageUrl)) {
        const updatePayload = {
          name: f.name,
          productCode: f.productCode || null,
          brandId: Number.isFinite(Number(f.brandId)) ? Number(f.brandId) : null,
          categoryId: Number.isFinite(Number(f.categoryId))
            ? Number(f.categoryId)
            : null,
          description: f.description || null,
          imageUrl: imageUrl || null,
        }

        await adminApi.updateProduct(
          editingProductId.value || productIdForUpload,
          updatePayload,
        )
      }

      closeModal()
      await loadProducts()
    } catch (error_) {
      modalError.value = error_?.message || 'Không thể lưu sản phẩm.'
    } finally {
      saving.value = false
    }
  }

  async function restoreProduct (product) {
    try {
      await adminApi.restoreProduct(product.id)
      const restoredId = Number(product?.id)
      hiddenProducts.value = hiddenProducts.value.filter(
        hidden => Number(hidden.id) !== restoredId,
      )
      await loadProducts()
    } catch {
      error.value = 'Không thể khôi phục sản phẩm.'
    }
  }

  async function restoreAllHiddenProducts () {
    try {
      for (const product of hiddenProducts.value) {
        await adminApi.restoreProduct(product.id)
      }
      hiddenProducts.value = []
      await loadProducts()
    } catch {
      error.value = 'Có lỗi xảy ra khi khôi phục.'
    }
  }

  async function loadProducts () {
    loading.value = true
    error.value = ''

    try {
      const [productList, brandList, categoryList, variantList] = await Promise.all([
        adminApi.getProducts({ page: 0, size: 300 }),
        brandsApi.getAll().catch(() => []),
        categoriesApi.getAll().catch(() => []),
        variantsApi.getAll(0, 1000).catch(() => []),
      ])

      const productsData = toList(productList)
      const variantsData = toList(variantList)

      // Build image and stock maps from variants
      const variantImageMap = new Map()
      const nextTotalStockByProduct = new Map()
      for (const v of variantsData) {
        const pid = Number(v.productId || v.product_id)
        const img = v.imageUrl || v.image_url || v.imgUrl
        if (pid && img && !variantImageMap.has(pid)) {
          variantImageMap.set(pid, img)
        }

        if (pid) {
          const stock = Number(v.stockQuantity ?? v.quantity ?? 0)
          const prev = nextTotalStockByProduct.get(pid) || 0
          nextTotalStockByProduct.set(pid, prev + (Number.isFinite(stock) ? stock : 0))
        }
      }

      products.value = productsData.map(p => ({
        ...p,
        _imageUrl: p.imageUrl || p.image_url || variantImageMap.get(Number(p.id)) || null,
      }))
      totalStockByProduct.value = nextTotalStockByProduct

      brands.value = toList(brandList)
      categories.value = toList(categoryList)
    } catch (error_) {
      console.error('Failed to load admin products:', error_)
      error.value = 'Không thể tải sản phẩm. Vui lòng kiểm tra backend API.'
    } finally {
      loading.value = false
    }
  }

  function clearProductImage () {
    form.value.imageUrl = ''
    productImageFile.value = null
    productUploadStatus.value = 'idle'
    productUploadError.value = ''
  }

  async function uploadProductImage (productId) {
    if (!productImageFile.value) {
      return form.value.imageUrl // Return existing preview/URL if no new file
    }

    try {
      productUploadStatus.value = 'uploading'
      productUploadError.value = ''

      const formData = new FormData()
      formData.append('file', productImageFile.value)

      const response = await axios.post(
        `${API_BASE_URL}/products/${productId}/upload-image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      )

      if (response.data && response.data.imageUrl) {
        form.value.imageUrl = response.data.imageUrl
        productUploadStatus.value = 'success'
        productImageFile.value = null
        return response.data.imageUrl
      } else {
        throw new Error('Máy chủ không trả về đường dẫn ảnh')
      }
    } catch (error_) {
      console.error('Error uploading product image:', error_)
      productUploadStatus.value = 'error'
      productUploadError.value
        = 'Tải ảnh lên thất bại: ' + (error_.response?.data?.error || error_.message)
      throw new Error(productUploadError.value)
    }
  }

  function handleProductImageUpload (event) {
    const file = event.target?.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      productUploadError.value = 'Vui lòng chọn tệp ảnh hợp lệ.'
      productUploadStatus.value = 'error'
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      productUploadError.value = 'Kích thước ảnh không được vượt quá 5MB.'
      productUploadStatus.value = 'error'
      return
    }

    productImageFile.value = file
    productUploadError.value = ''

    // Create preview
    const reader = new FileReader()
    reader.addEventListener('load', e => {
      form.value.imageUrl = e.target?.result || ''
    })
    reader.readAsDataURL(file)

    // Reset input
    event.target.value = ''
  }

  onMounted(loadProducts)
</script>
