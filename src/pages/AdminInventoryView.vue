<template>
  <div class="space-y-5">
    <section v-if="!props.hideHeader" class="retail-card p-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="text-xs uppercase tracking-[0.18em] text-primary">
            Quản lý sản phẩm
          </p>
          <h2 class="mt-1 text-2xl font-bold">Quản lý biến thể</h2>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <button
            class="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white hover:opacity-90"
            type="button"
            @click="openCreate"
          >
            <span class="material-symbols-outlined text-[18px]">add</span>
            Thêm biến thể
          </button>

          <button
            class="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600 dark:hover:bg-orange-700"
            type="button"
            @click="openBulkCreate"
          >
            <span class="material-symbols-outlined text-[18px]">library_add</span>
            Sinh biến thể hàng loạt
          </button>

          <button
            class="inline-flex items-center gap-2  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 text-sm font-medium hover:border-primary hover:text-primary "
            type="button"
            @click="resetFilters"
          >
            <span class="material-symbols-outlined text-[18px]">filter_alt_off</span>
            Xóa bộ lọc
          </button>

          <button
            class="inline-flex items-center gap-2  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 text-sm font-medium hover:border-primary hover:text-primary "
            type="button"
            @click="loadInventory"
          >
            <span class="material-symbols-outlined text-[18px]">refresh</span>
            Làm mới
          </button>
        </div>
      </div>
    </section>

    <div class="space-y-5">
      <!-- Search Bar -->
      <section v-if="!props.hideFilterControls" class="retail-card p-4">
        <div class="grid gap-3 md:grid-cols-[1fr_auto]">
          <label
            class="flex items-center gap-2  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 "
          >
            <span class="material-symbols-outlined text-[18px] text-slate-400">search</span>
            <input
              v-model="searchKeyword"
              class="w-full bg-transparent text-sm outline-none"
              placeholder="Tìm theo ID, sản phẩm, màu, size..."
              type="text"
              @input="handleSearch"
            >
          </label>

          <button
            class="inline-flex items-center justify-center gap-2  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-4 py-2 text-sm font-medium hover:border-primary hover:text-primary "
            type="button"
            @click="showFilters = !showFilters"
          >
            <span class="material-symbols-outlined text-[18px]">tune</span>
            {{ showFilters ? "Ẩn bộ lọc" : "Hiện bộ lọc" }}
          </button>
        </div>
      </section>

      <!-- Advanced Filters -->
      <section v-if="showFilters && !props.hideFilterControls" class="retail-card p-4">
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label class="mb-1 block text-xs font-medium text-slate-500">Sản phẩm</label>
            <select
              v-model="filters.productId"
              class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 text-sm "
              @change="applyFilters"
            >
              <option :value="null">Tất cả sản phẩm</option>
              <option
                v-for="product in products"
                :key="product.id"
                :value="product.id"
              >
                {{ product.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="mb-1 block text-xs font-medium text-slate-500">Màu sắc</label>
            <select
              v-model="filters.colorId"
              class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 text-sm "
              @change="applyFilters"
            >
              <option :value="null">Tất cả màu</option>
              <option v-for="color in colors" :key="color.id" :value="color.id">
                {{ color.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="mb-1 block text-xs font-medium text-slate-500">Size</label>
            <select
              v-model="filters.sizeId"
              class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 text-sm "
              @change="applyFilters"
            >
              <option :value="null">Tất cả size</option>
              <option v-for="size in sizes" :key="size.id" :value="size.id">
                {{ size.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="mb-1 block text-xs font-medium text-slate-500">Trạng thái biến thể</label>
            <select
              v-model="filters.stockStatus"
              class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 text-sm "
              @change="applyFilters"
            >
              <option :value="null">Tất cả</option>
              <option value="selling">Đang bán</option>
              <option value="out_of_stock">Hết hàng (0)</option>
              <option value="hidden">Ngừng bán</option>
              <option value="low_stock">Sắp hết (&lt; 10)</option>
              <option value="in_stock">Còn hàng (≥ 10)</option>
            </select>
          </div>

          <div>
            <label class="mb-1 block text-xs font-medium text-slate-500">Giá từ (VND)</label>
            <input
              v-model.number="filters.minPrice"
              class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 text-sm "
              min="0"
              placeholder="0"
              step="10000"
              type="number"
              @input="applyFilters"
            >
          </div>

          <div>
            <label class="mb-1 block text-xs font-medium text-slate-500">Giá đến (VND)</label>
            <input
              v-model.number="filters.maxPrice"
              class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 text-sm "
              min="0"
              placeholder="Không giới hạn"
              step="10000"
              type="number"
              @input="applyFilters"
            >
          </div>

          <div>
            <label class="mb-1 block text-xs font-medium text-slate-500">ID từ</label>
            <input
              v-model.number="filters.minId"
              class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 text-sm "
              min="1"
              placeholder="1"
              type="number"
              @input="applyFilters"
            >
          </div>

          <div>
            <label class="mb-1 block text-xs font-medium text-slate-500">ID đến</label>
            <input
              v-model.number="filters.maxId"
              class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 text-sm "
              min="1"
              placeholder="Không giới hạn"
              type="number"
              @input="applyFilters"
            >
          </div>
        </div>

        <div
          class="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-4 "
        >
          <div class="text-sm text-slate-500 ">
            <span class="font-semibold text-slate-700 ">{{
              filteredVariants.length
            }}</span>
            / {{ variants.length }} biến thể
          </div>
          <div class="flex gap-2">
            <button
              class="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 "
              type="button"
              @click="applyFilters"
            >
              Áp dụng
            </button>
            <button
              class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium hover:border-primary hover:text-primary "
              type="button"
              @click="resetFilters"
            >
              Đặt lại
            </button>
          </div>
        </div>
      </section>

      <!-- Modal: Cập nhật ảnh theo nhóm màu -->
      <Teleport to="body">
        <div v-if="showBulkImageModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <section class="retail-card p-5 w-full max-w-3xl flex flex-col max-h-[90vh] overflow-y-auto relative animate-[fadeIn_0.2s_ease-out]">
            <button class="absolute top-4 right-4 text-slate-400 hover:text-slate-800" @click="showBulkImageModal = false">
              <span class="material-symbols-outlined">close</span>
            </button>
            <div class="mb-4 flex items-center justify-between gap-2">
              <div>
                <h3 class="text-lg font-bold text-slate-800">Cập nhật ảnh theo nhóm màu</h3>
                <p class="text-xs text-slate-500 ">
                  1 bộ ảnh áp dụng cho toàn bộ biến thể cùng màu (khác size).
                </p>
                <p class="text-[11px] text-slate-500 ">
                  Luôn cố định 5 ảnh: Ảnh chính + 4 ảnh phụ. Upload mới sẽ ghi đè
                  đúng slot, không cộng dồn.
                </p>
              </div>
            </div>

            <p
              v-if="bulkImageNotice"
              class="mb-2 rounded-lg border border-amber-200 bg-amber-50 px-2.5 py-1.5 text-[11px] text-amber-700 /50 /20 "
            >
              {{ bulkImageNotice }}
            </p>

            <div class="grid gap-2 md:grid-cols-3">
              <div>
                <label class="mb-1 block text-xs font-medium text-slate-500">Sản phẩm</label>
                <select
                  v-model.number="bulkImageProductId"
                  class="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm "
                  @change="openBulkImageForGroup(bulkImageProductId, null)"
                >
                  <option :value="null">-- Chọn sản phẩm --</option>
                  <option v-for="p in products" :key="p.id" :value="Number(p.id)">
                    {{ p.name }}
                  </option>
                </select>
              </div>

              <div>
                <label class="mb-1 block text-xs font-medium text-slate-500">Màu</label>
                <select
                  v-model.number="bulkImageColorId"
                  class="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm "
                  :disabled="!bulkImageProductId"
                  @change="preloadBulkSlotsFromVariantDetails"
                >
                  <option :value="null">-- Chọn màu --</option>
                  <option
                    v-for="c in bulkColorOptions"
                    :key="c.id"
                    :value="Number(c.id)"
                  >
                    {{ c.name }}
                  </option>
                </select>
              </div>

              <div
                class="rounded-lg border border-slate-300 px-2.5 py-1.5 text-sm "
              >
                <div class="text-xs text-slate-500">Biến thể trong nhóm</div>
                <div class="mt-1 font-semibold">
                  {{ bulkTargetVariants.length }}
                </div>
              </div>
            </div>

            <div class="mt-2 grid grid-cols-5 gap-1.5">
              <div
                v-for="entry in imageSlotEntries"
                :key="`bulk-${entry.key}`"
                class="rounded-lg border border-slate-300 p-1.5 "
              >
                <div
                  class="mb-1 truncate text-[10px] font-semibold text-slate-600 "
                >
                  {{ entry.label }}
                </div>
                <div
                  class="mb-1.5 aspect-square overflow-hidden rounded-md bg-slate-100 "
                >
                  <img
                    v-if="slotSource(bulkImageSlots, entry.key)"
                    :alt="entry.label"
                    class="h-full w-full object-cover"
                    :src="slotSource(bulkImageSlots, entry.key)"
                  >
                  <div
                    v-else
                    class="flex h-full items-center justify-center text-[10px] text-slate-400"
                  >
                    Trống
                  </div>
                </div>
                <label
                  class="block cursor-pointer rounded-md border border-slate-300 px-1.5 py-1 text-center text-[10px] font-medium hover:border-primary hover:text-primary "
                >
                  Chọn ảnh thay slot
                  <input
                    accept="image/*"
                    class="hidden"
                    type="file"
                    @change="
                      handleImageUploadForSlots(bulkImageSlots, entry.key, $event)
                    "
                  >
                </label>
                <button
                  v-if="slotSource(bulkImageSlots, entry.key)"
                  class="mt-1 block w-full rounded-md border border-red-300 px-1.5 py-1 text-center text-[10px] font-medium text-red-600 hover:bg-red-50"
                  type="button"
                  @click="clearImageSlotForSlots(bulkImageSlots, entry.key)"
                >
                  Xóa ảnh
                </button>
              </div>
            </div>

            <div class="mt-2 flex flex-wrap items-center gap-2">
              <button
                class="inline-flex items-center gap-1.5 rounded-lg bg-primary px-2.5 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-60"
                :disabled="applyingBulkImages"
                type="button"
                @click="applyBulkImagesToColorGroup"
              >
                <span class="material-symbols-outlined text-[16px]">cloud_upload</span>
                {{
                  applyingBulkImages
                    ? "Đang áp dụng..."
                    : "Áp dụng cho toàn bộ nhóm màu"
                }}
              </button>
              <p
                v-if="bulkImageProductId && bulkImageColorId"
                class="text-[11px] text-slate-500 "
              >
                Đang đọc ảnh từ {{ bulkTargetVariants.length }} biến thể trong nhóm
                màu đã chọn.
              </p>
              <p v-if="bulkImageError" class="text-xs text-red-500">
                {{ bulkImageError }}
              </p>
              <p
                v-if="bulkImageSuccess"
                class="text-xs text-green-600 "
              >
                {{ bulkImageSuccess }}
              </p>
            </div>
          </section>
        </div>
      </Teleport>

      <!-- Statistics Cards -->
      <section class="retail-card p-5">
        <div class="mb-4 overflow-x-auto">
          <div class="flex min-w-max flex-nowrap gap-2 text-xs">
            <div class="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 whitespace-nowrap">
              <span class="text-slate-500">Tổng sản phẩm:</span>
              <span class="font-semibold text-slate-800">{{ totalProductsCount }}</span>
            </div>
            <div class="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 whitespace-nowrap">
              <span class="text-slate-500">Còn hàng:</span>
              <span class="font-semibold text-green-600">{{ inStockCount }}</span>
            </div>
            <div class="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 whitespace-nowrap">
              <span class="text-slate-500">Sắp hết:</span>
              <span class="font-semibold text-yellow-600">{{ lowStockCount }}</span>
            </div>
            <div class="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 whitespace-nowrap">
              <span class="text-slate-500">Hết hàng:</span>
              <span class="font-semibold text-red-600">{{ outOfStockCount }}</span>
            </div>
          </div>
        </div>

        <div
          v-if="error"
          class="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 /40 /20 "
        >
          {{ error }}
        </div>

        <div
          v-if="hiddenVariants.length > 0"
          class="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-3 py-3 text-sm text-slate-700 /20 "
        >
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p class="font-semibold">Biến thể ẩn tạm</p>
              <p class="text-xs text-slate-500 ">
                Những biến thể đã xóa mềm sẽ tạm ẩn khỏi danh sách được dùng.
                Bạn có thể khôi phục lại khi cần.
              </p>
            </div>
            <button
              class="rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-white hover:opacity-90"
              type="button"
              @click="restoreAllHiddenVariants"
            >
              Khôi phục tất cả
            </button>
          </div>
          <div class="mt-3 space-y-2">
            <div
              v-for="variant in hiddenVariants"
              :key="variant.id"
              class="flex flex-wrap items-center justify-between gap-2  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 "
            >
              <div class="text-sm">
                <span class="font-semibold">#{{ variant.id }}</span>
                <span class="ml-2">{{ variant.productName || "Sản phẩm" }} -
                  {{ variant.colorName || "" }}
                  {{ variant.sizeName || "" }}</span>
              </div>
              <div class="flex items-center gap-2">
                <button
                  class="rounded-xl bg-emerald-500 px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-emerald-600"
                  type="button"
                  @click="restoreVariant(variant)"
                >
                  Khôi phục
                </button>
                <button
                  class="rounded-xl bg-red-500 px-3 py-2 text-xs font-semibold text-white hover:bg-red-600"
                  type="button"
                  @click="hardDeleteVariant(variant)"
                >
                  Xóa hẳn
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="loading"
          class="py-10 text-center text-sm text-slate-500 "
        >
          Đang tải dữ liệu tồn kho...
        </div>

        <div
          v-else-if="filteredVariants.length === 0"
          class="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 "
        >
          Không có dữ liệu tồn kho phù hợp.
        </div>

        <div v-else class="space-y-3">
          <article
            v-for="group in groupedVariants"
            :key="group.productId"
            class="rounded-xl border-2 border-slate-300 bg-white/70 shadow-sm "
          >
            <button
              class="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-white"
              type="button"
              @click="toggleProductExpand(group.productId)"
            >
              <div class="min-w-0">
                <p class="truncate text-sm font-semibold">
                  {{ group.productName }}
                </p>
                <p class="text-xs text-slate-500 ">
                  {{ group.variants.length }} biến thể •
                  {{ group.colorCount }} màu • {{ group.sizeCount }} size • Tồn
                  kho {{ group.totalStock }}
                </p>
              </div>
              <div class="flex items-center gap-2">
                <div class="hidden items-center gap-1 md:flex">
                  <div class="flex items-center -space-x-2">
                    <div
                      v-for="(img, idx) in group.previewImages"
                      :key="`${group.productId}-preview-${idx}`"
                      class="size-8 overflow-hidden rounded-md border border-slate-300 bg-slate-100 ring-2 ring-white dark:ring-[#1a1512]"
                    >
                      <img
                        alt="preview"
                        class="h-full w-full object-cover"
                        :src="img"
                      >
                    </div>
                  </div>
                  <span class="text-[11px] text-slate-500 ">+{{ group.previewCount }}</span>
                </div>
                <button
                  class="rounded-lg border border-slate-300 px-2 py-1 text-xs font-medium hover:border-primary hover:text-primary "
                  type="button"
                  @click.stop="openBulkImageForGroup(group.productId)"
                >
                  Sửa ảnh theo màu
                </button>
                <span
                  class="material-symbols-outlined text-[18px] text-slate-500"
                >
                  {{
                    isExpandedProduct(group.productId)
                      ? "expand_less"
                      : "expand_more"
                  }}
                </span>
              </div>
            </button>

            <div
              v-if="isExpandedProduct(group.productId)"
              class="border-t-2 border-slate-300 px-3 py-2 "
            >
              <div class="grid gap-2">
                <div
                  v-for="v in group.variants"
                  :key="v.id"
                  class="grid grid-cols-[1fr_auto] items-center gap-2 rounded-lg border-2 border-slate-200 bg-slate-50/80 px-2 py-2 text-xs cursor-pointer hover:border-primary/50 transition-colors"
                  @click="setBulkColorFromVariant(v)"
                >
                  <div class="min-w-0">
                    <p class="font-semibold">
                      #{{ v.id }} • {{ v.colorName || "N/A" }} /
                      {{ v.sizeName || "N/A" }}
                    </p>
                    <p class="mt-1 text-slate-500 ">
                      {{ formatCurrency(v.price) }} • Tồn:
                      {{ v.stockQuantity ?? 0 }} • Ảnh:
                      {{ v.imageUrl ? 1 : 0 }} +
                      {{
                        Array.isArray(v.extraImages) ? v.extraImages.length : 0
                      }}
                    </p>
                    <span
                      class="mt-1 inline-flex rounded-full px-2 py-0.5 text-[11px] font-semibold"
                      :class="variantStatusClass(v.status, v.stockQuantity)"
                    >
                      {{ variantStatusLabel(v.status, v.stockQuantity) }}
                    </span>
                  </div>
                  <div class="flex items-center gap-1">
                    <button
                      class="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-white"
                      title="Chỉnh sửa"
                      @click.stop="openEdit(v)"
                    >
                      <span
                        class="material-symbols-outlined text-[18px] text-slate-500"
                      >edit</span>
                    </button>
                    <button
                      class="rounded-lg p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="Xóa"
                      @click.stop="confirmDelete(v)"
                    >
                      <span
                        class="material-symbols-outlined text-[18px] text-red-500"
                      >delete</span>
                    </button>
                    <button
                      class="rounded-lg p-1.5 hover:bg-blue-50"
                      title="Xem QR"
                      @click.stop="viewQR(v)"
                    >
                      <span class="material-symbols-outlined text-[18px] text-blue-500">qr_code</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
    <!-- Modal Xem QR -->
    <Teleport to="body">
      <div
        v-if="showQrModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        @click.self="showQrModal = false"
      >
        <div class="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl text-center">
          <h3 class="mb-2 text-base font-bold">
            Mã QR - Sản phẩm #{{ qrVariant?.productId || qrVariant?.product_id }}
          </h3>
          <div v-if="qrImageUrl" class="mx-auto flex justify-center">
            <img alt="QR Code" class="max-w-full h-auto" :src="qrImageUrl">
          </div>
          <div v-else class="py-4 text-sm text-slate-500">Đang tải mã QR...</div>
          <div class="mt-4 flex justify-end gap-2">
            <button
              class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
              @click="printQrCode"
            >
              In QR
            </button>
            <button
              class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50"
              @click="showQrModal = false"
            >
              Đóng
            </button>
          </div>
        </div>
      </div>
    </Teleport>
    <!-- Modal Thêm/Sửa -->
    <Teleport to="body">
      <div
        v-if="showModal"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        @click.self="closeModal"
      >
        <div
          class="w-full max-w-md max-h-[88vh] overflow-y-auto rounded-2xl bg-white p-4 shadow-2xl "
        >
          <h3 class="mb-3 text-base font-bold">
            {{ editingId ? `Sửa biến thể #${editingId}` : "Thêm biến thể mới" }}
          </h3>

          <div v-if="editingId" class="mb-4 flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 ">
            <div>
              <p class="text-xs font-medium text-slate-500 ">Ảnh của nhóm màu này</p>
              <div class="flex items-center gap-1 mt-1">
                <div v-for="entry in imageSlotEntries" :key="entry.key" class="size-8 rounded-md overflow-hidden bg-slate-200 /50 border border-slate-300 ">
                  <img v-if="slotSource(bulkImageSlots, entry.key)" class="w-full h-full object-cover" :src="slotSource(bulkImageSlots, entry.key)">
                </div>
              </div>
            </div>
            <button class="text-xs font-semibold text-primary hover:underline" type="button" @click="openBulkImageForGroup(form.productId, bulkImageColorId)">
              Xem / Sửa ảnh
            </button>
          </div>

          <div class="space-y-3">
            <div>
              <label class="mb-1 block text-xs font-medium text-slate-500">Sản phẩm *</label>
              <select
                v-model.number="form.productId"
                class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-1.5 text-sm "
              >
                <option :value="null">-- Chọn sản phẩm --</option>
                <option v-for="p in products" :key="p.id" :value="Number(p.id)">
                  {{ p.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-500">Màu sắc *</label>
              <input
                v-model="form.colorName"
                class="w-full shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-1.5 text-sm rounded-xl border border-slate-200 outline-none focus:border-primary"
                list="colorOptionsList"
                placeholder="-- Chọn hoặc nhập màu mới --"
              >
              <datalist id="colorOptionsList">
                <option v-for="c in availableColorsForForm" :key="c.id" :value="c.name" />
              </datalist>
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-500">Size *</label>
              <select
                v-model.number="form.sizeId"
                class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-1.5 text-sm "
              >
                <option :value="null">-- Chọn size --</option>
                <option v-for="s in availableSizesForForm" :key="s.id" :value="Number(s.id)">
                  {{ s.name }}
                </option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="mb-1 block text-xs font-medium text-slate-500">Giá (VND) *</label>
                <input
                  v-model.number="form.price"
                  class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-1.5 text-sm "
                  min="0"
                  type="number"
                >
              </div>
              <div>
                <label class="mb-1 block text-xs font-medium text-slate-500">Tồn kho *</label>
                <input
                  v-model.number="form.stockQuantity"
                  class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-1.5 text-sm "
                  min="0"
                  type="number"
                >
              </div>
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-500">Trạng thái bán *</label>
              <select
                v-model="form.status"
                class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-1.5 text-sm "
              >
                <option value="SELLING">Đang bán</option>
                <option value="OUT_OF_STOCK">Hết hàng</option>
                <option value="HIDDEN">Ngừng bán</option>
              </select>
            </div>

            <p
              class="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700 /50 /20 "
            >
              Ảnh biến thể được quản lý tập trung theo nhóm màu ở mục "Cập nhật
              ảnh theo nhóm màu" phía trên.
            </p>
          </div>

          <p v-if="modalError" class="mt-3 text-xs text-red-500">
            {{ modalError }}
          </p>

          <div class="mt-4 flex justify-end gap-2">
            <button
              class="rounded-xl border border-slate-200 px-3 py-1.5 text-sm font-medium hover:border-slate-400 "
              type="button"
              @click="closeModal"
            >
              Hủy
            </button>
            <button
              class="rounded-xl bg-primary px-3 py-1.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
              :disabled="saving"
              type="button"
              @click="saveVariant"
            >
              {{ saving ? "Đang lưu..." : editingId ? "Cập nhật" : "Thêm mới" }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal Xác nhận xóa -->
    <Teleport to="body">
      <div
        v-if="deleteTarget"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        @click.self="deleteTarget = null"
      >
        <div
          class="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl "
        >
          <h3 class="mb-2 text-base font-bold">Xác nhận xóa</h3>
          <p class="text-sm text-slate-500 ">
            Bạn chắc chắn muốn xóa biến thể
            <strong>#{{ deleteTarget.id }}</strong>
            ({{ deleteTarget.productName }} - {{ deleteTarget.colorName }} /
            {{ deleteTarget.sizeName }})?
          </p>
          <div class="mt-5 flex justify-end gap-3">
            <button
              class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium "
              @click="deleteTarget = null"
            >
              Hủy
            </button>
            <button
              class="rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-60"
              :disabled="deleting"
              @click="doDelete"
            >
              {{ deleting ? "Đang xóa..." : "Xóa" }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal Sinh Biến Thể Hàng Loạt -->
    <Teleport to="body">
      <div v-if="showBulkModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="closeBulkModal">
        <div class="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl ">
          <h3 class="mb-4 text-lg font-bold">Sinh Biến Thể Hàng Loạt</h3>

          <div class="grid gap-4">
            <div>
              <label class="mb-1 block text-sm font-medium text-slate-500">Sản phẩm *</label>
              <select v-model="bulkForm.productId" class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 text-sm ">
                <option :value="null">-- Chọn sản phẩm --</option>
                <option v-for="p in products" :key="p.id" :value="p.id">{{ p.name }}</option>
              </select>
            </div>

            <div class="grid md:grid-cols-2 gap-4">
              <div class="border rounded-xl p-3 border-slate-200 ">
                <label class="mb-2 block text-sm font-medium text-slate-500">Chọn Màu Sắc *</label>
                <div class="max-h-40 overflow-y-auto space-y-1">
                  <label v-for="c in availableColorsForBulk" :key="c.id" class="flex items-center gap-2 text-sm cursor-pointer hover:bg-slate-50 p-1 rounded dark:hover:bg-white">
                    <input v-model="bulkForm.selectedColors" class="rounded border-slate-300" type="checkbox" :value="c.id">
                    {{ c.name }}
                  </label>
                </div>
              </div>

              <div class="border rounded-xl p-3 border-slate-200 ">
                <label class="mb-2 block text-sm font-medium text-slate-500">Chọn Kích Cỡ *</label>
                <div class="max-h-40 overflow-y-auto space-y-1">
                  <label v-for="s in availableSizesForBulk" :key="s.id" class="flex items-center gap-2 text-sm cursor-pointer hover:bg-slate-50 p-1 rounded dark:hover:bg-white">
                    <input v-model="bulkForm.selectedSizes" class="rounded border-slate-300" type="checkbox" :value="s.id">
                    {{ s.name }}
                  </label>
                </div>
              </div>
            </div>

            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="mb-1 block text-sm font-medium text-slate-500">Giá bán chung (VND) *</label>
                <input v-model.number="bulkForm.price" class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 text-sm " min="0" type="number">
              </div>
              <div>
                <label class="mb-1 block text-sm font-medium text-slate-500">Số lượng biến thể chung *</label>
                <input v-model.number="bulkForm.stockQuantity" class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 text-sm " min="0" type="number">
              </div>
            </div>

            <div class="rounded-lg bg-blue-50 p-3 text-sm text-blue-700 /20 ">
              Sẽ tạo ra: <strong>{{ newCombinationsCount }}</strong> biến thể.
            </div>

            <p v-if="bulkError" class="text-sm text-red-500 font-medium">{{ bulkError }}</p>
          </div>

          <div class="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-4 ">
            <button class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50 dark:hover:bg-white" type="button" @click="closeBulkModal">Hủy</button>
            <button class="rounded-xl bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50" :disabled="bulkGenerating || !bulkForm.productId || newCombinationsCount === 0" type="button" @click="doBulkCreate">
              {{ bulkGenerating ? "Đang xử lý..." : "Bắt đầu tạo" }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
  import axios from 'axios'
  import QRCode from 'qrcode'
  import { computed, onMounted, ref, watch } from 'vue'
  import AdminShell from '@/components/admin/AdminShell.vue'
  import { adminApi, colorsApi, resolveImageUrl, sizesApi, variantsApi } from '@/services/api'
  import { buildVariantCode } from '@/utils/variantValues'

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

  function getVariantCode (product, variant) {
    return buildVariantCode(
      product && (product.productCode || product.product_code),
      variant && (variant.colorName || variant.color_name),
      variant && (variant.sizeName || variant.size_name),
      variant && (variant.variantCode || variant.variant_code),
    )
  }
  const props = defineProps({
    hideHeader: {
      type: Boolean,
      default: false,
    },
    hideFilterControls: {
      type: Boolean,
      default: false,
    },
  })
  // Biến state cho QR
  const showQrModal = ref(false)
  const qrVariant = ref(null)
  const qrImageUrl = ref('')
  // Bulk create state
  const showBulkModal = ref(false)
  const bulkForm = ref({
    productId: null,
    selectedColors: [],
    selectedSizes: [],
    price: 0,
    stockQuantity: 0,
  })
  const bulkGenerating = ref(false)
  const bulkError = ref('')
  const bulkSuccess = ref('')

  function openBulkCreate () {
    bulkForm.value = {
      productId: null,
      selectedColors: [],
      selectedSizes: [],
      price: 0,
      stockQuantity: 0,
    }
    bulkError.value = ''
    bulkSuccess.value = ''
    showBulkModal.value = true
  }

  function closeBulkModal () {
    showBulkModal.value = false
  }

  async function doBulkCreate () {
    bulkError.value = ''
    bulkSuccess.value = ''

    const { productId, selectedColors, selectedSizes, price, stockQuantity } = bulkForm.value

    if (!productId) {
      bulkError.value = 'Vui lòng chọn sản phẩm.'
      return
    }
    if (selectedColors.length === 0 || selectedSizes.length === 0) {
      bulkError.value = 'Vui lòng chọn ít nhất 1 màu và 1 size.'
      return
    }
    if (price < 0 || stockQuantity < 0) {
      bulkError.value = 'Giá và số lượng phải lớn hơn hoặc bằng 0.'
      return
    }

    bulkGenerating.value = true

    let successCount = 0
    let errorCount = 0

    for (const colorId of selectedColors) {
      for (const sizeId of selectedSizes) {
        const exists = rawVariants.value.some(v => v.productId === productId && v.colorId === colorId && v.sizeId === sizeId)
        if (exists) continue

        const product = products.value.find(item => Number(item.id) === Number(productId))
        const color = colors.value.find(item => Number(item.id) === Number(colorId))
        const size = sizes.value.find(item => Number(item.id) === Number(sizeId))

        try {
          await adminApi.createVariant({
            productId,
            colorId,
            sizeId,
            variantCode: getVariantCode(product, { colorName: color?.name, sizeName: size?.name }),
            price,
            stockQuantity,
            status: 'SELLING',
          })
          successCount++
        } catch (error_) {
          console.error('Lỗi khi tạo biến thể màu ' + colorId + ' size ' + sizeId, error_)
          errorCount++
        }
      }
    }

    bulkGenerating.value = false
    if (errorCount > 0) {
      bulkError.value = 'Đã tạo thành công ' + successCount + ' biến thể. Thất bại ' + errorCount + ' biến thể (có thể do đã tồn tại).'
    } else {
      showBulkModal.value = false
      await loadInventory()
    }
  }

  const loading = ref(false)
  const error = ref('')
  const searchKeyword = ref('')
  const showFilters = ref(false)
  const variants = ref([])
  const rawVariants = ref([])
  const products = ref([])
  const colors = ref([])
  const sizes = ref([])
  const hiddenVariants = ref([])

  // Filter state
  const filters = ref({
    productId: null,
    colorId: null,
    sizeId: null,
    stockStatus: null,
    minPrice: null,
    maxPrice: null,
    minId: null,
    maxId: null,
  })

  const expandedProductIds = ref([])

  const visibleVariants = computed(() => {
    return variants.value.filter(
      variant =>
        !hiddenVariants.value.some(
          hidden => Number(variant.id) === Number(hidden.id),
        ),
    )
  })

  const showModal = ref(false)
  const editingId = ref(null)
  const saving = ref(false)
  const modalError = ref('')
  const form = ref(emptyForm())

  const availableColorsForForm = computed(() => {
    if (!form.value.productId || !form.value.sizeId) return colors.value
    const existingVariants = visibleVariants.value.filter(v =>
      Number(v.productId) === Number(form.value.productId)
      && Number(v.sizeId) === Number(form.value.sizeId)
      && Number(v.id) !== Number(editingId.value),
    )
    const usedColorIds = new Set(existingVariants.map(v => Number(v.colorId)))
    return colors.value.filter(c => !usedColorIds.has(Number(c.id)))
  })

  const availableSizesForForm = computed(() => {
    if (!form.value.productId || !form.value.colorName) return sizes.value
    const selectedColor = colors.value.find(c => c.name.toLowerCase() === form.value.colorName.toLowerCase())
    if (!selectedColor) return sizes.value

    const existingVariants = visibleVariants.value.filter(v =>
      Number(v.productId) === Number(form.value.productId)
      && Number(v.colorId) === Number(selectedColor.id)
      && Number(v.id) !== Number(editingId.value),
    )
    const usedSizeIds = new Set(existingVariants.map(v => Number(v.sizeId)))
    return sizes.value.filter(s => !usedSizeIds.has(Number(s.id)))
  })

  const availableColorsForBulk = computed(() => {
    if (!bulkForm.value.productId) return colors.value
    const totalSizes = sizes.value.length
    if (totalSizes === 0) return colors.value
    return colors.value.filter(c => {
      const existingSizesCount = visibleVariants.value.filter(v => v.productId === bulkForm.value.productId && v.colorId === c.id).length
      return existingSizesCount < totalSizes
    })
  })

  const availableSizesForBulk = computed(() => {
    if (!bulkForm.value.productId) return sizes.value
    const totalColors = colors.value.length
    if (totalColors === 0) return sizes.value
    return sizes.value.filter(s => {
      const existingColorsCount = visibleVariants.value.filter(v => v.productId === bulkForm.value.productId && v.sizeId === s.id).length
      return existingColorsCount < totalColors
    })
  })

  const newCombinationsCount = computed(() => {
    if (!bulkForm.value.productId) return 0
    let count = 0
    for (const cid of bulkForm.value.selectedColors) {
      for (const sid of bulkForm.value.selectedSizes) {
        const exists = visibleVariants.value.some(v => v.productId === bulkForm.value.productId && v.colorId === cid && v.sizeId === sid)
        if (!exists) count++
      }
    }
    return count
  })

  const deleteTarget = ref(null)
  const deleting = ref(false)

  const IMAGE_SLOT_KEYS = ['primary', 'extra0', 'extra1', 'extra2', 'extra3']

  function createImageSlot (label, required = false) {
    return {
      label,
      required,
      file: null,
      url: '',
      previewUrl: '',
      status: 'idle',
      error: '',
    }
  }

  function createImageSlots () {
    return {
      primary: createImageSlot('Ảnh chính', true),
      extra0: createImageSlot('Ảnh phụ 1', true),
      extra1: createImageSlot('Ảnh phụ 2', true),
      extra2: createImageSlot('Ảnh phụ 3', true),
      extra3: createImageSlot('Ảnh phụ 4', true),
    }
  }

  const showBulkImageModal = ref(false)
  const bulkImageProductId = ref(null)
  const bulkImageColorId = ref(null)
  const bulkImageSlots = ref(createImageSlots())
  const bulkImageError = ref('')
  const bulkImageSuccess = ref('')
  const bulkImageNotice = ref('')
  const applyingBulkImages = ref(false)
  const bulkImagePreloadSeq = ref(0)

  const API_BASE_URL
    = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'

  // Computed: Filtered variants
  const filteredVariants = computed(() => {
    let result = [...visibleVariants.value]

    // Search by keyword
    if (searchKeyword.value) {
      const kw = searchKeyword.value.toLowerCase()
      result = result.filter(v => {
        return (
          String(v.id).includes(kw)
          || (v.productName && v.productName.toLowerCase().includes(kw))
          || (v.colorName && v.colorName.toLowerCase().includes(kw))
          || (v.sizeName && v.sizeName.toLowerCase().includes(kw))
        )
      })
    }

    // Filter by product
    if (filters.value.productId) {
      result = result.filter(v => v.productId === filters.value.productId)
    }

    // Filter by color
    if (filters.value.colorId) {
      result = result.filter(v => v.colorId === filters.value.colorId)
    }

    // Filter by size
    if (filters.value.sizeId) {
      result = result.filter(v => v.sizeId === filters.value.sizeId)
    }

    // Filter by stock status
    if (filters.value.stockStatus) {
      result = result.filter(v => {
        const stock = v.stockQuantity || 0
        const status = normalizeVariantStatus(v.status, stock)
        if (filters.value.stockStatus === 'selling') return status === 'SELLING'
        if (filters.value.stockStatus === 'out_of_stock') return stock === 0
        if (filters.value.stockStatus === 'hidden') return status === 'HIDDEN'
        if (filters.value.stockStatus === 'low_stock')
          return stock > 0 && stock < 10
        if (filters.value.stockStatus === 'in_stock') return stock >= 10
        return true
      })
    } else {
      // Mặc định ẩn các biến thể đã bị xóa mềm (Ngừng bán) để tránh rác giao diện
      result = result.filter(v => normalizeVariantStatus(v.status, v.stockQuantity) !== 'HIDDEN')
    }

    // Filter by price range
    if (
      filters.value.minPrice !== null
      && filters.value.minPrice !== undefined
      && filters.value.minPrice > 0
    ) {
      result = result.filter(v => (v.price || 0) >= filters.value.minPrice)
    }
    if (
      filters.value.maxPrice !== null
      && filters.value.maxPrice !== undefined
      && filters.value.maxPrice > 0
    ) {
      result = result.filter(v => (v.price || 0) <= filters.value.maxPrice)
    }

    // Filter by ID range
    if (
      filters.value.minId !== null
      && filters.value.minId !== undefined
      && filters.value.minId > 0
    ) {
      result = result.filter(v => v.id >= filters.value.minId)
    }
    if (
      filters.value.maxId !== null
      && filters.value.maxId !== undefined
      && filters.value.maxId > 0
    ) {
      result = result.filter(v => v.id <= filters.value.maxId)
    }

    // Sort by ID
    result.sort((a, b) => a.id - b.id)

    return result
  })

  const groupedVariants = computed(() => {
    const grouped = new Map()
    for (const v of filteredVariants.value) {
      const key = Number(v.productId)
      if (!grouped.has(key)) {
        grouped.set(key, {
          productId: key,
          productName: v.productName || `Sản phẩm #${key}`,
          variants: [],
        })
      }
      grouped.get(key).variants.push(v)
    }

    return [...grouped.values()]
      .map(group => ({
        ...group,
        variants: [...group.variants].sort((a, b) => (a.id || 0) - (b.id || 0)),
        totalStock: group.variants.reduce(
          (sum, item) => sum + Number(item.stockQuantity || 0),
          0,
        ),
        colorCount: new Set(group.variants.map(item => item.colorId)).size,
        sizeCount: new Set(group.variants.map(item => item.sizeId)).size,
        previewImages: [
          ...new Set(
            group.variants.flatMap(item => {
              const urls = []
              if (item.imageUrl) urls.push(item.imageUrl)
              if (Array.isArray(item.extraImages) && item.extraImages.length > 0) {
                urls.push(...item.extraImages.filter(Boolean))
              }
              return urls
            }),
          ),
        ].slice(0, 3),
        previewCount: group.variants.reduce((sum, item) => {
          const count
            = (item.imageUrl ? 1 : 0)
              + (Array.isArray(item.extraImages) ? item.extraImages.length : 0)
          return sum + count
        }, 0),
      }))
      .sort((a, b) =>
        a.productName.localeCompare(b.productName, 'vi', { sensitivity: 'base' }),
      )
  })

  const bulkColorOptions = computed(() => {
    if (!bulkImageProductId.value) return []
    const colorMap = new Map()
    for (const variant of variants.value) {
      if (Number(variant.productId) !== Number(bulkImageProductId.value))
        continue
      if (!variant.colorId) continue
      if (!colorMap.has(Number(variant.colorId))) {
        colorMap.set(Number(variant.colorId), {
          id: Number(variant.colorId),
          name: variant.colorName || `Màu #${variant.colorId}`,
        })
      }
    }
    return [...colorMap.values()].sort((a, b) =>
      a.name.localeCompare(b.name, 'vi', { sensitivity: 'base' }),
    )
  })

  const bulkTargetVariants = computed(() => {
    if (!bulkImageProductId.value || !bulkImageColorId.value) return []
    return variants.value
      .filter(
        item =>
          Number(item.productId) === Number(bulkImageProductId.value)
          && Number(item.colorId) === Number(bulkImageColorId.value),
      )
      .sort((a, b) => (a.id || 0) - (b.id || 0))
  })

  // Stock statistics
  const totalProductsCount = computed(() => {
    return new Set(variants.value.map(v => v.productId)).size
  })

  const productStockMap = computed(() => {
    const map = new Map()
    for (const v of variants.value) {
      const current = map.get(v.productId) || 0
      map.set(v.productId, current + (Number(v.stockQuantity) || 0))
    }
    return map
  })

  const inStockCount = computed(() => {
    let count = 0
    for (const stock of productStockMap.value.values()) {
      if (stock >= 10) count++
    }
    return count
  })

  const lowStockCount = computed(() => {
    let count = 0
    for (const stock of productStockMap.value.values()) {
      if (stock > 0 && stock < 10) count++
    }
    return count
  })

  const outOfStockCount = computed(() => {
    let count = 0
    for (const stock of productStockMap.value.values()) {
      if (stock === 0) count++
    }
    return count
  })

  // Reset filters
  function resetFilters () {
    filters.value = {
      productId: null,
      colorId: null,
      sizeId: null,
      stockStatus: null,
      minPrice: null,
      maxPrice: null,
      minId: null,
      maxId: null,
    }
    searchKeyword.value = ''
    applyFilters()
  }

  // Apply filters (reset to page 1)
  function applyFilters () {
  // no-op: computed filters auto apply
  }

  // Handle search with debounce
  let searchTimeout
  function handleSearch () {
    clearTimeout(searchTimeout)
    searchTimeout = setTimeout(() => {
    // no-op: computed filters auto apply
    }, 300)
  }

  function setSearchKeyword (value) {
    searchKeyword.value = value ?? ''
    handleSearch()
  }

  function setExternalFilters (nextFilters = {}) {
    filters.value = {
      ...filters.value,
      ...nextFilters,
    }
    applyFilters()
  }

  function isExpandedProduct (productId) {
    return expandedProductIds.value.includes(Number(productId))
  }

  function toggleProductExpand (productId) {
    const id = Number(productId)
    if (isExpandedProduct(id)) {
      expandedProductIds.value = expandedProductIds.value.filter(
        item => item !== id,
      )
      return
    }
    expandedProductIds.value = [...expandedProductIds.value, id]
  }

  function resetSpecificImageSlots (targetSlotsRef) {
    if (!targetSlotsRef || typeof targetSlotsRef !== 'object') return
    if ('value' in targetSlotsRef) {
      targetSlotsRef.value = createImageSlots()
      return
    }

    const fresh = createImageSlots()
    for (const key of IMAGE_SLOT_KEYS) {
      targetSlotsRef[key] = fresh[key]
    }
  }

  function isSlotCollection (candidate) {
    if (!candidate || typeof candidate !== 'object') return false
    return IMAGE_SLOT_KEYS.every(key => key in candidate)
  }

  function ensureSlotsObject (targetSlotsRef) {
    if (!targetSlotsRef || typeof targetSlotsRef !== 'object') {
      return createImageSlots()
    }

    // In Vue templates, refs are auto-unwrapped, so we may receive the slot object directly.
    if (isSlotCollection(targetSlotsRef)) {
      return targetSlotsRef
    }

    if (!('value' in targetSlotsRef)) {
      return createImageSlots()
    }

    if (!isSlotCollection(targetSlotsRef.value)) {
      targetSlotsRef.value = createImageSlots()
    }

    return targetSlotsRef.value
  }

  function normalizeSlotImageUrl (value) {
    if (!value) return ''
    let url = String(value).trim()
    if (!url) return ''

    // Backends sometimes return Windows-style paths (e.g. images\\foo.jpg).
    url = url.replace(/\\/g, '/')

    if (
      !/^https?:\/\//i.test(url)
      && !url.startsWith('data:')
      && !url.startsWith('/')
    ) {
      url = `/${url}`
    }

    // Some backends persist API-routed asset paths that are not directly renderable by <img>.
    // Convert `/api/images/*` and `/api/uploads/*` to direct static paths.
    url = url
      .replace(/\/api\/images\//i, '/images/')
      .replace(/\/api\/uploads\//i, '/uploads/')

    if (/^https?:\/\/[^/]+\/api\/(images|uploads)\//i.test(url)) {
      url = url.replace(/\/api\/(images|uploads)\//i, '/$1/')
    }

    return resolveImageUrl(url)
  }

  function readVariantPrimary (variant) {
    const candidate
      = variant?.imageUrl
        || variant?.image_url
        || variant?.imgUrl
        || variant?.img_url
        || variant?.imagePath
        || variant?.image_path
        || null

    return normalizeSlotImageUrl(candidate)
  }

  function readImageEntryValue (entry) {
    if (!entry) return ''
    if (typeof entry === 'string') return normalizeSlotImageUrl(entry)
    if (typeof entry === 'object') {
      const candidate
        = entry.url
          || entry.imageUrl
          || entry.image_url
          || entry.path
          || entry.imagePath
          || entry.image_path
          || ''
      return normalizeSlotImageUrl(candidate)
    }
    return ''
  }

  function bindVariantToSlots (targetSlotsRef, variant) {
    const slots = ensureSlotsObject(targetSlotsRef)
    const extra = readVariantExtras(variant)
    if (extra.length > 4) {
      bulkImageNotice.value = `Nhóm màu này đang có ${extra.length + 1} ảnh. Hệ thống chỉ dùng 5 ảnh chuẩn (1 chính + tối đa 4 phụ), ảnh dư sẽ bị bỏ qua khi cập nhật.`
    }
    slots.primary.url = readVariantPrimary(variant)
    slots.primary.previewUrl = ''
    slots.extra0.url = normalizeSlotImageUrl(extra[0])
    slots.extra0.previewUrl = ''
    slots.extra1.url = normalizeSlotImageUrl(extra[1])
    slots.extra1.previewUrl = ''
    slots.extra2.url = normalizeSlotImageUrl(extra[2])
    slots.extra2.previewUrl = ''
    slots.extra3.url = normalizeSlotImageUrl(extra[3])
    slots.extra3.previewUrl = ''
  }

  function bindImageSetToSlots (targetSlotsRef, imageSet) {
    const slots = ensureSlotsObject(targetSlotsRef)
    const extra = Array.isArray(imageSet?.extraImages)
      ? imageSet.extraImages
      : []

    slots.primary.url = normalizeSlotImageUrl(imageSet?.imageUrl)
    slots.primary.previewUrl = ''
    slots.extra0.url = normalizeSlotImageUrl(extra[0])
    slots.extra0.previewUrl = ''
    slots.extra1.url = normalizeSlotImageUrl(extra[1])
    slots.extra1.previewUrl = ''
    slots.extra2.url = normalizeSlotImageUrl(extra[2])
    slots.extra2.previewUrl = ''
    slots.extra3.url = normalizeSlotImageUrl(extra[3])
    slots.extra3.previewUrl = ''
  }

  function readVariantExtras (variant) {
    const direct = normalizeImageList(
      variant?.extraImages ?? variant?.extra_images ?? variant?.images ?? null,
    )
    if (direct.length > 0) return direct

    if (Array.isArray(variant?.images)) {
      const mapped = variant.images
        .map(entry => readImageEntryValue(entry))
        .filter(Boolean)
      if (mapped.length > 0) {
        return mapped.slice(0, 4)
      }
    }

    return []
  }

  function buildGroupImageSet (list) {
    const rows = Array.isArray(list) ? list : []
    const extras = ['', '', '', '']
    let imageUrl = ''

    for (const variant of rows) {
      const primary = readVariantPrimary(variant)
      if (!imageUrl && primary) {
        imageUrl = primary
      }

      const variantExtras = readVariantExtras(variant)
      for (let i = 0; i < 4; i += 1) {
        if (!extras[i] && variantExtras[i]) {
          extras[i] = variantExtras[i]
        }
      }
    }

    return {
      imageUrl,
      extraImages: extras,
    }
  }

  function slotSource (targetSlotsRef, slotKey) {
    const slots = ensureSlotsObject(targetSlotsRef)
    const slot = slots[slotKey]
    if (!slot) return ''
    if (slot.previewUrl) {
      return slot.previewUrl
    }
    if (!slot.url) {
      return ''
    }
    return resolveImageUrl(slot.url)
  }

  function slotImageName (targetSlotsRef, slotKey) {
    const url = slotSource(targetSlotsRef, slotKey)
    if (!url) return 'Chưa có ảnh'
    try {
      const segment = String(url).split('?')[0].split('/').pop()
      return segment || 'Ảnh hiện tại'
    } catch {
      return 'Ảnh hiện tại'
    }
  }

  function handleImageUploadForSlots (targetSlotsRef, slotKey, event) {
    const slots = ensureSlotsObject(targetSlotsRef)
    const file = event.target?.files?.[0]
    if (!file) return

    const slot = slots[slotKey]
    if (!slot) return
    slot.error = ''

    if (!file.type.startsWith('image/')) {
      slot.error = 'Vui lòng chọn tệp ảnh hợp lệ.'
      slot.status = 'error'
      return
    }

    if (file.size > 5 * 1024 * 1024) {
      slot.error = 'Kích thước ảnh không được vượt quá 5MB.'
      slot.status = 'error'
      return
    }

    if (slot.previewUrl && slot.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(slot.previewUrl)
    }

    slot.file = file
    slot.previewUrl = URL.createObjectURL(file)
    slot.status = 'selected'
  }

  function clearImageSlotForSlots (targetSlotsRef, slotKey) {
    const slots = ensureSlotsObject(targetSlotsRef)
    const slot = slots[slotKey]
    if (!slot) return
    if (slot.previewUrl && slot.previewUrl.startsWith('blob:')) {
      URL.revokeObjectURL(slot.previewUrl)
    }

    slot.file = null
    slot.url = ''
    slot.previewUrl = ''
    slot.status = 'idle'
    slot.error = ''
  }

  function emptyForm () {
    return {
      productId: null,
      colorName: '',
      sizeId: null,
      price: 0,
      stockQuantity: 0,
      status: 'SELLING',
    }
  }

  function toList (data) {
    if (Array.isArray(data)) return data
    if (data && typeof data === 'object') {
      if (Array.isArray(data.content)) return data.content
      if (Array.isArray(data.data)) return data.data
      if (Array.isArray(data.list)) return data.list
    }
    return []
  }

  function asFiniteNumber (value, fallback = null) {
    const n = Number(value)
    return Number.isFinite(n) ? n : fallback
  }

  function normalizeVariantStatus (value, stockQuantity = null) {
    const normalized = String(value || '').trim().toUpperCase()
    const hasKnownStock = stockQuantity !== null && stockQuantity !== undefined && stockQuantity !== ''
    const stock = Number(stockQuantity)
    const hasStock = hasKnownStock && Number.isFinite(stock) ? stock > 0 : true

    if (['SELLING', 'AVAILABLE', 'ACTIVE', 'ON_SALE'].includes(normalized)) {
      return hasStock ? 'SELLING' : 'OUT_OF_STOCK'
    }
    if (['OUT_OF_STOCK', 'SOLD_OUT', 'OUTOFSTOCK'].includes(normalized)) {
      return 'OUT_OF_STOCK'
    }
    if (['HIDDEN', 'INACTIVE', 'DISCONTINUED', 'STOP_SELLING'].includes(normalized)) {
      return 'HIDDEN'
    }
    return hasStock ? 'SELLING' : 'OUT_OF_STOCK'
  }

  function variantStatusLabel (status, stockQuantity = null) {
    const normalized = normalizeVariantStatus(status, stockQuantity)
    if (normalized === 'HIDDEN') return 'Ngừng bán'
    if (normalized === 'OUT_OF_STOCK') return 'Hết hàng'
    return 'Đang bán'
  }

  function variantStatusClass (status, stockQuantity = null) {
    const normalized = normalizeVariantStatus(status, stockQuantity)
    if (normalized === 'HIDDEN') {
      return 'bg-slate-100 text-slate-700 /30 '
    }
    if (normalized === 'OUT_OF_STOCK') {
      return 'bg-red-100 text-red-700 /20 '
    }
    return 'bg-green-100 text-green-700 /20 '
  }

  function toMap (rows, idKey = 'id') {
    const map = new Map()
    for (const row of rows) {
      const id = asFiniteNumber(row && row[idKey], null)
      if (id !== null) {
        map.set(id, row)
      }
    }
    return map
  }

  function normalizeImageList (value) {
    if (Array.isArray(value)) {
      return value.filter(Boolean).map(item => resolveImageUrl(item))
    }

    if (typeof value === 'string') {
      const trimmed = value.trim()
      if (!trimmed) return []

      if (trimmed.startsWith('[') && trimmed.endsWith(']')) {
        try {
          const parsed = JSON.parse(trimmed)
          return Array.isArray(parsed)
            ? parsed.filter(Boolean).map(item => resolveImageUrl(item))
            : []
        } catch {
          return []
        }
      }

      if (trimmed.includes(',')) {
        return trimmed
          .split(',')
          .map(item => item.trim())
          .filter(Boolean)
          .map(item => resolveImageUrl(item))
      }

      return [resolveImageUrl(trimmed)]
    }

    return []
  }

  function hydrateVariants (rawVariants, rawProducts, rawColors, rawSizes) {
    const productMap = toMap(rawProducts)
    const colorMap = toMap(rawColors)
    const sizeMap = toMap(rawSizes)

    return (Array.isArray(rawVariants) ? rawVariants : []).map(item => {
      const productId = asFiniteNumber(item.productId ?? item.product_id, null)
      const colorId = asFiniteNumber(item.colorId ?? item.color_id, null)
      const sizeId = asFiniteNumber(item.sizeId ?? item.size_id, null)

      const product = productId === null ? null : productMap.get(productId)
      const color = colorId === null ? null : colorMap.get(colorId)
      const size = sizeId === null ? null : sizeMap.get(sizeId)

      const rawHex
        = item.colorHex
          || item.color_hex
          || color?.hexCode
          || color?.hex_code
          || color?.hexCode1
          || color?.hexcode
          || null

      const primaryImage
        = item.imageUrl || item.image_url || item.imgUrl || item.img_url || null

      const normalizedExtras = normalizeImageList(
        item.extraImages ?? item.extra_images ?? item.images ?? null,
      )

      const stockQuantity
        = asFiniteNumber(item.stockQuantity ?? item.stock_quantity, 0) || 0

      return {
        ...item,
        productId,
        colorId,
        sizeId,
        productName: item.productName || item.product_name || product?.name || '',
        colorName: item.colorName || item.color_name || color?.name || '',
        sizeName: item.sizeName || item.size_name || size?.name || '',
        variantCode: getVariantCode(product || {}, {
          ...item,
          colorName: item.colorName || item.color_name || color?.name || '',
          sizeName: item.sizeName || item.size_name || size?.name || '',
        }),
        colorHex: normalizeHexColor(rawHex),
        price: asFiniteNumber(item.price, 0) || 0,
        stockQuantity,
        status: normalizeVariantStatus(
          item.status ?? item.variantStatus ?? item.variant_status,
          stockQuantity,
        ),
        imageUrl: resolveImageUrl(primaryImage),
        extraImages: normalizedExtras,
      }
    })
  }

  function normalizeHexColor (value) {
    const hex = String(value || '').trim()
    if (!hex) return null
    const normalized = hex.startsWith('#') ? hex : `#${hex}`
    return /^#[0-9A-Fa-f]{6}$/.test(normalized) ? normalized.toUpperCase() : null
  }

  function formatCurrency (value) {
    const n = Number(value)
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(Number.isFinite(n) ? n : 0)
  }

  function stockClass (stock) {
    const q = Number(stock)
    if (!Number.isFinite(q) || q <= 0) {
      return 'bg-red-100 text-red-700 /20 '
    }
    if (q < 10) {
      return 'bg-yellow-100 text-yellow-700 /20 '
    }
    return 'bg-green-100 text-green-700 /20 '
  }

  const imageSlotEntries = computed(() => {
    return IMAGE_SLOT_KEYS.map((key, idx) => ({
      key,
      isPrimary: key === 'primary',
      label: key === 'primary' ? 'Ảnh chính' : `Ảnh phụ ${idx}`,
      slot: bulkImageSlots.value[key],
    }))
  })

  function validateFiveImagesForSlots (targetSlotsRef) {
    const missing = IMAGE_SLOT_KEYS.filter(key => {
      const slot = targetSlotsRef.value[key]
      return !slot.file && !slot.url
    })
    const hasPrimary = targetSlotsRef.value.primary.file || targetSlotsRef.value.primary.url
    return hasPrimary && missing.length <= 1
  }

  function getVariantImageScore (variant) {
    if (!variant || typeof variant !== 'object') return 0
    const primary = variant.imageUrl ? 1 : 0
    const extras = Array.isArray(variant.extraImages)
      ? variant.extraImages.filter(Boolean).length
      : 0
    return primary + extras
  }

  function pickBestVariantForBulkPreview (list) {
    if (!Array.isArray(list) || list.length === 0) return null
    return (
      [...list].sort((left, right) => {
        const rightScore = getVariantImageScore(right)
        const leftScore = getVariantImageScore(left)
        if (rightScore !== leftScore) return rightScore - leftScore
        return Number(left?.id || 0) - Number(right?.id || 0)
      })[0] || null
    )
  }

  async function uploadAllSlotsToVariant (targetSlotsRef, variantId) {
    const uploadPrimary = async () => {
      const slot = targetSlotsRef.value.primary
      if (!slot.file) return slot.url || ''

      slot.status = 'uploading'
      slot.error = ''
      const formData = new FormData()
      formData.append('file', slot.file)

      const response = await axios.post(
        `${API_BASE_URL}/variants/${variantId}/upload-image`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      )
      const imageUrl = response?.data?.imageUrl
      if (!imageUrl) {
        throw new Error('Máy chủ không trả về ảnh chính')
      }

      slot.url = imageUrl
      slot.file = null
      if (slot.previewUrl && slot.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(slot.previewUrl)
      }
      slot.previewUrl = ''
      slot.status = 'success'
      return imageUrl
    }

    const uploadExtra = async index => {
      const slotKey = `extra${index}`
      const slot = targetSlotsRef.value[slotKey]
      if (!slot.file) return slot.url || ''

      slot.status = 'uploading'
      slot.error = ''
      const formData = new FormData()
      formData.append('file', slot.file)

      const response = await axios.post(
        `${API_BASE_URL}/variants/${variantId}/add-extra-image?index=${index}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      )
      const imageUrl
        = response?.data?.imageUrl || response?.data?.extraImages?.[index]
      if (!imageUrl) {
        throw new Error(`Máy chủ không trả về ảnh phụ ${index + 1}`)
      }

      slot.url = imageUrl
      slot.file = null
      if (slot.previewUrl && slot.previewUrl.startsWith('blob:')) {
        URL.revokeObjectURL(slot.previewUrl)
      }
      slot.previewUrl = ''
      slot.status = 'success'
      return imageUrl
    }

    const primaryImageUrl = await uploadPrimary()
    const extraImages = []
    for (let i = 0; i < 4; i += 1) {
      extraImages.push(await uploadExtra(i))
    }

    return {
      imageUrl: primaryImageUrl,
      extraImages: extraImages.filter(Boolean),
    }
  }

  function preloadBulkSlotsFromFirstVariant () {
    const firstVariant = pickBestVariantForBulkPreview(bulkTargetVariants.value)
    const groupImageSet = buildGroupImageSet(bulkTargetVariants.value)
    resetSpecificImageSlots(bulkImageSlots)
    bulkImageNotice.value = ''
    const hasGroupImages
      = !!groupImageSet.imageUrl || groupImageSet.extraImages.some(Boolean)
    if (hasGroupImages) {
      bindImageSetToSlots(bulkImageSlots, groupImageSet)
      return
    }

    bindVariantToSlots(bulkImageSlots, firstVariant || null)
  }

  async function fetchVariantDetailForImagePreload (variantId) {
    const id = Number(variantId)
    if (!Number.isFinite(id)) return null

    try {
      const response = await axios.get(`${API_BASE_URL}/variants/${id}`)
      const payload
        = response?.data && typeof response.data === 'object' && response.data.data
          ? response.data.data
          : response?.data

      if (!payload || typeof payload !== 'object') {
        return null
      }

      const [normalized] = hydrateVariants(
        [payload],
        products.value,
        colors.value,
        sizes.value,
      )
      return normalized || null
    } catch {
      return null
    }
  }

  async function preloadBulkSlotsFromVariantDetails () {
    const sequenceId = bulkImagePreloadSeq.value + 1
    bulkImagePreloadSeq.value = sequenceId

    const selectedGroup = [...bulkTargetVariants.value]
    const firstVariant = pickBestVariantForBulkPreview(selectedGroup)
    const detail = firstVariant?.id
      ? await fetchVariantDetailForImagePreload(firstVariant.id)
      : null

    if (sequenceId !== bulkImagePreloadSeq.value) {
      return
    }

    const sourceRows = detail
      ? [
        detail,
        ...selectedGroup.filter(
          item => Number(item.id) !== Number(detail.id),
        ),
      ]
      : selectedGroup

    const groupImageSet = buildGroupImageSet(sourceRows)
    resetSpecificImageSlots(bulkImageSlots)
    bulkImageNotice.value = ''

    const hasGroupImages
      = !!groupImageSet.imageUrl || groupImageSet.extraImages.some(Boolean)
    if (hasGroupImages) {
      bindImageSetToSlots(bulkImageSlots, groupImageSet)
      return
    }

    bindVariantToSlots(bulkImageSlots, detail || firstVariant || null)
  }

  function openBulkImageForGroup (productId, colorId = null) {
    showBulkImageModal.value = true
    bulkImageProductId.value
      = productId === null || productId === undefined ? null : Number(productId)
    bulkImageColorId.value = colorId !== null && colorId !== undefined ? Number(colorId) : null
    bulkImageError.value = ''
    bulkImageSuccess.value = ''
    preloadBulkSlotsFromVariantDetails()
  }

  watch([bulkImageProductId, bulkImageColorId], () => {
    bulkImageError.value = ''
    bulkImageSuccess.value = ''
    preloadBulkSlotsFromVariantDetails()
  })

  async function applyBulkImagesToColorGroup () {
    bulkImageError.value = ''
    bulkImageSuccess.value = ''

    if (!bulkImageProductId.value || !bulkImageColorId.value) {
      bulkImageError.value = 'Vui lòng chọn sản phẩm và màu để cập nhật ảnh.'
      return
    }

    if (bulkTargetVariants.value.length === 0) {
      bulkImageError.value = 'Không có biến thể nào trong nhóm màu này.'
      return
    }

    applyingBulkImages.value = true
    try {
      const firstVariant = bulkTargetVariants.value[0]
      const uploaded = await uploadAllSlotsToVariant(
        bulkImageSlots,
        firstVariant.id,
      )

      for (const variant of bulkTargetVariants.value) {
        await adminApi.updateVariant(variant.id, {
          productId: Number(variant.productId),
          colorId: Number(variant.colorId),
          sizeId: Number(variant.sizeId),
          price: Number(variant.price || 0),
          stockQuantity: Number(variant.stockQuantity || 0),
          status: normalizeVariantStatus(variant.status, variant.stockQuantity),
          imageUrl: uploaded.imageUrl || null,
          extraImages: uploaded.extraImages,
        })
      }

      bulkImageSuccess.value = `Đã áp dụng bộ ảnh cho ${bulkTargetVariants.value.length} biến thể cùng màu.`
      await loadInventory()
      preloadBulkSlotsFromVariantDetails()
    } catch (error_) {
      bulkImageError.value = error_?.message || 'Cập nhật ảnh nhóm màu thất bại.'
    } finally {
      applyingBulkImages.value = false
    }
  }

  function openCreate () {
    editingId.value = null
    form.value = emptyForm()
    modalError.value = ''
    showModal.value = true
  }

  function setBulkColorFromVariant (v) {
    bulkImageProductId.value = asFiniteNumber(v.productId, null)
    bulkImageColorId.value = asFiniteNumber(v.colorId, null)

    // Tự động cuộn lên phần upload ảnh để tiện thao tác
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function openEdit (v) {
    editingId.value = v.id

    // Tự động set form cập nhật ảnh nhóm màu
    bulkImageProductId.value = asFiniteNumber(v.productId, null)
    bulkImageColorId.value = asFiniteNumber(v.colorId, null)
    form.value = {
      productId: asFiniteNumber(v.productId, null),
      colorName: v.colorName || '',
      sizeId: asFiniteNumber(v.sizeId, null),
      price: asFiniteNumber(v.price, 0) || 0,
      stockQuantity: asFiniteNumber(v.stockQuantity, 0) || 0,
      status: normalizeVariantStatus(v.status, v.stockQuantity),
    }
    modalError.value = ''
    showModal.value = true
  }

  function closeModal () {
    showModal.value = false
  }

  async function saveVariant () {
    modalError.value = ''
    const f = form.value

    if (!f.productId || !f.colorName || !f.sizeId) {
      modalError.value = 'Vui lòng nhập đầy đủ Sản phẩm, Màu sắc và Size.'
      return
    }

    saving.value = true
    try {
      const typedColorName = String(f.colorName).trim()
      let finalColorId = null
      const existingColor = colors.value.find(c => c.name.toLowerCase() === typedColorName.toLowerCase())
      if (existingColor) {
        finalColorId = existingColor.id
      } else {
        try {
          const newColor = await colorsApi.create({ name: typedColorName })
          finalColorId = newColor.id || newColor.data?.id
          const rawColors = await colorsApi.getAll().catch(() => [])
          colors.value = toList(rawColors)
        } catch (error_) {
          modalError.value = 'Không thể tạo màu mới: ' + error_.message
          saving.value = false
          return
        }
      }

      let variantIdForUpload = editingId.value
      const requestedStatus = String(f.status || '').trim().toUpperCase()
      const enteredStock = Math.max(0, Number(f.stockQuantity || 0))
      // Khi người dùng nhập tồn kho dương nhưng trạng thái vẫn đang là "Hết hàng"
      // (vd: biến thể đang OUT_OF_STOCK, sửa 0 lên 10 mà không đổi dropdown),
      // ta ưu tiên theo số lượng thật và tự chuyển về "Đang bán".
      const normalizedStock
        = requestedStatus === 'HIDDEN'
          ? 0
          : (requestedStatus === 'OUT_OF_STOCK' && enteredStock > 0
              ? enteredStock
              : (requestedStatus === 'OUT_OF_STOCK' ? 0 : enteredStock))
      const normalizedStatus
        = normalizedStock > 0 && requestedStatus !== 'HIDDEN'
          ? 'SELLING'
          : normalizeVariantStatus(f.status, normalizedStock)

      if (editingId.value) {
        await adminApi.updateVariant(variantIdForUpload, {
          productId: Number(f.productId),
          colorId: Number(finalColorId),
          sizeId: Number(f.sizeId),
          price: Number(f.price || 0),
          stockQuantity: normalizedStock,
          status: normalizedStatus,
        })
      } else {
        const product = products.value.find(item => Number(item.id) === Number(f.productId))
        const color = colors.value.find(item => Number(item.id) === Number(finalColorId))
        const size = sizes.value.find(item => Number(item.id) === Number(f.sizeId))
        const payload = {
          productId: Number(f.productId),
          colorId: Number(finalColorId),
          sizeId: Number(f.sizeId),
          variantCode: getVariantCode(product, { colorName: color?.name, sizeName: size?.name }),
          price: Number(f.price || 0),
          stockQuantity: normalizedStock,
          status: normalizedStatus,
        }

        const createdVariant = await adminApi.createVariant(payload)
        variantIdForUpload = createdVariant.id || createdVariant.data?.id
      }

      if (!expandedProductIds.value.includes(Number(f.productId))) {
        expandedProductIds.value = [
          ...expandedProductIds.value,
          Number(f.productId),
        ]
      }

      closeModal()
      await loadInventory()
    } catch (error_) {
      modalError.value = error_?.message || 'Không thể lưu biến thể.'
    } finally {
      saving.value = false
    }
  }

  function confirmDelete (v) {
    deleteTarget.value = v
  }

  async function viewQR (variant) {
    qrVariant.value = variant
    qrImageUrl.value = ''
    showQrModal.value = true

    try {
      const productId = variant.productId || variant.product_id
      if (!productId) {
        throw new Error('Không tìm thấy ID sản phẩm')
      }

      // Sinh QR từ productId trực tiếp ở frontend
      const dataUrl = await QRCode.toDataURL(String(productId), {
        width: 300,
        margin: 2,
      })
      qrImageUrl.value = dataUrl
    } catch (error_) {
      console.error('Lỗi lấy QR:', error_)
      alert('Không thể tạo mã QR cho sản phẩm này.')
      showQrModal.value = false
    }
  }

  function printQrCode () {
    if (!qrImageUrl.value) {
      alert('Mã QR chưa sẵn sàng. Vui lòng thử lại.')
      return
    }

    const printWindow = window.open('', '', 'width=600,height=600')
    printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Mã Sản Phẩm: #${qrVariant.value?.productId || qrVariant.value?.product_id}
          </div>
          <div class="name">
            Sản phẩm: ${qrVariant.value?.productName || ''}</title>
        <style>
          body {
            margin: 0;
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            font-family: Arial, sans-serif;
            min-height: 100vh;
            background: white;
          }
          h1 {
            font-size: 20px;
            margin-bottom: 20px;
            text-align: center;
          }
          img {
            max-width: 400px;
            height: auto;
            border: 1px solid #ddd;
            padding: 10px;
            background: white;
          }
          @media print {
            body {
              padding: 0;
            }
          }
        </style>
      </head>
      <body>
        <h1>Mã Sản Phẩm: #${qrVariant.value?.productId || qrVariant.value?.product_id}</h1>
        <h2>Sản phẩm: ${qrVariant.value?.productName || ''}</h2>
        <img src="${qrImageUrl.value}" alt="QR Code" />
      </body>
    </html>
  `)
    printWindow.document.close()
    printWindow.addEventListener('load', () => {
      printWindow.print()
    })
  }
  async function doDelete () {
    if (!deleteTarget.value) return

    deleting.value = true
    try {
      const result = await adminApi.deleteVariant(deleteTarget.value.id)

      if (result && result.softDeleted) {
        if (
          !hiddenVariants.value.some(
            variant => Number(variant.id) === Number(deleteTarget.value.id),
          )
        ) {
          hiddenVariants.value.push(deleteTarget.value)
        }
        deleteTarget.value = null
        return
      }

      deleteTarget.value = null
      await loadInventory()
    } catch (error_) {
      error.value = error_?.message || 'Không thể xóa biến thể.'
    } finally {
      deleting.value = false
    }
  }

  async function restoreVariant (variant) {
    try {
      await adminApi.restoreVariant(variant.id, variant.stockQuantity)
      const restoredId = Number(variant?.id)
      hiddenVariants.value = hiddenVariants.value.filter(
        hidden => Number(hidden.id) !== restoredId,
      )
      await loadInventory()
    } catch {
      error.value = 'Không thể khôi phục biến thể.'
    }
  }

  async function hardDeleteVariant (variant) {
    if (!confirm('Bạn có chắc chắn muốn xóa vĩnh viễn biến thể này? Hành động này không thể hoàn tác!')) {
      return
    }
    try {
      await adminApi.hardDeleteVariant(variant.id)
      const deletedId = Number(variant?.id)
      hiddenVariants.value = hiddenVariants.value.filter(
        hidden => Number(hidden.id) !== deletedId,
      )
      await loadInventory()
    } catch {
      error.value = 'Không thể xóa vĩnh viễn biến thể này. Có thể nó đang được sử dụng trong các đơn hàng.'
    }
  }

  async function restoreAllHiddenVariants () {
    try {
      for (const variant of hiddenVariants.value) {
        await adminApi.restoreVariant(variant.id, variant.stockQuantity)
      }
      hiddenVariants.value = []
      await loadInventory()
    } catch {
      error.value = 'Có lỗi xảy ra khi khôi phục.'
    }
  }

  async function loadInventory () {
    loading.value = true
    error.value = ''

    try {
      const [variantData, productData, colorData, sizeData] = await Promise.all([
        adminApi.getVariants({ page: 0, size: 500 }),
        adminApi.getProducts({ page: 0, size: 500 }),
        colorsApi.getAll().catch(() => []),
        sizesApi.getAll().catch(() => []),
      ])

      const normalizedProducts = Array.isArray(productData) ? productData : []
      const normalizedColors = toList(colorData)
      const normalizedSizes = toList(sizeData)

      products.value = normalizedProducts
      colors.value = normalizedColors
      sizes.value = normalizedSizes
      variants.value = hydrateVariants(
        Array.isArray(variantData) ? variantData : [],
        normalizedProducts,
        normalizedColors,
        normalizedSizes,
      )
    } catch (error_) {
      console.error('Failed to load inventory:', error_)
      error.value
        = 'Không thể tải dữ liệu biến thể. Vui lòng kiểm tra backend API.'
    } finally {
      loading.value = false
    }
  }
  watch(showQrModal, newVal => {
    if (!newVal && qrImageUrl.value && qrImageUrl.value.startsWith('blob:')) {
      URL.revokeObjectURL(qrImageUrl.value)
      qrImageUrl.value = ''
    }
  })
  defineExpose({
    openCreate,
    openBulkCreate,
    resetFilters,
    loadInventory,
    setSearchKeyword,
    setExternalFilters,
    products,
    colors,
    sizes,
  })

  onMounted(loadInventory)
</script>
