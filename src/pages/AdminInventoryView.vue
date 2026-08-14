<template>
  <div class="space-y-5">
    <section v-if="!props.hideHeader" class="retail-card p-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p class="text-xs uppercase tracking-[0.18em] text-primary">
            Quáº£n lÃ½ sáº£n pháº©m
          </p>
          <h2 class="mt-1 text-2xl font-bold">Quáº£n lÃ½ biáº¿n thá»ƒ</h2>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-xl bg-primary px-3 py-2 text-sm font-semibold text-white hover:opacity-90"
            @click="openCreate"
          >
            <span class="material-symbols-outlined text-[18px]">add</span>
            ThÃªm biáº¿n thá»ƒ
          </button>

          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-3 py-2 text-sm font-semibold text-white hover:bg-orange-600 dark:hover:bg-orange-700"
            @click="openBulkCreate"
          >
            <span class="material-symbols-outlined text-[18px]">library_add</span>
            Sinh biáº¿n thá»ƒ hÃ ng loáº¡t
          </button>

          <button
            type="button"
            class="inline-flex items-center gap-2  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 text-sm font-medium hover:border-primary hover:text-primary "
            @click="resetFilters"
          >
            <span class="material-symbols-outlined text-[18px]"
              >filter_alt_off</span
            >
            XÃ³a bá»™ lá»c
          </button>

          <button
            type="button"
            class="inline-flex items-center gap-2  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 text-sm font-medium hover:border-primary hover:text-primary "
            @click="loadInventory"
          >
            <span class="material-symbols-outlined text-[18px]">refresh</span>
            LÃ m má»›i
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
            <span class="material-symbols-outlined text-[18px] text-slate-400"
              >search</span
            >
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="TÃ¬m theo ID, sáº£n pháº©m, mÃ u, size..."
              class="w-full bg-transparent text-sm outline-none"
              @input="handleSearch"
            />
          </label>

          <button
            type="button"
            class="inline-flex items-center justify-center gap-2  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-4 py-2 text-sm font-medium hover:border-primary hover:text-primary "
            @click="showFilters = !showFilters"
          >
            <span class="material-symbols-outlined text-[18px]">tune</span>
            {{ showFilters ? "áº¨n bá»™ lá»c" : "Hiá»‡n bá»™ lá»c" }}
          </button>
        </div>
      </section>

      <!-- Advanced Filters -->
      <section v-if="showFilters && !props.hideFilterControls" class="retail-card p-4">
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label class="mb-1 block text-xs font-medium text-slate-500"
              >Sáº£n pháº©m</label
            >
            <select
              v-model="filters.productId"
              class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 text-sm "
              @change="applyFilters"
            >
              <option :value="null">Táº¥t cáº£ sáº£n pháº©m</option>
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
            <label class="mb-1 block text-xs font-medium text-slate-500"
              >MÃ u sáº¯c</label
            >
            <select
              v-model="filters.colorId"
              class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 text-sm "
              @change="applyFilters"
            >
              <option :value="null">Táº¥t cáº£ mÃ u</option>
              <option v-for="color in colors" :key="color.id" :value="color.id">
                {{ color.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="mb-1 block text-xs font-medium text-slate-500"
              >Size</label
            >
            <select
              v-model="filters.sizeId"
              class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 text-sm "
              @change="applyFilters"
            >
              <option :value="null">Táº¥t cáº£ size</option>
              <option v-for="size in sizes" :key="size.id" :value="size.id">
                {{ size.name }}
              </option>
            </select>
          </div>

          <div>
            <label class="mb-1 block text-xs font-medium text-slate-500"
              >Tráº¡ng thÃ¡i biáº¿n thá»ƒ</label
            >
            <select
              v-model="filters.stockStatus"
              class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 text-sm "
              @change="applyFilters"
            >
              <option :value="null">Táº¥t cáº£</option>
              <option value="selling">Äang bÃ¡n</option>
              <option value="out_of_stock">Háº¿t hÃ ng (0)</option>
              <option value="hidden">Ngá»«ng bÃ¡n</option>
              <option value="low_stock">Sáº¯p háº¿t (&lt; 10)</option>
              <option value="in_stock">CÃ²n hÃ ng (â‰¥ 10)</option>
            </select>
          </div>

          <div>
            <label class="mb-1 block text-xs font-medium text-slate-500"
              >GiÃ¡ tá»« (VND)</label
            >
            <input
              v-model.number="filters.minPrice"
              type="number"
              min="0"
              step="10000"
              placeholder="0"
              class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 text-sm "
              @input="applyFilters"
            />
          </div>

          <div>
            <label class="mb-1 block text-xs font-medium text-slate-500"
              >GiÃ¡ Ä‘áº¿n (VND)</label
            >
            <input
              v-model.number="filters.maxPrice"
              type="number"
              min="0"
              step="10000"
              placeholder="KhÃ´ng giá»›i háº¡n"
              class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 text-sm "
              @input="applyFilters"
            />
          </div>

          <div>
            <label class="mb-1 block text-xs font-medium text-slate-500"
              >ID tá»«</label
            >
            <input
              v-model.number="filters.minId"
              type="number"
              min="1"
              placeholder="1"
              class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 text-sm "
              @input="applyFilters"
            />
          </div>

          <div>
            <label class="mb-1 block text-xs font-medium text-slate-500"
              >ID Ä‘áº¿n</label
            >
            <input
              v-model.number="filters.maxId"
              type="number"
              min="1"
              placeholder="KhÃ´ng giá»›i háº¡n"
              class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 text-sm "
              @input="applyFilters"
            />
          </div>
        </div>

        <div
          class="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-slate-200 pt-4 "
        >
          <div class="text-sm text-slate-500 ">
            <span class="font-semibold text-slate-700 ">{{
              filteredVariants.length
            }}</span>
            / {{ variants.length }} biáº¿n thá»ƒ
          </div>
          <div class="flex gap-2">
            <button
              type="button"
              class="rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-200 "
              @click="applyFilters"
            >
              Ãp dá»¥ng
            </button>
            <button
              type="button"
              class="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium hover:border-primary hover:text-primary "
              @click="resetFilters"
            >
              Äáº·t láº¡i
            </button>
          </div>
        </div>
      </section>

            <!-- Modal: Cáº­p nháº­t áº£nh theo nhÃ³m mÃ u -->
      <Teleport to="body">
        <div v-if="showBulkImageModal" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 overflow-y-auto">
          <section class="retail-card p-5 w-full max-w-3xl flex flex-col max-h-[90vh] overflow-y-auto relative animate-[fadeIn_0.2s_ease-out]">
            <button @click="showBulkImageModal = false" class="absolute top-4 right-4 text-slate-400 hover:text-slate-800">
              <span class="material-symbols-outlined">close</span>
            </button>
            <div class="mb-4 flex items-center justify-between gap-2">
              <div>
                <h3 class="text-lg font-bold text-slate-800">Cáº­p nháº­t áº£nh theo nhÃ³m mÃ u</h3>
              <p class="text-xs text-slate-500 ">
                1 bá»™ áº£nh Ã¡p dá»¥ng cho toÃ n bá»™ biáº¿n thá»ƒ cÃ¹ng mÃ u (khÃ¡c size).
              </p>
              <p class="text-[11px] text-slate-500 ">
                LuÃ´n cá»‘ Ä‘á»‹nh 5 áº£nh: áº¢nh chÃ­nh + 4 áº£nh phá»¥. Upload má»›i sáº½ ghi Ä‘Ã¨
                Ä‘Ãºng slot, khÃ´ng cá»™ng dá»“n.
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
              <label class="mb-1 block text-xs font-medium text-slate-500"
                >Sáº£n pháº©m</label
              >
              <select
                v-model.number="bulkImageProductId"
                class="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm "
                @change="openBulkImageForGroup(bulkImageProductId, null)"
              >
                <option :value="null">-- Chá»n sáº£n pháº©m --</option>
                <option v-for="p in products" :key="p.id" :value="Number(p.id)">
                  {{ p.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-500"
                >MÃ u</label
              >
              <select
                v-model.number="bulkImageColorId"
                class="w-full rounded-lg border border-slate-300 bg-white px-2.5 py-1.5 text-sm "
                :disabled="!bulkImageProductId"
                @change="preloadBulkSlotsFromVariantDetails"
              >
                <option :value="null">-- Chá»n mÃ u --</option>
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
              <div class="text-xs text-slate-500">Biáº¿n thá»ƒ trong nhÃ³m</div>
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
                  :src="slotSource(bulkImageSlots, entry.key)"
                  :alt="entry.label"
                  class="h-full w-full object-cover"
                />
                <div
                  v-else
                  class="flex h-full items-center justify-center text-[10px] text-slate-400"
                >
                  Trá»‘ng
                </div>
              </div>
              <label
                class="block cursor-pointer rounded-md border border-slate-300 px-1.5 py-1 text-center text-[10px] font-medium hover:border-primary hover:text-primary "
              >
                Chá»n áº£nh thay slot
                <input
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="
                    handleImageUploadForSlots(bulkImageSlots, entry.key, $event)
                  "
                />
              </label>
              <button
                type="button"
                v-if="slotSource(bulkImageSlots, entry.key)"
                class="mt-1 block w-full rounded-md border border-red-300 px-1.5 py-1 text-center text-[10px] font-medium text-red-600 hover:bg-red-50"
                @click="clearImageSlotForSlots(bulkImageSlots, entry.key)"
              >
                XÃ³a áº£nh
              </button>
            </div>
          </div>

          <div class="mt-2 flex flex-wrap items-center gap-2">
            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-lg bg-primary px-2.5 py-1.5 text-xs font-semibold text-white hover:opacity-90 disabled:opacity-60"
              :disabled="applyingBulkImages"
              @click="applyBulkImagesToColorGroup"
            >
              <span class="material-symbols-outlined text-[16px]"
                >cloud_upload</span
              >
              {{
                applyingBulkImages
                  ? "Äang Ã¡p dá»¥ng..."
                  : "Ãp dá»¥ng cho toÃ n bá»™ nhÃ³m mÃ u"
              }}
            </button>
            <p
              v-if="bulkImageProductId && bulkImageColorId"
              class="text-[11px] text-slate-500 "
            >
              Äang Ä‘á»c áº£nh tá»« {{ bulkTargetVariants.length }} biáº¿n thá»ƒ trong nhÃ³m
              mÃ u Ä‘Ã£ chá»n.
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
              <span class="text-slate-500">Tá»•ng sáº£n pháº©m:</span>
              <span class="font-semibold text-slate-800">{{ totalProductsCount }}</span>
            </div>
            <div class="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 whitespace-nowrap">
              <span class="text-slate-500">CÃ²n hÃ ng:</span>
              <span class="font-semibold text-green-600">{{ inStockCount }}</span>
            </div>
            <div class="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 whitespace-nowrap">
              <span class="text-slate-500">Sáº¯p háº¿t:</span>
              <span class="font-semibold text-yellow-600">{{ lowStockCount }}</span>
            </div>
            <div class="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 whitespace-nowrap">
              <span class="text-slate-500">Háº¿t hÃ ng:</span>
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
              <p class="font-semibold">Biáº¿n thá»ƒ áº©n táº¡m</p>
              <p class="text-xs text-slate-500 ">
                Nhá»¯ng biáº¿n thá»ƒ Ä‘Ã£ xÃ³a má»m sáº½ táº¡m áº©n khá»i danh sÃ¡ch Ä‘Æ°á»£c dÃ¹ng.
                Báº¡n cÃ³ thá»ƒ khÃ´i phá»¥c láº¡i khi cáº§n.
              </p>
            </div>
            <button
              type="button"
              class="rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-white hover:opacity-90"
              @click="restoreAllHiddenVariants"
            >
              KhÃ´i phá»¥c táº¥t cáº£
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
                <span class="ml-2"
                  >{{ variant.productName || "Sáº£n pháº©m" }} -
                  {{ variant.colorName || "" }}
                  {{ variant.sizeName || "" }}</span
                >
              </div>
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  class="rounded-xl bg-emerald-500 px-3 py-2 text-xs font-semibold text-slate-800 hover:bg-emerald-600"
                  @click="restoreVariant(variant)"
                >
                  KhÃ´i phá»¥c
                </button>
                <button
                  type="button"
                  class="rounded-xl bg-red-500 px-3 py-2 text-xs font-semibold text-white hover:bg-red-600"
                  @click="hardDeleteVariant(variant)"
                >
                  XÃ³a háº³n
                </button>
              </div>
            </div>
          </div>
        </div>

        <div
          v-if="loading"
          class="py-10 text-center text-sm text-slate-500 "
        >
          Äang táº£i dá»¯ liá»‡u tá»“n kho...
        </div>

        <div
          v-else-if="filteredVariants.length === 0"
          class="rounded-2xl border border-dashed border-slate-300 p-8 text-center text-sm text-slate-500 "
        >
          KhÃ´ng cÃ³ dá»¯ liá»‡u tá»“n kho phÃ¹ há»£p.
        </div>

        <div v-else class="space-y-3">
          <article
            v-for="group in groupedVariants"
            :key="group.productId"
            class="rounded-xl border-2 border-slate-300 bg-white/70 shadow-sm "
          >
            <button
              type="button"
              class="flex w-full items-center justify-between gap-3 rounded-xl px-3 py-2.5 text-left hover:bg-slate-50 dark:hover:bg-white"
              @click="toggleProductExpand(group.productId)"
            >
              <div class="min-w-0">
                <p class="truncate text-sm font-semibold">
                  {{ group.productName }}
                </p>
                <p class="text-xs text-slate-500 ">
                  {{ group.variants.length }} biáº¿n thá»ƒ â€¢
                  {{ group.colorCount }} mÃ u â€¢ {{ group.sizeCount }} size â€¢ Tá»“n
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
                        :src="img"
                        alt="preview"
                        class="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  <span class="text-[11px] text-slate-500 "
                    >+{{ group.previewCount }}</span
                  >
                </div>
                <button
                  type="button"
                  class="rounded-lg border border-slate-300 px-2 py-1 text-xs font-medium hover:border-primary hover:text-primary "
                  @click.stop="openBulkImageForGroup(group.productId)"
                >
                  Sá»­a áº£nh theo mÃ u
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
                      #{{ v.id }} â€¢ {{ v.colorName || "N/A" }} /
                      {{ v.sizeName || "N/A" }}
                    </p>
                    <p class="mt-1 text-slate-500 ">
                      {{ formatCurrency(v.price) }} â€¢ Tá»“n:
                      {{ v.stockQuantity ?? 0 }} â€¢ áº¢nh:
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
                      title="Chá»‰nh sá»­a"
                      @click.stop="openEdit(v)"
                    >
                      <span
                        class="material-symbols-outlined text-[18px] text-slate-500"
                        >edit</span
                      >
                    </button>
                    <button
                      class="rounded-lg p-1.5 hover:bg-red-50 dark:hover:bg-red-900/20"
                      title="XÃ³a"
                      @click.stop="confirmDelete(v)"
                    >
                      <span
                        class="material-symbols-outlined text-[18px] text-red-500"
                        >delete</span
                      >
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
        MÃ£ QR - Sáº£n pháº©m #{{ qrVariant?.productId || qrVariant?.product_id }}
      </h3>
      <div v-if="qrImageUrl" class="mx-auto flex justify-center">
        <img :src="qrImageUrl" alt="QR Code" class="max-w-full h-auto" />
      </div>
      <div v-else class="py-4 text-sm text-slate-500">Äang táº£i mÃ£ QR...</div>
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
          ÄÃ³ng
        </button>
      </div>
    </div>
  </div>
</Teleport>
    <!-- Modal ThÃªm/Sá»­a -->
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
              {{ editingId ? `Sá»­a biáº¿n thá»ƒ #${editingId}` : "ThÃªm biáº¿n thá»ƒ má»›i" }}
            </h3>
            
            <div v-if="editingId" class="mb-4 flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200 ">
              <div>
                <p class="text-xs font-medium text-slate-500 ">áº¢nh cá»§a nhÃ³m mÃ u nÃ y</p>
                <div class="flex items-center gap-1 mt-1">
                  <div v-for="entry in imageSlotEntries" :key="entry.key" class="size-8 rounded-md overflow-hidden bg-slate-200 /50 border border-slate-300 ">
                    <img v-if="slotSource(bulkImageSlots, entry.key)" :src="slotSource(bulkImageSlots, entry.key)" class="w-full h-full object-cover" />
                  </div>
                </div>
              </div>
              <button type="button" @click="openBulkImageForGroup(form.productId, bulkImageColorId)" class="text-xs font-semibold text-primary hover:underline">
                Xem / Sá»­a áº£nh
              </button>
            </div>

          <div class="space-y-3">
            <div>
              <label class="mb-1 block text-xs font-medium text-slate-500"
                >Sáº£n pháº©m *</label
              >
              <select
                v-model.number="form.productId"
                class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-1.5 text-sm "
              >
                <option :value="null">-- Chá»n sáº£n pháº©m --</option>
                <option v-for="p in products" :key="p.id" :value="Number(p.id)">
                  {{ p.name }}
                </option>
              </select>
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-500"
                >MÃ u sáº¯c *</label
              >
              <input
                v-model="form.colorName"
                list="colorOptionsList"
                placeholder="-- Chá»n hoáº·c nháº­p mÃ u má»›i --"
                class="w-full shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-1.5 text-sm rounded-xl border border-slate-200 outline-none focus:border-primary"
              />
              <datalist id="colorOptionsList">
                <option v-for="c in availableColorsForForm" :key="c.id" :value="c.name"></option>
              </datalist>
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-500"
                >Size *</label
              >
              <select
                v-model.number="form.sizeId"
                class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-1.5 text-sm "
              >
                <option :value="null">-- Chá»n size --</option>
                <option v-for="s in availableSizesForForm" :key="s.id" :value="Number(s.id)">
                  {{ s.name }}
                </option>
              </select>
            </div>

            <div class="grid grid-cols-2 gap-3">
              <div>
                <label class="mb-1 block text-xs font-medium text-slate-500"
                  >GiÃ¡ (VND) *</label
                >
                <input
                  v-model.number="form.price"
                  type="number"
                  min="0"
                  class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-1.5 text-sm "
                />
              </div>
              <div>
                <label class="mb-1 block text-xs font-medium text-slate-500"
                  >Tá»“n kho *</label
                >
                <input
                  v-model.number="form.stockQuantity"
                  type="number"
                  min="0"
                  class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-1.5 text-sm "
                />
              </div>
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-500"
                >Tráº¡ng thÃ¡i bÃ¡n *</label
              >
              <select
                v-model="form.status"
                class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-1.5 text-sm "
              >
                <option value="SELLING">Äang bÃ¡n</option>
                <option value="OUT_OF_STOCK">Háº¿t hÃ ng</option>
                <option value="HIDDEN">Ngá»«ng bÃ¡n</option>
              </select>
            </div>

            <p
              class="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-700 /50 /20 "
            >
              áº¢nh biáº¿n thá»ƒ Ä‘Æ°á»£c quáº£n lÃ½ táº­p trung theo nhÃ³m mÃ u á»Ÿ má»¥c "Cáº­p nháº­t
              áº£nh theo nhÃ³m mÃ u" phÃ­a trÃªn.
            </p>
          </div>

          <p v-if="modalError" class="mt-3 text-xs text-red-500">
            {{ modalError }}
          </p>

          <div class="mt-4 flex justify-end gap-2">
            <button
              type="button"
              class="rounded-xl border border-slate-200 px-3 py-1.5 text-sm font-medium hover:border-slate-400 "
              @click="closeModal"
            >
              Há»§y
            </button>
            <button
              type="button"
              :disabled="saving"
              class="rounded-xl bg-primary px-3 py-1.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
              @click="saveVariant"
            >
              {{ saving ? "Äang lÆ°u..." : editingId ? "Cáº­p nháº­t" : "ThÃªm má»›i" }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

    <!-- Modal XÃ¡c nháº­n xÃ³a -->
    <Teleport to="body">
      <div
        v-if="deleteTarget"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        @click.self="deleteTarget = null"
      >
        <div
          class="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl "
        >
          <h3 class="mb-2 text-base font-bold">XÃ¡c nháº­n xÃ³a</h3>
          <p class="text-sm text-slate-500 ">
            Báº¡n cháº¯c cháº¯n muá»‘n xÃ³a biáº¿n thá»ƒ
            <strong>#{{ deleteTarget.id }}</strong>
            ({{ deleteTarget.productName }} - {{ deleteTarget.colorName }} /
            {{ deleteTarget.sizeName }})?
          </p>
          <div class="mt-5 flex justify-end gap-3">
            <button
              class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium "
              @click="deleteTarget = null"
            >
              Há»§y
            </button>
            <button
              :disabled="deleting"
              class="rounded-xl bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600 disabled:opacity-60"
              @click="doDelete"
            >
              {{ deleting ? "Äang xÃ³a..." : "XÃ³a" }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  
        <!-- Modal Sinh Biáº¿n Thá»ƒ HÃ ng Loáº¡t -->
    <Teleport to="body">
      <div v-if="showBulkModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" @click.self="closeBulkModal">
        <div class="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl ">
          <h3 class="mb-4 text-lg font-bold">Sinh Biáº¿n Thá»ƒ HÃ ng Loáº¡t</h3>
          
          <div class="grid gap-4">
            <div>
              <label class="mb-1 block text-sm font-medium text-slate-500">Sáº£n pháº©m *</label>
              <select v-model="bulkForm.productId" class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 text-sm ">
                <option :value="null">-- Chá»n sáº£n pháº©m --</option>
                <option v-for="p in products" :key="p.id" :value="p.id">{{ p.name }}</option>
              </select>
            </div>

            <div class="grid md:grid-cols-2 gap-4">
              <div class="border rounded-xl p-3 border-slate-200 ">
                <label class="mb-2 block text-sm font-medium text-slate-500">Chá»n MÃ u Sáº¯c *</label>
                <div class="max-h-40 overflow-y-auto space-y-1">
                  <label v-for="c in availableColorsForBulk" :key="c.id" class="flex items-center gap-2 text-sm cursor-pointer hover:bg-slate-50 p-1 rounded dark:hover:bg-white">
                    <input type="checkbox" :value="c.id" v-model="bulkForm.selectedColors" class="rounded border-slate-300" />
                    {{ c.name }}
                  </label>
                </div>
              </div>

              <div class="border rounded-xl p-3 border-slate-200 ">
                <label class="mb-2 block text-sm font-medium text-slate-500">Chá»n KÃ­ch Cá»¡ *</label>
                <div class="max-h-40 overflow-y-auto space-y-1">
                  <label v-for="s in availableSizesForBulk" :key="s.id" class="flex items-center gap-2 text-sm cursor-pointer hover:bg-slate-50 p-1 rounded dark:hover:bg-white">
                    <input type="checkbox" :value="s.id" v-model="bulkForm.selectedSizes" class="rounded border-slate-300" />
                    {{ s.name }}
                  </label>
                </div>
              </div>
            </div>

            <div class="grid md:grid-cols-2 gap-4">
              <div>
                <label class="mb-1 block text-sm font-medium text-slate-500">GiÃ¡ bÃ¡n chung (VND) *</label>
                <input v-model.number="bulkForm.price" type="number" min="0" class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 text-sm " />
              </div>
              <div>
                <label class="mb-1 block text-sm font-medium text-slate-500">Sá»‘ lÆ°á»£ng biáº¿n thá»ƒ chung *</label>
                <input v-model.number="bulkForm.stockQuantity" type="number" min="0" class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 text-sm " />
              </div>
            </div>
            
            <div class="rounded-lg bg-blue-50 p-3 text-sm text-blue-700 /20 ">
              Sáº½ táº¡o ra: <strong>{{ newCombinationsCount }}</strong> biáº¿n thá»ƒ.
            </div>

            <p v-if="bulkError" class="text-sm text-red-500 font-medium">{{ bulkError }}</p>
          </div>

          <div class="mt-6 flex justify-end gap-3 border-t border-slate-200 pt-4 ">
            <button type="button" class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:bg-slate-50 dark:hover:bg-white" @click="closeBulkModal">Há»§y</button>
            <button type="button" :disabled="bulkGenerating || !bulkForm.productId || newCombinationsCount === 0" class="rounded-xl bg-orange-500 px-4 py-2 text-sm font-medium text-white hover:bg-orange-600 disabled:opacity-50" @click="doBulkCreate">
              {{ bulkGenerating ? "Äang xá»­ lÃ½..." : "Báº¯t Ä‘áº§u táº¡o" }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

  </div>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import axios from "axios";
import AdminShell from "@/components/admin/AdminShell.vue";
import { adminApi, colorsApi, sizesApi, variantsApi } from "@/services/api";
import { resolveImageUrl } from "@/services/api";
import QRCode from 'qrcode';

function removeVietnameseTones(str) { if (!str) return ""; return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D"); }

function getInitials(str) {
  if (!str) return "XX";
  const clean = removeVietnameseTones(str).toUpperCase().trim();
  const words = clean.split(/\s+/);
  if (words.length === 1) return words[0].substring(0, 3) || "XX";
  return words.map(w => w[0]).join('');
}

function getVariantCode(product, variant) {
  const pCode = product.productCode || product.id || "SP";
  const cCode = getInitials(variant.colorName || "");
  const sCode = (variant.sizeName || "").toUpperCase().trim();
  return `--`;
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
});
// Biáº¿n state cho QR
const showQrModal = ref(false);
const qrVariant = ref(null);
const qrImageUrl = ref("");
// Bulk create state
const showBulkModal = ref(false);
const bulkForm = ref({
  productId: null,
  selectedColors: [],
  selectedSizes: [],
  price: 0,
  stockQuantity: 0,
});
const bulkGenerating = ref(false);
const bulkError = ref("");
const bulkSuccess = ref("");

function openBulkCreate() {
  bulkForm.value = {
    productId: null,
    selectedColors: [],
    selectedSizes: [],
    price: 0,
    stockQuantity: 0,
  };
  bulkError.value = "";
  bulkSuccess.value = "";
  showBulkModal.value = true;
}

function closeBulkModal() {
  showBulkModal.value = false;
}

async function doBulkCreate() {
  bulkError.value = "";
  bulkSuccess.value = "";
  
  const { productId, selectedColors, selectedSizes, price, stockQuantity } = bulkForm.value;
  
  if (!productId) {
    bulkError.value = "Vui lÃ²ng chá»n sáº£n pháº©m.";
    return;
  }
  if (!selectedColors.length || !selectedSizes.length) {
    bulkError.value = "Vui lÃ²ng chá»n Ã­t nháº¥t 1 mÃ u vÃ  1 size.";
    return;
  }
  if (price < 0 || stockQuantity < 0) {
    bulkError.value = "GiÃ¡ vÃ  sá»‘ lÆ°á»£ng pháº£i lá»›n hÆ¡n hoáº·c báº±ng 0.";
    return;
  }

  bulkGenerating.value = true;
  
  let successCount = 0;
  let errorCount = 0;

  for (const colorId of selectedColors) {
    for (const sizeId of selectedSizes) {
      const exists = rawVariants.value.some(v => v.productId === productId && v.colorId === colorId && v.sizeId === sizeId);
      if (exists) continue;

      try {
        await adminApi.createVariant({
          productId,
          colorId,
          sizeId,
          price,
          stockQuantity,
          status: "SELLING"
        });
        successCount++;
      } catch (err) {
        console.error("Lá»—i khi táº¡o biáº¿n thá»ƒ mÃ u " + colorId + " size " + sizeId, err);
        errorCount++;
      }
    }
  }

  bulkGenerating.value = false;
  if (errorCount > 0) {
    bulkError.value = "ÄÃ£ táº¡o thÃ nh cÃ´ng " + successCount + " biáº¿n thá»ƒ. Tháº¥t báº¡i " + errorCount + " biáº¿n thá»ƒ (cÃ³ thá»ƒ do Ä‘Ã£ tá»“n táº¡i).";
  } else {
    showBulkModal.value = false;
    await loadInventory();
  }
}

const loading = ref(false);
const error = ref("");
const searchKeyword = ref("");
const showFilters = ref(false);
const variants = ref([]);
const rawVariants = ref([]);
const products = ref([]);
const colors = ref([]);
const sizes = ref([]);
const hiddenVariants = ref([]);

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
});

const expandedProductIds = ref([]);

const visibleVariants = computed(() => {
  return variants.value.filter(
    (variant) =>
      !hiddenVariants.value.some(
        (hidden) => Number(variant.id) === Number(hidden.id),
      ),
  );
});

const showModal = ref(false);
const editingId = ref(null);
const saving = ref(false);
const modalError = ref("");
const form = ref(emptyForm());

const availableColorsForForm = computed(() => {
  if (!form.value.productId || !form.value.sizeId) return colors.value;
  const existingVariants = visibleVariants.value.filter(v => 
    Number(v.productId) === Number(form.value.productId) && 
    Number(v.sizeId) === Number(form.value.sizeId) && 
    Number(v.id) !== Number(editingId.value)
  );
  const usedColorIds = new Set(existingVariants.map(v => Number(v.colorId)));
  return colors.value.filter(c => !usedColorIds.has(Number(c.id)));
});

const availableSizesForForm = computed(() => {
  if (!form.value.productId || !form.value.colorName) return sizes.value;
  const selectedColor = colors.value.find(c => c.name.toLowerCase() === form.value.colorName.toLowerCase());
  if (!selectedColor) return sizes.value;
  
  const existingVariants = visibleVariants.value.filter(v => 
    Number(v.productId) === Number(form.value.productId) && 
    Number(v.colorId) === Number(selectedColor.id) && 
    Number(v.id) !== Number(editingId.value)
  );
  const usedSizeIds = new Set(existingVariants.map(v => Number(v.sizeId)));
  return sizes.value.filter(s => !usedSizeIds.has(Number(s.id)));
});

const availableColorsForBulk = computed(() => {
  if (!bulkForm.value.productId) return colors.value;
  const totalSizes = sizes.value.length;
  if (totalSizes === 0) return colors.value;
  return colors.value.filter(c => {
    const existingSizesCount = visibleVariants.value.filter(v => v.productId === bulkForm.value.productId && v.colorId === c.id).length;
    return existingSizesCount < totalSizes;
  });
});

const availableSizesForBulk = computed(() => {
  if (!bulkForm.value.productId) return sizes.value;
  const totalColors = colors.value.length;
  if (totalColors === 0) return sizes.value;
  return sizes.value.filter(s => {
    const existingColorsCount = visibleVariants.value.filter(v => v.productId === bulkForm.value.productId && v.sizeId === s.id).length;
    return existingColorsCount < totalColors;
  });
});

const newCombinationsCount = computed(() => {
  if (!bulkForm.value.productId) return 0;
  let count = 0;
  for (const cid of bulkForm.value.selectedColors) {
    for (const sid of bulkForm.value.selectedSizes) {
      const exists = visibleVariants.value.some(v => v.productId === bulkForm.value.productId && v.colorId === cid && v.sizeId === sid);
      if (!exists) count++;
    }
  }
  return count;
});

const deleteTarget = ref(null);
const deleting = ref(false);

const IMAGE_SLOT_KEYS = ["primary", "extra0", "extra1", "extra2", "extra3"];

function createImageSlot(label, required = false) {
  return {
    label,
    required,
    file: null,
    url: "",
    previewUrl: "",
    status: "idle",
    error: "",
  };
}

function createImageSlots() {
  return {
    primary: createImageSlot("áº¢nh chÃ­nh", true),
    extra0: createImageSlot("áº¢nh phá»¥ 1", true),
    extra1: createImageSlot("áº¢nh phá»¥ 2", true),
    extra2: createImageSlot("áº¢nh phá»¥ 3", true),
    extra3: createImageSlot("áº¢nh phá»¥ 4", true),
  };
}

const showBulkImageModal = ref(false);
const bulkImageProductId = ref(null);
const bulkImageColorId = ref(null);
const bulkImageSlots = ref(createImageSlots());
const bulkImageError = ref("");
const bulkImageSuccess = ref("");
const bulkImageNotice = ref("");
const applyingBulkImages = ref(false);
const bulkImagePreloadSeq = ref(0);

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

// Computed: Filtered variants
const filteredVariants = computed(() => {
  let result = [...visibleVariants.value];

  // Search by keyword
  if (searchKeyword.value) {
    const kw = searchKeyword.value.toLowerCase();
    result = result.filter((v) => {
      return (
        String(v.id).includes(kw) ||
        (v.productName && v.productName.toLowerCase().includes(kw)) ||
        (v.colorName && v.colorName.toLowerCase().includes(kw)) ||
        (v.sizeName && v.sizeName.toLowerCase().includes(kw))
      );
    });
  }

  // Filter by product
  if (filters.value.productId) {
    result = result.filter((v) => v.productId === filters.value.productId);
  }

  // Filter by color
  if (filters.value.colorId) {
    result = result.filter((v) => v.colorId === filters.value.colorId);
  }

  // Filter by size
  if (filters.value.sizeId) {
    result = result.filter((v) => v.sizeId === filters.value.sizeId);
  }

  // Filter by stock status
  if (filters.value.stockStatus) {
    result = result.filter((v) => {
      const stock = v.stockQuantity || 0;
      const status = normalizeVariantStatus(v.status, stock);
      if (filters.value.stockStatus === "selling") return status === "SELLING";
      if (filters.value.stockStatus === "out_of_stock") return stock === 0;
      if (filters.value.stockStatus === "hidden") return status === "HIDDEN";
      if (filters.value.stockStatus === "low_stock")
        return stock > 0 && stock < 10;
      if (filters.value.stockStatus === "in_stock") return stock >= 10;
      return true;
    });
  } else {
    // Máº·c Ä‘á»‹nh áº©n cÃ¡c biáº¿n thá»ƒ Ä‘Ã£ bá»‹ xÃ³a má»m (Ngá»«ng bÃ¡n) Ä‘á»ƒ trÃ¡nh rÃ¡c giao diá»‡n
    result = result.filter(v => normalizeVariantStatus(v.status, v.stockQuantity) !== "HIDDEN");
  }

  // Filter by price range
  if (
    filters.value.minPrice !== null &&
    filters.value.minPrice !== undefined &&
    filters.value.minPrice > 0
  ) {
    result = result.filter((v) => (v.price || 0) >= filters.value.minPrice);
  }
  if (
    filters.value.maxPrice !== null &&
    filters.value.maxPrice !== undefined &&
    filters.value.maxPrice > 0
  ) {
    result = result.filter((v) => (v.price || 0) <= filters.value.maxPrice);
  }

  // Filter by ID range
  if (
    filters.value.minId !== null &&
    filters.value.minId !== undefined &&
    filters.value.minId > 0
  ) {
    result = result.filter((v) => v.id >= filters.value.minId);
  }
  if (
    filters.value.maxId !== null &&
    filters.value.maxId !== undefined &&
    filters.value.maxId > 0
  ) {
    result = result.filter((v) => v.id <= filters.value.maxId);
  }

  // Sort by ID
  result.sort((a, b) => a.id - b.id);

  return result;
});

const groupedVariants = computed(() => {
  const grouped = new Map();
  for (const v of filteredVariants.value) {
    const key = Number(v.productId);
    if (!grouped.has(key)) {
      grouped.set(key, {
        productId: key,
        productName: v.productName || `Sáº£n pháº©m #${key}`,
        variants: [],
      });
    }
    grouped.get(key).variants.push(v);
  }

  return [...grouped.values()]
    .map((group) => ({
      ...group,
      variants: [...group.variants].sort((a, b) => (a.id || 0) - (b.id || 0)),
      totalStock: group.variants.reduce(
        (sum, item) => sum + Number(item.stockQuantity || 0),
        0,
      ),
      colorCount: new Set(group.variants.map((item) => item.colorId)).size,
      sizeCount: new Set(group.variants.map((item) => item.sizeId)).size,
      previewImages: [
        ...new Set(
          group.variants.flatMap((item) => {
            const urls = [];
            if (item.imageUrl) urls.push(item.imageUrl);
            if (Array.isArray(item.extraImages) && item.extraImages.length) {
              urls.push(...item.extraImages.filter(Boolean));
            }
            return urls;
          }),
        ),
      ].slice(0, 3),
      previewCount: group.variants.reduce((sum, item) => {
        const count =
          (item.imageUrl ? 1 : 0) +
          (Array.isArray(item.extraImages) ? item.extraImages.length : 0);
        return sum + count;
      }, 0),
    }))
    .sort((a, b) =>
      a.productName.localeCompare(b.productName, "vi", { sensitivity: "base" }),
    );
});

const bulkColorOptions = computed(() => {
  if (!bulkImageProductId.value) return [];
  const colorMap = new Map();
  for (const variant of variants.value) {
    if (Number(variant.productId) !== Number(bulkImageProductId.value))
      continue;
    if (!variant.colorId) continue;
    if (!colorMap.has(Number(variant.colorId))) {
      colorMap.set(Number(variant.colorId), {
        id: Number(variant.colorId),
        name: variant.colorName || `MÃ u #${variant.colorId}`,
      });
    }
  }
  return [...colorMap.values()].sort((a, b) =>
    a.name.localeCompare(b.name, "vi", { sensitivity: "base" }),
  );
});

const bulkTargetVariants = computed(() => {
  if (!bulkImageProductId.value || !bulkImageColorId.value) return [];
  return variants.value
    .filter(
      (item) =>
        Number(item.productId) === Number(bulkImageProductId.value) &&
        Number(item.colorId) === Number(bulkImageColorId.value),
    )
    .sort((a, b) => (a.id || 0) - (b.id || 0));
});

// Stock statistics
const totalProductsCount = computed(() => {
  return new Set(variants.value.map(v => v.productId)).size;
});

const productStockMap = computed(() => {
  const map = new Map();
  for (const v of variants.value) {
    const current = map.get(v.productId) || 0;
    map.set(v.productId, current + (Number(v.stockQuantity) || 0));
  }
  return map;
});

const inStockCount = computed(() => {
  let count = 0;
  for (const stock of productStockMap.value.values()) {
    if (stock >= 10) count++;
  }
  return count;
});

const lowStockCount = computed(() => {
  let count = 0;
  for (const stock of productStockMap.value.values()) {
    if (stock > 0 && stock < 10) count++;
  }
  return count;
});

const outOfStockCount = computed(() => {
  let count = 0;
  for (const stock of productStockMap.value.values()) {
    if (stock === 0) count++;
  }
  return count;
});

// Reset filters
function resetFilters() {
  filters.value = {
    productId: null,
    colorId: null,
    sizeId: null,
    stockStatus: null,
    minPrice: null,
    maxPrice: null,
    minId: null,
    maxId: null,
  };
  searchKeyword.value = "";
  applyFilters();
}

// Apply filters (reset to page 1)
function applyFilters() {
  // no-op: computed filters auto apply
}

// Handle search with debounce
let searchTimeout;
function handleSearch() {
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(() => {
    // no-op: computed filters auto apply
  }, 300);
}

function setSearchKeyword(value) {
  searchKeyword.value = value ?? "";
  handleSearch();
}

function setExternalFilters(nextFilters = {}) {
  filters.value = {
    ...filters.value,
    ...nextFilters,
  };
  applyFilters();
}

function isExpandedProduct(productId) {
  return expandedProductIds.value.includes(Number(productId));
}

function toggleProductExpand(productId) {
  const id = Number(productId);
  if (isExpandedProduct(id)) {
    expandedProductIds.value = expandedProductIds.value.filter(
      (item) => item !== id,
    );
    return;
  }
  expandedProductIds.value = [...expandedProductIds.value, id];
}

function resetSpecificImageSlots(targetSlotsRef) {
  if (!targetSlotsRef || typeof targetSlotsRef !== "object") return;
  if ("value" in targetSlotsRef) {
    targetSlotsRef.value = createImageSlots();
    return;
  }

  const fresh = createImageSlots();
  for (const key of IMAGE_SLOT_KEYS) {
    targetSlotsRef[key] = fresh[key];
  }
}

function isSlotCollection(candidate) {
  if (!candidate || typeof candidate !== "object") return false;
  return IMAGE_SLOT_KEYS.every((key) => key in candidate);
}

function ensureSlotsObject(targetSlotsRef) {
  if (!targetSlotsRef || typeof targetSlotsRef !== "object") {
    return createImageSlots();
  }

  // In Vue templates, refs are auto-unwrapped, so we may receive the slot object directly.
  if (isSlotCollection(targetSlotsRef)) {
    return targetSlotsRef;
  }

  if (!("value" in targetSlotsRef)) {
    return createImageSlots();
  }

  if (!isSlotCollection(targetSlotsRef.value)) {
    targetSlotsRef.value = createImageSlots();
  }

  return targetSlotsRef.value;
}

function normalizeSlotImageUrl(value) {
  if (!value) return "";
  let url = String(value).trim();
  if (!url) return "";

  // Backends sometimes return Windows-style paths (e.g. images\\foo.jpg).
  url = url.replace(/\\/g, "/");

  if (
    !/^https?:\/\//i.test(url) &&
    !url.startsWith("data:") &&
    !url.startsWith("/")
  ) {
    url = `/${url}`;
  }

  // Some backends persist API-routed asset paths that are not directly renderable by <img>.
  // Convert `/api/images/*` and `/api/uploads/*` to direct static paths.
  url = url
    .replace(/\/api\/images\//i, "/images/")
    .replace(/\/api\/uploads\//i, "/uploads/");

  if (/^https?:\/\/[^/]+\/api\/(images|uploads)\//i.test(url)) {
    url = url.replace(/\/api\/(images|uploads)\//i, "/$1/");
  }

  return resolveImageUrl(url);
}

function readVariantPrimary(variant) {
  const candidate =
    variant?.imageUrl ||
    variant?.image_url ||
    variant?.imgUrl ||
    variant?.img_url ||
    variant?.imagePath ||
    variant?.image_path ||
    null;

  return normalizeSlotImageUrl(candidate);
}

function readImageEntryValue(entry) {
  if (!entry) return "";
  if (typeof entry === "string") return normalizeSlotImageUrl(entry);
  if (typeof entry === "object") {
    const candidate =
      entry.url ||
      entry.imageUrl ||
      entry.image_url ||
      entry.path ||
      entry.imagePath ||
      entry.image_path ||
      "";
    return normalizeSlotImageUrl(candidate);
  }
  return "";
}

function bindVariantToSlots(targetSlotsRef, variant) {
  const slots = ensureSlotsObject(targetSlotsRef);
  const extra = readVariantExtras(variant);
  if (extra.length > 4) {
    bulkImageNotice.value = `NhÃ³m mÃ u nÃ y Ä‘ang cÃ³ ${extra.length + 1} áº£nh. Há»‡ thá»‘ng chá»‰ dÃ¹ng 5 áº£nh chuáº©n (1 chÃ­nh + tá»‘i Ä‘a 4 phá»¥), áº£nh dÆ° sáº½ bá»‹ bá» qua khi cáº­p nháº­t.`;
  }
  slots.primary.url = readVariantPrimary(variant);
  slots.primary.previewUrl = "";
  slots.extra0.url = normalizeSlotImageUrl(extra[0]);
  slots.extra0.previewUrl = "";
  slots.extra1.url = normalizeSlotImageUrl(extra[1]);
  slots.extra1.previewUrl = "";
  slots.extra2.url = normalizeSlotImageUrl(extra[2]);
  slots.extra2.previewUrl = "";
  slots.extra3.url = normalizeSlotImageUrl(extra[3]);
  slots.extra3.previewUrl = "";
}

function bindImageSetToSlots(targetSlotsRef, imageSet) {
  const slots = ensureSlotsObject(targetSlotsRef);
  const extra = Array.isArray(imageSet?.extraImages)
    ? imageSet.extraImages
    : [];

  slots.primary.url = normalizeSlotImageUrl(imageSet?.imageUrl);
  slots.primary.previewUrl = "";
  slots.extra0.url = normalizeSlotImageUrl(extra[0]);
  slots.extra0.previewUrl = "";
  slots.extra1.url = normalizeSlotImageUrl(extra[1]);
  slots.extra1.previewUrl = "";
  slots.extra2.url = normalizeSlotImageUrl(extra[2]);
  slots.extra2.previewUrl = "";
  slots.extra3.url = normalizeSlotImageUrl(extra[3]);
  slots.extra3.previewUrl = "";
}

function readVariantExtras(variant) {
  const direct = normalizeImageList(
    variant?.extraImages ?? variant?.extra_images ?? variant?.images ?? null,
  );
  if (direct.length) return direct;

  if (Array.isArray(variant?.images)) {
    const mapped = variant.images
      .map((entry) => readImageEntryValue(entry))
      .filter(Boolean);
    if (mapped.length) {
      return mapped.slice(0, 4);
    }
  }

  return [];
}

function buildGroupImageSet(list) {
  const rows = Array.isArray(list) ? list : [];
  const extras = ["", "", "", ""];
  let imageUrl = "";

  for (const variant of rows) {
    const primary = readVariantPrimary(variant);
    if (!imageUrl && primary) {
      imageUrl = primary;
    }

    const variantExtras = readVariantExtras(variant);
    for (let i = 0; i < 4; i += 1) {
      if (!extras[i] && variantExtras[i]) {
        extras[i] = variantExtras[i];
      }
    }
  }

  return {
    imageUrl,
    extraImages: extras,
  };
}

function slotSource(targetSlotsRef, slotKey) {
  const slots = ensureSlotsObject(targetSlotsRef);
  const slot = slots[slotKey];
  if (!slot) return "";
  if (slot.previewUrl) {
    return slot.previewUrl;
  }
  if (!slot.url) {
    return "";
  }
  return resolveImageUrl(slot.url);
}

function slotImageName(targetSlotsRef, slotKey) {
  const url = slotSource(targetSlotsRef, slotKey);
  if (!url) return "ChÆ°a cÃ³ áº£nh";
  try {
    const segment = String(url).split("?")[0].split("/").pop();
    return segment || "áº¢nh hiá»‡n táº¡i";
  } catch {
    return "áº¢nh hiá»‡n táº¡i";
  }
}

function handleImageUploadForSlots(targetSlotsRef, slotKey, event) {
  const slots = ensureSlotsObject(targetSlotsRef);
  const file = event.target?.files?.[0];
  if (!file) return;

  const slot = slots[slotKey];
  if (!slot) return;
  slot.error = "";

  if (!file.type.startsWith("image/")) {
    slot.error = "Vui lÃ²ng chá»n tá»‡p áº£nh há»£p lá»‡.";
    slot.status = "error";
    return;
  }

  if (file.size > 5 * 1024 * 1024) {
    slot.error = "KÃ­ch thÆ°á»›c áº£nh khÃ´ng Ä‘Æ°á»£c vÆ°á»£t quÃ¡ 5MB.";
    slot.status = "error";
    return;
  }

  if (slot.previewUrl && slot.previewUrl.startsWith("blob:")) {
    URL.revokeObjectURL(slot.previewUrl);
  }

  slot.file = file;
  slot.previewUrl = URL.createObjectURL(file);
  slot.status = "selected";
}

function clearImageSlotForSlots(targetSlotsRef, slotKey) {
  const slots = ensureSlotsObject(targetSlotsRef);
  const slot = slots[slotKey];
  if (!slot) return;
  if (slot.previewUrl && slot.previewUrl.startsWith("blob:")) {
    URL.revokeObjectURL(slot.previewUrl);
  }

  slot.file = null;
  slot.url = "";
  slot.previewUrl = "";
  slot.status = "idle";
  slot.error = "";
}

function emptyForm() {
  return {
    productId: null,
    colorName: "",
    sizeId: null,
    price: 0,
    stockQuantity: 0,
    status: "SELLING",
  };
}

function toList(data) {
  if (Array.isArray(data)) return data;
  if (data && typeof data === "object") {
    if (Array.isArray(data.content)) return data.content;
    if (Array.isArray(data.data)) return data.data;
    if (Array.isArray(data.list)) return data.list;
  }
  return [];
}

function asFiniteNumber(value, fallback = null) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeVariantStatus(value, stockQuantity = null) {
  const normalized = String(value || "").trim().toUpperCase();
  const hasKnownStock = stockQuantity !== null && stockQuantity !== undefined && stockQuantity !== "";
  const stock = Number(stockQuantity);
  const hasStock = hasKnownStock && Number.isFinite(stock) ? stock > 0 : true;

  if (["SELLING", "AVAILABLE", "ACTIVE", "ON_SALE"].includes(normalized)) {
    return hasStock ? "SELLING" : "OUT_OF_STOCK";
  }
  if (["OUT_OF_STOCK", "SOLD_OUT", "OUTOFSTOCK"].includes(normalized)) {
    return "OUT_OF_STOCK";
  }
  if (["HIDDEN", "INACTIVE", "DISCONTINUED", "STOP_SELLING"].includes(normalized)) {
    return "HIDDEN";
  }
  return hasStock ? "SELLING" : "OUT_OF_STOCK";
}

function variantStatusLabel(status, stockQuantity = null) {
  const normalized = normalizeVariantStatus(status, stockQuantity);
  if (normalized === "HIDDEN") return "Ngá»«ng bÃ¡n";
  if (normalized === "OUT_OF_STOCK") return "Háº¿t hÃ ng";
  return "Äang bÃ¡n";
}

function variantStatusClass(status, stockQuantity = null) {
  const normalized = normalizeVariantStatus(status, stockQuantity);
  if (normalized === "HIDDEN") {
    return "bg-slate-100 text-slate-700 /30 ";
  }
  if (normalized === "OUT_OF_STOCK") {
    return "bg-red-100 text-red-700 /20 ";
  }
  return "bg-green-100 text-green-700 /20 ";
}

function toMap(rows, idKey = "id") {
  const map = new Map();
  for (const row of rows) {
    const id = asFiniteNumber(row && row[idKey], null);
    if (id !== null) {
      map.set(id, row);
    }
  }
  return map;
}

function normalizeImageList(value) {
  if (Array.isArray(value)) {
    return value.filter(Boolean).map((item) => resolveImageUrl(item));
  }

  if (typeof value === "string") {
    const trimmed = value.trim();
    if (!trimmed) return [];

    if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
      try {
        const parsed = JSON.parse(trimmed);
        return Array.isArray(parsed)
          ? parsed.filter(Boolean).map((item) => resolveImageUrl(item))
          : [];
      } catch {
        return [];
      }
    }

    if (trimmed.includes(",")) {
      return trimmed
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
        .map((item) => resolveImageUrl(item));
    }

    return [resolveImageUrl(trimmed)];
  }

  return [];
}

function hydrateVariants(rawVariants, rawProducts, rawColors, rawSizes) {
  const productMap = toMap(rawProducts);
  const colorMap = toMap(rawColors);
  const sizeMap = toMap(rawSizes);

  return (Array.isArray(rawVariants) ? rawVariants : []).map((item) => {
    const productId = asFiniteNumber(item.productId ?? item.product_id, null);
    const colorId = asFiniteNumber(item.colorId ?? item.color_id, null);
    const sizeId = asFiniteNumber(item.sizeId ?? item.size_id, null);

    const product = productId !== null ? productMap.get(productId) : null;
    const color = colorId !== null ? colorMap.get(colorId) : null;
    const size = sizeId !== null ? sizeMap.get(sizeId) : null;

    const rawHex =
      item.colorHex ||
      item.color_hex ||
      color?.hexCode ||
      color?.hex_code ||
      color?.hexCode1 ||
      color?.hexcode ||
      null;

    const primaryImage =
      item.imageUrl || item.image_url || item.imgUrl || item.img_url || null;

    const normalizedExtras = normalizeImageList(
      item.extraImages ?? item.extra_images ?? item.images ?? null,
    );

    const stockQuantity =
      asFiniteNumber(item.stockQuantity ?? item.stock_quantity, 0) || 0;

    return {
      ...item,
      productId,
      colorId,
      sizeId,
      productName: item.productName || item.product_name || product?.name || "",
      colorName: item.colorName || item.color_name || color?.name || "",
      sizeName: item.sizeName || item.size_name || size?.name || "",
      colorHex: normalizeHexColor(rawHex),
      price: asFiniteNumber(item.price, 0) || 0,
      stockQuantity,
      status: normalizeVariantStatus(
        item.status ?? item.variantStatus ?? item.variant_status,
        stockQuantity,
      ),
      imageUrl: resolveImageUrl(primaryImage),
      extraImages: normalizedExtras,
    };
  });
}

function normalizeHexColor(value) {
  const hex = String(value || "").trim();
  if (!hex) return null;
  const normalized = hex.startsWith("#") ? hex : `#${hex}`;
  return /^#[0-9A-Fa-f]{6}$/.test(normalized) ? normalized.toUpperCase() : null;
}

function formatCurrency(value) {
  const n = Number(value);
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(Number.isFinite(n) ? n : 0);
}

function stockClass(stock) {
  const q = Number(stock);
  if (!Number.isFinite(q) || q <= 0) {
    return "bg-red-100 text-red-700 /20 ";
  }
  if (q < 10) {
    return "bg-yellow-100 text-yellow-700 /20 ";
  }
  return "bg-green-100 text-green-700 /20 ";
}

const imageSlotEntries = computed(() => {
  return IMAGE_SLOT_KEYS.map((key, idx) => ({
    key,
    isPrimary: key === "primary",
    label: key === "primary" ? "áº¢nh chÃ­nh" : `áº¢nh phá»¥ ${idx}`,
    slot: bulkImageSlots.value[key],
  }));
});

function validateFiveImagesForSlots(targetSlotsRef) {
  const missing = IMAGE_SLOT_KEYS.filter((key) => {
    const slot = targetSlotsRef.value[key];
    return !slot.file && !slot.url;
  });
  const hasPrimary = targetSlotsRef.value.primary.file || targetSlotsRef.value.primary.url;
  return hasPrimary && missing.length <= 1;
}

function getVariantImageScore(variant) {
  if (!variant || typeof variant !== "object") return 0;
  const primary = variant.imageUrl ? 1 : 0;
  const extras = Array.isArray(variant.extraImages)
    ? variant.extraImages.filter(Boolean).length
    : 0;
  return primary + extras;
}

function pickBestVariantForBulkPreview(list) {
  if (!Array.isArray(list) || list.length === 0) return null;
  return (
    [...list].sort((left, right) => {
      const rightScore = getVariantImageScore(right);
      const leftScore = getVariantImageScore(left);
      if (rightScore !== leftScore) return rightScore - leftScore;
      return Number(left?.id || 0) - Number(right?.id || 0);
    })[0] || null
  );
}

async function uploadAllSlotsToVariant(targetSlotsRef, variantId) {
  const uploadPrimary = async () => {
    const slot = targetSlotsRef.value.primary;
    if (!slot.file) return slot.url || "";

    slot.status = "uploading";
    slot.error = "";
    const formData = new FormData();
    formData.append("file", slot.file);

    const response = await axios.post(
      `${API_BASE_URL}/variants/${variantId}/upload-image`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    const imageUrl = response?.data?.imageUrl;
    if (!imageUrl) {
      throw new Error("MÃ¡y chá»§ khÃ´ng tráº£ vá» áº£nh chÃ­nh");
    }

    slot.url = imageUrl;
    slot.file = null;
    if (slot.previewUrl && slot.previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(slot.previewUrl);
    }
    slot.previewUrl = "";
    slot.status = "success";
    return imageUrl;
  };

  const uploadExtra = async (index) => {
    const slotKey = `extra${index}`;
    const slot = targetSlotsRef.value[slotKey];
    if (!slot.file) return slot.url || "";

    slot.status = "uploading";
    slot.error = "";
    const formData = new FormData();
    formData.append("file", slot.file);

    const response = await axios.post(
      `${API_BASE_URL}/variants/${variantId}/add-extra-image?index=${index}`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
    const imageUrl =
      response?.data?.imageUrl || response?.data?.extraImages?.[index];
    if (!imageUrl) {
      throw new Error(`MÃ¡y chá»§ khÃ´ng tráº£ vá» áº£nh phá»¥ ${index + 1}`);
    }

    slot.url = imageUrl;
    slot.file = null;
    if (slot.previewUrl && slot.previewUrl.startsWith("blob:")) {
      URL.revokeObjectURL(slot.previewUrl);
    }
    slot.previewUrl = "";
    slot.status = "success";
    return imageUrl;
  };

  const primaryImageUrl = await uploadPrimary();
  const extraImages = [];
  for (let i = 0; i < 4; i += 1) {
    extraImages.push(await uploadExtra(i));
  }

  return {
    imageUrl: primaryImageUrl,
    extraImages: extraImages.filter(Boolean),
  };
}

function preloadBulkSlotsFromFirstVariant() {
  const firstVariant = pickBestVariantForBulkPreview(bulkTargetVariants.value);
  const groupImageSet = buildGroupImageSet(bulkTargetVariants.value);
  resetSpecificImageSlots(bulkImageSlots);
  bulkImageNotice.value = "";
  const hasGroupImages =
    !!groupImageSet.imageUrl || groupImageSet.extraImages.some(Boolean);
  if (hasGroupImages) {
    bindImageSetToSlots(bulkImageSlots, groupImageSet);
    return;
  }

  bindVariantToSlots(bulkImageSlots, firstVariant || null);
}

async function fetchVariantDetailForImagePreload(variantId) {
  const id = Number(variantId);
  if (!Number.isFinite(id)) return null;

  try {
    const response = await axios.get(`${API_BASE_URL}/variants/${id}`);
    const payload =
      response?.data && typeof response.data === "object" && response.data.data
        ? response.data.data
        : response?.data;

    if (!payload || typeof payload !== "object") {
      return null;
    }

    const [normalized] = hydrateVariants(
      [payload],
      products.value,
      colors.value,
      sizes.value,
    );
    return normalized || null;
  } catch {
    return null;
  }
}

async function preloadBulkSlotsFromVariantDetails() {
  const sequenceId = bulkImagePreloadSeq.value + 1;
  bulkImagePreloadSeq.value = sequenceId;

  const selectedGroup = [...bulkTargetVariants.value];
  const firstVariant = pickBestVariantForBulkPreview(selectedGroup);
  const detail = firstVariant?.id
    ? await fetchVariantDetailForImagePreload(firstVariant.id)
    : null;

  if (sequenceId !== bulkImagePreloadSeq.value) {
    return;
  }

  const sourceRows = detail
    ? [
        detail,
        ...selectedGroup.filter(
          (item) => Number(item.id) !== Number(detail.id),
        ),
      ]
    : selectedGroup;

  const groupImageSet = buildGroupImageSet(sourceRows);
  resetSpecificImageSlots(bulkImageSlots);
  bulkImageNotice.value = "";

  const hasGroupImages =
    !!groupImageSet.imageUrl || groupImageSet.extraImages.some(Boolean);
  if (hasGroupImages) {
    bindImageSetToSlots(bulkImageSlots, groupImageSet);
    return;
  }

  bindVariantToSlots(bulkImageSlots, detail || firstVariant || null);
}

function openBulkImageForGroup(productId, colorId = null) {
  showBulkImageModal.value = true;
  bulkImageProductId.value =
    productId === null || productId === undefined ? null : Number(productId);
  if (colorId !== null && colorId !== undefined) {
    bulkImageColorId.value = Number(colorId);
  } else {
    bulkImageColorId.value = null;
  }
  bulkImageError.value = "";
  bulkImageSuccess.value = "";
  preloadBulkSlotsFromVariantDetails();
}

watch([bulkImageProductId, bulkImageColorId], () => {
  bulkImageError.value = "";
  bulkImageSuccess.value = "";
  preloadBulkSlotsFromVariantDetails();
});

async function applyBulkImagesToColorGroup() {
  bulkImageError.value = "";
  bulkImageSuccess.value = "";

  if (!bulkImageProductId.value || !bulkImageColorId.value) {
    bulkImageError.value = "Vui lÃ²ng chá»n sáº£n pháº©m vÃ  mÃ u Ä‘á»ƒ cáº­p nháº­t áº£nh.";
    return;
  }

  if (!bulkTargetVariants.value.length) {
    bulkImageError.value = "KhÃ´ng cÃ³ biáº¿n thá»ƒ nÃ o trong nhÃ³m mÃ u nÃ y.";
    return;
  }


  applyingBulkImages.value = true;
  try {
    const firstVariant = bulkTargetVariants.value[0];
    const uploaded = await uploadAllSlotsToVariant(
      bulkImageSlots,
      firstVariant.id,
    );

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
      });
    }

    bulkImageSuccess.value = `ÄÃ£ Ã¡p dá»¥ng bá»™ áº£nh cho ${bulkTargetVariants.value.length} biáº¿n thá»ƒ cÃ¹ng mÃ u.`;
    await loadInventory();
    preloadBulkSlotsFromVariantDetails();
  } catch (err) {
    bulkImageError.value = err?.message || "Cáº­p nháº­t áº£nh nhÃ³m mÃ u tháº¥t báº¡i.";
  } finally {
    applyingBulkImages.value = false;
  }
}

function openCreate() {
  editingId.value = null;
  form.value = emptyForm();
  modalError.value = "";
  showModal.value = true;
}

function setBulkColorFromVariant(v) {
  bulkImageProductId.value = asFiniteNumber(v.productId, null);
  bulkImageColorId.value = asFiniteNumber(v.colorId, null);
  
  // Tá»± Ä‘á»™ng cuá»™n lÃªn pháº§n upload áº£nh Ä‘á»ƒ tiá»‡n thao tÃ¡c
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openEdit(v) {
  editingId.value = v.id;
  
  // Tá»± Ä‘á»™ng set form cáº­p nháº­t áº£nh nhÃ³m mÃ u
  bulkImageProductId.value = asFiniteNumber(v.productId, null);
  bulkImageColorId.value = asFiniteNumber(v.colorId, null);
  form.value = {
    productId: asFiniteNumber(v.productId, null),
    colorName: v.colorName || "",
    sizeId: asFiniteNumber(v.sizeId, null),
    price: asFiniteNumber(v.price, 0) || 0,
    stockQuantity: asFiniteNumber(v.stockQuantity, 0) || 0,
    status: normalizeVariantStatus(v.status, v.stockQuantity),
  };
  modalError.value = "";
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

async function saveVariant() {
  modalError.value = "";
  const f = form.value;

  if (!f.productId || !f.colorName || !f.sizeId) {
    modalError.value = "Vui lÃ²ng nháº­p Ä‘áº§y Ä‘á»§ Sáº£n pháº©m, MÃ u sáº¯c vÃ  Size.";
    return;
  }

  saving.value = true;
  try {
    const typedColorName = String(f.colorName).trim();
    let finalColorId = null;
    const existingColor = colors.value.find(c => c.name.toLowerCase() === typedColorName.toLowerCase());
    if (existingColor) {
      finalColorId = existingColor.id;
    } else {
      try {
        const newColor = await colorsApi.create({ name: typedColorName });
        finalColorId = newColor.id || newColor.data?.id;
        const rawColors = await colorsApi.getAll().catch(() => []);
        colors.value = toList(rawColors);
      } catch(err) {
        modalError.value = "KhÃ´ng thá»ƒ táº¡o mÃ u má»›i: " + err.message;
        saving.value = false;
        return;
      }
    }

    let variantIdForUpload = editingId.value;
    const requestedStatus = String(f.status || "").trim().toUpperCase();
    const normalizedStock =
      requestedStatus === "OUT_OF_STOCK"
        ? 0
        : Math.max(0, Number(f.stockQuantity || 0));
    const normalizedStatus = normalizeVariantStatus(f.status, normalizedStock);

    if (!editingId.value) {
      const payload = {
        productId: Number(f.productId),
        colorId: Number(finalColorId),
        sizeId: Number(f.sizeId),
        price: Number(f.price || 0),
        stockQuantity: normalizedStock,
        status: normalizedStatus,
      };

      const createdVariant = await adminApi.createVariant(payload);
      variantIdForUpload = createdVariant.id || createdVariant.data?.id;
    } 
    else {
      await adminApi.updateVariant(variantIdForUpload, {
        productId: Number(f.productId),
        colorId: Number(finalColorId),
        sizeId: Number(f.sizeId),
        price: Number(f.price || 0),
        stockQuantity: normalizedStock,
        status: normalizedStatus,
      });
    }

    if (!expandedProductIds.value.includes(Number(f.productId))) {
      expandedProductIds.value = [
        ...expandedProductIds.value,
        Number(f.productId),
      ];
    }

    closeModal();
    await loadInventory();
  } catch (err) {
    modalError.value = err?.message || "KhÃ´ng thá»ƒ lÆ°u biáº¿n thá»ƒ.";
  } finally {
    saving.value = false;
  }
}

function confirmDelete(v) {
  deleteTarget.value = v;
}

async function viewQR(variant) {
  qrVariant.value = variant;
  qrImageUrl.value = "";
  showQrModal.value = true;

  try {
    const productId = variant.productId || variant.product_id;
    if (!productId) {
      throw new Error("KhÃ´ng tÃ¬m tháº¥y ID sáº£n pháº©m");
    }
    
    // Sinh QR tá»« productId trá»±c tiáº¿p á»Ÿ frontend
    const dataUrl = await QRCode.toDataURL(String(productId), {
      width: 300,
      margin: 2,
    });
    qrImageUrl.value = dataUrl;
  } catch (err) {
    console.error('Lá»—i láº¥y QR:', err);
    alert('KhÃ´ng thá»ƒ táº¡o mÃ£ QR cho sáº£n pháº©m nÃ y.');
    showQrModal.value = false;
  }
}

function printQrCode() {
  if (!qrImageUrl.value) {
    alert('MÃ£ QR chÆ°a sáºµn sÃ ng. Vui lÃ²ng thá»­ láº¡i.');
    return;
  }

  const printWindow = window.open('', '', 'width=600,height=600');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>MÃ£ Sáº£n Pháº©m: #${qrVariant.value?.productId || qrVariant.value?.product_id}
          </div>
          <div class="name">
            Sáº£n pháº©m: ${qrVariant.value?.productName || ''}</title>
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
        <h1>MÃ£ Sáº£n Pháº©m: #${qrVariant.value?.productId || qrVariant.value?.product_id}</h1>
        <h2>Sáº£n pháº©m: ${qrVariant.value?.productName || ''}</h2>
        <img src="${qrImageUrl.value}" alt="QR Code" />
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.print();
  };
}
async function doDelete() {
  if (!deleteTarget.value) return;

  deleting.value = true;
  try {
    const result = await adminApi.deleteVariant(deleteTarget.value.id);

    if (result && result.softDeleted) {
      if (
        !hiddenVariants.value.some(
          (variant) => Number(variant.id) === Number(deleteTarget.value.id),
        )
      ) {
        hiddenVariants.value.push(deleteTarget.value);
      }
      deleteTarget.value = null;
      return;
    }

    deleteTarget.value = null;
    await loadInventory();
  } catch (err) {
    error.value = err?.message || "KhÃ´ng thá»ƒ xÃ³a biáº¿n thá»ƒ.";
  } finally {
    deleting.value = false;
  }
}

async function restoreVariant(variant) {
  try {
    await adminApi.restoreVariant(variant.id, variant.stockQuantity);
    const restoredId = Number(variant?.id);
    hiddenVariants.value = hiddenVariants.value.filter(
      (hidden) => Number(hidden.id) !== restoredId,
    );
    await loadInventory();
  } catch (err) {
    error.value = "KhÃ´ng thá»ƒ khÃ´i phá»¥c biáº¿n thá»ƒ.";
  }
}

async function hardDeleteVariant(variant) {
  if (!confirm("Báº¡n cÃ³ cháº¯c cháº¯n muá»‘n xÃ³a vÄ©nh viá»…n biáº¿n thá»ƒ nÃ y? HÃ nh Ä‘á»™ng nÃ y khÃ´ng thá»ƒ hoÃ n tÃ¡c!")) {
    return;
  }
  try {
    await adminApi.hardDeleteVariant(variant.id);
    const deletedId = Number(variant?.id);
    hiddenVariants.value = hiddenVariants.value.filter(
      (hidden) => Number(hidden.id) !== deletedId,
    );
    await loadInventory();
  } catch (err) {
    error.value = "KhÃ´ng thá»ƒ xÃ³a vÄ©nh viá»…n biáº¿n thá»ƒ nÃ y. CÃ³ thá»ƒ nÃ³ Ä‘ang Ä‘Æ°á»£c sá»­ dá»¥ng trong cÃ¡c Ä‘Æ¡n hÃ ng.";
  }
}

async function restoreAllHiddenVariants() {
  try {
    for (const variant of hiddenVariants.value) {
      await adminApi.restoreVariant(variant.id, variant.stockQuantity);
    }
    hiddenVariants.value = [];
    await loadInventory();
  } catch (err) {
    error.value = "CÃ³ lá»—i xáº£y ra khi khÃ´i phá»¥c.";
  }
}

async function loadInventory() {
  loading.value = true;
  error.value = "";

  try {
    const [variantData, productData, colorData, sizeData] = await Promise.all([
      adminApi.getVariants({ page: 0, size: 500 }),
      adminApi.getProducts({ page: 0, size: 500 }),
      colorsApi.getAll().catch(() => []),
      sizesApi.getAll().catch(() => []),
    ]);

    const normalizedProducts = Array.isArray(productData) ? productData : [];
    const normalizedColors = toList(colorData);
    const normalizedSizes = toList(sizeData);

    products.value = normalizedProducts;
    colors.value = normalizedColors;
    sizes.value = normalizedSizes;
    variants.value = hydrateVariants(
      Array.isArray(variantData) ? variantData : [],
      normalizedProducts,
      normalizedColors,
      normalizedSizes,
    );
  } catch (err) {
    console.error("Failed to load inventory:", err);
    error.value =
      "KhÃ´ng thá»ƒ táº£i dá»¯ liá»‡u biáº¿n thá»ƒ. Vui lÃ²ng kiá»ƒm tra backend API.";
  } finally {
    loading.value = false;
  }
}
watch(showQrModal, (newVal) => {
  if (!newVal && qrImageUrl.value && qrImageUrl.value.startsWith("blob:")) {
    URL.revokeObjectURL(qrImageUrl.value);
    qrImageUrl.value = "";
  }
});
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
});

onMounted(loadInventory);
</script>



