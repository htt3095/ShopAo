[Output too large (28KB). Full output saved to: c:\Users\Dell\AppData\Roaming\Code\copilot-terminal-output\copilot-terminal-output-2e858a0d-e4a1-4ddd-8a47-bf5e8d699081.txt]
[Use readFile or grep to examine the full output.]

<template>
  <AdminShell :wide="true">
    <template #header>
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p class="text-xs uppercase tracking-[0.18em] text-primary">
            Quáº£n lÃ½ sáº£n pháº©m
          </p>
          <h2 class="mt-1 text-xl font-bold">Quáº£n lÃ½ sáº£n pháº©m </h2>
        </div>

        <div class="flex flex-wrap items-center gap-2 lg:gap-3">
          <div class="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5">
            <span class="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">Product</span>
            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90"
              @click="openCreate"
            >
              <span class="material-symbols-outlined text-[18px]">add</span>
              ThÃªm sáº£n pháº©m
            </button>

            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium hover:border-primary hover:text-primary"
              @click="loadProducts"
            >
              <span class="material-symbols-outlined text-[18px]">refresh</span>
              LÃ m má»›i SP
            </button>
          </div>

          <div class="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-white px-2 py-1.5">
            <span class="rounded-md bg-slate-100 px-2 py-1 text-[11px] font-semibold uppercase tracking-wide text-slate-600">Inventory</span>
            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700"
              @click="openInventoryCreate"
            >
              <span class="material-symbols-outlined text-[18px]">add_box</span>
              ThÃªm biáº¿n thá»ƒ
            </button>

            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-lg bg-orange-500 px-3 py-1.5 text-sm font-semibold text-white hover:bg-orange-600"
              @click="openInventoryBulkCreate"
            >
              <span class="material-symbols-outlined text-[18px]">library_add</span>
              Táº¡o hÃ ng loáº¡t
            </button>

            <button
              type="button"
              class="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-medium hover:border-primary hover:text-primary"
              @click="refreshInventory"
            >
              <span class="material-symbols-outlined text-[18px]">sync</span>
              LÃ m má»›i BT
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
              type="button"
              class="inline-flex h-8 items-center gap-1 rounded-full border border-slate-300 bg-white px-2.5 text-slate-600 hover:border-primary hover:text-primary"
              title="Chuyá»ƒn bá»™ lá»c"
              @click="toggleFilterScope"
            >
              <span class="material-symbols-outlined text-[16px]">swap_horiz</span>
              <span class="text-xs font-medium">Switch</span>
            </button>

            <button
              type="button"
              class="inline-flex h-8 items-center gap-1 rounded-full border border-slate-300 bg-white px-2.5 text-slate-600 hover:border-primary hover:text-primary"
              title="XÃ³a toÃ n bá»™ bá»™ lá»c"
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
            <input v-model="search" type="text" placeholder="TÃ¬m theo tÃªn, mÃ£ sáº£n pháº©m, thÆ°Æ¡ng hiá»‡u" class="w-full bg-transparent text-sm outline-none" />
          </label>

          <select v-model.number="filterBrandId" class="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm xl:col-span-3">
            <option :value="null">Táº¥t cáº£ thÆ°Æ¡ng hiá»‡u</option>
            <option v-for="brand in brands" :key="brand.id" :value="Number(brand.id)">{{ brand.name }}</option>
          </select>

          <select v-model.number="filterCategoryId" class="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm xl:col-span-3">
            <option :value="null">Táº¥t cáº£ danh má»¥c</option>
            <option v-for="category in categories" :key="category.id" :value="Number(category.id)">{{ category.name }}</option>
          </select>
        </div>

        <div v-else class="grid gap-2 xl:grid-cols-12">
          <label class="flex h-9 items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 xl:col-span-4">
            <span class="material-symbols-outlined text-[18px] text-slate-400">search</span>
            <input :value="inventoryFilterForm.keyword" type="text" placeholder="TÃ¬m theo ID, sáº£n pháº©m, mÃ u, size" class="w-full bg-transparent text-sm outline-none" @input="updateInventoryKeyword($event.target.value)" />
          </label>

          <select v-model.number="inventoryFilterForm.productId" class="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm xl:col-span-2" @change="updateInventoryFilter('productId', inventoryFilterForm.productId)">
            <option :value="null">Sáº£n pháº©m</option>
            <option v-for="product in inventoryOptionsProducts" :key="product.id" :value="Number(product.id)">{{ product.name }}</option>
          </select>

          <select v-model.number="inventoryFilterForm.colorId" class="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm xl:col-span-2" @change="updateInventoryFilter('colorId', inventoryFilterForm.colorId)">
            <option :value="null">MÃ u</option>
            <option v-for="color in inventoryOptionsColors" :key="color.id" :value="Number(color.id)">{{ color.name }}</option>
          </select>

          <select v-model.number="inventoryFilterForm.sizeId" class="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm xl:col-span-2" @change="updateInventoryFilter('sizeId', inventoryFilterForm.sizeId)">
            <option :value="null">Size</option>
            <option v-for="size in inventoryOptionsSizes" :key="size.id" :value="Number(size.id)">{{ size.name }}</option>
          </select>

          <select v-model="inventoryFilterForm.stockStatus" class="h-9 rounded-xl border border-slate-200 bg-white px-3 text-sm xl:col-span-2" @change="updateInventoryFilter('stockStatus', inventoryFilterForm.stockStatus)">
            <option :value="null">Tráº¡ng thÃ¡i</option>
            <option value="selling">Äang bÃ¡n</option>
            <option value="out_of_stock">Háº¿t hÃ ng</option>
            <option value="hidden">Ngá»«ng bÃ¡n</option>
            <option value="low_stock">Sáº¯p háº¿t</option>
            <option value="in_stock">CÃ²n hÃ ng</option>
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
                <p class="font-semibold">Sáº£n pháº©m áº©n táº¡m</p>
                <p class="text-xs text-slate-500">Nhá»¯ng sáº£n pháº©m Ä‘Ã£ xÃ³a má»m sáº½ táº¡m áº©n khá»i danh sÃ¡ch. Báº¡n cÃ³ thá»ƒ khÃ´i phá»¥c láº¡i khi cáº§n.</p>
              </div>
              <button type="button" class="rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-white hover:opacity-90" @click="restoreAllHiddenProducts">KhÃ´i phá»¥c táº¥t cáº£</button>
            </div>
            <div class="mt-3 space-y-2">
              <div v-for="product in hiddenProducts" :key="product.id" class="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2">
                <div class="text-sm"><span class="font-semibold">#{{ product.id }}</span><span class="ml-2">{{ product.name || 'Sáº£n pháº©m' }}</span></div>
                <div class="flex items-center gap-2">
                  <button type="button" class="rounded-xl bg-emerald-500 px-3 py-2 text-xs font-semibold text-white hover:bg-emerald-600" @click="restoreProduct(product)">KhÃ´i phá»¥c</button>
                  <button type="button" class="rounded-xl bg-red-500 px-3 py-2 text-xs font-semibold text-white hover:bg-red-600" @click="hardDeleteProduct(product)">XÃ³a háº³n</button>
                </div>
              </div>
            </div>
          </div>

          <div v-if="loading" class="py-8 text-center text-sm text-slate-500">Äang táº£i danh sÃ¡ch sáº£n pháº©m...</div>

          <div v-else-if="filteredProducts.length === 0" class="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500">KhÃ´ng tÃ¬m tháº¥y sáº£n pháº©m.</div>

          <div v-else class="overflow-x-hidden">
            <table class="w-full table-fixed text-left text-sm">
              <colgroup>
                <col class="w-[8%]" />
                <col class="w-[44%]" />
                <col class="w-[22%]" />
                <col class="w-[11%]" />
                <col class="w-[15%]" />
              </colgroup>
              <thead>
                <tr class="border-b border-slate-200 text-slate-500">
                  <th class="px-2 py-2 font-medium">STT</th>
                  <th class="px-2 py-2 font-medium">Sáº£n pháº©m</th>
                  <th class="px-2 py-2 font-medium">Danh má»¥c</th>
                  <th class="px-2 py-2 text-right font-medium">Tá»“n</th>
                  <th class="px-2 py-2 text-right font-medium">Thao tÃ¡c</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(product, index) in filteredProducts" :key="product.id" class="border-b border-slate-100 last:border-none">
                  <td class="px-2 py-2 font-semibold text-slate-500">{{ index + 1 }}</td>
                  <td class="px-2 py-2 align-top">
                    <div class="flex items-center gap-2">
                      <div class="size-9 shrink-0 overflow-hidden rounded-md bg-slate-100">
                        <img v-if="product._imageUrl || product.imageUrl" :src="product._imageUrl || product.imageUrl" alt="Product" class="h-full w-full object-cover" />
                      </div>
                      <div class="min-w-0">
                        <p class="truncate text-sm font-semibold" :title="product.name || 'Sáº£n pháº©m'">{{ product.name || 'Sáº£n pháº©m' }}</p>
                        <p class="truncate text-xs text-slate-500" :title="(product.productCode || ('ID: ' + product.id)) + ' Â· ' + brandName(product.brandId)">{{ product.productCode || ('ID: ' + product.id) }} Â· {{ brandName(product.brandId) }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-2 py-2 truncate" :title="categoryName(product.categoryId)">{{ categoryName(product.categoryId) }}</td>
                  <td class="px-2 py-2 text-right font-semibold">{{ getTotalStock(product.id) }}</td>
                  <td class="px-2 py-2 text-right">
                    <div class="flex items-center justify-end gap-1">
                      <button class="rounded-md p-1.5 hover:bg-slate-100" title="Chá»‰nh sá»­a" @click="openEdit(product)"><span class="material-symbols-outlined text-[18px] text-slate-500">edit</span></button>
                      <button class="rounded-md p-1.5 hover:bg-red-50" title="XÃ³a" @click="confirmDelete(product)"><span class="material-symbols-outlined text-[18px] text-red-500">delete</span></button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section class="retail-card min-w-0 h-[calc(100vh-220px)] overflow-y-auto p-3">
        <AdminInventoryView ref="inventoryPanelRef" :hide-header="true" :hide-filter-controls="true" />
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
                ? `Sá»­a sáº£n pháº©m #${editingProductId}`
                : "ThÃªm sáº£n pháº©m má»›i"
            }}
          </h3>

          <div class="grid gap-3 md:grid-cols-2">
            <div class="md:col-span-2">
              <label class="mb-1 block text-xs font-medium text-slate-500"
                >TÃªn sáº£n pháº©m *</label
              >
              <input
                v-model.trim="form.name"
                type="text"
                class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-1.5 text-sm "
                placeholder="Nháº­p tÃªn sáº£n pháº©m"
              />
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-500"
                >MÃ£ sáº£n pháº©m</label
              >
              <input
                v-model.trim="form.productCode" @input="isProductCodeManuallyEdited = true" type="text"
                class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-1.5 text-sm "
                placeholder="VD: SNK-001"
              />
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-500"
                >ThÆ°Æ¡ng hiá»‡u</label
              >
              <select
                v-model.number="form.brandId"
                class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-1.5 text-sm "
              >
                <option :value="null">-- Chá»n thÆ°Æ¡ng hiá»‡u --</option>
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
              <label class="mb-1 block text-xs font-medium text-slate-500"
                >Danh má»¥c</label
              >
              <select
                v-model.number="form.categoryId"
                class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-1.5 text-sm "
              >
                <option :value="null">-- Chá»n danh má»¥c --</option>
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
              <label class="mb-1 block text-xs font-medium text-slate-500"
                >MÃ´ táº£ chi tiáº¿t sáº£n pháº©m</label
              >
              <textarea
                v-model="form.description"
                rows="10"
                class="w-full shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 text-sm rounded-xl border border-slate-200 outline-none focus:border-primary"
                placeholder="Nháº­p thÃ´ng tin chi tiáº¿t vá» cháº¥t liá»‡u, kiá»ƒu dÃ¡ng, tÃ­nh nÄƒng, v.v. (VÃ­ dá»¥: Ão thun thá»ƒ thao nam mÃ¡t láº¡nh, cháº¥t váº£i co giÃ£n, tháº¥m hÃºt má»“ hÃ´i...)"
              ></textarea>
            </div>

            <div class="md:col-span-2">
              <label class="mb-3 block text-xs font-medium text-slate-500"
                >áº¢nh sáº£n pháº©m</label
              >

              <!-- Image Preview -->
              <div v-if="form.imageUrl" class="mb-4 flex items-end gap-3">
                <div
                  class="size-20 overflow-hidden rounded-lg border border-slate-200 "
                >
                  <img
                    :src="form.imageUrl"
                    alt="Preview"
                    class="h-full w-full object-cover"
                  />
                </div>
                <button
                  type="button"
                  class="rounded-lg bg-red-100 px-2.5 py-1.5 text-xs font-medium text-red-600 hover:bg-red-200 /30 "
                  @click="clearProductImage"
                >
                  XÃ³a áº£nh
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
                Äang táº£i lÃªn...
              </div>
              <div
                v-else-if="productUploadError"
                class="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-600 /40 /20 "
              >
                {{ productUploadError }}
              </div>

              <!-- File Upload Input (Hidden) -->
              <input
                ref="productImageInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleProductImageUpload"
              />

              <!-- Upload Button -->
              <button
                type="button"
                :disabled="productUploadStatus === 'uploading'"
                class="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary disabled:opacity-50 disabled:cursor-not-allowed "
                @click="$refs.productImageInput?.click()"
              >
                <span class="material-symbols-outlined text-[20px]">image</span>
                Chá»n áº£nh tá»« mÃ¡y tÃ­nh
              </button>
            </div>
          </div>

          <p v-if="modalError" class="mt-3 text-xs text-red-500">
            {{ modalError }}
          </p>

          <div class="mt-4 flex justify-end gap-2">
            <button
              type="button"
              class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:border-slate-400 "
              @click="closeModal"
            >
              Há»§y
            </button>

            <button
              type="button"
              :disabled="saving"
              class="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
              @click="saveProduct"
            >
              {{
                saving
                  ? "Äang lÆ°u..."
                  : editingProductId
                    ? "Cáº­p nháº­t"
                    : "ThÃªm má»›i"
              }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>

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
            Báº¡n cháº¯c cháº¯n muá»‘n xÃ³a sáº£n pháº©m
            <strong>#{{ deleteTarget.id }}</strong> ({{
              deleteTarget.name || "Sáº£n pháº©m"
            }})?
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
    </div>
  </AdminShell>
