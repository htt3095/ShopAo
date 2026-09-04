<template>
  <div class="retail-shell min-h-screen">
    <MainTopBar />

    <main class="mx-auto flex w-full max-w-[1240px] flex-col gap-8 px-4 py-10 md:px-8 xl:px-10">
      <section class="retail-card px-5 py-5 sm:px-6 lg:px-7">
        <div class="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div class="max-w-2xl">
            <div class="flex flex-wrap items-center gap-3">
              <span class="retail-kicker">Trung tâm ưu đãi</span>
              <span class="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-green-700">
                <span class="material-symbols-outlined text-[16px]">local_activity</span>
                {{ activeCount }} mã khả dụng
              </span>
            </div>

            <div class="mt-4 flex flex-wrap items-end justify-between gap-4">
              <div>
                <h1 class="retail-heading text-3xl leading-tight text-slate-900 sm:text-4xl">Mã giảm giá của bạn</h1>
                <p class="mt-2 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
                  Kiểm tra nhanh mã còn dùng được, mã đã dùng và hạn áp dụng để vào checkout với ít thao tác hơn.
                </p>
              </div>
            </div>
          </div>

          <div class="grid flex-1 gap-3 sm:grid-cols-3 lg:max-w-[560px] lg:min-w-[420px]">
            <article class="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
              <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Đang hoạt động</p>
              <p class="mt-2 text-3xl font-bold leading-none text-slate-900">{{ activeCount }}</p>
            </article>
            <article class="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
              <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Đã dùng</p>
              <p class="mt-2 text-3xl font-bold leading-none text-slate-900">{{ usedCount }}</p>
            </article>
            <article class="rounded-[20px] border border-slate-200 bg-slate-50 p-4">
              <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Tổng số mã</p>
              <p class="mt-2 text-3xl font-bold leading-none text-slate-900">{{ vouchers.length }}</p>
            </article>
          </div>
        </div>
      </section>

      <section class="flex flex-wrap gap-4 border-b border-slate-300/70 pb-4">
        <button
          class="rounded-full px-5 py-3 text-sm font-semibold transition-colors"
          :class="currentTab ==='available'?'bg-primary text-white':'border border-slate-300 text-slate-700 hover:border-primary hover:text-primary'"
          type="button"
          @click="currentTab ='available'"
        >
          Đang khả dụng
        </button>
        <button
          class="rounded-full px-5 py-3 text-sm font-semibold transition-colors"
          :class="currentTab ==='history'?'bg-primary text-white':'border border-slate-300 text-slate-700 hover:border-primary hover:text-primary'"
          type="button"
          @click="currentTab ='history'"
        >
          Đã dùng và hết hạn
        </button>
      </section>

      <section v-if="isLoading"class="retail-card py-24 text-center">
        <p class="text-lg font-semibold text-slate-700">Đang tải vouchers...</p>
      </section>

      <section v-else-if="errorMessage"class="retail-card py-24 text-center">
        <span class="material-symbols-outlined text-7xl text-red-400 opacity-40">error</span>
        <p class="mt-4 text-lg font-semibold text-red-600">{{ errorMessage }}</p>
      </section>

      <section v-else-if="filteredVouchers.length > 0"class="grid grid-cols-1 gap-5 lg:grid-cols-2">
        <article v-for="voucher in filteredVouchers":key="voucher.id"class="retail-card overflow-hidden p-0">
          <div class="grid h-full grid-cols-[0.75fr_1.25fr]">
            <div class="flex items-center justify-center border-r border-dashed border-primary/30 bg-[#f6efe6] p-6">
              <div>
                <p class="text-[11px] uppercase tracking-[0.22em] text-primary">Mã ưu đãi</p>
                <h3 class="mt-3 text-2xl font-bold uppercase text-slate-900">{{ voucher.code }}</h3>
              </div>
            </div>

            <div class="flex flex-col justify-between px-6 py-6">
              <div>
                <div class="flex flex-wrap items-center justify-between gap-3">
                  <p class="text-2xl font-semibold text-slate-900">Giảm {{ formatValue(voucher) }}</p>
                  <span class="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]":class="getStatusBadge(voucher.status)">{{ getStatusLabel(voucher.status) }}</span>
                </div>
                <p class="mt-3 text-sm leading-6 text-slate-600">Hạn dùng đến {{ new Date(voucher.endDate).toLocaleDateString('vi-VN') }}.</p>
                <p class="mt-2 text-sm leading-6 text-slate-600">Đơn tối thiểu {{ formatMoney(voucher.minOrderValue) }}.</p>
              </div>

              <button
                v-if="voucher.status ==='ACTIVE'"
                class="mt-5 inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                type="button"
                @click="copy(voucher.code)"
              >
                Sao chép mã
              </button>
              <div v-else class="mt-5 rounded-full border border-slate-300 px-5 py-3 text-center text-sm font-semibold text-slate-500">
                Mã hiện không còn dùng được
              </div>
            </div>
          </div>
        </article>
      </section>

      <section v-else class="retail-card py-24 text-center">
        <span class="material-symbols-outlined text-7xl text-slate-400 opacity-40">inventory_2</span>
        <p class="mt-4 text-lg font-semibold text-slate-700">Hiện chưa có voucher nào trong mục này.</p>
      </section>
    </main>
  </div>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue'
  import MainTopBar from '@/components/MainTopBar.vue'
  import { orderUtils, voucherAPI } from '@/services/orders'

  const currentTab = ref('available')
  const vouchers = ref([])
  const isLoading = ref(false)
  const errorMessage = ref('')

  const activeCount = computed(() => vouchers.value.filter(voucher => voucher.status === 'ACTIVE').length)
  const usedCount = computed(() => vouchers.value.filter(voucher => ['USED', 'EXPIRED'].includes(voucher.status)).length)

  const filteredVouchers = computed(() => {
    return currentTab.value === 'available'
      ? vouchers.value.filter(voucher => ['ACTIVE', 'INACTIVE'].includes(voucher.status))
      : vouchers.value.filter(voucher => ['USED', 'EXPIRED'].includes(voucher.status))
  })

  function normalizeVoucher (voucher) {
    // Prefer snake_case fields returned by backend SQL result.
    return {
      ...voucher,
      id: voucher.id,
      code: voucher.code,
      discountType: voucher.discount_type ?? voucher.discountType,
      discountValue: voucher.discount_value ?? voucher.discountValue,
      minOrderValue: voucher.min_order_value ?? voucher.minOrderValue,
      startDate: voucher.start_date ?? voucher.startDate,
      endDate: voucher.end_date ?? voucher.endDate,
      isActive: voucher.is_active ?? voucher.isActive ?? false,
      usedCount: voucher.used_count ?? voucher.usedCount ?? 0,
      usageLimit: voucher.usage_limit ?? voucher.usageLimit ?? null,
    }
  }

  function determineStatus (voucher) {
    const now = new Date()
    const startDate = new Date(voucher.startDate)
    const endDate = new Date(voucher.endDate)

    if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
      return 'INACTIVE'
    }

    if (!voucher.isActive) return 'INACTIVE'
    if (now > endDate) return 'EXPIRED'
    if (now >= startDate && now <= endDate) return 'ACTIVE'
    return 'INACTIVE'
  }

  function formatMoney (value) {
    return orderUtils.formatPrice(Number(value || 0))
  }

  function formatValue (voucher) {
    return voucher.discountType === 'PERCENT'
      ? `${voucher.discountValue}%`
      : `${Number(voucher.discountValue || 0).toLocaleString('vi-VN')}đ`
  }

  function getStatusBadge (status) {
    if (status === 'ACTIVE') return 'bg-green-100 text-green-700'
    if (status === 'USED') return 'bg-slate-200 text-slate-700'
    if (status === 'INACTIVE') return 'bg-amber-100 text-amber-700'
    return 'bg-red-100 text-red-700'
  }

  function getStatusLabel (status) {
    if (status === 'ACTIVE') return 'Đang dùng'
    if (status === 'USED') return 'Đã dùng'
    if (status === 'INACTIVE') return 'Tạm khóa'
    return 'Hết hạn'
  }

  function copy (code) {
    navigator.clipboard.writeText(code)
    alert(`Đã sao chép mã ${code}`)
  }

  onMounted(async () => {
    try {
      isLoading.value = true
      const response = await voucherAPI.getAllVouchers()

      let voucherList = []

      // Handle different response structures
      if (response.success && response.data) {
        voucherList = Array.isArray(response.data) ? response.data : [response.data]
      } else if (Array.isArray(response)) {
        voucherList = response
      } else if (response.data && Array.isArray(response.data)) {
        voucherList = response.data
      }

      // Normalize fields first, then compute status from normalized values.
      vouchers.value = voucherList.map(rawVoucher => {
        const voucher = normalizeVoucher(rawVoucher)
        return {
          ...voucher,
          status: determineStatus(voucher),
        }
      })

      if (vouchers.value.length === 0) {
        errorMessage.value = 'Bạn chưa có voucher nào'
      }
    } catch (error) {
      console.error('Error fetching vouchers:', error)
      errorMessage.value = error.message || 'Lỗi khi tải vouchers'
      vouchers.value = []
    } finally {
      isLoading.value = false
    }
  })
</script>
