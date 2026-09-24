<template>
  <AdminShell>
    <template #header>
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p class="text-xs uppercase tracking-[0.18em] text-primary">
            Quản lý danh mục
          </p>
          <h2 class="mt-1 text-xl font-bold">Quản lý danh mục</h2>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <button
            class="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90"
            type="button"
            @click="openCreateModal"
          >
            <span class="material-symbols-outlined text-[18px]">add</span>
            Thêm danh mục
          </button>

          <button
            class="inline-flex items-center gap-1.5  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-1.5 text-sm font-medium hover:border-primary hover:text-primary "
            type="button"
            @click="fetchCategories"
          >
            <span class="material-symbols-outlined text-[18px]">refresh</span>
            Làm mới
          </button>
        </div>
      </div>
    </template>

    <div class="space-y-3">
      <section class="retail-card p-3">
        <label
          class="flex items-center gap-2  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-1.5 "
        >
          <span class="material-symbols-outlined text-[18px] text-slate-400">search</span>
          <input
            v-model="searchQuery"
            class="w-full bg-transparent text-sm outline-none"
            placeholder="Tìm theo tên danh mục, ID..."
            type="text"
          >
        </label>
      </section>

      <section class="retail-card p-3">
        <div
          v-if="error"
          class="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700   "
        >
          {{ error }}
        </div>

        <div
          v-if="hiddenCategories.length > 0"
          class="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-slate-700  "
        >
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p class="font-semibold">Danh mục ẩn tạm</p>
              <p class="text-xs text-slate-500 ">
                Những danh mục đã xóa mềm sẽ tạm ẩn khỏi danh sách được dùng.
                Bạn có thể khôi phục lại khi cần.
              </p>
            </div>

          </div>

        </div>

        <div
          v-if="loading"
          class="py-8 text-center text-sm text-slate-500 "
        >
          Đang tải danh sách danh mục...
        </div>

        <div
          v-else-if="filteredCategorys.length === 0"
          class="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 "
        >
          Không tìm thấy danh mục.
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full min-w-[680px] text-left text-xs">
            <thead>
              <tr
                class="border-b border-slate-200 text-slate-500 "
              >
                <th class="px-2 py-2 font-medium">STT</th>
                <th class="px-2 py-2 font-medium">Logo</th>
                <th class="px-2 py-2 font-medium">Tên danh mục</th>
                <th class="px-2 py-2 font-medium">Đường dẫn URL</th>
                <th class="px-2 py-2 text-right font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(category, index) in paginatedCategories"
                :key="category.id"
                class="border-b border-slate-100 last:border-none "
              >
                <td
                  class="px-2 py-2 font-semibold text-slate-500 "
                >
                  {{ (currentPage - 1) * pageSize + index + 1 }}
                </td>
                <td class="px-2 py-2">
                  <div
                    class="flex h-12 w-12 items-center justify-center overflow-hidden rounded-xl bg-slate-100 "
                  >
                    <img
                      v-if="category.imageUrl"
                      :alt="category.name"
                      class="h-full w-full object-cover"
                      :src="category.imageUrl"
                      @error="handleImageError"
                    >
                    <span
                      v-else
                      class="material-symbols-outlined text-2xl text-slate-400"
                    >
                      category_awareness
                    </span>
                  </div>
                </td>
                <td class="px-2 py-2 font-semibold">{{ category.name }}</td>
                <td class="px-2 py-2 text-slate-500 ">
                  {{ category.slugDisplay || "—" }}
                </td>
                <td class="px-2 py-2 text-right">
                  <div class="flex items-center justify-end gap-1">
                    <button
                      class="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-white"
                      title="Chỉnh sửa"
                      @click="openEditModal(category)"
                    >
                      <span
                        class="material-symbols-outlined text-[18px] text-slate-500"
                      >edit</span>
                    </button>

                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Phân trang -->
        <div
          v-if="filteredCategorys.length > 0"
          class="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-3 "
        >
          <p class="text-xs text-slate-500 ">
            Hiển thị {{ (currentPage - 1) * pageSize + 1 }} đến
            {{ Math.min(currentPage * pageSize, filteredCategorys.length) }} /
            {{ filteredCategorys.length }} danh mục
          </p>
          <div class="flex gap-1">
            <button
              class="rounded-lg border border-slate-200 px-2.5 py-1 text-xs transition-colors hover:bg-slate-50 disabled:opacity-50 dark:hover:bg-white"
              :disabled="currentPage === 1"
              @click="currentPage--"
            >
              Trước
            </button>
            <span class="px-3 py-1 text-xs">
              Trang {{ currentPage }} / {{ totalPages }}
            </span>
            <button
              class="rounded-lg border border-slate-200 px-2.5 py-1 text-xs transition-colors hover:bg-slate-50 disabled:opacity-50 dark:hover:bg-white"
              :disabled="currentPage === totalPages"
              @click="currentPage++"
            >
              Sau
            </button>
          </div>
        </div>
      </section>
    </div>

    <!-- Modal Thêm/Sửa -->
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
              editingCategoryId
                ? `Sửa danh mục #${editingCategoryId}`
                : "Thêm danh mục mới"
            }}
          </h3>

          <div class="grid gap-3">
            <div>
              <label class="mb-1 block text-xs font-medium text-slate-500">Tên danh mục *</label>
              <input
                v-model.trim="form.name"
                class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-1.5 text-sm "
                :class="{ 'border-red-500': errors.name }"
                placeholder="VD: Nike, Adidas, Puma..."
                type="text"
              >
              <p v-if="errors.name" class="mt-1 text-xs text-red-500">
                {{ errors.name }}
              </p>
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-500">Ảnh danh mục</label>
              <input
                ref="imageInput"
                accept="image/*"
                class="hidden"
                type="file"
                @change="handleImageUpload"
              >
              <button class="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-primary hover:text-primary " type="button" @click="$refs.imageInput?.click()">
                <span class="material-symbols-outlined text-[18px]">upload</span>
                Chọn ảnh từ máy tính
              </button>
            </div>

            <!-- Preview logo -->
            <div
              v-if="form.imageUrl"
              class="rounded-xl bg-slate-50 p-3 "
            >
              <label class="mb-2 block text-xs font-medium text-slate-500">Xem trước logo</label>
              <div class="flex items-center gap-3">
                <div
                  class="flex h-16 w-16 items-center justify-center overflow-hidden rounded-lg bg-white p-1 shadow-sm"
                >
                  <img
                    alt="Preview"
                    class="h-full w-full object-contain"
                    :src="form.imageUrl"
                    @error="previewError = true"
                  >
                </div>
                <span
                  v-if="previewError"
                  class="text-xs text-red-500"
                >Không thể tải ảnh</span>
              </div>
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
              @click="submitForm"
            >
              {{
                saving
                  ? "Đang lưu..."
                  : editingCategoryId
                    ? "Cập nhật"
                    : "Thêm mới"
              }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </AdminShell>
</template>

<script setup>
  import { computed, onMounted, ref, watch } from 'vue'
  import AdminShell from '@/components/admin/AdminShell.vue'
  import { adminApi, categoriesApi, resolveImageUrl } from '@/services/api'

  // State
  const categorys = ref([])
  const hiddenCategories = ref([])
  const loading = ref(false)
  const error = ref('')
  const searchQuery = ref('')
  const currentPage = ref(1)
  const pageSize = ref(10)

  // Modal state
  const showModal = ref(false)
  const editingCategoryId = ref(null)
  const saving = ref(false)
  const modalError = ref('')
  const previewError = ref(false)
  const categoryImageFile = ref(null)

  const visibleCategories = computed(() => {
    return categorys.value.filter(
      category =>
        !hiddenCategories.value.some(
          hidden => Number(category.id) === Number(hidden.id),
        ),
    )
  })

  // Form data
  const form = ref({
    name: '',
    slug: '',
    imageUrl: '',
  })

  const errors = ref({})

  // Computed
  const filteredCategorys = computed(() => {
    const keyword = searchQuery.value.trim().toLowerCase()
    if (!keyword) {
      return visibleCategories.value
    }

    return visibleCategories.value.filter(category => {
      const haystack = [category.name, category.slug, category.slugDisplay, category.id]
        .filter(item => item !== undefined && item !== null)
        .join(' ')
        .toLowerCase()

      return haystack.includes(keyword)
    })
  })

  const totalPages = computed(() =>
    Math.ceil(filteredCategorys.value.length / pageSize.value),
  )

  const paginatedCategories = computed(() => {
    const start = (currentPage.value - 1) * pageSize.value
    const end = start + pageSize.value
    return filteredCategorys.value.slice(start, end)
  })

  // Methods
  function handleImageUpload (event) {
    const file = event.target?.files?.[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      modalError.value = 'Vui lòng chọn tệp ảnh hợp lệ.'
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      modalError.value = 'Kích thước ảnh không được vượt quá 5MB.'
      return
    }

    modalError.value = ''
    categoryImageFile.value = file

    const reader = new FileReader()
    reader.addEventListener('load', e => {
      form.value.imageUrl = e.target?.result || ''
    })
    reader.readAsDataURL(file)
    event.target.value = ''
  }

  function resetForm () {
    form.value = {
      name: '',
      slug: '',
      imageUrl: '',
    }
    errors.value = {}
    previewError.value = false
    editingCategoryId.value = null
    modalError.value = ''
  }

  function openCreateModal () {
    resetForm()
    showModal.value = true
  }

  function openEditModal (category) {
    resetForm()
    editingCategoryId.value = category.id
    form.value = {
      name: category.name || '',
      slug: category.slugDisplay || '',
      imageUrl: category.imageUrl || '',
    }
    showModal.value = true
  }

  function closeModal () {
    showModal.value = false
    resetForm()
  }

  function validateForm () {
    errors.value = {}

    if (!form.value.name || form.value.name.trim() === '') {
      errors.value.name = 'Vui lòng nhập tên danh mục'
      return false
    }

    if (form.value.name.length > 100) {
      errors.value.name = 'Tên danh mục không được vượt quá 100 ký tự'
      return false
    }

    return true
  }

  function generateSlug (name) {
    if (!name) return ''
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036F]/g, '')
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  function pickCategorySlug (source) {
    const item = source && typeof source === 'object' ? source : {}
    return (
      item.slug
      ?? item.slugName
      ?? item.slug_name
      ?? item.seoSlug
      ?? item.seo_slug
      ?? ''
    )
  }

  function normalizeCategoryRecord (source) {
    const item = source && typeof source === 'object' ? source : {}
    const name = String(item.name || '').trim()
    const slugValue = String(pickCategorySlug(item) || '').trim()

    return {
      ...item,
      name,
      slugDisplay: slugValue || (name ? generateSlug(name) : ''),
      imageUrl:
        item.imageUrl || item.logo_url
          ? resolveImageUrl(item.imageUrl || item.logo_url)
          : null,
    }
  }

  // Watch name to auto-generate slug
  watch(
    () => form.value.name,
    (newName, oldName) => {
      if (!form.value.slug || form.value.slug === generateSlug(oldName || '')) {
        form.value.slug = generateSlug(newName)
      }
    },
  )

  async function submitForm () {
    if (!validateForm()) return

    saving.value = true
    modalError.value = ''

    try {
      let finalImageUrl = form.value.imageUrl
      if (categoryImageFile.value) {
        try {
          const uploadRes = await adminApi.uploadImage(categoryImageFile.value)
          if (uploadRes && uploadRes.imageUrl) {
            finalImageUrl = uploadRes.imageUrl
          }
        } catch {
          modalError.value = 'Lỗi khi upload ảnh. Vui lòng thử lại.'
          saving.value = false
          return
        }
      }
      const payload = {
        name: form.value.name.trim(),
        slug: form.value.slug?.trim() || generateSlug(form.value.name),
        imageUrl: finalImageUrl || null,
      }

      await (editingCategoryId.value ? categoriesApi.update(editingCategoryId.value, payload) : categoriesApi.create(payload))

      closeModal()
      await fetchCategories()
    } catch (error_) {
      console.error('Lỗi khi lưu danh mục:', error_)
      modalError.value
        = error_?.message
          || (editingCategoryId.value
            ? 'Không thể cập nhật danh mục'
            : 'Không thể thêm danh mục')
    } finally {
      saving.value = false
    }
  }

  async function fetchCategories () {
    loading.value = true
    error.value = ''

    try {
      const response = await categoriesApi.getAll()
      let categoryList = []

      if (Array.isArray(response)) {
        categoryList = response
      } else if (
        response
        && response.content
        && Array.isArray(response.content)
      ) {
        categoryList = response.content
      } else if (response && response.data && Array.isArray(response.data)) {
        categoryList = response.data
      }

      categorys.value = categoryList.map(normalizeCategoryRecord)
    } catch (error_) {
      console.error('Lỗi khi tải danh sách danh mục:', error_)
      error.value
        = 'Không thể tải danh sách danh mục. Vui lòng kiểm tra backend API.'
    } finally {
      loading.value = false
    }
  }

  function handleImageError (e) {
    previewError.value = true
    e.target.style.display = 'none'
  }

  async function restoreCategory (category) {
    try {
      await categoriesApi.restoreCategory(category.id)
      const restoredId = Number(category?.id)
      hiddenCategories.value = hiddenCategories.value.filter(
        hidden => Number(hidden.id) !== restoredId,
      )
      await fetchCategories()
    } catch {
      error.value = 'Không thể khôi phục danh mục.'
    }
  }

  async function restoreAllHiddenCategorys () {
    try {
      for (const category of hiddenCategories.value) {
        await categoriesApi.restoreCategory(category.id)
      }
      hiddenCategories.value = []
      await fetchCategories()
    } catch {
      error.value = 'Có lỗi xảy ra khi khôi phục.'
    }
  }

  // Watch search to reset page
  watch(searchQuery, () => {
    currentPage.value = 1
  })

  // Lifecycle
  onMounted(() => {
    fetchCategories()
  })
</script>

<style scoped>
.retail-card {
  background: white;
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.dark .retail-card {
  background: #1a1a1a;
  border-color: #2d2d2d;
}

.material-symbols-outlined {
  font-size: 20px;
}
</style>