</template>

<script setup>
import { computed, onMounted, ref, watch } from "vue";
import axios from "axios";
import AdminShell from "@/components/admin/AdminShell.vue";
import { adminApi, brandsApi, categoriesApi, variantsApi } from "@/services/api";
import AdminInventoryView from "@/pages/AdminInventoryView.vue";

const isProductCodeManuallyEdited = ref(false);
const autoGeneratedSessionId = ref("");

function removeVietnameseTones(str) { if (!str) return ""; return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/đ/g, "d").replace(/Đ/g, "D"); }

function getInitials(str) {
  if (!str) return "XX";
  const clean = removeVietnameseTones(str).toUpperCase().trim();
  const words = clean.split(/\s+/);
  if (words.length === 1) return words[0].substring(0, 3) || "XX";
  return words.map(w => w[0]).join('');
}

watch([() => form.value.name, () => form.value.brandId], ([newName, newBrandId]) => {
  if (isProductCodeManuallyEdited.value) return;
  if (!editingProductId.value && (newName || newBrandId)) {
    let bCode = "XX";
    if (newBrandId) {
      const brand = brands.value.find(b => Number(b.id) === Number(newBrandId));
      if (brand) bCode = getInitials(brand.name).substring(0, 2);
    }
    const pCode = newName ? getInitials(newName) : "XX";
    form.value.productCode = `--`;
  }
});
  const loading = ref(false);
