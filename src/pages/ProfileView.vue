<template>
  <div
    class="retail-shell text-slate-900  overflow-x-hidden transition-colors duration-200 min-h-screen flex flex-col"
  >
    <MainTopBar />

    <div v-if="isLoading" class="flex-1 flex items-center justify-center">
      <div
        class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"
      />
    </div>

    <div v-else class="flex flex-1 justify-center py-10 px-4 sm:px-8">
      <div class="flex flex-col max-w-[1080px] flex-1 w-full gap-8">
        <section class="retail-card overflow-hidden p-0">
          <div
            class="grid gap-6 bg-[#f8f1e8] px-6 py-7 md:grid-cols-[1.1fr_0.9fr] md:px-8 md:py-8 "
          >
            <div class="space-y-3">
              <span class="retail-kicker">Tài khoản</span>
              <h1
                class="text-3xl md:text-4xl font-black tracking-tight text-slate-900 "
              >
                Xin chào {{ user.username || "bạn" }}
              </h1>
              <p class="text-slate-600  text-base leading-7">
                Quản lý hồ sơ, theo dõi đơn hàng và xem lại toàn bộ đánh giá mua
                sắm của bạn tại một nơi.
              </p>
              <div class="flex flex-wrap gap-3 pt-2">
                <button
                  class="inline-flex items-center justify-center gap-2 rounded-full bg-primary-white transition-transform hover:-translate-y-0.5"
                  @click="editProfile"
                >
                  <span class="material-symbols-outlined text-[18px]">edit</span>
                  Sửa hồ sơ
                </button>
                <router-link
                  class="inline-flex items-center justify-center gap-2 rounded-full border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700 transition-colors hover:border-primary hover:text-primary  "
                  to="/shop"
                >
                  <span class="material-symbols-outlined text-[18px]">shopping_bag</span>
                  Mua sắm thêm
                </router-link>
              </div>
            </div>

            <div class="grid grid-cols-2 gap-3 md:justify-self-end">
              <article
                class="rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-4  "
              >
                <p
                  class="text-[11px] uppercase tracking-[0.18em] text-slate-500 "
                >
                  Đơn hàng
                </p>
                <p
                  class="mt-2 text-2xl font-bold text-slate-900 "
                >
                  {{ orders.length }}
                </p>
              </article>
              <article
                class="rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-4  "
              >
                <p
                  class="text-[11px] uppercase tracking-[0.18em] text-slate-500 "
                >
                  Đánh giá
                </p>
                <p
                  class="mt-2 text-2xl font-bold text-slate-900 "
                >
                  {{ feedbacks.length }}
                </p>
              </article>
              <article
                class="rounded-2xl border border-slate-200/80 bg-white/80 px-4 py-4   col-span-2"
              >
                <p
                  class="text-[11px] uppercase tracking-[0.18em] text-slate-500 "
                >
                  Trạng thái
                </p>
                <p
                  class="mt-2 text-sm font-semibold"
                  :class="
                    user.isActive
                      ? 'text-green-700 '
                      : 'text-red-700 '
                  "
                >
                  {{
                    user.isActive
                      ? "Tài khoản đang hoạt động"
                      : "Tài khoản tạm khóa"
                  }}
                </p>
              </article>
            </div>
          </div>
        </section>

        <section class="retail-card overflow-hidden">
          <div
            class="p-6 md:p-8 flex flex-col md:flex-row gap-6 items-start md:items-center justify-between border-b border-slate-200/70 "
          >
            <div class="flex items-center gap-6">
              <div
                class="size-24 shrink-0 rounded-full shadow-inner flex items-center justify-center bg-slate-100 text-slate-500   overflow-hidden"
              >
                <img
                  v-if="resolvedProfileAvatar"
                  :alt="user.username"
                  class="w-full h-full object-cover"
                  :src="resolvedProfileAvatar"
                >
                <span
                  v-else
                  class="material-symbols-outlined text-5xl"
                >account_circle</span>
              </div>
              <div class="flex flex-col gap-1">
                <h2 class="text-slate-900  text-2xl font-bold">
                  {{ user.username || "Thành viên" }}
                </h2>
                <div
                  class="flex items-center gap-2 text-slate-500 "
                >
                  <span class="material-symbols-outlined text-lg">mail</span>
                  <span class="text-sm">{{
                    user.gmail || user.email || "email@example.com"
                  }}</span>
                </div>
                <div
                  class="flex items-center gap-2 text-slate-500  mt-1"
                >
                  <span
                    class="px-2 py-0.5 rounded-full bg-yellow-100  text-yellow-700  text-xs font-bold uppercase tracking-wider"
                  >{{ user.membership || "Thành viên thường" }}</span>
                </div>
              </div>
            </div>
          </div>

          <div
            class="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-200/70 "
          >
            <div class="p-6 md:p-8 flex flex-col gap-4">
              <div class="flex items-center justify-between mb-2">
                <div class="flex items-center gap-2">
                  <span class="material-symbols-outlined text-primary">location_on</span>
                  <h3 class="text-slate-900 font-bold text-lg">Sổ địa chỉ</h3>
                </div>
                <button class="text-sm font-medium text-primary hover:underline" @click="showAddAddressModal = true">
                  + Thêm mới
                </button>
              </div>
              <div class="pl-8 flex flex-col gap-3">
                <div v-if="addresses.length > 0">
                  <div v-for="addr in addresses" :key="addr.id" class="border rounded-lg p-3 relative group" :class="{'border-primary bg-primary/5': addr.isDefault}">
                    <div v-if="addr.isDefault" class="absolute top-2 right-2 text-xs bg-primary text-white px-2 py-0.5 rounded">Mặc định</div>
                    <p class="font-bold text-sm text-slate-800">{{ addr.fullname }} - {{ addr.phone }}</p>
                    <p class="text-sm text-slate-600 mt-1">{{ addr.address }}</p>
                    <div class="flex items-center gap-3 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button v-if="!addr.isDefault" class="text-xs text-primary font-medium" @click="setDefaultAddress(addr)">Đặt mặc định</button>
                    </div>
                  </div>
                </div>
                <p v-else class="text-slate-400 italic">Bạn chưa thêm địa chỉ nào</p>
              </div>
            </div>
            <div class="p-6 md:p-8 flex flex-col gap-4">
              <div class="flex items-center gap-2 mb-2">
                <span class="material-symbols-outlined text-primary">info</span>
                <h3 class="text-slate-900  font-bold text-lg">
                  Thông tin cá nhân
                </h3>
              </div>
              <div class="pl-8 grid grid-cols-2 gap-y-4">
                <div>
                  <p
                    class="text-slate-400  text-xs uppercase font-semibold"
                  >
                    Số điện thoại
                  </p>
                  <p
                    class="text-slate-900  text-sm font-medium mt-1"
                  >
                    {{ user.phone || "Chưa cập nhật" }}
                  </p>
                </div>
                <div>
                  <p
                    class="text-slate-400  text-xs uppercase font-semibold"
                  >
                    Trạng thái
                  </p>
                  <p
                    class="text-slate-900  text-sm font-medium mt-1"
                  >
                    <span
                      :class="user.isActive ? 'text-green-600' : 'text-red-600'"
                    >
                      {{ user.isActive ? "Đang hoạt động" : "Tạm khóa" }}
                    </span>
                  </p>
                </div>
                <div>
                  <p
                    class="text-slate-400  text-xs uppercase font-semibold"
                  >
                    Mã tài khoản
                  </p>
                  <p
                    class="text-slate-900  text-sm font-medium mt-1 font-mono"
                  >
                    {{ user.id || "N/A" }}
                  </p>
                </div>
                <div>
                  <p
                    class="text-slate-400  text-xs uppercase font-semibold"
                  >
                    Ngày tham gia
                  </p>
                  <p
                    class="text-slate-900  text-sm font-medium mt-1"
                  >
                    {{ formatDate(user.createdAt) || "Không rõ" }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section class="flex flex-col gap-4">
          <div class="flex items-center justify-between">
            <h2 class="text-slate-900  text-xl font-bold">
              Đơn hàng của tôi
            </h2>
            <router-link
              class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100  :bg-slate-800"
              to="/orders"
            >
              Đơn hàng của tôi
            </router-link>
          </div>

          <div v-if="isLoadingOrders" class="flex justify-center py-8">
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
            />
          </div>

          <div
            v-else-if="recentOrders.length > 0"
            class="retail-card overflow-hidden"
          >
            <div
              class="hidden md:grid grid-cols-12 gap-4 p-4 border-b border-slate-200/70  bg-[#f7efe6]  text-xs font-semibold uppercase text-slate-500  tracking-wider"
            >
              <div class="col-span-1">STT</div>
              <div class="col-span-4">Sản phẩm</div>
              <div class="col-span-2">Ngày</div>
              <div class="col-span-2">Trạng thái</div>
              <div class="col-span-2 text-right">Tổng tiền</div>
              <div class="col-span-1 text-right">Thao tác</div>
            </div>

            <div
              v-for="(order, index) in recentOrders"
              :key="order.id || index"
              class="grid grid-cols-1 md:grid-cols-12 gap-4 p-4 items-center border-b border-slate-200/70  hover:bg-[#fbf4ec] :bg-[#2a231f] transition-colors group"
            >
              <div class="col-span-1 flex items-center gap-3">
                <div
                  class="p-2 rounded bg-slate-100  text-slate-500  md:hidden"
                >
                  <span class="material-symbols-outlined text-lg">receipt_long</span>
                </div>
                <span class="font-bold text-slate-900 ">{{
                  index + 1
                }}</span>
              </div>
              <div class="col-span-4">
                <p class="text-sm font-medium text-slate-900 ">
                  {{ getOrderProductPreview(order) }}
                </p>
              </div>
              <div
                class="col-span-2 text-slate-600  text-sm"
              >
                {{ formatDate(getOrderDate(order)) }}
              </div>
              <div class="col-span-2">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  :class="getStatusClass(order.status)"
                >
                  <span
                    class="w-1.5 h-1.5 mr-1.5"
                    :class="getStatusDotClass(order.status)"
                  />
                  {{ formatOrderStatus(order.status) }}
                </span>
              </div>
              <div
                class="col-span-2 text-right font-medium text-slate-900 "
              >
                {{ formatPrice(getOrderTotal(order)) }}
              </div>
              <div class="col-span-1 flex justify-end">
                <router-link
                  class="text-sm font-medium text-primary hover:text-[#a84f24] flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  :to="`/order/${order.id}`"
                >
                  Xem chi tiết
                  <span class="material-symbols-outlined text-sm">arrow_forward</span>
                </router-link>
              </div>
            </div>
          </div>

          <div v-else class="retail-card text-center py-12">
            <span class="material-symbols-outlined text-5xl text-slate-400 mb-4">shopping_bag</span>
            <p class="text-slate-500 ">
              Bạn chưa có đơn hàng nào
            </p>
            <router-link
              class="inline-block mt-4 text-primary hover:text-[#a84f24] text-sm font-medium"
              to="/shop"
            >Bắt đầu mua sắm</router-link>
          </div>
        </section>

        <section class="flex flex-col gap-4">
          <h2 class="text-slate-900  text-xl font-bold">
            Đánh giá của tôi
          </h2>

          <div v-if="isLoadingFeedback" class="flex justify-center py-8">
            <div
              class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"
            />
          </div>

          <div
            v-else-if="feedbacks.length > 0"
            class="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <div
              v-for="feedback in feedbacks"
              :key="feedback.id"
              class="retail-card p-4 flex flex-col gap-3"
            >
              <div class="flex items-start justify-between gap-3">
                <div>
                  <p
                    class="text-[11px] uppercase tracking-wide text-slate-400 "
                  >
                    Sản phẩm
                  </p>
                  <h3 class="text-sm font-bold text-slate-900 ">
                    {{ getReviewProductName(feedback.productId) }}
                  </h3>
                  <p class="text-xs text-slate-400  mt-0.5">
                    Đánh giá #{{ feedback.id }}
                  </p>
                </div>
                <span class="text-xs text-slate-500 ">{{
                  formatDate(feedback.createdAt)
                }}</span>
              </div>

              <div class="flex text-yellow-400 text-sm">
                <span
                  v-for="i in 5"
                  :key="i"
                  class="material-symbols-outlined text-[16px]"
                  :class="
                    i <= feedback.rating
                      ? 'fill-current'
                      : 'text-slate-300 '
                  "
                >
                  star
                </span>
              </div>

              <p
                class="text-sm text-slate-600  leading-relaxed"
              >
                {{ feedback.comment }}
              </p>
            </div>
          </div>

          <div v-else class="retail-card text-center py-12">
            <span class="material-symbols-outlined text-5xl text-slate-400 mb-4">rate_review</span>
            <p class="text-slate-500 ">
              Bạn chưa viết đánh giá nào
            </p>
          </div>
        </section>
      </div>
    </div>
    <!-- Modal Thêm Địa Chỉ -->
    <div v-if="showAddAddressModal" class="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <div class="bg-white rounded-xl p-6 w-full max-w-md">
        <h3 class="text-xl font-bold text-slate-900 mb-4">Thêm địa chỉ mới</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm font-medium mb-1">Họ và tên</label>
            <input v-model="newAddress.fullname" class="w-full border rounded p-2" placeholder="Tên người nhận" type="text">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Số điện thoại</label>
            <input v-model="newAddress.phone" class="w-full border rounded p-2" placeholder="Số điện thoại" type="text">
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Địa chỉ chi tiết</label>
            <textarea v-model="newAddress.address" class="w-full border rounded p-2" placeholder="Số nhà, đường, phường, quận, thành phố..." @blur="forwardGeocode" />
          </div>
          <div>
            <label class="block text-sm font-medium mb-1">Hoặc chọn trên bản đồ</label>
            <div id="profile-map" class="h-48 w-full rounded-xl border border-slate-200 z-10 relative overflow-hidden" />
            <p class="text-[11px] text-slate-500 mt-1">Bấm vào bản đồ để định vị địa chỉ nhanh chóng.</p>
          </div>
          <div class="flex items-center gap-2">
            <input id="isDefault" v-model="newAddress.isDefault" type="checkbox">
            <label class="text-sm" for="isDefault">Đặt làm địa chỉ mặc định</label>
          </div>
        </div>
        <div class="mt-6 flex justify-end gap-3">
          <button class="px-4 py-2 border rounded hover:bg-slate-50" @click="showAddAddressModal = false">Hủy</button>
          <button class="px-4 py-2 bg-primary text-white rounded hover:bg-primary/90" @click="addAddress">Lưu</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
  import L from 'leaflet'
  // Fix Leaflet marker icons
  import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
  import iconUrl from 'leaflet/dist/images/marker-icon.png'
  import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
  import { computed, nextTick, onMounted, ref, watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { orderAPI } from '@/services/orders'
  import { useProductStore } from '@/stores/products'

  import { useReviewsStore } from '@/stores/reviews'
  import { accountsApi, addressApi, resolveBackendAssetUrl } from '../services/api'
  import 'leaflet/dist/leaflet.css'

  L.Icon.Default.mergeOptions({
    iconRetinaUrl,
    iconUrl,
    shadowUrl,
  })

  const router = useRouter()
  const productStore = useProductStore()
  const reviewsStore = useReviewsStore()
  const isLoading = ref(true)
  const isLoadingOrders = ref(false)
  const isLoadingFeedback = ref(false)
  const user = ref({})
  const orders = ref([])
  const feedbacks = ref([])
  const addresses = ref([])
  const showAddAddressModal = ref(false)
  const newAddress = ref({ fullname: '', phone: '', address: '', isDefault: false })
  const recentOrders = computed(() => orders.value.slice(0, 4))

  async function fetchAddresses () {
    const accountId = getAccountId(user.value)
    if (accountId === null) return
    try {
      const res = await addressApi.getByAccountId(accountId)
      addresses.value = Array.isArray(res) ? res : (res.data || [])
    } catch (error) {
      console.error('Lỗi lấy địa chỉ', error)
    }
  }

  async function addAddress () {
    const accountId = getAccountId(user.value)
    if (!accountId || !newAddress.value.address || !newAddress.value.phone) return
    try {
      await addressApi.create({ ...newAddress.value, accountId })
      showAddAddressModal.value = false
      newAddress.value = { fullname: '', phone: '', address: '', isDefault: false }
      await fetchAddresses()
    } catch (error) {
      console.error(error)
      alert('Thêm địa chỉ thất bại')
    }
  }

  async function setDefaultAddress (addr) {
    try {
      await addressApi.update(addr.id, { ...addr, isDefault: true })
      await fetchAddresses()
    } catch (error) {
      console.error(error)
    }
  }

  function normalizeAvatarUrl (rawUrl) {
    if (!rawUrl || typeof rawUrl !== 'string') {
      return ''
    }

    const fixedUrl = rawUrl.replace(
      /^https?:\/\/[^/]+\/?(https?:\/\/.+)$/i,
      '$1',
    )

    return resolveBackendAssetUrl(fixedUrl) || ''
  }

  const resolvedProfileAvatar = computed(() =>
    normalizeAvatarUrl(user.value.imgUrl),
  )

  function normalizeIsActive (value, fallback = true) {
    if (value === true || value === 1 || value === '1' || value === 'true')
      return true
    if (value === false || value === 0 || value === '0' || value === 'false')
      return false
    return fallback
  }

  function getAccountId (sourceUser) {
    const source = sourceUser && typeof sourceUser === 'object' ? sourceUser : {}
    const candidate
      = source.accountId !== undefined && source.accountId !== null
        ? source.accountId
        : (source.account_id !== undefined && source.account_id !== null
          ? source.account_id
          : source.id)
    const parsed = Number(candidate)
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null
  }

  // Lấy thông tin user từ localStorage khi component được mount
  onMounted(async () => {
    await loadUserData()
    await fetchAddresses()
    await fetchUserOrders()
    await fetchUserFeedbacks()
  })

  async function loadUserData () {
    try {
      const userData = localStorage.getItem('user')
      if (userData) {
        const localUser = JSON.parse(userData)
        const localRawActive
          = localUser.isActive ?? localUser.is_active ?? localUser.status

        user.value = {
          ...localUser,
          // Treat numeric 1 as active, 0 as inactive.
          isActive: normalizeIsActive(localRawActive, true),
        }

        // Refresh from backend to avoid stale localStorage status.
        const accountId = getAccountId(user.value)
        if (accountId !== null) {
          try {
            const latestAccount = await accountsApi.getById(accountId)
            const latestRawActive
              = latestAccount?.isActive
                ?? latestAccount?.is_active
                ?? latestAccount?.status
            if (latestAccount && typeof latestAccount === 'object') {
              user.value = {
                ...user.value,
                ...latestAccount,
                isActive: normalizeIsActive(latestRawActive, user.value.isActive),
              }
              localStorage.setItem('user', JSON.stringify(user.value))
            }
          } catch (refreshError) {
            console.error('Failed to refresh account status:', refreshError)
          }
        }

        console.log('User data loaded:', user.value)
        console.log('User email field:', user.value.gmail || user.value.email) // Debug để xem tên trường
      } else {
        router.push('/login')
      }
    } catch (error) {
      console.error('Error loading user data:', error)
    } finally {
      isLoading.value = false
    }
  }

  // Fetch orders của user
  async function fetchUserOrders () {
    const accountId = getAccountId(user.value)
    if (accountId === null) {
      orders.value = []
      return
    }

    isLoadingOrders.value = true
    try {
      const response = await orderAPI.getUserOrders(accountId)
      const orderList = Array.isArray(response) ? response : []
      const sortedOrders = orderList.slice().sort((a, b) => {
        const timeA = getOrderTime(getOrderDate(a))
        const timeB = getOrderTime(getOrderDate(b))
        if (timeA !== timeB) {
          return timeB - timeA
        }

        const idA = Number(a && a.id)
        const idB = Number(b && b.id)
        const normalizedA = Number.isFinite(idA) ? idA : 0
        const normalizedB = Number.isFinite(idB) ? idB : 0
        return normalizedB - normalizedA
      })

      orders.value = await enrichLatestOrderNames(sortedOrders, 4)
    } catch (error) {
      console.error('Error fetching orders:', error)
      orders.value = []
    } finally {
      isLoadingOrders.value = false
    }
  }

  function getOrderTime (value) {
    const parsed = new Date(value || 0).getTime()
    return Number.isFinite(parsed) ? parsed : 0
  }

  async function enrichLatestOrderNames (orderList, limit = 4) {
    const source = Array.isArray(orderList) ? orderList.slice() : []
    if (source.length === 0) {
      return source
    }

    const cappedLimit = Math.min(limit, source.length)
    const detailList = await Promise.all(
      source.slice(0, cappedLimit).map(async order => {
        const orderId = Number(order && order.id)
        if (!Number.isFinite(orderId) || orderId <= 0) {
          return null
        }

        try {
          return await orderAPI.getOrder(orderId)
        } catch (error) {
          console.warn('Could not load order detail for mini history:', error)
          return null
        }
      }),
    )

    for (let i = 0; i < cappedLimit; i += 1) {
      const detail = detailList[i]
      if (detail && typeof detail === 'object') {
        source[i] = {
          ...source[i],
          ...detail,
          id: source[i].id || detail.id,
        }
      }
    }

    return source
  }

  // Fetch feedbacks của user (nếu có API)
  async function fetchUserFeedbacks () {
    const accountId = getAccountId(user.value)
    if (accountId === null) {
      feedbacks.value = []
      return
    }

    isLoadingFeedback.value = true
    try {
      if (productStore.products.length === 0) {
        await productStore.fetchProducts()
      }

      await reviewsStore.fetchAccounts()
      await reviewsStore.fetchReviews({ force: true })

      feedbacks.value = reviewsStore
        .getByAccountId(accountId)
        .slice()
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        )
    } catch (error) {
      console.error('Error fetching feedbacks:', error)
      feedbacks.value = []
    } finally {
      isLoadingFeedback.value = false
    }
  }

  // Format ngày tháng
  function formatDate (dateString) {
    if (!dateString) return 'Không rõ'
    const date = new Date(dateString)
    return new Intl.DateTimeFormat('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date)
  }

  // Format giá tiền
  function formatPrice (price) {
    if (!price) return '0 ₫'
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(Number(price))
  }

  function getOrderDate (order) {
    if (!order || typeof order !== 'object') return null
    return (
      order.createdAt
      || order.orderDate
      || order.created_at
      || order.order_date
      || null
    )
  }

  function getOrderTotal (order) {
    if (!order || typeof order !== 'object') return 0

    const candidate
      = order.finalAmount !== undefined && order.finalAmount !== null
        ? order.finalAmount
        : order.totalAmount !== undefined && order.totalAmount !== null
          ? order.totalAmount
          : order.totalMoney !== undefined && order.totalMoney !== null
            ? order.totalMoney
            : order.final_amount !== undefined && order.final_amount !== null
              ? order.final_amount
              : order.total_amount !== undefined && order.total_amount !== null
                ? order.total_amount
                : order.total_money

    const parsed = Number(candidate)
    return Number.isFinite(parsed) ? parsed : 0
  }

  function getReviewProductName (productId) {
    const id = Number(productId)
    if (!Number.isFinite(id)) return 'Sản phẩm không rõ'
    const product = productStore.getProductById(id)
    return product?.name || `Sản phẩm #${id}`
  }

  function getOrderItems (order) {
    const source = order && typeof order === 'object' ? order : {}
    if (Array.isArray(source.orderItems)) return source.orderItems
    if (Array.isArray(source.order_items)) return source.order_items
    if (Array.isArray(source.items)) return source.items
    if (Array.isArray(source.orderDetails)) return source.orderDetails
    if (Array.isArray(source.order_details)) return source.order_details
    return []
  }

  function getOrderItemName (item) {
    const source = item && typeof item === 'object' ? item : {}
    const rawName
      = source.productName
        || source.product_name
        || source.name
        || source.itemName
        || source.item_name
        || (source.product
          && (source.product.name
            || source.product.productName
            || source.product.product_name))
        || (source.variant
          && (source.variant.name
            || source.variant.productName
              || source.variant.product_name))
          || ''

    return String(rawName || '').trim()
  }

  function getOrderProductPreview (order) {
    const items = getOrderItems(order)
    if (items.length === 0) {
      const source = order && typeof order === 'object' ? order : {}
      const orderLevelName
        = source.productName
          || source.product_name
          || source.name
          || source.title
          || ''
      const normalizedOrderLevelName = String(orderLevelName || '').trim()
      if (normalizedOrderLevelName) {
        return normalizedOrderLevelName
      }

      return 'Không rõ sản phẩm'
    }

    const uniqueNames = []
    for (const item of items) {
      const name = getOrderItemName(item)
      if (name && !uniqueNames.includes(name)) {
        uniqueNames.push(name)
      }
    }

    if (uniqueNames.length === 0) {
      return 'Không rõ sản phẩm'
    }

    if (uniqueNames.length === 1) {
      return uniqueNames[0]
    }

    return `${uniqueNames[0]} +${uniqueNames.length - 1} sản phẩm`
  }

  function normalizeStatusKey (status) {
    return String(status || '')
      .trim()
      .toUpperCase()
  }

  function getOrderStatusCategory (status) {
    const key = normalizeStatusKey(status)

    if (
      key.includes('DELIVER')
      || key.includes('RECEIV')
      || key.includes('SUCCESS')
      || key.includes('COMPLETE')
    ) {
      return 'delivered'
    }

    if (key.includes('SHIP') || key.includes('TRANSIT')) {
      return 'shipping'
    }

    if (
      key.includes('CANCEL')
      || key.includes('FAIL')
      || key.includes('REJECT')
    ) {
      return 'cancelled'
    }

    if (
      key.includes('RETURN')
      || key.includes('REFUND')
      || key === 'TRA_HANG'
      || key === 'YEU_CAU_TRA'
    ) {
      return 'returned'
    }

    return 'processing'
  }

  function getStatusMeta (status) {
    const category = getOrderStatusCategory(status)

    if (category === 'delivered') {
      return {
        label: 'Đã giao',
        className:
          'bg-green-100 text-green-800  ',
        dotClass: 'bg-green-500',
      }
    }

    if (category === 'shipping') {
      return {
        label: 'Đang giao',
        className:
          'bg-blue-100 text-blue-800  ',
        dotClass: 'bg-blue-500',
      }
    }

    if (category === 'cancelled') {
      return {
        label: 'Đã hủy',
        className: 'bg-red-100 text-red-800  ',
        dotClass: 'bg-red-500',
      }
    }

    if (category === 'returned') {
      return {
        label: 'Hoàn hàng',
        className:
          'bg-slate-100 text-slate-800  ',
        dotClass: 'bg-slate-500',
      }
    }

    return {
      label: 'Chờ xử lý',
      className:
        'bg-amber-100 text-amber-800  ',
      dotClass: 'bg-amber-500',
    }
  }

  function formatOrderStatus (status) {
    return getStatusMeta(status).label
  }

  // Xử lý edit profile
  function editProfile () {
    router.push('/profile/edit')
  }

  // Xử lý logout
  function handleLogout () {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/login')
  }

  // Lấy class cho status badge
  function getStatusClass (status) {
    return getStatusMeta(status).className
  }

  // Lấy class cho status dot
  function getStatusDotClass (status) {
    return getStatusMeta(status).dotClass
  }

  // --- Map logic ---
  let map = null
  let marker = null

  async function safeParseResponse (res) {
    try {
      return await res.json()
    } catch {
      return null
    }
  }

  function initMap () {
    const mapElement = document.querySelector('#profile-map')
    if (!mapElement) return

    if (map) {
      map.remove()
    }

    const defaultCoord = [21.028511, 105.804817] // Hanoi default
    map = L.map('profile-map').setView(defaultCoord, 12)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(map)

    marker = L.marker(defaultCoord).addTo(map)

    map.on('click', e => {
      const lat = e.latlng.lat
      const lng = e.latlng.lng
      marker.setLatLng([lat, lng])
      reverseGeocode(lat, lng)
    })
  }

  async function reverseGeocode (lat, lng) {
    try {
      const res = await fetch(`/nominatim/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`)
      if (!res.ok) return
      const data = await safeParseResponse(res)
      if (data && data.display_name) {
        newAddress.value.address = data.display_name
      }
    } catch (error) {
      console.error(error)
    }
  }

  async function forwardGeocode () {
    if (!newAddress.value.address || !map) return
    try {
      const geoRes = await fetch(
        `/nominatim/search?format=json&addressdetails=1&limit=1&q=${encodeURIComponent(newAddress.value.address + ', Việt Nam')}`,
      )
      if (!geoRes.ok) return
      const geoData = await safeParseResponse(geoRes)
      const first = Array.isArray(geoData) ? geoData[0] : null

      if (first && first.lat && first.lon) {
        const lat = Number.parseFloat(first.lat)
        const lng = Number.parseFloat(first.lon)
        map.setView([lat, lng], 15)
        marker.setLatLng([lat, lng])
      }
    } catch (error) {
      console.error(error)
    }
  }

  watch(showAddAddressModal, newVal => {
    if (newVal) {
      nextTick(() => {
        initMap()
        if (newAddress.value.address) {
          forwardGeocode()
        }
      })
    } else {
      if (map) {
        map.remove()
        map = null
      }
    }
  })
</script>

<style scoped>
/* Scrollbar styles for consistent dark mode look */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #101922;
}
::-webkit-scrollbar-thumb {
  background: #f97316;
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #ea580c;
}
</style>
