<template>
  <AdminShell>
    <template #header>
      <div class="flex flex-wrap items-center justify-between gap-2">
        <div>
          <p class="text-xs uppercase tracking-[0.18em] text-primary">
            Quản lý người dùng
          </p>
          <h2 class="mt-1 text-xl font-bold">
            Quản lý khách hàng và nhân viên
          </h2>
          <p class="mt-1 text-sm text-slate-500 ">
            {{
              isAdmin
                ? "ADMIN xem tất cả khách hàng và nhân viên."
                : "Nhân viên chỉ xem được khách hàng."
            }}
          </p>
        </div>

        <div class="flex flex-wrap items-center gap-2">
          <button
            class="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-sm font-semibold text-white hover:opacity-90"
            type="button"
            @click="openCreate"
          >
            <span class="material-symbols-outlined text-[18px]">person_add</span>
            Thêm người dùng
          </button>

          <button
            class="inline-flex items-center gap-1.5  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-1.5 text-sm font-medium hover:border-primary hover:text-primary "
            type="button"
            @click="loadAccounts"
          >
            <span class="material-symbols-outlined text-[18px]">refresh</span>
            Làm mới
          </button>
        </div>
      </div>
    </template>

    <div class="space-y-3">
      <section class="retail-card p-3">
        <div class="grid gap-3 md:grid-cols-[1fr_220px]">
          <label
            class="flex items-center gap-2  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-1.5 "
          >
            <span class="material-symbols-outlined text-[18px] text-slate-400">search</span>
            <input
              v-model="search"
              class="w-full bg-transparent text-sm outline-none"
              placeholder="Tìm theo tên, email, số điện thoại"
              type="text"
            >
          </label>

          <select
            v-model="statusFilter"
            class=" shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-1.5 text-sm "
          >
            <option value="ALL">Tất cả trạng thái</option>
            <option value="ACTIVE">Đang hoạt động</option>
            <option value="LOCKED">Tạm khóa</option>
          </select>
        </div>
      </section>

      <section class="retail-card p-3">
        <div class="mb-4 text-sm text-slate-500 ">
          Tổng người dùng:
          <span class="font-semibold text-slate-900 ">{{
            filteredAccounts.length
          }}</span>
          <span class="mx-2">/</span>
          Tổng dữ liệu:
          <span class="font-semibold text-slate-900 ">{{
            accounts.length
          }}</span>
        </div>

        <div
          v-if="error"
          class="mb-4 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700   "
        >
          {{ error }}
        </div>

        <div
          v-if="loading"
          class="py-8 text-center text-sm text-slate-500 "
        >
          Đang tải danh sách người dùng...
        </div>

        <div
          v-else-if="filteredAccounts.length === 0"
          class="rounded-2xl border border-dashed border-slate-300 p-6 text-center text-sm text-slate-500 "
        >
          Không tìm thấy khách hàng phù hợp.
        </div>

        <div v-else class="overflow-x-auto">
          <table class="w-full min-w-[920px] text-left text-xs">
            <thead>
              <tr
                class="border-b border-slate-200 text-slate-500 "
              >
                <th class="px-2 py-2 font-medium">STT</th>
                <th class="px-2 py-2 font-medium">Khách hàng</th>
                <th class="px-2 py-2 font-medium">Vai trò</th>
                <th class="px-2 py-2 font-medium">Liên hệ</th>
                <th class="px-2 py-2 font-medium">Trạng thái</th>
                <th class="px-2 py-2 font-medium">Địa chỉ</th>
                <th class="px-2 py-2 text-right font-medium">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(account, index) in filteredAccounts"
                :key="account.id"
                class="border-b border-slate-100 last:border-none "
              >
                <td
                  class="px-2 py-2 font-semibold text-slate-500 "
                >
                  {{ index + 1 }}
                </td>

                <td class="px-2 py-2">
                  <div class="flex items-center gap-3">
                    <div
                      class="size-10 overflow-hidden rounded-full bg-slate-100 "
                    >
                      <img
                        v-if="account.imgUrl"
                        alt="Avatar"
                        class="h-full w-full object-cover"
                        :src="account.imgUrl"
                      >
                      <span
                        v-else
                        class="flex h-full items-center justify-center text-xs text-slate-500 "
                      >
                        {{ getInitials(account.username) }}
                      </span>
                    </div>
                    <div>
                      <p class="font-semibold">
                        {{ account.username || "Khách hàng" }}
                      </p>
                      <p class="text-xs text-slate-500 ">
                        ID: {{ account.id }}
                      </p>
                    </div>
                  </div>
                </td>

                <td class="px-2 py-2">
                  <span
                    class="rounded-full px-2 py-1 text-xs font-semibold"
                    :class="getRoleBadgeClasses(account.role)"
                  >
                    {{ formatRoleLabel(account.role) }}
                  </span>
                </td>

                <td class="px-2 py-2 text-slate-500 ">
                  <p>{{ account.gmail || "-" }}</p>
                  <p>{{ account.phone || "-" }}</p>
                </td>

                <td class="px-2 py-2">
                  <span
                    class="rounded-full px-2 py-1 text-xs font-semibold"
                    :class="
                      account.isActive
                        ? 'bg-green-100 text-green-700  '
                        : 'bg-red-100 text-red-700  '
                    "
                  >
                    {{ account.isActive ? "Hoạt động" : "Tạm khóa" }}
                  </span>
                </td>

                <td class="px-2 py-2 text-slate-500 ">
                  {{ account.address || "-" }}
                </td>

                <td class="px-2 py-2 text-right">
                  <div class="flex items-center justify-end gap-1">
                    <button
                      class="rounded-lg p-1.5 hover:bg-slate-100 dark:hover:bg-white"
                      title="Chỉnh sửa"
                      @click="openEdit(account)"
                    >
                      <span
                        class="material-symbols-outlined text-[18px] text-slate-500"
                      >edit</span>
                    </button>

                    <button
                      class="rounded-lg p-1.5 hover:bg-amber-50 dark:hover:bg-amber-900/20"
                      :title="
                        account.isActive
                          ? 'Khóa tài khoản'
                          : 'Mở khóa tài khoản'
                      "
                      @click="toggleActive(account)"
                    >
                      <span
                        class="material-symbols-outlined text-[18px] text-amber-500"
                      >
                        {{ account.isActive ? "lock" : "lock_open" }}
                      </span>
                    </button>

                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>

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
              editingAccountId
                ? `Sửa người dùng #${editingAccountId}`
                : "Thêm người dùng mới"
            }}
          </h3>

          <div class="grid gap-3 md:grid-cols-2">
            <div>
              <label class="mb-1 block text-xs font-medium text-slate-500">Tên đăng nhập *</label>
              <input
                v-model.trim="form.username"
                class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-1.5 text-sm "
                placeholder="Nhập tên đăng nhập"
                type="text"
              >
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-500">Email *</label>
              <input
                v-model.trim="form.gmail"
                class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 text-sm "
                placeholder="example@email.com"
                type="email"
              >
            </div>

            <div v-if="canManageRoles">
              <label class="mb-1 block text-xs font-medium text-slate-500">Vai trò</label>
              <select
                v-model="form.role"
                class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 text-sm "
              >
                <option value="USER">Khách hàng</option>
                <option value="STAFF">Nhân viên</option>
              </select>
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-500">Số điện thoại</label>
              <input
                v-model.trim="form.phone"
                class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 text-sm "
                placeholder="09..."
                type="text"
              >
            </div>

            <div>
              <label class="mb-1 block text-xs font-medium text-slate-500">
                {{
                  editingAccountId
                    ? "Mật khẩu mới (không bắt buộc)"
                    : "Mật khẩu *"
                }}
              </label>
              <input
                v-model="form.password"
                class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 text-sm "
                placeholder="Tối thiểu 6 ký tự"
                type="password"
              >
            </div>

            <div class="md:col-span-2">
              <label class="mb-1 block text-xs font-medium text-slate-500">Địa chỉ</label>
              <textarea
                v-model.trim="form.address"
                class="w-full  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-1.5 text-sm "
                placeholder="Nhập địa chỉ khách hàng"
                rows="3"
              />
            </div>

            <label class="md:col-span-2 inline-flex items-center gap-2 text-sm">
              <input v-model="form.isActive" type="checkbox">
              <span>Tài khoản đang hoạt động</span>
            </label>
          </div>

          <p v-if="modalError" class="mt-3 text-xs text-red-500">
            {{ modalError }}
          </p>

          <div class="mt-4 flex justify-end gap-2">
            <button
              class="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium hover:border-slate-400 "
              type="button"
              @click="closeModal"
            >
              Hủy
            </button>

            <button
              class="rounded-xl bg-primary px-4 py-2 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
              :disabled="saving"
              type="button"
              @click="saveAccount"
            >
              {{
                saving
                  ? "Đang lưu..."
                  : editingAccountId
                    ? "Cập nhật"
                    : "Thêm mới"
              }}
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </AdminShell>
</template>