const error = ref("");
const search = ref("");
const filterBrandId = ref(null);
const filterCategoryId = ref(null);
const products = ref([]);
const brands = ref([]);
const categories = ref([]);
const hiddenProducts = ref([]);
const totalStockByProduct = ref(new Map());
const inventoryPanelRef = ref(null);
const filterScope = ref("product");
const inventoryFilterForm = ref({
  keyword: "",
  productId: null,
  colorId: null,
  sizeId: null,
  stockStatus: null,
});

const showModal = ref(false);
const editingProductId = ref(null);
const saving = ref(false);
const modalError = ref("");
const form = ref(emptyForm());

const deleteTarget = ref(null);
const deleting = ref(false);

const visibleProducts = computed(() => {
  return products.value.filter(
    (product) =>
      !hiddenProducts.value.some(
        (hidden) => Number(product.id) === Number(hidden.id),
      ),
  );
});

const productImageInput = ref(null);
const productUploadStatus = ref("idle"); // idle, uploading, success, error
const productUploadError = ref("");
const productImageFile = ref(null);

const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const brandMap = computed(() => {
  return brands.value.reduce((acc, item) => {
    const id = Number(item.id);
    if (Number.isFinite(id)) {
      acc[id] = item.name;
    }
    return acc;
  }, {});
});

