<template>
  <AdminShell>
    <template #header>
      <div class="flex items-center justify-between gap-3">
        <div>
          <p class="text-[11px] font-bold uppercase tracking-wider text-primary">Danh Sách</p>
          <h2 class="text-2xl font-black text-slate-900">Quản lý Yêu Cầu Trả Hàng</h2>
        </div>
        <button class="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:border-primary hover:text-primary" type="button" @click="loadReturns">
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
      
      <div v-else-if="returns.length === 0" class="flex flex-col items-center justify-center py-20 text-slate-400">
        <span class="material-symbols-outlined text-6xl opacity-20">assignment_return</span>
        <p class="mt-3 text-base font-bold text-slate-600">Không có yêu cầu trả hàng nào</p>
        <p class="mt-1 text-sm">Hiện tại không có đơn hàng nào đang yêu cầu trả lại.</p>
      </div>
      
      <div v-else class="overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead class="bg-slate-50 text-slate-600 border-b border-slate-200">
            <tr>
              <th class="px-5 py-4 font-bold uppercase tracking-wider text-[11px]">Đơn Hàng</th>
              <th class="px-5 py-4 font-bold uppercase tracking-wider text-[11px]">Khách Hàng</th>
              <th class="px-5 py-4 font-bold uppercase tracking-wider text-[11px]">Lý Do Trả Hàng</th>
              <th class="px-5 py-4 font-bold uppercase tracking-wider text-[11px] text-right">Hoàn Tiền</th>
              <th class="px-5 py-4 font-bold uppercase tracking-wider text-[11px] text-center">Trạng Thái</th>
              <th class="px-5 py-4 font-bold uppercase tracking-wider text-[11px] text-center">Thao Tác</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-slate-100">
            <tr v-for="item in returns" :key="item.id" class="transition-colors hover:bg-slate-50 group">
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
              
              <!-- Reason -->
              <td class="px-5 py-4 max-w-[200px]">
                <p class="truncate text-slate-700 font-medium" :title="getReturnReason(item)">
                  {{ getReturnReason(item) }}
                </p>
              </td>
              
              <!-- Money -->
              <td class="px-5 py-4 text-right">
                <p class="font-black text-red-500">{{ formatMoney(item.finalAmount || item.totalMoney) }}</p>
                <p class="text-xs text-slate-500 mt-0.5">{{ itemCount(item) }} sản phẩm</p>
              </td>
              
              <!-- Status -->
              <td class="px-5 py-4 text-center">
                <span class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold" :class="getStatusBadgeClass(item.status)">
                  <span class="material-symbols-outlined text-[14px]">{{ getStatusIcon(item.status) }}</span>
                  {{ formatStatus(item.status) }}
                </span>
              </td>
              
              <!-- Action -->
              <td class="px-5 py-4 text-center">
                <router-link 
                  :to="`/admin/orders?search=${item.id}`"
                  class="inline-flex h-9 items-center justify-center rounded-lg bg-primary/10 px-3 text-sm font-bold text-primary transition hover:bg-primary hover:text-white"
                >
                  Xử lý
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

  const returns = ref([])
  const loading = ref(false)
  const error = ref('')

  function formatMoney (value) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 }).format(Number(value) || 0)
  }

  function itemCount (item) {
    return (item.items || []).reduce((sum, entry) => sum + Number(entry.quantity || 0), 0)
  }

  function getReturnReason(order) {
    if (!order.returnReason) return 'Không có lý do'
    try {
      const parsed = JSON.parse(order.returnReason)
      return parsed.reason || parsed.note || order.returnReason
    } catch {
      return order.returnReason
    }
  }

  function formatStatus(status) {
    const map = {
      RETURN_REQUEST: 'Yêu Cầu Hoàn',
      RETURN_APPROVED: 'Chờ Nhận Hàng',
      RETURNED: 'Đã Hoàn Thành'
    }
    return map[status] || status
  }
  
  function getStatusBadgeClass(status) {
    if (status === 'RETURN_REQUEST') return 'bg-orange-100 text-orange-700 border border-orange-200'
    if (status === 'RETURN_APPROVED') return 'bg-blue-100 text-blue-700 border border-blue-200'
    if (status === 'RETURNED') return 'bg-green-100 text-green-700 border border-green-200'
    return 'bg-slate-100 text-slate-700'
  }
  
  function getStatusIcon(status) {
    if (status === 'RETURN_REQUEST') return 'pending_actions'
    if (status === 'RETURN_APPROVED') return 'local_shipping'
    if (status === 'RETURNED') return 'check_circle'
    return 'info'
  }

  async function loadReturns () {
    loading.value = true
    error.value = ''
    try {
      const data = await adminApi.getOrders({ page: 0, size: 250 })
      const orders = Array.isArray(data) ? data : []
      returns.value = orders
        .filter(item => ['RETURN_REQUEST', 'RETURN_APPROVED', 'RETURNED'].includes(item.status))
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    } catch {
      error.value = 'Không thể tải danh sách trả hàng. Vui lòng thử lại sau.'
    } finally {
      loading.value = false
    }
  }

  onMounted(loadReturns)
</script>