<script setup>
  import { computed, onMounted, ref } from 'vue'

  import AdminShell from '@/components/admin/AdminShell.vue'
  import { adminApi } from '@/services/api'

  const loading = ref(false)
  const error = ref('')
  const accounts = ref([])
  const search = ref('')
  const statusFilter = ref('ALL')
  const currentUserRole = ref(localStorage.getItem('userRole') || null)

  const showModal = ref(false)
  const editingAccountId = ref(null)
  const saving = ref(false)
  const modalError = ref('')
  const form = ref(emptyForm())

  const isAdmin = computed(() => currentUserRole.value === 'ADMIN')
  const canManageRoles = computed(() => isAdmin.value)

  const filteredAccounts = computed(() => {
    const keyword = search.value.trim().toLowerCase()

    return accounts.value.filter(account => {
      const activeMatch
        = statusFilter.value === 'ALL'
          || (statusFilter.value === 'ACTIVE'
            ? !!account.isActive
            : !account.isActive)

      if (!activeMatch) {
        return false
      }

      if (!keyword) {
        return true
      }

      const haystack = [
        account.username,
        account.gmail,
        account.phone,
        account.address,
        account.id,
        account.role,
      ]
        .filter(item => item !== undefined && item !== null)
        .join(' ')
        .toLowerCase()

      return haystack.includes(keyword)
    })
  })

  function formatRoleLabel (role) {
    const normalized = String(role || 'USER')
      .trim()
      .toUpperCase()
    if (normalized === 'ADMIN') return 'Admin'
    if (normalized === 'STAFF') return 'Nhân viên'
    if (normalized === 'CUSTOMER') return 'Khách hàng'
    if (normalized === 'GUEST') return 'Khách vãng lai'
    return 'Khách hàng'
  }

  function getRoleBadgeClasses (role) {
    const normalized = String(role || 'USER')
      .trim()
      .toUpperCase()
    if (normalized === 'STAFF') {
      return 'bg-blue-100 text-blue-700  '
    }
    if (normalized === 'CUSTOMER' || normalized === 'USER') {
      return 'bg-green-100 text-green-700  '
    }
    return 'bg-slate-100 text-slate-700  '
  }

  function isCustomerOnlyRole (account) {
    const role = String(account?.role || 'USER')
      .trim()
      .toUpperCase()
    return role === 'USER' || role === 'CUSTOMER'
  }

  function emptyForm () {
    return {
      username: '',
      gmail: '',
      phone: '',
      address: '',
      password: '',
      isActive: true,
      role: 'USER',
    }
  }

  function getInitials (name) {
    const value = String(name || '').trim()
    if (!value) return 'KH'

    const parts = value.split(/\s+/).filter(Boolean)
    if (parts.length === 1) {
      return parts[0].slice(0, 2).toUpperCase()
    }
    return `${parts[0][0] || ''}${parts.at(-1)[0] || ''}`.toUpperCase()
  }

  function openCreate () {
    editingAccountId.value = null
    form.value = emptyForm()
    modalError.value = ''
    showModal.value = true
  }

  function openEdit (account) {
    editingAccountId.value = account.id
    form.value = {
      username: account.username || '',
      gmail: account.gmail || '',
      phone: account.phone || '',
      address: account.address || '',
      password: '',
      isActive: !!account.isActive,
      role: account.role || 'USER',
    }
    modalError.value = ''
    showModal.value = true
  }

  function closeModal () {
    showModal.value = false
  }

  async function saveAccount () {
    const f = form.value
    modalError.value = ''

    if (!f.username || !f.gmail) {
      modalError.value = 'Vui lòng điền đầy đủ Tên đăng nhập và Email.'
      return
    }

    if (!editingAccountId.value && (!f.password || f.password.length < 6)) {
      modalError.value = 'Mật khẩu phải có ít nhất 6 ký tự khi tạo mới.'
      return
    }

    saving.value = true
    try {
      const payload = {
        username: f.username,
        gmail: f.gmail,
        phone: f.phone || '',
        address: f.address || '',
        isActive: !!f.isActive,
        role: canManageRoles.value ? f.role : 'USER',
      }

      if (f.password) {
        payload.password = f.password
      }

      await (editingAccountId.value ? adminApi.updateAccount(editingAccountId.value, payload) : adminApi.createAccount(payload))

      closeModal()
      await loadAccounts()
    } catch (error_) {
      modalError.value = error_?.message || 'Không thể lưu tài khoản khách hàng.'
    } finally {
      saving.value = false
    }
  }

  async function toggleActive (account) {
    try {
      await adminApi.updateAccount(account.id, {
        username: account.username,
        gmail: account.gmail,
        phone: account.phone || '',
        address: account.address || '',
        isActive: !account.isActive,
        role: account.role || 'USER',
      })

      account.isActive = !account.isActive
    } catch (error_) {
      error.value = error_?.message || 'Không thể cập nhật trạng thái tài khoản.'
    }
  }

  async function loadAccounts () {
    loading.value = true
    error.value = ''

    try {
      const data = await adminApi.getCustomerAccounts()
      const accountsToShow = Array.isArray(data) ? data : []

      accounts.value = [...accountsToShow]
        .filter(account => isAdmin.value || isCustomerOnlyRole(account))
        .sort((a, b) => Number(b.id || 0) - Number(a.id || 0))
    } catch (error_) {
      console.error('Failed to load customer accounts:', error_)
      error.value
        = 'Không thể tải danh sách người dùng. Vui lòng kiểm tra backend API.'
    } finally {
      loading.value = false
    }
  }

  onMounted(loadAccounts)
</script>