const categoryMap = computed(() => {
  return categories.value.reduce((acc, item) => {
    const id = Number(item.id);
    if (Number.isFinite(id)) {
      acc[id] = item.name;
    }
    return acc;
  }, {});
});

const inventoryOptionsProducts = computed(() => {
  return inventoryPanelRef.value?.products || [];
});

const inventoryOptionsColors = computed(() => {
  return inventoryPanelRef.value?.colors || [];
});

const inventoryOptionsSizes = computed(() => {
  return inventoryPanelRef.value?.sizes || [];
});

const filteredProducts = computed(() => {
  const keyword = search.value.trim().toLowerCase();
  const brandId = toNullableId(filterBrandId.value);
  const categoryId = toNullableId(filterCategoryId.value);

  return visibleProducts.value.filter((product) => {
    if (brandId !== null && Number(product.brandId) !== brandId) {
      return false;
    }

    if (categoryId !== null && Number(product.categoryId) !== categoryId) {
      return false;
    }

    if (!keyword) {
      return true;
    }

    const haystack = [
      product.name,
      product.productCode,
      brandName(product.brandId),
      categoryName(product.categoryId),
      product.id,
    ]
      .filter((item) => item !== undefined && item !== null)
      .join(" ")
      .toLowerCase();

    return haystack.includes(keyword);
  });
});

