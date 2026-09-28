<template>
  <div class="retail-shell">
    <header class="retail-header">
      <div
        class="mx-auto flex w-full items-center justify-between px-4 py-3 md:px-6"
        :class="wide ? 'max-w-[1920px]' : 'max-w-[1720px]'"
      >
        <div class="flex items-center gap-3">
          <button
            aria-label="Mở hoặc đóng menu"
            class="flex size-10 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-700 shadow-sm transition-colors hover:bg-slate-50 hover:text-primary"
            title="Mở/đóng menu"
            type="button"
            @click="menuOpen = !menuOpen"
          >
            <span class="material-symbols-outlined text-xl">{{
              menuOpen ? 'close' : 'menu'
            }}</span>
          </button>
          <div
            class="flex size-10 items-center justify-center rounded-2xl bg-primary-white"
          >
            <span class="material-symbols-outlined text-xl">admin_panel_settings</span>
          </div>
          <div>
            <p class="text-[11px] uppercase tracking-[0.2em] text-primary">
              SportX
            </p>
            <h1 class="text-lg font-bold leading-none">Bảng quản trị</h1>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <NotificationBell />
          <p class="hidden text-sm text-slate-600 md:block">
            Xin chào,
            <span class="font-semibold text-slate-900">{{
              currentUserName
            }}</span>
          </p>

          <button
            class="inline-flex items-center gap-2  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-3 py-2 text-sm font-medium transition-colors hover:border-red-500 hover:text-red-500  "
            type="button"
            @click="handleLogout"
          >
            <span class="material-symbols-outlined text-[18px]">logout</span>
            Đăng xuất
          </button>
        </div>
      </div>
    </header>

    <div
      class="mx-auto flex w-full gap-6 px-4 py-6 md:px-6"
      :class="wide ? 'max-w-[1920px]' : 'max-w-[1720px]'"
    >
      <Teleport to="body">
        <Transition name="fade">
          <div
            v-if="menuOpen"
            class="fixed inset-0 z-[60] bg-black/40"
            @click="menuOpen = false"
            @keydown.esc="menuOpen = false"
          />
        </Transition>

        <Transition name="slide">
          <aside
            v-if="menuOpen"
            class="fixed left-0 top-0 z-[70] flex h-full w-72 flex-col bg-white shadow-2xl"
          >
            <div class="flex items-center justify-between border-b border-slate-100 px-4 py-4">
              <div class="flex items-center gap-2">
                <div
                  class="flex size-9 items-center justify-center rounded-xl text-primary"
                >
                  <span class="material-symbols-outlined text-xl">admin_panel_settings</span>
                </div>
                <div>
                  <p class="text-[10px] uppercase tracking-[0.2em] text-primary">SportX</p>
                  <p class="text-sm font-bold leading-none">Bảng quản trị</p>
                </div>
              </div>
              <button
                class="flex size-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                title="Đóng menu"
                type="button"
                @click="menuOpen = false"
              >
                <span class="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            <div class="retail-card m-3 flex-1 overflow-y-auto p-3">
              <nav class="grid gap-1">
                <router-link
                  v-for="item in navItems"
                  :key="item.path"
                  class="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors"
                  :class="isActive(item.path)
                    ? 'bg-transparent text-primary'
                    : 'text-slate-700 hover:bg-primary/10 hover:text-primary'"
                  :to="item.path"
                  @click="menuOpen = false"
                >
                  <span class="material-symbols-outlined text-[20px]">{{
                    item.icon
                  }}</span>
                  <span>{{ item.label }}</span>
                </router-link>

                <router-link
                  class="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-primary bg-white"
                  to="/"
                  @click="menuOpen = false"
                >
                  <span class="material-symbols-outlined text-[20px]">storefront</span>
                  <span>Về Trang chủ</span>
                </router-link>
              </nav>
            </div>
          </aside>
        </Transition>
      </Teleport>

      <section class="min-w-0 flex-1 space-y-6">
        <header v-if="$slots.header" class="retail-card p-5 md:p-6">
          <slot name="header" />
        </header>

        <slot />
      </section>
    </div>
  </div>
</template>

<script setup>
  import { computed, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  defineProps({
    wide: {
      type: Boolean,
      default: false,
    },
  })

  const route = useRoute()
  const router = useRouter()

  import NotificationBell from '@/components/NotificationBell.vue'

  const menuOpen = ref(false)

  const navItems = [
    { path: '/admin/reports', label: 'Báo cáo', icon: 'bar_chart' },
    { path: '/admin/pos', label: 'Bán hàng POS', icon: 'point_of_sale' },
    { path: '/admin/products', label: 'Quản lý sản phẩm', icon: 'inventory_2' },
    { path: '/admin/orders', label: 'Đơn hàng', icon: 'shopping_bag' },
    { path: '/admin/returns', label: 'Trả hàng', icon: 'assignment_return' },
    { path: '/admin/refunds', label: 'Hoàn tiền', icon: 'payments' },
    { path: '/admin/categories', label: 'Danh mục', icon: 'category' },
    { path: '/admin/brands', label: 'Thương hiệu', icon: 'branding_watermark' },
    { path: '/admin/customers', label: 'Quản Lý Tài Khoản', icon: 'group' },
    { path: '/admin/vouchers', label: 'Voucher', icon: 'local_activity' },
    { path: '/admin/settings', label: 'Cài đặt', icon: 'settings' },
  ]

  const currentUserName = computed(() => {
    try {
      const raw = localStorage.getItem('user')
      if (!raw) return 'Admin'
      const parsed = JSON.parse(raw)
      return parsed.username || parsed.gmail || 'Admin'
    } catch {
      return 'Admin'
    }
  })

  function isActive (path) {
    if (path === '/admin') {
      return route.path === '/admin'
    }
    return route.path.startsWith(path)
  }

  function handleLogout () {
    localStorage.removeItem('user')
    localStorage.removeItem('userRole')
    localStorage.removeItem('token')
    router.push({ name: 'login' })
  }
</script>

<style scoped>
  .fade-enter-active,
  .fade-leave-active {
    transition: opacity 0.2s ease;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .slide-enter-active,
  .slide-leave-active {
    transition: transform 0.25s ease;
  }

  .slide-enter-from,
  .slide-leave-to {
    transform: translateX(-100%);
  }
</style>
