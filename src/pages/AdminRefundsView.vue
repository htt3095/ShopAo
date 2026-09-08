<template>
  <AdminShell>
    <template #header>
      <div class="flex items-center justify-between gap-3">
        <div>
          <p class="text-xs uppercase tracking-[0.18em] text-primary">Hậu mãi</p>
          <h2 class="mt-1 text-xl font-bold">Quản lý hoàn tiền</h2>
        </div>
        <button class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-primary hover:text-primary" type="button" @click="loadRefunds">Làm mới</button>
      </div>
    </template>
    <section class="retail-card overflow-hidden p-0">
      <p v-if="error" class="m-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{{ error }}</p>
      <p v-else-if="loading" class="p-6 text-sm text-slate-500">Đang tải hoàn tiền...</p>
      <p v-else-if="refunds.length === 0" class="p-6 text-sm text-slate-500">Không có giao dịch hoàn tiền.</p>
      <table v-else class="w-full text-left text-sm"><thead class="border-b border-slate-200 bg-slate-50 text-slate-500"><tr><th class="px-4 py-3">Đơn hàng</th><th class="px-4 py-3">Phương thức</th><th class="px-4 py-3 text-right">Số tiền</th></tr></thead><tbody class="divide-y divide-slate-100"><tr v-for="item in refunds" :key="item.id"><td class="px-4 py-3 font-semibold">#{{ item.id }}</td><td class="px-4 py-3">{{ item.method }}</td><td class="px-4 py-3 text-right font-semibold text-red-600">{{ formatMoney(item.amount) }}</td></tr></tbody></table>
    </section>
  </AdminShell>
</template>

<script setup>
  import axios from 'axios'
  import { onMounted, ref } from 'vue'
  import AdminShell from '@/components/admin/AdminShell.vue'

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'
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
      const response = await axios.get(`${API_BASE_URL}/orders`)
      const orders = Array.isArray(response.data) ? response.data : (response.data.content || [])
      refunds.value = orders.filter(item => item.paymentStatus === 'REFUNDED').map(item => ({
        id: item.id,
        method: item.paymentMethodName || item.paymentMethod || 'Khác',
        amount: item.finalAmount || item.totalMoney || 0,
      }))
    } catch {
      error.value = 'Không thể tải danh sách hoàn tiền.'
    } finally {
      loading.value = false
    }
  }

  onMounted(loadRefunds)
</script>