function emptyForm() { autoGeneratedSessionId.value = Math.random().toString(36).substring(2, 5).toUpperCase(); isProductCodeManuallyEdited.value = false; return { name: "", productCode: "", brandId: null, categoryId: null, imageUrl: "", description: "" }; }

function toList(payload) {
  if (Array.isArray(payload)) {
    return payload;
  }
  if (payload && typeof payload === "object") {
    if (Array.isArray(payload.content)) return payload.content;
    if (Array.isArray(payload.list)) return payload.list;
    if (Array.isArray(payload.data)) return payload.data;
  }
  return [];
}

function toNullableId(value) {
  if (
    value === null ||
    value === undefined ||
    value === "" ||
    value === "null"
  ) {
    return null;
  }
  const id = Number(value);
  return Number.isFinite(id) ? id : null;
}

function brandName(brandId) {
  const id = Number(brandId);
  if (!Number.isFinite(id)) return "-";
  return brandMap.value[id] || `Brand #${id}`;
}

function categoryName(categoryId) {
  const id = Number(categoryId);
  if (!Number.isFinite(id)) return "-";
  return categoryMap.value[id] || `Category #${id}`;
}

function getTotalStock(productId) {
  const id = Number(productId);
  if (!Number.isFinite(id)) return 0;
  return totalStockByProduct.value.get(id) || 0;
}

function openCreate() {
  editingProductId.value = null;
  form.value = emptyForm();
  modalError.value = "";
  showModal.value = true;
}

function openEdit(product) {
  editingProductId.value = product.id;
  form.value = {
    name: product.name || "",
    productCode: product.productCode || "",
    brandId: Number.isFinite(Number(product.brandId))
      ? Number(product.brandId)
      : null,
    categoryId: Number.isFinite(Number(product.categoryId))
      ? Number(product.categoryId)
      : null,
    imageUrl: product._imageUrl || product.imageUrl || "",
    description: product.description || "",
  };
  modalError.value = "";
  showModal.value = true;
}

function closeModal() {
  showModal.value = false;
}

function openInventoryCreate() {
  inventoryPanelRef.value?.openCreate?.();
}

function openInventoryBulkCreate() {
  inventoryPanelRef.value?.openBulkCreate?.();
}

function refreshInventory() {
  inventoryPanelRef.value?.loadInventory?.();
}

function resetInventoryPanelFilters() {
  inventoryFilterForm.value = {
    keyword: "",
    productId: null,
    colorId: null,
    sizeId: null,
    stockStatus: null,
  };
  inventoryPanelRef.value?.resetFilters?.();
}

function resetProductFilters() {
  search.value = "";
  filterBrandId.value = null;
  filterCategoryId.value = null;
}

function resetAllFilters() {
  resetProductFilters();
  resetInventoryPanelFilters();
}

function toggleFilterScope() {
  filterScope.value = filterScope.value === "product" ? "inventory" : "product";
}

