<template>
  <AdminShell>
    <template #header>
      <div class="flex items-center justify-between gap-3">
        <div>
          <p class="text-xs uppercase tracking-[0.18em] text-primary">Hậu mãi</p>
          <h2 class="mt-1 text-xl font-bold">Quản lý trả hàng</h2>
        </div>
        <button class="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:border-primary hover:text-primary" type="button" @click="loadReturns">Làm mới</button>
      </div>
    </template>
    <section class="retail-card overflow-hidden p-0">
      <p v-if="error" class="m-4 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{{ error }}</p>
      <p v-else-if="loading" class="p-6 text-sm text-slate-500">Đang tải trả hàng...</p>
      <p v-else-if="returns.length === 0" class="p-6 text-sm text-slate-500">Không có yêu cầu trả hàng.</p>
      <table v-else class="w-full text-left text-sm">
        <thead class="border-b border-slate-200 bg-slate-50 text-slate-500"><tr><th class="px-4 py-3">Đơn hàng</th><th class="px-4 py-3">Số lượng</th><th class="px-4 py-3">Trạng thái</th></tr></thead>
        <tbody class="divide-y divide-slate-100">
          <tr v-for="item in returns" :key="item.id"><td class="px-4 py-3 font-semibold">#{{ item.id }}</td><td class="px-4 py-3">{{ itemCount(item) }}</td><td class="px-4 py-3">{{ item.status }}</td></tr>
        </tbody>
      </table>
    </section>
  </AdminShell>
</template>

<script setup>
  import axios from 'axios'
  import { onMounted, ref } from 'vue'
  import AdminShell from '@/components/admin/AdminShell.vue'

  const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api'
  const returns = ref([])
  const loading = ref(false)
  const error = ref('')

  function itemCount (item) {
    return (item.items || []).reduce((sum, entry) => sum + Number(entry.quantity || 0), 0)
  }

  async function loadReturns () {
    loading.value = true
    error.value = ''
    try {
      const response = await axios.get(`${API_BASE_URL}/orders`)
      const orders = Array.isArray(response.data) ? response.data : (response.data.content || [])
      returns.value = orders.filter(item => ['RETURN_REQUEST', 'RETURNING', 'RETURNED'].includes(item.status))
    } catch {
      error.value = 'Không thể tải danh sách trả hàng.'
    } finally {
      loading.value = false
    }
  }

  onMounted(loadReturns)
</script>
