<template>
  <header :class="['retail-header z-50 transition-all duration-300', isHome ? 'absolute w-full top-0 bg-transparent' : 'sticky top-0 bg-white/90 border-b border-slate-200 backdrop-blur-xl']">
    <div class="mx-auto flex w-full max-w-[1400px] items-center justify-between px-4 py-4 md:px-8 xl:px-10">

      <!-- 1. Logo (Left) -->
      <router-link class="flex items-center gap-3 group shrink-0" to="/">
        <div class="hidden sm:block">
          <p class="text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">SportX</p>
          <h2 class="font-headline text-[24px] uppercase leading-none tracking-tight text-slate-900 drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">SPORT STORE</h2>
        </div>
      </router-link>

      <!-- 2. Centered Nav (Middle) -->
      <nav class="hidden flex-1 items-center justify-center xl:flex">
        <div class="flex items-center gap-8 rounded-full bg-white/90 border border-slate-200 px-8 py-3 shadow-glass text-[12px] font-medium tracking-wide text-slate-500">
          <router-link class="hover:text-primary hover:drop-shadow-[0_0_8px_rgba(255,77,0,0.6)] transition-all text-slate-900" to="/">Trang chủ</router-link>
          <router-link class="hover:text-primary hover:drop-shadow-[0_0_8px_rgba(255,77,0,0.6)] transition-all" to="/shop">Cửa Hàng</router-link>
          <router-link class="hover:text-primary hover:drop-shadow-[0_0_8px_rgba(255,77,0,0.6)] transition-all" to="/brands">Thương hiệu</router-link>
          <router-link class="hover:text-primary hover:drop-shadow-[0_0_8px_rgba(255,77,0,0.6)] transition-all" to="/vouchers">Khuyến mãi</router-link>
          <router-link class="hover:text-primary hover:drop-shadow-[0_0_8px_rgba(255,77,0,0.6)] transition-all" to="/about">Về SportX</router-link>
          <router-link v-if="isAdmin" class="hover:text-primary hover:drop-shadow-[0_0_8px_rgba(255,77,0,0.6)] transition-all text-primary" to="/admin">Quản trị</router-link>
        </div>
      </nav>

      <!-- 3. Icons & Actions (Right) -->
      <div class="flex shrink-0 items-center justify-end gap-2">
        <!-- Compare Icon -->
        <router-link
          aria-label="So sánh sản phẩm"
          class="relative flex size-11 items-center justify-center rounded-full text-slate-500 transition-colors hover:bg-slate-100 hover:text-primary"
          title="So sánh sản phẩm"
          to="/compare"
        >
          <span class="material-symbols-outlined">compare_arrows</span>
          <span v-if="compareCount > 0" class="absolute right-1 top-2 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white shadow-neon">
            {{ compareCount }}
          </span>
        </router-link>

        <!-- Cart Icon -->
        <router-link class="relative flex size-11 items-center justify-center rounded-full text-slate-500 hover:text-primary hover:bg-slate-100 transition-colors" to="/cart">
          <span class="material-symbols-outlined">shopping_bag</span>
          <span v-if="cartCount > 0" class="absolute right-1 top-2 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white shadow-neon">
            {{ cartCount }}
          </span>
        </router-link>

        <!-- Notification Bell (Only show if logged in) -->
        <NotificationBell v-if="isLoggedIn" />

        <!-- User Menu -->
        <div v-if="isLoggedIn" ref="userMenuRef" class="relative ml-2">
          <button
            class="flex size-11 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-800 hover:border-primary transition-colors"
            type="button"
            @click="toggleUserMenu"
          >
            <div
              class="flex size-8 items-center justify-center overflow-hidden rounded-full bg-primary/20 text-[10px] font-bold uppercase text-primary"
            >
              <img
                v-if="resolvedUserAvatar"
                :alt="userName"
                class="h-full w-full object-cover"
                :src="resolvedUserAvatar"
              >
              <span v-else>{{ userInitials }}</span>
            </div>
          </button>

          <div
            v-if="showUserMenu"
            class="absolute right-0 mt-3 w-64 rounded-3xl border border-slate-200 bg-[#fffdf8] p-3 shadow-card-warm"
          >
            <div class="rounded-2xl bg-[#f6efe6] px-4 py-3">
              <p class="text-[11px] uppercase tracking-[0.22em] text-primary">
                Tài khoản
              </p>
              <p
                class="mt-1 truncate text-sm font-semibold text-slate-900"
              >
                {{ userEmail || "Không có email" }}
              </p>
            </div>
            <div class="mt-3 grid gap-1 text-sm">
              <router-link
                class="rounded-2xl px-4 py-3 font-medium hover:bg-primary/10"
                to="/profile"
                @click="showUserMenu = false"
              >Hồ sơ của tôi</router-link>
              <router-link
                class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100"
                to="/orders"
              >
                Đơn hàng của tôi
              </router-link>
              <button
                class="rounded-2xl px-4 py-3 text-left font-medium text-red-600 hover:bg-red-50"
                type="button"
                @click="handleLogout"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>

        <router-link
          v-else
          class="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
          to="/login"
        >
          Đăng nhập
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup>
  import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { resolveBackendAssetUrl } from '@/services/api'
  import { useCartStore } from '@/stores/cart'
  import { useCompareStore } from '@/stores/compare'
  import NotificationBell from '@/components/NotificationBell.vue'

  const cartStore = useCartStore()
  const compareStore = useCompareStore()
  const route = useRoute()
  const router = useRouter()

  const isHome = computed(() => route.name === 'home' || route.path === '/')

  const showUserMenu = ref(false)
  const isLoggedIn = ref(false)
  const userName = ref('Khách SportX')
  const userEmail = ref('')
  const userAvatar = ref('')
  const userMenuRef = ref(null)

  const cartCount = computed(() => cartStore.cartItems.length)
  const compareCount = computed(() => compareStore.count)

  const userInitials = computed(() => {
    if (!userName.value) return 'PS'
    return userName.value
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map(part => part[0])
      .join('')
      .toUpperCase()
  })

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

  const resolvedUserAvatar = computed(() => normalizeAvatarUrl(userAvatar.value))

  function syncSession () {
    const rawUser = localStorage.getItem('user')
    const token = localStorage.getItem('token')

    if (!rawUser && !token) {
      isLoggedIn.value = false
      userName.value = 'Khách SportX'
      userEmail.value = ''
      userAvatar.value = ''
      return
    }

    isLoggedIn.value = true

    if (!rawUser) return

    try {
      const user = JSON.parse(rawUser)
      userName.value = user.username || 'Khách SportX'
      userEmail.value = user.gmail || user.email || ''
      userAvatar.value = user.imgUrl || ''
    } catch {
      userName.value = 'Khách SportX'
      userEmail.value = ''
      userAvatar.value = ''
    }
  }

  function toggleUserMenu (event) {
    event.stopPropagation()
    if (!isLoggedIn.value) {
      router.push('/login')
      return
    }
    showUserMenu.value = !showUserMenu.value
  }

  function handleOutsideClick (event) {
    if (!showUserMenu.value) return
    if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
      showUserMenu.value = false
    }
  }

  function handleLogout () {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    showUserMenu.value = false
    syncSession()
    router.push('/login')
  }

  onMounted(() => {
    syncSession()
    window.addEventListener('click', handleOutsideClick)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('click', handleOutsideClick)
  })

  watch(
    () => route.fullPath,
    () => {
      showUserMenu.value = false
      syncSession()
    },
  )

  const isAdmin = computed(() => {
    const role = localStorage.getItem('userRole')
    return role === 'ADMIN'
  })
</script>