function syncInventoryFilters() {
  inventoryPanelRef.value?.setSearchKeyword?.(inventoryFilterForm.value.keyword);
  inventoryPanelRef.value?.setExternalFilters?.({
    productId: toNullableId(inventoryFilterForm.value.productId),
    colorId: toNullableId(inventoryFilterForm.value.colorId),
    sizeId: toNullableId(inventoryFilterForm.value.sizeId),
    stockStatus: inventoryFilterForm.value.stockStatus || null,
  });
}

function updateInventoryKeyword(value) {
  inventoryFilterForm.value.keyword = value ?? "";
  syncInventoryFilters();
}

function updateInventoryFilter(key, value) {
  inventoryFilterForm.value[key] = value;
  syncInventoryFilters();
}

async function saveProduct() {
  const f = form.value;
  modalError.value = "";

  if (!f.name) {
    modalError.value = "Vui lÃ²ng nháº­p tÃªn sáº£n pháº©m.";
    return;
  }

  saving.value = true;
  try {
    let imageUrl = f.imageUrl;
    let productIdForUpload = editingProductId.value;

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
      };

      const createdProduct = await adminApi.createProduct(payload);
      productIdForUpload = createdProduct.id || createdProduct.data?.id;
    }

    // Upload image if there's a file selected
    if (productImageFile.value && productIdForUpload) {
      try {
        imageUrl = await uploadProductImage(productIdForUpload);
      } catch (uploadErr) {
        // Image upload failed, but if it's a new product, we already created it
        // For editing, we'll just warn the user
        console.warn("Image upload failed:", uploadErr);
        modalError.value = "Táº£i áº£nh lÃªn tháº¥t báº¡i, nhÆ°ng sáº£n pháº©m Ä‘Ã£ Ä‘Æ°á»£c lÆ°u.";
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
      };

      await adminApi.updateProduct(
        editingProductId.value || productIdForUpload,
        updatePayload,
      );
    }

    closeModal();
    await loadProducts();
  } catch (err) {
    modalError.value = err?.message || "KhÃ´ng thá»ƒ lÆ°u sáº£n pháº©m.";
  } finally {
    saving.value = false;
  }
}

function confirmDelete(product) {
  deleteTarget.value = product;
}

async function doDelete() {
  if (!deleteTarget.value) {
    return;
  }

  deleting.value = true;
  try {
    const result = await adminApi.deleteProduct(deleteTarget.value.id);

    if (result && result.softDeleted) {
      if (
        !hiddenProducts.value.some(
          (product) => Number(product.id) === Number(deleteTarget.value.id),
        )
      ) {
        hiddenProducts.value.push(deleteTarget.value);
      }
      deleteTarget.value = null;
      return;
    }

    deleteTarget.value = null;
    await loadProducts();
  } catch (err) {
    error.value = err?.message || "KhÃ´ng thá»ƒ xÃ³a sáº£n pháº©m.";
  } finally {
    deleting.value = false;
  }
}

async function restoreProduct(product) {
  try {
    await adminApi.restoreProduct(product.id);
    const restoredId = Number(product?.id);
    hiddenProducts.value = hiddenProducts.value.filter(
      (hidden) => Number(hidden.id) !== restoredId,
    );
    await loadProducts();
  } catch (err) {
    error.value = "KhÃ´ng thá»ƒ khÃ´i phá»¥c sáº£n pháº©m.";
  }
}

async function hardDeleteProduct(product) {
  if (!confirm("Báº¡n cÃ³ cháº¯c cháº¯n muá»‘n xÃ³a vÄ©nh viá»…n sáº£n pháº©m nÃ y? HÃ nh Ä‘á»™ng nÃ y khÃ´ng thá»ƒ hoÃ n tÃ¡c!")) {
    return;
  }
  try {
    await adminApi.hardDeleteProduct(product.id);
    const deletedId = Number(product?.id);
    hiddenProducts.value = hiddenProducts.value.filter(
      (hidden) => Number(hidden.id) !== deletedId,
    );
    await loadProducts();
  } catch (err) {
    error.value = "KhÃ´ng thá»ƒ xÃ³a vÄ©nh viá»…n sáº£n pháº©m nÃ y. CÃ³ thá»ƒ nÃ³ Ä‘ang chá»©a cÃ¡c biáº¿n thá»ƒ Ä‘Æ°á»£c sá»­ dá»¥ng trong cÃ¡c Ä‘Æ¡n hÃ ng.";
  }
}


