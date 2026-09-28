<template>
  <div
    class="retail-shell flex min-h-screen flex-col text-slate-900  font-display antialiased selection:bg-primary selection:text-white"
  >
    <transition name="fade-scale">
      <div
        v-if="modal.show"
        class="fixed inset-0 z-[100] flex items-center justify-center px-4"
      >
        <div
          class="absolute inset-0 bg-black/50 backdrop-blur-sm"
          @click="closeAlert"
        />
        <div
          class="relative w-full max-w-sm rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-2xl  "
        >
          <div
            class="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full"
            :class="{
              'bg-emerald-100 text-emerald-600': modal.type === 'success',
              'bg-red-100 text-red-600': modal.type === 'error',
              'bg-amber-100 text-amber-600': modal.type === 'warning'
            }"
          >
            <span class="material-symbols-outlined text-4xl">
              {{ modal.type === 'success' ? 'check_circle' : (modal.type === 'error' ? 'error' : 'warning') }}
            </span>
          </div>
          <h3 class="mb-2 text-xl font-bold text-slate-800">
            {{ modal.title }}
          </h3>
          <p class="mb-6 text-sm text-slate-500 ">
            {{ modal.message }}
          </p>
          <button
            class="w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-600"
            @click="closeAlert"
          >
            Đã hiểu
          </button>
        </div>
      </div>
    </transition>

    <MainTopBar />

    <main class="flex-grow container mx-auto px-4 py-8 lg:px-8 xl:px-40">
      <div class="mb-6 border-b border-slate-200 pb-4 ">
        <h1 class="text-3xl font-black tracking-tight">Thanh toán</h1>
        <p class="mt-1 text-sm text-slate-500 ">
          Hoàn tất thông tin để xác nhận đơn hàng của bạn.
        </p>
      </div>

      <div
        v-if="cartStore.notice"
        class="mb-6 flex items-start gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm"
      >
        <span class="material-symbols-outlined mt-0.5 text-amber-500">info</span>
        <div class="min-w-0 flex-1">
          <p class="font-bold text-amber-800">Giỏ hàng tạm khôi phục</p>
          <p class="mt-1 text-amber-700">{{ cartStore.notice }}</p>
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
        v-if="stockNotice"
        class="mb-6 flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm"
      >
        <span class="material-symbols-outlined mt-0.5 text-red-500">inventory_2</span>
        <div class="min-w-0">
          <p class="font-bold text-red-700">Một số sản phẩm trong giỏ không còn đủ tồn kho</p>
          <p class="mt-1 whitespace-pre-line text-red-600">{{ stockNotice }}</p>
          <p class="mt-1 text-xs text-red-500">
            Sản phẩm vừa được bán tại cửa hàng hoặc khách khác đặt trước. Vui lòng giảm số lượng để đặt hàng.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-1 gap-8 lg:grid-cols-12">
        <section class="space-y-6 lg:col-span-7">
          <article
            class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm  "
          >
            <h2 class="mb-5 flex items-center gap-2 text-xl font-bold">
              <span class="material-symbols-outlined text-primary">person</span>
              Thông tin giao hàng
            </h2>

            <!-- Chọn địa chỉ đã lưu -->
            <div v-if="savedAddresses.length > 0" class="mb-6">
              <h3 class="text-sm font-bold text-slate-700 mb-3">Chọn địa chỉ đã lưu:</h3>
              <div class="space-y-3">
                <label v-for="addr in savedAddresses" :key="addr.id" class="flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-colors" :class="selectedAddressId === addr.id ? 'border-primary bg-primary/5' : 'border-slate-200 hover:bg-slate-50'">
                  <input
                    v-model="selectedAddressId"
                    class="mt-1"
                    type="radio"
                    :value="addr.id"
                    @change="handleSelectSavedAddress(addr)"
                  >
                  <div>
                    <p class="font-bold text-sm">{{ addr.fullname }} - {{ addr.phone }} <span v-if="addr.isDefault" class="ml-2 text-[10px] bg-primary text-white px-1.5 py-0.5 rounded">Mặc định</span></p>
                    <p class="text-sm text-slate-600">{{ addr.address }}</p>
                  </div>
                </label>
                <label class="flex items-start gap-3 p-3 border rounded-xl cursor-pointer transition-colors" :class="selectedAddressId === 'new' ? 'border-primary bg-primary/5' : 'border-slate-200 hover:bg-slate-50'">
                  <input
                    v-model="selectedAddressId"
                    class="mt-1"
                    type="radio"
                    value="new"
                    @change="resetShippingForm"
                  >
                  <span class="font-bold text-sm">Nhập địa chỉ mới</span>
                </label>
              </div>
            </div>

            <div v-show="selectedAddressId === 'new'" class="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label class="flex flex-col gap-2 md:col-span-2">
                <span
                  class="text-xs font-semibold uppercase tracking-wide text-slate-500 "
                >Email liên hệ</span>
                <input
                  v-model.trim="shippingForm.gmail"
                  class="rounded-xl border bg-white px-4 py-3 text-sm text-slate-900 outline-none focus:ring-2 focus:border-primary   "
                  placeholder="peak@example.com"
                  type="email"
                >
              </label>

              <label class="flex flex-col gap-2">
                <span
                  class="text-xs font-semibold uppercase tracking-wide text-slate-500 "
                >Họ và tên</span>
                <input
                  v-model.trim="shippingForm.fullname"
                  class="rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:border-primary   "
                  placeholder="Nguyen Van A"
                  type="text"
                >
              </label>

              <label class="flex flex-col gap-2">
                <span
                  class="text-xs font-semibold uppercase tracking-wide text-slate-500 "
                >Số điện thoại</span>
                <input
                  v-model.trim="shippingForm.phone"
                  class="rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:border-primary   "
                  placeholder="09xxxxxxxx"
                  type="text"
                >
              </label>

              <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:col-span-2">
                <label class="flex flex-col gap-2">
                  <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Tỉnh/Thành phố</span>
                  <select v-model="selectedProvince" class="rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:border-primary" @change="selectedDistrict = null; selectedWard = null; isRouteCalculated = false;">
                    <option :value="null">Chọn Tỉnh/Thành</option>
                    <option v-for="p in provinces" :key="p.code" :value="p">{{ p.name }}</option>
                  </select>
                </label>
                <label class="flex flex-col gap-2">
                  <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Quận/Huyện</span>
                  <select v-model="selectedDistrict" class="rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:border-primary" :disabled="!selectedProvince" @change="selectedWard = null; isRouteCalculated = false;">
                    <option :value="null">Chọn Quận/Huyện</option>
                    <option v-for="d in selectedProvince?.districts || []" :key="d.code" :value="d">{{ d.name }}</option>
                  </select>
                </label>
                <label class="flex flex-col gap-2">
                  <span class="text-xs font-semibold uppercase tracking-wide text-slate-500">Phường/Xã</span>
                  <select v-model="selectedWard" class="rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:border-primary" :disabled="!selectedDistrict" @change="isRouteCalculated = false;">
                    <option :value="null">Chọn Phường/Xã</option>
                    <option v-for="w in selectedDistrict?.wards || []" :key="w.code" :value="w">{{ w.name }}</option>
                  </select>
                </label>
              </div>

              <div class="relative flex flex-col gap-2 md:col-span-2">
                <span class="text-xs font-semibold uppercase tracking-wide text-slate-500 ">Địa chỉ chi tiết</span>
                <AddressAutocomplete
                  v-model="streetAddress"
                  input-class="w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none focus:ring-2 focus:border-primary"
                  placeholder="Nhập địa chỉ chi tiết"
                  :query-context="''"
                  @blur="handleAddressBlur"
                  @enter="checkAndCalculateRoute(true)"
                  @select="selectAddressSuggestion"
                />
              </div>

            </div>

            <div
              v-show="isRouteCalculated"
              class="mt-6 rounded-xl border border-green-500/30 bg-green-50/50 p-5"
            >
              <h3
                class="mb-4 flex items-center gap-2 text-base font-bold text-green-700 "
              >
                <span class="material-symbols-outlined">local_shipping</span>
                Thông tin giao hàng đã xác nhận
              </h3>
              <div class="space-y-3 text-sm">
                <div
                  class="flex items-start justify-between border-b border-green-500/20 pb-3"
                >
                  <span class="font-semibold text-slate-600 ">Kho hàng:</span>
                  <span class="text-right font-medium">123 Đ. Nguyễn Ngọc Vũ, Trung Hoà, Cầu Giấy, Hà Nội</span>
                </div>
                <div
                  class="flex items-start justify-between border-b border-green-500/20 pb-3"
                >
                  <span class="font-semibold text-slate-600 ">Giao đến:</span>
                  <span class="text-right font-medium max-w-[70%]">{{
                    fullAddressString
                  }}</span>
                </div>
                <div v-if="Number(distanceKm) > 0" class="flex items-center justify-between">
                  <span class="font-semibold text-slate-600 ">Khoảng cách:</span>
                  <span class="font-bold">{{ distanceKm }} km</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="font-semibold text-slate-600 ">Dự kiến giao:</span>
                  <span class="font-bold">{{ estimatedDays }} ngày</span>
                </div>
                <div class="flex items-center justify-between pt-2">
                  <span class="font-semibold text-slate-600 ">Phí vận chuyển:</span>
                  <span class="text-lg font-black text-red-500">{{
                    formatMoney(calculatedShippingFee)
                  }}</span>
                </div>
                <div class="text-[10px] text-slate-500 italic mt-1 text-right border-t border-green-500/10 pt-2">
                  *Nội thành Hà Nội: &lt;5km (15k), &lt;10km (25k), trên 10km (35k). Ngoại thành/Tỉnh khác: 40k.
                </div>
              </div>
            </div>

            <div
              v-show="routeError"
              class="mt-4 text-sm text-red-500 font-medium"
            >
              {{ routeError }}
            </div>
          </article>

          <article
            class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm  "
          >
            <h2 class="mb-5 flex items-center gap-2 text-xl font-bold">
              <span class="material-symbols-outlined text-primary">wallet</span>
              Phương thức thanh toán
            </h2>

            <div class="grid grid-cols-1 gap-3 md:grid-cols-2">
              <label
                v-for="method in paymentMethods"
                :key="method.id"
                class="flex cursor-pointer items-center justify-between rounded-xl border px-4 py-3 transition-colors"
                :class="
                  selectedPayment === method.id
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-slate-200 bg-white text-slate-700   '
                "
              >
                <span class="flex items-center gap-3">
                  <input
                    v-model="selectedPayment"
                    class="size-4 accent-primary"
                    type="radio"
                    :value="method.id"
                  >
                  <span class="text-sm font-semibold">{{ method.name }}</span>
                </span>
                <span class="material-symbols-outlined text-base">{{
                  method.icon
                }}</span>
              </label>
            </div>

            <div
              v-if="selectedPayment === 2"
              class="mt-4 rounded-xl border border-slate-200 bg-slate-50 p-4  "
            >
              <label
                class="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500 "
              >Chọn kênh thanh toán online</label>
              <select
                v-model.number="selectedDigitalPayment"
                class="w-full cursor-pointer  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20  "
              >
                <option
                  v-for="method in digitalPaymentMethods"
                  :key="method.id"
                  :value="method.id"
                >
                  {{ method.name }}
                </option>
              </select>
            </div>
          </article>
        </section>

        <aside class="lg:col-span-5">
          <div class="sticky top-24 space-y-6">
            <article
              class="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm  "
            >
              <h2 class="mb-5 text-xl font-bold">Tóm tắt đơn hàng</h2>

              <div
                v-if="cartItems.length === 0"
                class="rounded-xl border border-dashed border-slate-300 px-4 py-8 text-center text-sm text-slate-500"
              >
                Giỏ hàng hiện đang trống.
              </div>

              <template v-else>
                <div
                  class="max-h-[280px] space-y-4 overflow-y-auto pr-1 custom-scrollbar"
                >
                  <div
                    v-for="item in cartItems"
                    :key="item.id || item.variantId"
                    class="flex items-center gap-3"
                  >
                    <div
                      class="h-16 w-16 overflow-hidden rounded-lg bg-slate-100 "
                    >
                      <img
                        :alt="getItemName(item)"
                        class="h-full w-full object-cover"
                        :src="getItemImage(item)"
                      >
                    </div>
                    <div class="min-w-0 flex-1">
                      <p class="truncate text-sm font-semibold">
                        {{ getItemName(item) }}
                      </p>
                      <p class="text-xs text-slate-500 ">
                        {{ getSizeLabel(item) }} • {{ getColorLabel(item) }} •
                        x{{ item.quantity }}
                      </p>
                      <p
                        v-if="Number(item.stockAvailable || item.stockQuantity) < Number(item.quantity || 0)"
                        class="mt-0.5 text-xs font-semibold text-red-500"
                      >
                        Còn {{ item.stockAvailable || item.stockQuantity }} trong kho
                      </p>
                    </div>
                    <p class="text-sm font-bold text-slate-900 ">
                      {{ formatMoney(item.price * item.quantity) }}
                    </p>
                  </div>
                </div>

                <div class="mt-6 rounded-xl bg-slate-50 p-4 ">
                  <label
                    class="mb-2 block text-xs font-semibold uppercase tracking-wide text-slate-500 "
                  >Mã giảm giá</label>
                  <div class="flex gap-2">
                    <input
                      v-model.trim="voucherInput"
                      class="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm outline-none focus:border-primary  "
                      placeholder="Nhập mã voucher"
                      type="text"
                    >
                    <button
                      class="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold hover:bg-slate-200 disabled:opacity-60 "
                      :disabled="isApplyingVoucher"
                      type="button"
                      @click="applyVoucher"
                    >
                      {{ isApplyingVoucher ? "Đang xử lý" : "Áp dụng" }}
                    </button>
                  </div>

                  <div class="mt-3">
                    <div
                      v-if="appliedVoucher && appliedVoucher.code"
                      class="mt-2 flex items-center justify-between rounded-lg border border-green-500/40 bg-green-500/10 px-3 py-2 text-xs"
                    >
                      <span
                        class="font-semibold text-green-600 "
                      >Đang dùng mã: {{ appliedVoucher.code }}</span>
                      <button
                        class="font-semibold text-red-500 hover:text-red-600"
                        type="button"
                        @click="clearVoucher"
                      >
                        Gỡ
                      </button>
                    </div>
                    <p
                      class="text-xs font-semibold uppercase tracking-wide text-slate-500  mt-3"
                    >
                      Voucher khả dụng
                    </p>
                    <div
                      v-if="processedAvailableVouchers.length === 0"
                      class="mt-2 text-xs text-slate-500"
                    >
                      Chưa có voucher phù hợp.
                    </div>
                    <div v-else class="mt-2 space-y-2">
                      <div
                        v-for="voucher in processedAvailableVouchers"
                        :key="voucher.id || voucher.code"
                        class="rounded-lg border px-3 py-2"
                        :class="voucher.isActive ? (voucher.isEligible ? 'border-slate-200 bg-white' : 'border-slate-200 bg-slate-50 opacity-70') : 'border-slate-200 bg-slate-100 opacity-80'"
                      >
                        <div class="flex items-start justify-between gap-3">
                          <div>
                            <p class="text-sm font-bold">{{ voucher.code }}</p>
                            <p class="text-xs text-slate-500">
                              {{ voucher.description }}
                            </p>
                            <p v-if="!voucher.isEligible" class="mt-1 text-[11px] font-semibold text-amber-600 ">
                              Cần tối thiểu {{ formatMoney(voucher.minOrderValue || voucher.min_order_value || 0) }}
                            </p>
                            <p v-else-if="voucher.reason" class="mt-1 text-[11px] font-semibold text-slate-500">
                              {{ voucher.reason }}
                            </p>
                          </div>
                          <button
                            class="rounded-md px-3 py-1 text-xs font-semibold"
                            :class="voucher.isActive && voucher.isEligible ? 'bg-primary text-white hover:bg-blue-600' : 'bg-slate-200 text-slate-500 cursor-not-allowed'"
                            :disabled="!voucher.isActive || !voucher.isEligible"
                            type="button"
                            @click="applySuggestedVoucher(voucher)"
                          >
                            {{ voucher.isActive ? (voucher.isEligible ? 'Dùng mã' : 'Chưa đủ ĐK') : 'Tắt' }}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  class="mt-6 space-y-3 border-t border-slate-200 pt-4 "
                >
                  <div
                    class="flex items-center justify-between text-sm text-slate-600 "
                  >
                    <span>Tạm tính</span>
                    <span
                      class="font-semibold text-slate-900 "
                    >{{ formatMoney(subtotal) }}</span>
                  </div>
                  <div
                    class="flex items-center justify-between text-sm text-slate-600 "
                  >
                    <span>
                      Phí vận chuyển
                      <span class="mt-0.5 block text-[11px] font-normal text-slate-400">
                        Nội thành Hà Nội: dưới 5km = 15k, dưới 10km = 25k, từ 10km = 35k; tỉnh khác = 40k.
                      </span>
                    </span>
                    <span
                      class="font-semibold text-slate-900 "
                    >{{ formatMoney(shipping) }}</span>
                  </div>
                  <div
                    v-if="discountAmount > 0"
                    class="flex items-center justify-between text-sm text-green-600 "
                  >
                    <span>Giảm giá</span>
                    <span class="font-bold">-{{ formatMoney(discountAmount) }}</span>
                  </div>
                  <div
                    class="flex items-center justify-between border-t border-slate-200 pt-4 text-lg "
                  >
                    <span class="font-bold">Tổng thanh toán</span>
                    <span class="font-black text-primary">{{
                      formatMoney(total)
                    }}</span>
                  </div>
                </div>

                <button
                  class="mt-6 w-full rounded-xl bg-primary px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-blue-600 disabled:opacity-60"
                  :disabled="isProcessing || cartItems.length === 0"
                  type="button"
                  @click="handlePlaceOrder"
                >
                  {{ isProcessing ? "Đang xử lý..." : "Xác nhận đặt hàng" }}
                </button>
              </template>
            </article>
          </div>
        </aside>
      </div>
    </main>

    <!-- Custom Confirm Modal -->
    <div
      v-if="showConfirmModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm transition-opacity"
    >
      <div class="relative w-[90%] max-w-sm rounded-2xl bg-white p-6 shadow-2xl overflow-hidden transform scale-100 transition-transform duration-200">
        <!-- Decorative Header -->
        <div class="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-primary to-blue-400" />
        
        <div class="flex items-center gap-4 mb-4">
          <div class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-50 text-primary">
            <span class="material-symbols-outlined text-[28px]">shopping_cart_checkout</span>
          </div>
          <div>
            <h3 class="text-lg font-bold text-slate-800">Xác nhận đặt hàng</h3>
            <p class="text-sm text-slate-500 mt-1">Bạn đã kiểm tra kỹ thông tin đơn hàng chưa?</p>
          </div>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <button
            class="rounded-xl px-5 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:bg-slate-100 active:bg-slate-200"
            @click="handleConfirmModal(false)"
          >
            Hủy bỏ
          </button>
          <button
            class="rounded-xl bg-primary px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-primary/30 transition-all hover:bg-blue-600 hover:shadow-lg active:scale-95"
            @click="handleConfirmModal(true)"
          >
            Đồng ý
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { computed, nextTick, onMounted, onUnmounted, reactive, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import AddressAutocomplete from '@/components/AddressAutocomplete.vue'
  import { addressApi, paymentApi, stockApi } from '@/services/api'
  import { orderAPI, orderUtils, voucherAPI } from '@/services/orders'
  import { useCartStore } from '@/stores/cart'
  import { resolveColorMeta, resolveSizeMeta } from '@/utils/variantValues'

  const cartStore = useCartStore()
  const route = useRoute()
  const router = useRouter()

  // Modal logic
  const showConfirmModal = ref(false)
  let confirmResolver = null

  function handleConfirmModal (isConfirmed) {
    showConfirmModal.value = false
    if (confirmResolver) {
      confirmResolver(isConfirmed)
      confirmResolver = null
    }
  }

  const currentUser = ref(null)
  const currentAccountId = ref(null)
  const isProcessing = ref(false)
  const isApplyingVoucher = ref(false)

  const modal = reactive({
    show: false,
    title: '',
    message: '',
    type: 'success',
    onConfirm: null,
  })

  const stockNotice = ref('')

  const shippingForm = reactive({
    gmail: '',
    fullname: '',
    phone: '',
    address: '',
  })

  const savedAddresses = ref([])
  const selectedAddressId = ref('new')
  let addressSearchToken = 0
  let skipNextAddressWatcher = false

  watch(selectedAddressId, newVal => {
    if (newVal === 'new') {
      // address form shown
    }
  })

  function normalizeSavedAddressResponse (response) {
    if (Array.isArray(response)) return response
    if (Array.isArray(response?.data)) return response.data
    if (Array.isArray(response?.content)) return response.content
    if (Array.isArray(response?.data?.content)) return response.data.content
    return []
  }

  async function fetchAddresses () {
    const accountId = Number(currentAccountId.value)
    if (!Number.isFinite(accountId) || accountId <= 0) return

    try {
      savedAddresses.value = normalizeSavedAddressResponse(
        await addressApi.getByAccountId(accountId),
      )

      const defaultAddress = savedAddresses.value.find(
        address => address.isDefault || address.is_default,
      )
      const addressToSelect = defaultAddress || savedAddresses.value[0]
      if (addressToSelect) {
        selectedAddressId.value = addressToSelect.id
        await handleSelectSavedAddress(addressToSelect)
      }
    } catch (error) {
      savedAddresses.value = []
      console.error('Lỗi lấy địa chỉ giao hàng', error)
    }
  }

  async function handleSelectSavedAddress (addr) {
    shippingForm.fullname = addr.fullname || addr.full_name || ''
    shippingForm.phone = addr.phone || ''
    shippingForm.address = addr.address || addr.fullAddress || addr.full_address || ''
    selectedAddressPoint.value = null
    skipNextAddressWatcher = true
    streetAddress.value = shippingForm.address
    fullAddressString.value = shippingForm.address

    const selectionToken = ++addressSearchToken
    await processAddressText(streetAddress.value, selectionToken)
  }

  function resetShippingForm () {
    addressSearchToken++
    selectedAddressPoint.value = null
    shippingForm.fullname = currentUser.value?.fullname || currentUser.value?.username || ''
    shippingForm.phone = currentUser.value?.phone || ''
    shippingForm.address = ''
    skipNextAddressWatcher = true
    streetAddress.value = ''
    isRouteCalculated.value = false
  }

  function handleAddressBlur () {
    checkAndCalculateRoute(true)
  }

  async function selectAddressSuggestion (sug) {
    const latitude = Number(sug?.lat)
    const longitude = Number(sug?.lon)
    selectedAddressPoint.value = Number.isFinite(latitude) && Number.isFinite(longitude)
      ? { latitude, longitude, address: sug.address || {}, addressText: sug.display_name || '' }
      : null

    if (sug && sug.address) {
      const cityOrProvince = sug.address.city || sug.address.state || sug.address.province
      if (cityOrProvince) {
        const matchedProv = findBestMatchByName(provinces.value, cityOrProvince)
        if (matchedProv) {
          selectedProvince.value = matchedProv
          await nextTick()

          const addressTokens = [
            sug.address.county,
            sug.address.district,
            sug.address.city_district,
            sug.address.town,
            sug.address.suburb,
            sug.address.ward,
            sug.address.village,
            sug.address.hamlet,
            sug.address.quarter,
            sug.address.neighbourhood,
            ...(sug.display_name || '').split(',').map(s => s.trim()),
          ].filter(Boolean)

          let foundDist = null
          let foundWard = null

          for (const token of addressTokens) {
            const match = findBestMatchByName(selectedProvince.value.districts, token)
            if (match) {
              foundDist = match
              break
            }
          }

          if (!foundDist) {
            for (const d of selectedProvince.value.districts || []) {
              for (const token of addressTokens) {
                const wMatch = findBestMatchByName(d.wards, token)
                if (wMatch) {
                  foundDist = d
                  foundWard = wMatch
                  break
                }
              }
              if (foundDist) break
            }
          }

          if (foundDist) {
            selectedDistrict.value = foundDist
            await nextTick()

            if (!foundWard) {
              for (const token of addressTokens) {
                const match = findBestMatchByName(foundDist.wards, token)
                if (match) {
                  foundWard = match
                  break
                }
              }
            }
            if (foundWard) {
              selectedWard.value = foundWard
            }
          }
        }
      }

      streetAddress.value = sug.display_name || ''
    }

    checkAndCalculateRoute(true)
  }

  // -----------------------------------------===== LOGIC CHỌN TỈNH THÀNH & TÍNH SHIP =====
  const provinces = ref([])
  const districts = ref([])
  const wards = ref([])

  const geocodeCache = new Map()
  const lastGeocodeTime = 0
  async function fetchGeocode (q, limit = 1) {
    const cacheKey = `${q}|${limit}`
    if (geocodeCache.has(cacheKey)) return geocodeCache.get(cacheKey)
    const targetUrl = `/photon/api/?q=${encodeURIComponent(q)}&limit=${limit}`
    try {
      const res = await fetch(targetUrl)
      if (!res.ok) return { ok: false, status: res.status }
      const rawData = await res.json()

      const mappedData = (rawData.features || []).map(f => {
        const p = f.properties || {}
        return {
          lat: String(f.geometry.coordinates[1]),
          lon: String(f.geometry.coordinates[0]),
          display_name: [p.name, p.street, p.district, p.city, p.state, p.country].filter(Boolean).join(', '),
          address: {
            state: p.state || p.city,
            city: p.city,
            county: p.district || p.county,
            district: p.district,
            suburb: p.district || p.suburb,
            ward: p.ward || p.suburb,
            road: p.street || p.name,
          },
        }
      })

      const result = { ok: true, data: mappedData }
      geocodeCache.set(cacheKey, result)
      return result
    } catch {
      return { ok: false, status: -1 }
    }
  }

  const selectedProvince = ref(null)
  const selectedDistrict = ref(null)
  const selectedWard = ref(null)
  const streetAddress = ref('')
  const selectedAddressPoint = ref(null)

  const isRouteCalculated = ref(false)
  const distanceKm = ref(0)
  const calculatedShippingFee = ref(0)
  const estimatedDays = ref(0)
  const fullAddressString = ref('')
  const routeError = ref('')
  let autoRouteTimer = null
  let autoAddressFillTimer = null
  const isAutoFillingAddress = ref(false)
  const skipNextWatcherUpdate = ref(false)

  // Tọa độ kho hàng (123 Nguyễn Ngọc Vũ, Trung Hoà, Cầu Giấy, Hà Nội)
  const SHOP_COORD = [21.008_882, 105.802_883]

  function normalizeAddressText (value) {
    return String(value || '')
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036F]/g, '')
      .replace(/[^a-z0-9\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }

  function normalizePhone (value) {
    return String(value || '').replace(/\D/g, '').trim()
  }

  function resolveUserAddress (user) {
    const source = user && typeof user === 'object' ? user : {}
    return (
      source.address
      || source.shippingAddress
      || source.shipping_address
      || source.fullAddress
      || source.full_address
      || source.diaChi
      || ''
    )
  }

  function applyTextFallbackShipping (addressText = '', searchToken = addressSearchToken) {
    if (searchToken !== null && searchToken !== addressSearchToken) return
    const normalized = normalizeAddressText(addressText)
    const isHaNoi = /ha\s*noi/.test(normalized)

    distanceKm.value = '0.0'
    estimatedDays.value = isHaNoi ? 1 : 3
    calculatedShippingFee.value = isHaNoi ? 30_000 : 40_000
    fullAddressString.value = String(addressText || '').trim()

    routeError.value = ''
    isRouteCalculated.value = true
  }

  function buildDetectedAddressString () {
    return [
      selectedWard.value?.name,
      selectedDistrict.value?.name,
      selectedProvince.value?.name,
    ]
      .filter(Boolean)
      .join(', ')
  }

  function buildCurrentAddressString (addressText = streetAddress.value) {
    const str = String(addressText || '').trim()
    const parts = [str]
    const norm = normalizeAddressText(str)

    const ward = selectedWard.value?.name
    if (ward) {
      const bare = stripAdministrativePrefix(ward)
      if (bare && !norm.includes(bare)) parts.push(ward)
    }
    const district = selectedDistrict.value?.name
    if (district) {
      const bare = stripAdministrativePrefix(district)
      if (bare && !norm.includes(bare)) parts.push(district)
    }
    const province = selectedProvince.value?.name
    if (province) {
      const bare = stripAdministrativePrefix(province)
      if (bare && !norm.includes(bare)) parts.push(province)
    }
    return parts.filter(Boolean).join(', ')
  }

  function scheduleAutoRouteCalculation () {
    if (autoRouteTimer) {
      clearTimeout(autoRouteTimer)
    }

    autoRouteTimer = setTimeout(() => {
      void processAddressText(streetAddress.value, addressSearchToken)
    }, 500)
  }

  function scheduleAddressAutoFill () {
    if (autoAddressFillTimer) {
      clearTimeout(autoAddressFillTimer)
    }

    autoAddressFillTimer = setTimeout(async () => {
      if (isAutoFillingAddress.value) return
      if (String(streetAddress.value || '').trim().length < 3) return
      await autoFillAddressHierarchyFromText(streetAddress.value)
    }, 800)
  }

  function splitAddressCandidates (...values) {
    return values
      .flatMap(value => String(value || '').split(','))
      .map(part => part.trim())
      .filter(Boolean)
  }

  function stripAdministrativePrefix (value) {
    return normalizeAddressText(value)
      .replace(/^(phuong|p|xa|x|thi tran|tt|quan|q|huyen|h|thi xa|tx|thanh pho|tp|tinh|ward|district|city|province|street|st)[\s.,-]+/g, '')
      .replace(/[\s.,-]+(ward|district|city|province|street|county)$/g, '')
      .replace(/\s+/g, ' ')
      .trim()
  }

  function findBestMatchByName (options, ...rawNames) {
    const list = Array.isArray(options) ? options : []
    const candidates = splitAddressCandidates(...rawNames)
      .map(part => stripAdministrativePrefix(part))
      .filter(Boolean)

    if (list.length === 0 || candidates.length === 0) return null

    let best = null
    let bestScore = -1

    for (const item of list) {
      const name = stripAdministrativePrefix(item?.name)
      if (!name) continue
      const nameClean = name.replace(/\s+/g, '')

      let score = 0
      for (const target of candidates) {
        if (!target) continue
        const targetClean = target.replace(/\s+/g, '')

        if (target === name || targetClean === nameClean) score = Math.max(score, 100)
        else if (target.includes(name) || targetClean.includes(nameClean)) score = Math.max(score, 80)
        else if (name.includes(target) || nameClean.includes(targetClean)) score = Math.max(score, 70)
        else {
          const targetTokens = target.split(' ').filter(Boolean)
          const nameTokens = new Set(name.split(' ').filter(Boolean))
          const overlap = targetTokens.filter(token => nameTokens.has(token)).length
          if (overlap > 0) {
            const tokenScore = overlap * 10
            score = Math.max(score, tokenScore)
          }
        }
      }

      if (score > bestScore) {
        bestScore = score
        best = item
      }
    }

    return bestScore >= 20 ? best : null
  }

  async function safeParseResponse (res) {
    if (!res) return null
    try {
      const data = await res.json()
      return data
    } catch {
      try {
        const text = await res.text()
        return text
      } catch {
        return null
      }
    }
  }

  async function processAddressText (rawAddress, searchToken) {
    const input = String(rawAddress || '').trim()
    if (!input || searchToken !== addressSearchToken) return

    let geoResult = null
    if (provinces.value.length > 0) {
      geoResult = await autoFillAddressHierarchyFromText(input, searchToken)
    }
    if (searchToken !== addressSearchToken) return

    // Reuse coordinates from autoFill geocode to avoid a second Nominatim call (429 rate-limit)
    const reusedPoint = (geoResult && geoResult.lat && geoResult.lon)
      ? { latitude: Number(geoResult.lat), longitude: Number(geoResult.lon), address: geoResult.address || {}, addressText: input }
      : selectedAddressPoint.value
    await calculateRouteFromFreeformAddress(input, true, searchToken, reusedPoint)
  }

  async function autoFillAddressHierarchyFromText (rawAddress, selectionToken = null) {
    const input = String(rawAddress || '').trim()
    if (!input || provinces.value.length === 0) return

    isAutoFillingAddress.value = true
    skipNextWatcherUpdate.value = true

    try {
      let first = null
      const parts = input.split(',').map(s => s.trim()).filter(Boolean)
      while (parts.length > 0) {
        const q = parts.join(', ')
        const geoRes = await fetchGeocode(q, 5)
        if (selectionToken !== null && selectionToken !== addressSearchToken) return
        if (!geoRes.ok) {
          if (geoRes.status === 429) {
            routeError.value = 'Geocoding service busy — tính ship tạm thời bằng ước lượng.'
            applyTextFallbackShipping(input, selectionToken)
            return true
          }
          throw new Error(`Geocoding failed (HTTP ${geoRes.status})`)
        }
        const geoData = geoRes.data
        if (Array.isArray(geoData) && geoData.length > 0) {
          first = chooseGeocodeCandidate(input, geoData)
        }
        if (first) {
          break
        }
        parts.shift()
      }

      if (!first) return null

      // Extract from Photon for basic hints (may be English)
      let addressMeta = first?.address || {}

      // Photon returns English names ("Hanoi", "Lang Ward") which can't match
      // Vietnamese dropdown options ("Thành phố Hà Nội", "Phường Láng Hạ").
      // Do a Nominatim reverse geocode with Vietnamese language to get proper names.
      if (first.lat && first.lon) {
        try {
          const revRes = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${first.lat}&lon=${first.lon}&addressdetails=1&accept-language=vi`,
          )
          if (selectionToken !== null && selectionToken !== addressSearchToken) return
          if (revRes.ok) {
            const revData = await revRes.json()
            if (revData.address) {
              // Validate: only use reverse geocode data if the province/city matches
              // (prevent wrong data like "Huyện KBàng" in Gia Lai when address is in Hanoi)
              const revProvince = normalizeAddressText(revData.address.state || revData.address.city || '')
              const origProvince = normalizeAddressText(addressMeta.state || addressMeta.city || '')
              const isSameRegion = !origProvince || !revProvince
                || revProvince.includes(origProvince) || origProvince.includes(revProvince)
                || revProvince.replace(/\s/g, '').includes(origProvince.replace(/\s/g, ''))
                || origProvince.replace(/\s/g, '').includes(revProvince.replace(/\s/g, ''))
              if (isSameRegion) {
                addressMeta = { ...addressMeta, ...revData.address }
              }
            }
          }
        } catch {
          // Fallback to original Photon hints
        }
      }

      const provinceHint
        = addressMeta.state
          || addressMeta.city
          || addressMeta.province
          || addressMeta.region
          || ''
      const districtHint
        = addressMeta.city_district
          || addressMeta.county
          || addressMeta.district
          || addressMeta.suburb
          || ''
      const wardHint
        = addressMeta.quarter
          || addressMeta.ward
          || addressMeta.neighbourhood
          || addressMeta.suburb
          || ''
      const displayNameHint = first?.display_name || ''
      if (selectionToken !== null && selectionToken !== addressSearchToken) return

      // STEP 1: Match Province - try hint first, then fallback to input search
      const matchedProvince
        = findBestMatchByName(provinces.value, provinceHint, displayNameHint)
          || findBestMatchByName(provinces.value, input, displayNameHint)

      if (selectionToken !== null && selectionToken !== addressSearchToken) return

      if (!matchedProvince) {
        skipNextWatcherUpdate.value = false
        scheduleAutoRouteCalculation()
        return
      }

      selectedProvince.value = matchedProvince
      districts.value = matchedProvince.districts || []

      // STEP 2: Match District - try hint first, then search whole input text
      const matchedDistrict
        = findBestMatchByName(districts.value, districtHint, displayNameHint)
          || findBestMatchByName(districts.value, input, displayNameHint)

      if (matchedDistrict) {
        selectedDistrict.value = matchedDistrict
        wards.value = matchedDistrict.wards || []

        // STEP 3: Match Ward - try hint first, then search whole input
        const matchedWard
          = findBestMatchByName(wards.value, wardHint, displayNameHint)
            || findBestMatchByName(wards.value, input, displayNameHint)

        selectedWard.value = matchedWard || ''
      } else {
        // District hint didn't work - try searching inside each district's wards for the hint
        let foundDistrictAndWard = false

        for (const dist of districts.value) {
          const districtWards = dist.wards || []

          // Try to find ward using ward hint
          const wardByHint = findBestMatchByName(
            districtWards,
            wardHint,
            displayNameHint,
            input,
          )
          if (wardByHint) {
            selectedDistrict.value = dist
            selectedWard.value = wardByHint
            wards.value = districtWards
            foundDistrictAndWard = true
            break
          }
        }

        // If still no match, try searching entire input text across all districts/wards
        if (!foundDistrictAndWard) {
          for (const dist of districts.value) {
            const districtWards = dist.wards || []

            // Try to find by input text
            const wardByInput = findBestMatchByName(
              districtWards,
              input,
              displayNameHint,
            )
            if (wardByInput) {
              selectedDistrict.value = dist
              selectedWard.value = wardByInput
              wards.value = districtWards
              foundDistrictAndWard = true
              break
            }
          }
        }

        // If still no exact match found, just leave ward empty but keep district set
        if (!foundDistrictAndWard) {
          selectedWard.value = ''
          // Set wards array to empty so user can manually select
          wards.value = []
        }
      }

      fullAddressString.value = input
      return first
    } catch (error) {
      console.error('Auto-fill error:', error)
    } finally {
      if (selectionToken === null || selectionToken === addressSearchToken) {
        isAutoFillingAddress.value = false
        // Reset flag AFTER this microtask completes so watcher definitely skips
        Promise.resolve().then(() => {
          if (selectionToken === null || selectionToken === addressSearchToken) {
            skipNextWatcherUpdate.value = false
          }
        })
      }
    }
  }

  async function calculateRouteFromFreeformAddress (rawAddress, silent = false, searchToken = addressSearchToken, preferredPoint = null) {
    const addressText = String(rawAddress || '').trim()
    if (!addressText) {
      if (!silent) {
        routeError.value = 'Vui lòng nhập địa chỉ giao hàng để tính phí ship.'
      }
      return false
    }

    try {
      const pointMatchesAddress = preferredPoint
        && (preferredPoint.addressText === addressText || addressText.startsWith(preferredPoint.addressText) || preferredPoint.addressText.startsWith(addressText))
      let first = pointMatchesAddress
        ? {
          lat: preferredPoint.latitude,
          lon: preferredPoint.longitude,
          address: preferredPoint.address,
          display_name: addressText,
        }
        : null
      if (!first) {
        const parts = addressText.split(',').map(s => s.trim()).filter(Boolean)
        const originalLength = parts.length
        while (parts.length > 0) {
          const q = parts.join(', ')
          const geoRes = await fetchGeocode(q, 5)
          if (searchToken !== addressSearchToken) return false

          if (geoRes.ok && Array.isArray(geoRes.data) && geoRes.data.length > 0) {
            first = chooseGeocodeCandidate(addressText, geoRes.data)
          }
          if (first) {
            if (parts.length <= 1 && originalLength >= 3) {
              first = null
            }
            break
          }
          parts.shift()
        }
      }
      if (!first) {
        applyTextFallbackShipping(addressText, searchToken)
        return true
      }

      const userLat = Number(first.lat)
      const userLon = Number(first.lon)
      if (!Number.isFinite(userLat) || !Number.isFinite(userLon)) {
        applyTextFallbackShipping(addressText, searchToken)
        return true
      }

      const routeUrl = `https://router.project-osrm.org/route/v1/driving/${SHOP_COORD[1]},${SHOP_COORD[0]};${userLon},${userLat}?overview=false`
      const routeRes = await fetch(routeUrl)
      const routeData = await routeRes.json()
      if (searchToken !== addressSearchToken) return false
      if (routeData.code !== 'Ok') {
        applyTextFallbackShipping(addressText, searchToken)
        return true
      }

      const km = Number(routeData.routes?.[0]?.distance || 0) / 1000
      const provinceText = String(
        first.address?.state || first.address?.city || first.address?.province || first.display_name || addressText || '',
      )
      const isHaNoi = /ha\s*noi/.test(normalizeAddressText(provinceText))

      distanceKm.value = Number.isFinite(km) ? km.toFixed(1) : '0.0'
      if (isHaNoi) {
        if (km < 5) calculatedShippingFee.value = 15_000
        else if (km < 10) calculatedShippingFee.value = 25_000
        else calculatedShippingFee.value = 35_000
        estimatedDays.value = 1
      } else {
        calculatedShippingFee.value = 40_000
        estimatedDays.value = km < 100 ? 2 : 3
      }

      const formatted = formatGeocodedAddress(first)
      if (isMatchingGeocodeAddress(addressText, first)) {
        fullAddressString.value = formatted
        if (addressText.length < formatted.length && streetAddress.value === addressText) {
          skipNextAddressWatcher = true
          streetAddress.value = formatted
        }
      } else {
        fullAddressString.value = addressText
      }

      routeError.value = ''
      isRouteCalculated.value = true
      return true
    } catch {
      applyTextFallbackShipping(addressText, searchToken)
      return true
    }
  }

  function isMatchingGeocodeAddress (input, result) {
    const normalizedDisplay = normalizeAddressText(result?.display_name)
    const tokens = normalizeAddressText(input)
      .split(' ')
      .filter(token => token.length > 1)
    const houseNumber = tokens.find(token => /^\d+[a-z]?$/i.test(token))
    const streetTokens = tokens.filter(token => (
      token !== houseNumber
      && ![
        'so', 'nha', 'duong', 'pho', 'ngo', 'ngach', 'hem', 'hanoi', 'ha', 'noi', 'vietnam',
        'xa', 'phuong', 'thi', 'tran', 'thanh', 'pho', 'quan', 'huyen', 'tinh',
        'ward', 'district', 'city', 'province',
      ].includes(token)
    ))
    if (streetTokens.length === 0) return false
    const matchedStreetTokens = streetTokens.filter(token => normalizedDisplay.includes(token)).length
    const hasMatchingPhrase = streetTokens.some((token, index) => {
      const nextToken = streetTokens[index + 1]
      if (!nextToken) return false
      return normalizedDisplay.includes(`${token} ${nextToken}`)
    })

    if (streetTokens.length === 1) return matchedStreetTokens === 1
    return hasMatchingPhrase && matchedStreetTokens >= 2
  }

  function chooseGeocodeCandidate (input, candidates) {
    const matchingCandidates = candidates.filter(candidate => isMatchingGeocodeAddress(input, candidate))
    const candidatesToRank = matchingCandidates.length > 0 ? matchingCandidates : candidates
    const inputTokens = normalizeAddressText(input).split(' ').filter(Boolean)
    const houseNumber = inputTokens.find(token => /^\d+[a-z]?$/i.test(token))

    const rankedCandidates = candidatesToRank
      .map(candidate => {
        const candidateText = normalizeAddressText(candidate.display_name)
        const tokenMatches = inputTokens.filter(token => candidateText.includes(token)).length
        const hasHouseNumber = houseNumber && candidateText.includes(houseNumber)
        return {
          candidate,
          score: tokenMatches + (hasHouseNumber ? 10 : 0),
        }
      })
      .toSorted((left, right) => right.score - left.score)
      .find(
        result => result.score > 0,
      )

    return rankedCandidates?.candidate || null
  }

  function formatGeocodedAddress (result) {
    const segments = String(result?.display_name || '')
      .split(',')
      .map(segment => segment.trim())
      .filter(Boolean)

    if (segments.length < 2) return segments.join(', ')

    const firstTokens = new Set(normalizeAddressText(segments[0]).split(' ').filter(Boolean))
    const deduplicated = segments.filter((segment, index) => {
      if (index === 0) return true
      const segmentTokens = normalizeAddressText(segment).split(' ').filter(Boolean)
      const overlap = segmentTokens.filter(token => firstTokens.has(token)).length
      return overlap < Math.min(2, firstTokens.size)
    })

    return deduplicated.join(', ')
  }

  async function autoCalculateShippingOnEnter () {
    const rawAddress = String(streetAddress.value || shippingForm.address || '').trim()
    if (!rawAddress) {
      return
    }

    if (!streetAddress.value) {
      streetAddress.value = rawAddress
    }

    const ok = await checkAndCalculateRoute(true, addressSearchToken)
    if (!ok) {
      applyTextFallbackShipping(rawAddress)
    }
  }

  onMounted(async () => {
    window.scrollTo(0, 0)
    await nextTick()

    await hydrateCheckout()
    await fetchAddresses()
    startCheckoutStockSync()
    updateStockNotice()
    try {
      const res = await fetch('https://esgoo.net/api-tinhthanh/4/0.htm')
      const json = await res.json()
      provinces.value = json.error === 0 && json.data
        ? json.data.map(p => ({
          name: p.full_name || p.name,
          code: p.id,
          districts: (p.data2 || []).map(d => ({
            name: d.full_name || d.name,
            code: d.id,
            wards: (d.data3 || []).map(w => ({
              name: w.full_name || w.name,
              code: w.id,
            })),
          })),
        }))
        : []

      if (shippingForm.address) {
        await processAddressText(shippingForm.address, ++addressSearchToken)
      }
    } catch (error) {
      console.error('Không tải được API Tỉnh Thành', error)
      await autoCalculateShippingOnEnter()
    }
  })

  onUnmounted(() => {
    stopCheckoutStockSync()
  })

  async function checkAndCalculateRoute (silent = false, searchToken = addressSearchToken) {
    if (!streetAddress.value && shippingForm.address) {
      streetAddress.value = String(shippingForm.address).trim()
    }

    if (!streetAddress.value) {
      if (!silent) {
        routeError.value = 'Vui lòng nhập địa chỉ giao hàng để tính phí ship.'
      }
      isRouteCalculated.value = false
      return false
    }

    // Khi đã chọn combobox Tỉnh/Quận → ghép để geocoding chính xác hơn
    // Khi chưa chọn (saved address flow) → dùng streetAddress nguyên bản vì đã có đầy đủ
    const fullAddr = (selectedProvince.value && selectedDistrict.value)
      ? buildCurrentAddressString()
      : String(streetAddress.value || shippingForm.address).trim()
    const calculatedFromFreeform = await calculateRouteFromFreeformAddress(
      fullAddr,
      silent,
      searchToken,
      selectedAddressPoint.value,
    )
    return calculatedFromFreeform
  }

  function applyFallbackShipping () {
    distanceKm.value = 0
    const addressForFee = String(streetAddress.value || shippingForm.address || '').trim()
    const detectedProvince = selectedProvince.value?.name || ''
    const isHaNoi
      = /ha\s*noi/.test(normalizeAddressText(addressForFee))
        || /ha\s*noi/.test(normalizeAddressText(detectedProvince))
    estimatedDays.value = isHaNoi ? 1 : 3
    calculatedShippingFee.value = isHaNoi ? 30_000 : 40_000
    fullAddressString.value = buildCurrentAddressString(addressForFee)
    routeError.value = ''
    isRouteCalculated.value = true
  }
  // ===== END LOGIC ROUTING =====

  // ===== LOGIC THANH TOÁN VÀ VOUCHER =====
  const selectedPayment = ref(1)
  const paymentMethods = [
    { id: 1, name: 'Thanh toán khi nhận hàng', icon: 'local_shipping' },
    { id: 2, name: 'VNPay QR / Ví điện tử', icon: 'qr_code_2' },
  ]
  const selectedDigitalPayment = ref(2)
  const digitalPaymentMethods = [
    { id: 2, name: 'VNPay' },
    { id: 3, name: 'Momo' },
    { id: 4, name: 'Bank Transfer' },
    { id: 5, name: 'ZaloPay' },
  ]
  const effectivePaymentMethodId = computed(() =>
    selectedPayment.value === 1 ? 1 : Number(selectedDigitalPayment.value || 2),
  )

  const voucherInput = ref('')
  const appliedVoucher = ref(null)
  const availableVouchers = ref([])

  function getVoucherMinOrder (voucher) {
    return Number(voucher?.minOrderValue ?? voucher?.min_order_value ?? 0) || 0
  }

  function getVoucherUsageState (voucher) {
    const limit = Number(voucher?.usageLimit ?? voucher?.usage_limit ?? voucher?.limit ?? 0) || 0
    const used = Number(voucher?.usedCount ?? voucher?.used_count ?? voucher?.used ?? 0) || 0
    return {
      limit,
      used,
      remaining: limit > 0 ? Math.max(0, limit - used) : null,
      exhausted: limit > 0 && used >= limit,
    }
  }

  function getVoucherByCode (code) {
    const normalizedCode = String(code || '').trim().toUpperCase()
    if (!normalizedCode) return null

    return (
      (availableVouchers.value || []).find(
        voucher => String(voucher?.code || '').trim().toUpperCase() === normalizedCode,
      ) || null
    )
  }

  function enforceVoucherMinOrder (voucher, orderBaseAmount) {
    const fromList = getVoucherByCode(voucher?.code)
    const minOrder = Math.max(
      getVoucherMinOrder(voucher),
      getVoucherMinOrder(fromList),
    )

    if (minOrder > 0 && Number(orderBaseAmount) < minOrder) {
      throw new Error(
        `Đơn tối thiểu ${formatMoney(minOrder)} mới áp dụng được mã ${voucher?.code || ''}.`,
      )
    }
  }

  function computeVoucherDiscount (voucher, baseAmount) {
    const type = voucher?.discountType || voucher?.discount_type
    const value = Number(voucher?.discountValue ?? voucher?.discount_value ?? 0) || 0
    const safeBase = Math.max(0, Number(baseAmount) || 0)
    const maxCap = Number(voucher?.maxDiscountAmount ?? voucher?.max_discount_amount ?? 0) || 0

    if (type === 'AMOUNT') {
      return Math.min(safeBase, value)
    }
    if (type === 'PERCENT') {
      const raw = (safeBase * value) / 100
      // Áp dụng giới hạn giảm tối đa nếu có
      return maxCap > 0 ? Math.min(raw, maxCap) : raw
    }
    return Number(voucher?.discountAmount || 0)
  }

  function getVoucherAvailabilityReason (voucher) {
    const statusRaw = String(voucher?.status || voucher?.state || '').trim().toUpperCase()
    if (['INACTIVE', 'DISABLED', 'DELETED'].includes(statusRaw)) return 'Voucher không còn hoạt động'
    if (statusRaw === 'EXPIRED') return 'Voucher đã hết hạn'
    if (statusRaw === 'USED') return 'Voucher đã hết lượt sử dụng'

    if (voucher?.isActive === false || voucher?.is_active === false) return 'Voucher không còn hoạt động'

    const now = new Date()
    const startDateRaw = voucher?.startDate || voucher?.start_date
    if (startDateRaw) {
      const startDate = new Date(startDateRaw)
      if (!Number.isNaN(startDate.getTime()) && startDate.getTime() > now.getTime()) {
        return 'Voucher chưa đến hạn sử dụng'
      }
    }

    const endDateRaw = voucher?.endDate || voucher?.end_date || voucher?.expiryDate || voucher?.expire_date
    if (endDateRaw) {
      const endDate = new Date(endDateRaw)
      if (!Number.isNaN(endDate.getTime()) && endDate.getTime() < now.getTime()) {
        return 'Voucher đã hết hạn'
      }
    }

    const usageState = getVoucherUsageState(voucher)
    if (usageState.exhausted) return 'Voucher đã hết lượt sử dụng'

    return null
  }

  function isVoucherActive (voucher) {
    return !getVoucherAvailabilityReason(voucher)
  }

  const processedAvailableVouchers = computed(() => {
    const orderBase = Math.max(0, orderTotalBeforeDiscount.value)

    return (availableVouchers.value || [])
      .map(voucher => {
        const minOrder = getVoucherMinOrder(voucher)
        const isEligible = orderBase >= minOrder
        const expectedDiscount = isEligible
          ? computeVoucherDiscount(voucher, orderBase)
          : 0
        const reason = getVoucherAvailabilityReason(voucher)
        return {
          ...voucher,
          isEligible,
          expectedDiscount,
          isActive: !reason,
          reason,
        }
      })
      .filter(voucher => !voucher.reason)
      .toSorted((a, b) => (b.expectedDiscount || 0) - (a.expectedDiscount || 0))
  })

  const cartItems = computed(() => cartStore.cartItems)
  let checkoutStockTimer = null
  const subtotal = computed(() => cartStore.cartTotal)
  const shipping = computed(() =>
    cartItems.value.length > 0 ? calculatedShippingFee.value : 0,
  )

  // TÍNH TIỀN GIẢM GIÁ
  const discountAmount = computed(() => {
    if (!appliedVoucher.value) return 0

    // Base để tính giảm giá = subtotal (giá hàng), KHÔNG bao gồm phí ship
    const base = Math.max(0, subtotal.value)
    // Giới hạn tối đa 50% theo quy định khuyến mãi Việt Nam
    const maxAllowed = base * 0.5

    // Ưu tiên dùng discountAmount từ API (đã áp dụng cap maxDiscountAmount bên backend)
    if (appliedVoucher.value.discountAmount != null) {
      return Math.min(
        Math.max(0, Number(appliedVoucher.value.discountAmount) || 0),
        maxAllowed,
      )
    }

    // Fallback: tự tính nếu chưa có discountAmount từ API
    const currentCode = appliedVoucher.value.code || voucherInput.value
    const found = availableVouchers.value.find(
      v => v.code.toUpperCase() === String(currentCode).toUpperCase(),
    )

    const type = found
      ? found.discountType
      : appliedVoucher.value.discountType || appliedVoucher.value.discount_type
    const val = found
      ? found.discountValue
      : appliedVoucher.value.discountValue || appliedVoucher.value.discount_value
    const maxCap = found
      ? (found.maxDiscountAmount ?? null)
      : (appliedVoucher.value.maxDiscountAmount ?? null)

    if (type === 'AMOUNT') {
      return Math.min(base, Number(val) || 0, maxAllowed)
    } else if (type === 'PERCENT') {
      const raw = (base * (Number(val) || 0)) / 100
      // Áp dụng cap maxDiscountAmount nếu có, sau đó giới hạn 50%
      const capped = maxCap != null && Number(maxCap) > 0 ? Math.min(raw, Number(maxCap)) : raw
      return Math.min(base, capped, maxAllowed)
    }

    return 0
  })

  const orderTotalBeforeDiscount = computed(() =>
    Math.max(0, subtotal.value + shipping.value),
  )
  const total = computed(() =>
    Math.max(0, orderTotalBeforeDiscount.value - discountAmount.value),
  )

  function extractListPayload (payload) {
    if (Array.isArray(payload)) return payload
    if (!payload || typeof payload !== 'object') return []
    if (Array.isArray(payload.data)) return payload.data
    if (Array.isArray(payload.content)) return payload.content
    if (Array.isArray(payload.items)) return payload.items
    if (payload.data && Array.isArray(payload.data.content)) return payload.data.content
    if (payload.data && Array.isArray(payload.data.items)) return payload.data.items
    return []
  }

  function showAlert (title, message, type = 'success', onConfirm = null) {
    modal.title = title
    modal.message = message
    modal.type = type
    modal.onConfirm = onConfirm
    modal.show = true
  }

  function closeAlert () {
    const onConfirm = modal.onConfirm
    modal.onConfirm = null
    modal.show = false
    if (typeof onConfirm === 'function') onConfirm()
  }

  function updateStockNotice () {
    const issues = cartItems.value.filter(item => {
      const available = Number(item.stockAvailable || item.stockQuantity)
      return Number.isFinite(available)
        && available >= 0
        && available < Number(item.quantity || 0)
    })
    if (issues.length === 0) {
      stockNotice.value = ''
      return
    }
    stockNotice.value = issues.map(item => {
      const name = item.productName || 'Sản phẩm'
      return `• ${name}: bạn đặt ${item.quantity}, hiện kho chỉ còn ${item.stockAvailable || item.stockQuantity}`
    }).join('\n')
  }

  async function syncCheckoutStockLive () {
    if (document.hidden) return
    await cartStore.refreshCartStockLive()
    updateStockNotice()
  }

  function startCheckoutStockSync () {
    checkoutStockTimer = setInterval(syncCheckoutStockLive, 15_000)
    window.addEventListener('focus', syncCheckoutStockLive)
    document.addEventListener('visibilitychange', syncCheckoutStockLive)
  }

  function stopCheckoutStockSync () {
    if (checkoutStockTimer) clearInterval(checkoutStockTimer)
    window.removeEventListener('focus', syncCheckoutStockLive)
    document.removeEventListener('visibilitychange', syncCheckoutStockLive)
  }

  function formatMoney (value) {
    return orderUtils.formatPrice(value || 0)
  }
  function getItemName (item) {
    return item.productName || item.name || 'Sản phẩm'
  }
  function getItemImage (item) {
    return item.imageUrl || item.image || 'https://via.placeholder.com/150'
  }
  function getSizeLabel (item) {
    return (
      resolveSizeMeta({ id: item.sizeId, name: item.sizeName || item.variantSize || '' })
        .name || '--'
    )
  }
  function getColorLabel (item) {
    return (
      resolveColorMeta({
        id: item.colorId,
        name: item.colorName || item.color,
        hexCode: item.colorHexCode,
      }).name || '--'
    )
  }

  function getAccountId (user) {
    const source = user && typeof user === 'object' ? user : {}
    const candidate = source.accountId ?? source.account_id ?? source.id
    const n = Number(candidate)
    return Number.isFinite(n) && n > 0 ? n : null
  }

  function redirectToLoginForCheckout () {
    router.replace({ name: 'login', query: { redirect: '/checkout' } })
  }

  // =====================================
  // ĐÂY LÀ CHỖ ĐỂ TÍCH HỢP PAYLOAD ĐẶT HÀNG!
  // =====================================
  async function handlePlaceOrder () {
    if (isProcessing.value) return

    // Bổ sung confirm theo yêu cầu "Thanh toán phải có confirm"
    const userConfirmed = await new Promise(resolve => {
      confirmResolver = resolve
      showConfirmModal.value = true
    })
    
    if (!userConfirmed) {
      return
    }

    // Guard: chặn đặt hàng nếu giỏ hàng rỗng (bảo vệ cả khi bị bypass UI)
    if (!cartItems.value?.length) {
      showAlert('Giỏ hàng trống', 'Vui lòng thêm sản phẩm vào giỏ trước khi thanh toán.', 'error')
      return
    }

    // Guard: bắt buộc chọn đủ Tỉnh/Quận/Phường
    if (!selectedProvince.value || !selectedDistrict.value || !selectedWard.value) {
      showAlert('Thiếu địa chỉ', 'Vui lòng chọn đầy đủ Tỉnh/Thành phố, Quận/Huyện và Phường/Xã.', 'error')
      return
    }

    if (!isRouteCalculated.value) {
      const autoCalculated = await checkAndCalculateRoute(true)
      if (autoCalculated && isRouteCalculated.value) {
      // Continue placing order below.
      } else {
        showAlert(
          'Thiếu thông tin',
          'Vui lòng nhập địa chỉ giao hàng đầy đủ để hệ thống tự tính phí ship.',
          'error',
        )
        return
      }
    }

    const normalizedName = String(shippingForm.fullname || '').trim()
    const normalizedPhone = normalizePhone(shippingForm.phone)
    if (normalizedName.length < 2) {
      showAlert(
        'Thiếu thông tin',
        'Vui lòng nhập họ tên hợp lệ (ít nhất 2 ký tự).',
        'error',
      )
      return
    }
    if (!/^\d{7,15}$/.test(normalizedPhone)) {
      showAlert(
        'Thiếu thông tin',
        'Số điện thoại chỉ gồm chữ số và dài từ 7 đến 15 ký tự.',
        'error',
      )
      return
    }

    // Validate địa chỉ giao hàng đầy đủ
    if (!String(streetAddress.value || '').trim()) {
      showAlert('Thiếu thông tin', 'Vui lòng nhập địa chỉ chi tiết (số nhà, tên đường).', 'error')
      return
    }

    // voucher validation is performed after shipping is known so discount applies to subtotal+shipping

    isProcessing.value = true

    try {
      const finalShippingAddress = fullAddressString.value || buildCurrentAddressString()
      if (!isRouteCalculated.value && finalShippingAddress) {
        applyFallbackShipping()
      }
      const effectiveShippingFee = Math.max(
        0,
        Number(
          // prefer calculatedShippingFee (from route) but fall back to precomputed calculatedShippingFee
          typeof calculatedShippingFee.value === 'number' && !Number.isNaN(Number(calculatedShippingFee.value))
            ? calculatedShippingFee.value
            : (typeof shipping.value === 'number' ? shipping.value : 0),
        ),
      )
      const effectiveTotalBeforeDiscount = Math.max(
        0,
        Number(subtotal.value || 0) + effectiveShippingFee,
      )
      const effectiveDiscountAmount = Math.min(
        effectiveTotalBeforeDiscount,
        Math.max(0, Number(discountAmount.value || 0)),
      )
      const effectiveFinalAmount = Math.max(
        0,
        effectiveTotalBeforeDiscount - effectiveDiscountAmount,
      )
      const effectiveDistanceKm = Number(distanceKm.value || 0) || 0

      // Now validate voucher against the effective total (subtotal + shipping)
      if (appliedVoucher.value?.code) {
        try {
          const validatedVoucher = await voucherAPI.applyVoucher(
            appliedVoucher.value.code,
            effectiveTotalBeforeDiscount,
          )
          const usageState = getVoucherUsageState(validatedVoucher)
          if (usageState.exhausted) {
            throw new Error('Mã giảm giá đã hết lượt sử dụng.')
          }
          enforceVoucherMinOrder(validatedVoucher, effectiveTotalBeforeDiscount)
          appliedVoucher.value = validatedVoucher
          voucherInput.value = validatedVoucher.code || appliedVoucher.value.code
        } catch (voucherError) {
          showAlert(
            'Voucher không hợp lệ',
            voucherError?.message || 'Mã giảm giá không còn đủ điều kiện áp dụng.',
            'error',
          )
          clearVoucher()
          isProcessing.value = false
          return
        }
      }

      // ── STOCK VALIDATION: Kiểm tra tồn kho trước khi đặt hàng ──
      const stockCheckItems = cartItems.value.map(item => ({
        variantId: item.variantId || item.variant_id || (item.variant && item.variant.id),
        quantity: item.quantity,
        productName: item.productName || item.name,
      }))
      const stockResult = await stockApi.checkStock(stockCheckItems)
      if (!stockResult.valid) {
        const errorMessages = stockResult.errors.map(e => e.message).join('\n')
        showAlert(
          'Sản phẩm không đủ hàng',
          `Một số sản phẩm bạn chọn vừa được bán tại cửa hàng hoặc khách khác đặt trước, nên tồn kho đã giảm:\n\n${errorMessages}\n\nVui lòng giảm số lượng trong giỏ rồi đặt lại nhé.`,
          'error',
          async () => {
            await cartStore.loadCartFromBackend(currentAccountId.value)
            router.push('/shop')
          },
        )
        await cartStore.loadCartFromBackend(currentAccountId.value)
        isProcessing.value = false
        return
      }
      // ── End STOCK VALIDATION ──

      const orderData = {
        accountId: currentAccountId.value,
        orderSource: 'ONLINE',
        salesChannel: 'ONLINE',
        fullname: normalizedName,
        gmail: shippingForm.gmail || null,
        email: shippingForm.gmail || null,
        phone: normalizedPhone,
        shippingAddress: finalShippingAddress,
        streetAddress: streetAddress.value || null,
        wardName: selectedWard.value?.name || null,
        districtName: selectedDistrict.value?.name || null,
        provinceName: selectedProvince.value?.name || null,
        paymentMethodId: effectivePaymentMethodId.value,
        voucherId: appliedVoucher.value?.id || null,
        voucherCode: appliedVoucher.value?.code || null,
        subtotalAmount: subtotal.value,
        subtotal: subtotal.value,
        subtotal_amount: subtotal.value,
        shippingFee: effectiveShippingFee,
        shipping_fee: effectiveShippingFee,
        shipping: effectiveShippingFee,
        shippingAmount: effectiveShippingFee,
        shipping_amount: effectiveShippingFee,
        deliveryFee: effectiveShippingFee,
        delivery_fee: effectiveShippingFee,
        shipFee: effectiveShippingFee,
        ship_fee: effectiveShippingFee,
        feeShip: effectiveShippingFee,
        fee_ship: effectiveShippingFee,
        shippingDistanceKm: effectiveDistanceKm,
        shipping_distance_km: effectiveDistanceKm,
        distanceKm: effectiveDistanceKm,
        distance_km: effectiveDistanceKm,
        orderShipping: {
          fee: effectiveShippingFee,
          shippingFee: effectiveShippingFee,
          distanceKm: effectiveDistanceKm,
        },
        shippingInfo: {
          fee: effectiveShippingFee,
          shippingFee: effectiveShippingFee,
          distanceKm: effectiveDistanceKm,
        },
        totalMoney: effectiveFinalAmount,
        total_money: effectiveFinalAmount,
        totalAmount: effectiveFinalAmount,
        total_amount: effectiveFinalAmount,
        discountAmount: effectiveDiscountAmount,
        discount_amount: effectiveDiscountAmount,
        finalAmount: effectiveFinalAmount,
        final_amount: effectiveFinalAmount,

        // >>> DANH SÁCH Áo GỬI KÈM MỚI Ở ĐÂY NÈ! <<<
        items: cartItems.value.map(item => ({
          variantId:
            item.variantId
            || item.variant_id
            || (item.variant && item.variant.id)
            || (item.product && item.product.defaultVariantId),
          quantity: item.quantity,
        })),
      }

      const result = await orderAPI.placeOrder(orderData)
      const createdOrderId
        = result?.orderId
          || result?.id
          || result?.data?.orderId
          || result?.data?.id

      if (createdOrderId) {
        try {
          await orderAPI.updateOrder(createdOrderId, {
            ...orderData,
            id: createdOrderId,
            orderId: createdOrderId,
          })
        } catch (updateError) {
          console.warn('Không thể cập nhật lại phí vận chuyển cho đơn hàng:', updateError)
        }
      }

      // ── VNPay: nếu chọn thanh toán online → redirect sang VNPay ──
      if (selectedPayment.value === 2) {
        try {
          if (!createdOrderId) {
            throw new Error('Không lấy được mã đơn hàng để thanh toán VNPay.')
          }

          const vnpayResult = await paymentApi.createVnpayPayment(
            createdOrderId,
            effectiveFinalAmount,
          )

          if (vnpayResult?.paymentUrl) {
            // Clear cart BEFORE redirect so it's empty when customer returns
            cartStore.markCartPurchased()
            if (currentAccountId.value !== null) {
              await cartStore.clearCartBackend()
            }
            window.location.href = vnpayResult.paymentUrl
            return // stop here — user will be redirected
          } else {
            throw new Error('Không tạo được link thanh toán VNPay.')
          }
        } catch (vnpayError) {
          showAlert(
            'Lỗi thanh toán VNPay',
            vnpayError?.message || 'Không thể kết nối cổng thanh toán. Đơn hàng đã được tạo, vui lòng thử thanh toán lại.',
            'error',
          )
          isProcessing.value = false
          return
        }
      }
      // ── End VNPay ──

      cartStore.markCartPurchased()
      if (currentAccountId.value === null) {
        cartStore.clearCart()
      } else {
        await cartStore.clearCartBackend()
      }

      showAlert(
        'Đặt hàng thành công',
        'Đơn hàng của bạn đã được ghi nhận.',
        'success',
      )
      setTimeout(() => {
        router.push('/orders')
      }, 1000)
    } catch (error) {
      showAlert(
        'Không thể đặt hàng',
        error.message || 'Vui lòng thử lại sau',
        'error',
      )
    } finally {
      isProcessing.value = false
    }
  }

  async function loadAvailableVouchers () {
    try {
      // Đã xóa phần "payload" nhầm lẫn ở đây để hàm load Voucher chạy đúng chức năng!
      const response = await voucherAPI.getAllVouchers(
        0,
        100,
        'createdAt',
        'DESC',
      )

      const rows = extractListPayload(response)
      const estimateDiscount = voucher =>
        computeVoucherDiscount(voucher, orderTotalBeforeDiscount.value)

      availableVouchers.value = rows
        .filter(v => isVoucherActive(v))
        .toSorted((a, b) => estimateDiscount(b) - estimateDiscount(a))
        .slice(0, 20)
    } catch {
      availableVouchers.value = []
    }
  }

  async function applyVoucher () {
    const code = String(voucherInput.value || '').trim()
    if (!code) return

    isApplyingVoucher.value = true
    try {
      const validated = await voucherAPI.applyVoucher(
        code,
        orderTotalBeforeDiscount.value,
      )
      const usageState = getVoucherUsageState(validated)
      if (usageState.exhausted) {
        throw new Error('Mã giảm giá đã hết lượt sử dụng.')
      }
      enforceVoucherMinOrder(validated, orderTotalBeforeDiscount.value)
      appliedVoucher.value = validated
      voucherInput.value = validated.code || code
    } catch (error) {
      showAlert(
        'Voucher không hợp lệ',
        error?.message || 'Mã giảm giá không thể áp dụng cho đơn hiện tại.',
        'error',
      )
      clearVoucher()
    } finally {
      isApplyingVoucher.value = false
    }
  }

  function applySuggestedVoucher (v) {
    if (!v?.isEligible) {
      showAlert(
        'Chưa đủ điều kiện',
        `Đơn cần tối thiểu ${formatMoney(v.minOrderValue || v.min_order_value || 0)} để dùng mã này.`,
        'error',
      )
      return
    }
    const usageState = getVoucherUsageState(v)
    if (usageState.exhausted) {
      showAlert('Voucher không khả dụng', 'Mã giảm giá này đã hết lượt sử dụng.', 'error')
      return
    }
    voucherInput.value = v.code
    appliedVoucher.value = v
  }

  function clearVoucher () {
    appliedVoucher.value = null
    voucherInput.value = ''
  }

  function autoPickBestEligibleVoucher () {
    const bestVoucher = processedAvailableVouchers.value.find(
      voucher => voucher.isEligible,
    )

    if (!bestVoucher) {
      return
    }

    const currentCode = String(appliedVoucher.value?.code || '').toUpperCase()
    const bestCode = String(bestVoucher.code || '').toUpperCase()
    if (currentCode && currentCode === bestCode) {
      return
    }

    voucherInput.value = bestVoucher.code || ''
    appliedVoucher.value = bestVoucher
  }

  async function hydrateCheckout () {
    const userData = localStorage.getItem('user')
    if (userData) {
      try {
        currentUser.value = JSON.parse(userData)
      } catch {
        currentUser.value = null
      }
    }
    currentAccountId.value = getAccountId(currentUser.value)
    if (currentAccountId.value === null) {
      showAlert('Yêu cầu đăng nhập', 'Bạn cần đăng nhập để thanh toán', 'error')
      setTimeout(() => redirectToLoginForCheckout(), 250)
      return
    }
    cartStore.accountId = currentAccountId.value
    await cartStore.loadCartFromBackend(currentAccountId.value)
    await loadAvailableVouchers()
    autoPickBestEligibleVoucher()

    shippingForm.fullname
      = currentUser.value?.fullName || currentUser.value?.username || ''
    shippingForm.gmail
      = currentUser.value?.email || currentUser.value?.gmail || ''
    shippingForm.phone = currentUser.value?.phone || ''
    shippingForm.address = resolveUserAddress(currentUser.value)
    streetAddress.value = shippingForm.address || ''
  }

  watch(
    () => streetAddress.value,
    () => {
      if (skipNextAddressWatcher) {
        skipNextAddressWatcher = false
        return
      }

      fullAddressString.value = buildCurrentAddressString()
      addressSearchToken++
      scheduleAutoRouteCalculation()
    },
  )

  watch(
    () => selectedWard.value,
    () => {
      if (skipNextWatcherUpdate.value) return

      // Only recalculate if we have at least province + district
      if (!selectedProvince.value || !selectedDistrict.value) {
        isRouteCalculated.value = false
        calculatedShippingFee.value = 0
        return
      }

      // Update address string and trigger route calculation
      fullAddressString.value = buildCurrentAddressString()
      scheduleAutoRouteCalculation()
    },
  )

  watch(
    () => orderTotalBeforeDiscount.value,
    () => {
      if (!appliedVoucher.value?.code) {
        autoPickBestEligibleVoucher()
        return
      }

      const currentCode = String(appliedVoucher.value.code || '').toUpperCase()
      const matched = processedAvailableVouchers.value.find(
        voucher => String(voucher.code || '').toUpperCase() === currentCode,
      )

      if (matched && matched.isEligible) {
        appliedVoucher.value = matched
        return
      }

      clearVoucher()
      autoPickBestEligibleVoucher()
    },
  )
</script>

<style scoped>
@keyframes fade-scale-in {
  from {
    opacity: 0;
    transform: scale(0.94);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.fade-scale-enter-active {
  animation: fade-scale-in 0.18s ease-out;
}
.fade-scale-leave-active {
  animation: fade-scale-in 0.16s reverse ease-in;
}
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: #94a3b8;
  border-radius: 9999px;
}
</style>
