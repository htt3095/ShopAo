<template>
  <AdminShell>
    <template #header>
      <div class="flex items-center justify-between gap-3">
        <div>
          <p class="text-[11px] font-bold uppercase tracking-wider text-primary">Tài Chính</p>
          <h2 class="text-2xl font-black text-slate-900">Quản lý Hoàn Tiền</h2>
        </div>
        <button class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-primary hover:text-primary" type="button" @click="loadRefunds">
          <span class="material-symbols-outlined text-[18px]">refresh</span>
          Làm mới
        </button>
      </div>
    </template>
    
    <section class="retail-card overflow-hidden bg-white shadow-sm rounded-2xl border border-slate-200">
      <!-- Alerts -->
      <div v-if="error" class="m-4 flex items-center gap-3 rounded-xl bg-red-50 p-4 text-red-700 border border-red-100">
        <span class="material-symbols-outlined">error</span>
        <p class="text-sm font-semibold">{{ error }}</p>
      </div>
      
      <!-- Content -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20 text-slate-500">
        <span class="material-symbols-outlined animate-spin text-4xl text-primary">sync</span>
        <p class="mt-3 text-sm font-semibold">Đang tải dữ liệu...</p>
      </div>
      
      <div v-else-if="refunds.length === 0" class="flex flex-col items-center justify-center py-20 text-slate-400">
        <span class="material-symbols-outlined text-6xl opacity-20">payments</span>
        <p class="mt-3 text-base font-bold text-slate-600">Không có giao dịch hoàn tiền</p>
        <p class="mt-1 text-sm">Chưa có đơn hàng nào được hoàn tiền.</p>
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 text-slate-600 border-b border-slate-200">
            <tr>
              <th class="px-5 py-4 font-bold uppercase tracking-wider text-[11px]">Đơn Hàng</th>
              <th class="px-5 py-4 font-bold uppercase tracking-wider text-[11px]">Khách Hàng</th>
              <th class="px-5 py-4 font-bold uppercase tracking-wider text-[11px]">Phương Thức</th>
              <th class="px-5 py-4 font-bold uppercase tracking-wider text-[11px] text-right">Số Tiền Hoàn</th>
              <th class="px-5 py-4 font-bold uppercase tracking-wider text-[11px] text-center">Trạng Thái</th>
              <th class="px-5 py-4 font-bold uppercase tracking-wider text-[11px] text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="item in refunds" :key="item.id" class="transition-colors hover:bg-slate-50 group">
              <!-- Order Info -->
              <td class="px-5 py-4">
                <div class="flex flex-col items-start gap-1">
                  <span class="font-black text-slate-900 text-[15px]">#{{ item.id }}</span>
                  <span v-if="item.shippingAddress === 'Mua trực tiếp tại cửa hàng' || item.orderSource === 'POS'" class="inline-block rounded-md bg-gradient-to-r from-purple-500 to-indigo-500 px-1.5 py-[2px] text-[10px] font-black text-white shadow-sm">POS</span>
                  <span v-else class="inline-block rounded-md bg-gradient-to-r from-emerald-400 to-teal-500 px-1.5 py-[2px] text-[10px] font-black text-white shadow-sm">ONL</span>
                  <p class="mt-1 text-xs text-slate-400">{{ new Date(item.createdAt).toLocaleDateString('vi-VN') }}</p>
                </div>
              </td>
              
              <!-- Customer Info -->
              <td class="px-5 py-4">
                <p class="font-bold text-slate-800">{{ item.fullname || item.fullName || 'Khách hàng' }}</p>
                <p class="text-xs text-slate-500 mt-0.5">{{ item.phone || 'Không có SĐT' }}</p>
              </td>
              
              <!-- Method -->
              <td class="px-5 py-4">
                <div class="flex items-center gap-2">
                  <span v-if="(item.paymentMethodName || item.paymentMethod) === 'VNPay'" class="flex size-6 items-center justify-center rounded bg-blue-50 text-blue-600">
                    <span class="material-symbols-outlined text-[14px]">account_balance</span>
                  </span>
                  <span v-else class="flex size-6 items-center justify-center rounded bg-emerald-50 text-emerald-600">
                    <span class="material-symbols-outlined text-[14px]">payments</span>
                  </span>
                  <span class="font-semibold text-slate-700">{{ item.paymentMethodName || item.paymentMethod || 'Tiền mặt' }}</span>
                </div>
              </td>
              
              <!-- Money -->
              <td class="px-5 py-4 text-right">
                <p class="font-black text-red-500 text-base">{{ formatMoney(item.finalAmount || item.totalMoney) }}</p>
              </td>
              
              <!-- Status -->
              <td class="px-5 py-4 text-center">
                <span class="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-bold text-green-700 border border-green-200">
                  <span class="material-symbols-outlined text-[14px]">price_check</span>
                  Đã Hoàn Tiền
                </span>
              </td>
              
              <!-- Action -->
              <td class="px-5 py-4 text-center">
                <router-link 
                  :to="`/admin/orders?search=${item.id}`"
                  class="inline-flex h-9 items-center justify-center rounded-lg bg-slate-100 px-3 text-sm font-bold text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
                >
                  Xem đơn
                </router-link>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
  </AdminShell>
</template>

<script setup>
  import { onMounted, ref } from 'vue'
  import AdminShell from '@/components/admin/AdminShell.vue'
  import { adminApi } from '@/services/api'

  const refunds = ref([])
  const loading = ref(false)
  const error = ref('')

  function formatMoney (value) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(Number(value) || 0)
  }

  async function loadRefunds () {
    loading.value = true
    error.value = ''
    try {
      const data = await adminApi.getOrders({ page: 0, size: 250 })
      const orders = Array.isArray(data) ? data : []
      refunds.value = orders
        .filter(item => item.paymentStatus === 'REFUNDED')
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } catch {
      error.value = 'Không thể tải danh sách hoàn tiền. Vui lòng thử lại sau.'
    } finally {
      loading.value = false
    }
  }

  onMounted(loadRefunds)
</script>