async function restoreAllHiddenProducts() {
  try {
    for (const product of hiddenProducts.value) {
      await adminApi.restoreProduct(product.id);
    }
    hiddenProducts.value = [];
    await loadProducts();
  } catch (err) {
    error.value = "CÃ³ lá»—i xáº£y ra khi khÃ´i phá»¥c.";
  }
}

async function loadProducts() {
  loading.value = true;
  error.value = "";

  try {
    const [productList, brandList, categoryList, variantList] = await Promise.all([
      adminApi.getProducts({ page: 0, size: 300 }),
      brandsApi.getAll().catch(() => []),
      categoriesApi.getAll().catch(() => []),
      variantsApi.getAll(0, 1000).catch(() => []),
    ]);

    const productsData = toList(productList);
    const variantsData = toList(variantList);
    
    // Build image and stock maps from variants
    const variantImageMap = new Map();
    const nextTotalStockByProduct = new Map();
    for (const v of variantsData) {
      const pid = Number(v.productId || v.product_id);
      const img = v.imageUrl || v.image_url || v.imgUrl;
      if (pid && img && !variantImageMap.has(pid)) {
        variantImageMap.set(pid, img);
      }

      if (pid) {
        const stock = Number(v.stockQuantity ?? v.quantity ?? 0);
        const prev = nextTotalStockByProduct.get(pid) || 0;
        nextTotalStockByProduct.set(pid, prev + (Number.isFinite(stock) ? stock : 0));
      }
    }

    products.value = productsData.map((p) => ({
      ...p,
      _imageUrl: p.imageUrl || p.image_url || variantImageMap.get(Number(p.id)) || null,
    }));
    totalStockByProduct.value = nextTotalStockByProduct;
    
    brands.value = toList(brandList);
    categories.value = toList(categoryList);
  } catch (err) {
    console.error("Failed to load admin products:", err);
    error.value = "KhÃ´ng thá»ƒ táº£i sáº£n pháº©m. Vui lÃ²ng kiá»ƒm tra backend API.";
  } finally {
    loading.value = false;
  }
}

function clearProductImage() {
  form.value.imageUrl = "";
  productImageFile.value = null;
  productUploadStatus.value = "idle";
  productUploadError.value = "";
}

async function uploadProductImage(productId) {
  if (!productImageFile.value) {
    return form.value.imageUrl; // Return existing preview/URL if no new file
  }

  try {
    productUploadStatus.value = "uploading";
    productUploadError.value = "";

    const formData = new FormData();
    formData.append("file", productImageFile.value);

    const response = await axios.post(
      `${API_BASE_URL}/products/${productId}/upload-image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );

    if (response.data && response.data.imageUrl) {
      form.value.imageUrl = response.data.imageUrl;
      productUploadStatus.value = "success";
      productImageFile.value = null;
      return response.data.imageUrl;
    } else {
      throw new Error("MÃ¡y chá»§ khÃ´ng tráº£ vá» Ä‘Æ°á»ng dáº«n áº£nh");
    }
  } catch (err) {
    console.error("Error uploading product image:", err);
    productUploadStatus.value = "error";
    productUploadError.value =
      "Táº£i áº£nh lÃªn tháº¥t báº¡i: " + (err.response?.data?.error || err.message);
    throw new Error(productUploadError.value);
  }
}

function handleProductImageUpload(event) {
  const file = event.target?.files?.[0];
  if (!file) return;

  // Validate file type
  if (!file.type.startsWith("image/")) {
    productUploadError.value = "Vui lÃ²ng chá»n tá»‡p áº£nh há»£p lá»‡.";
    productUploadStatus.value = "error";
    return;
  }

  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    productUploadError.value = "KÃ­ch thÆ°á»›c áº£nh khÃ´ng Ä‘Æ°á»£c vÆ°á»£t quÃ¡ 5MB.";
    productUploadStatus.value = "error";
    return;
  }

  productImageFile.value = file;
  productUploadError.value = "";

  // Create preview
  const reader = new FileReader();
  reader.onload = (e) => {
    form.value.imageUrl = e.target?.result || "";
  };
  reader.readAsDataURL(file);

  // Reset input
  event.target.value = "";
}

onMounted(loadProducts);
</script>


