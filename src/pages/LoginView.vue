<template>
  <div
    class="retail-shell text-slate-900  overflow-x-hidden antialiased flex flex-col min-h-screen"
  >
    <MainTopBar />

    <main
      class="mx-auto flex w-full max-w-[1240px] flex-1 flex-col gap-6 px-4 py-8 md:px-8 lg:flex-row lg:items-stretch lg:gap-8 xl:px-10"
    >
      <section
        class="hidden lg:flex lg:w-[52%] retail-card overflow-hidden p-0"
      >
        <div class="relative flex w-full items-end">
          <img
            alt="Athletic runner sprinting on a modern track wearing SportX sportswear"
            class="absolute inset-0 h-full w-full object-cover"
            src="https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1400&q=80"
          >
          <div
            class="absolute inset-0 bg-gradient-to-t from-[#14100d]/90 via-[#14100d]/45 to-transparent"
          />

          <div class="relative z-10 flex w-full flex-col gap-6 p-10 text-slate-800">
            <span
              class="retail-kicker w-fit border-white/30 bg-white/15 text-slate-800"
            >Tài khoản SportX</span>
            <div>
              <h1 class="text-[42px] font-black leading-[1.02] tracking-tight">
                Đăng nhập để mua nhanh và theo dõi đơn thuận tiện hơn.
              </h1>
              <p class="mt-4 max-w-xl text-sm leading-7 text-[#f0dfd2]">
                Xem trạng thái đơn hàng, lưu địa chỉ giao nhận và quản lý ưu đãi
                thành viên trong một nơi.
              </p>
            </div>
            <div class="grid grid-cols-2 gap-3 max-w-sm">
              <article
                class="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm"
              >
                <p
                  class="text-[11px] uppercase tracking-[0.18em] text-[#f7c2a4]"
                >
                  Thành viên
                </p>
                <p class="mt-1 text-2xl font-bold">20.000+</p>
              </article>
              <article
                class="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm"
              >
                <p
                  class="text-[11px] uppercase tracking-[0.18em] text-[#f7c2a4]"
                >
                  Đơn xử lý
                </p>
                <p class="mt-1 text-2xl font-bold">Mỗi ngày</p>
              </article>
            </div>
          </div>
        </div>
      </section>

      <section class="w-full lg:w-[48%] flex items-center justify-center">
        <div class="retail-card w-full max-w-[500px] px-6 py-7 sm:px-8">
          <div class="text-center lg:text-left">
            <h1
              class="text-slate-900  tracking-tight text-[32px] font-bold leading-tight pb-2"
            >
              Chào mừng quay lại
            </h1>
            <p class="text-slate-500  text-base">
              Nhập thông tin để tiếp tục mua sắm và theo dõi tài khoản.
            </p>
          </div>

          <div class="w-full py-3">
            <div
              class="flex h-12 w-full items-center justify-center rounded-xl bg-[#f2e9dd]  p-1"
            >
              <div
                class="flex flex-1 cursor-default h-full items-center justify-center overflow-hidden rounded-lg px-2 bg-white  shadow-sm text-slate-900  text-sm font-medium transition-all"
              >
                <span class="truncate">Đăng nhập</span>
              </div>
              <router-link
                class="flex flex-1 cursor-pointer h-full items-center justify-center overflow-hidden rounded-lg px-2 text-slate-500  text-sm font-medium transition-all hover:text-slate-800 :text-slate-800 hover:bg-black/5 :bg-white/5"
                to="/register"
              >
                <span class="truncate">Đăng ký</span>
              </router-link>
            </div>
          </div>

          <div
            v-if="errorMessage"
            class="bg-red-100  border border-red-400  text-red-700  px-4 py-3 rounded-lg text-sm font-medium text-center"
          >
            {{ errorMessage }}
          </div>

          <div
            v-if="successMessage"
            class="mt-3 bg-green-100  border border-green-400  text-green-700  px-4 py-3 rounded-lg text-sm font-medium text-center"
          >
            {{ successMessage }}
          </div>

          <form class="mt-4 flex flex-col gap-4" @submit.prevent="handleLogin">
            <label class="flex flex-col gap-1.5">
              <span
                class="text-slate-900  text-sm font-medium leading-normal"
              >Email liên hệ <span class="text-red-500">*</span></span>
              <div
                class="flex items-center rounded-xl border border-slate-300  bg-white  overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all"
              >
                <span class="pl-4 text-slate-400 "><span class="material-symbols-outlined text-[20px]">mail</span></span>
                <input
                  v-model="formData.gmail"
                  class="w-full border-none bg-transparent p-3.5 text-base text-slate-900  placeholder:text-slate-400 :text-[#9cabba] focus:ring-0 outline-none"
                  placeholder="you@gmail.com"
                  required
                  type="email"
                >
              </div>
            </label>

            <label class="flex flex-col gap-1.5">
              <span
                class="text-slate-900  text-sm font-medium leading-normal"
              >Mật khẩu <span class="text-red-500">*</span></span>
              <div
                class="flex items-center rounded-xl border border-slate-300  bg-white  overflow-hidden focus-within:border-primary focus-within:ring-1 focus-within:ring-primary transition-all"
              >
                <span class="pl-4 text-slate-400 "><span class="material-symbols-outlined text-[20px]">lock</span></span>
                <input
                  v-model="formData.password"
                  class="w-full border-none bg-transparent p-3.5 text-base text-slate-900  placeholder:text-slate-400 :text-[#9cabba] focus:ring-0 outline-none"
                  placeholder="••••••••"
                  required
                  :type="showPassword ? 'text' : 'password'"
                >
                <button
                  class="pr-4 text-slate-400  hover:text-primary transition-colors cursor-pointer"
                  type="button"
                  @click="showPassword = !showPassword"
                >
                  <span class="material-symbols-outlined text-[20px]">{{
                    showPassword ? "visibility" : "visibility_off"
                  }}</span>
                </button>
              </div>
            </label>

            <div class="flex items-center justify-end py-1">
              <router-link
                class="font-medium text-primary hover:text-[#a84f24] hover:underline transition-colors text-sm"
                to="/forgot-password"
              >Quên mật khẩu?</router-link>
            </div>

            <button
              class="flex w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 bg-primary hover:bg-[#a84f24] transition-all text-white text-base font-bold leading-normal tracking-[0.015em] shadow-lg shadow-orange-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              :disabled="isLoading"
              type="submit"
            >
              <span v-if="isLoading" class="mr-2">
                <svg
                  class="animate-spin h-5 w-5 text-slate-800"
                  fill="none"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  />
                  <path
                    class="opacity-75"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    fill="currentColor"
                  />
                </svg>
              </span>
              {{ isLoading ? "Đang đăng nhập..." : "Đăng nhập" }}
            </button>

            <div class="relative flex items-center py-4">
              <div
                class="flex-grow border-t border-slate-200 "
              />
              <span
                class="flex-shrink-0 mx-4 text-slate-400 text-xs uppercase tracking-wider font-semibold"
              >Hoặc tiếp tục với</span>
              <div
                class="flex-grow border-t border-slate-200 "
              />
            </div>

            <div class="flex justify-center w-full mb-2">
              <GoogleLogin
                :callback="handleGoogleLogin"
                shape="rectangular"
                text="continue_with"
                theme="filled_black"
                :width="350"
              />
            </div>
          </form>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
  import { reactive, ref } from 'vue'
  import { GoogleLogin } from 'vue3-google-login' // BẮT BUỘC PHẢI CÓ DÒNG NÀY ĐỂ HIỆN NÚT
  import { useRouter } from 'vue-router'
  import { authApi } from '../services/api'

  const router = useRouter()

  const showPassword = ref(false)
  const isLoading = ref(false)
  const errorMessage = ref('')
  const successMessage = ref('')

  const formData = reactive({
    gmail: '',
    password: '',
  })

  function normalizeIsActive (value, fallback = true) {
    if (value === true || value === 1 || value === '1' || value === 'true')
      return true
    if (value === false || value === 0 || value === '0' || value === 'false')
      return false
    return fallback
  }

  function extractAccountPayload (response) {
    if (!response || typeof response !== 'object') return null
    if (response.account && typeof response.account === 'object')
      return response.account
    if (response.accountResponse && typeof response.accountResponse === 'object')
      return response.accountResponse
    if (response.data?.account && typeof response.data.account === 'object')
      return response.data.account
    if (response.data && typeof response.data === 'object' && response.data.id)
      return response.data
    if (response.id) return response
    return null
  }

  function normalizeRoleName (roleValue) {
    if (typeof roleValue !== 'string') return null
    const normalized = roleValue.trim().toUpperCase()
    if (!normalized) return null
    return normalized.startsWith('ROLE_') ? normalized.slice(5) : normalized
  }

  function extractRoleFromAccount (account) {
    if (!account || typeof account !== 'object') return null

    const directRole
      = normalizeRoleName(account.role)
        || normalizeRoleName(account.roleName)
        || normalizeRoleName(account.authority)

    if (directRole) return directRole

    if (!Array.isArray(account.roles)) return null

    const roleNames = account.roles
      .map(item => {
        if (typeof item === 'string') return normalizeRoleName(item)
        if (!item || typeof item !== 'object') return null
        return (
          normalizeRoleName(item.name)
          || normalizeRoleName(item.role)
          || normalizeRoleName(item.roleName)
          || normalizeRoleName(item.authority)
        )
      })
      .filter(Boolean)

    if (roleNames.includes('ADMIN')) return 'ADMIN'
    if (roleNames.includes('USER')) return 'USER'
    if (roleNames.includes('GUEST')) return 'GUEST'
    return roleNames[0] || null
  }

  // --- HÀM LƯU THÔNG TIN ĐĂNG NHẬP VÀ CHUYỂN HƯỚNG ---
  function handleLoginSuccess (response, account) {
    successMessage.value = 'Đăng nhập thành công! Đang chuyển hướng...'

    let role = extractRoleFromAccount(account)
    if (
      !role
      && (account.gmail === 'admin@shopgiay.com'
        || account.gmail === 'admin@example.com')
    ) {
      role = 'ADMIN'
    }
    if (!role) {
      role = 'CUSTOMER'
    }

    console.log('User role detected:', role)

    const normalizedUser = {
      id: account.id,
      accountCode: account.accountCode,
      username: account.username,
      gmail: account.gmail,
      phone: account.phone,
      address: account.address,
      imgUrl: account.imgUrl || null,
      isActive: normalizeIsActive(account.isActive, true),
      role: role,
      roles: Array.isArray(account.roles) ? account.roles : [],
    }

    localStorage.setItem('user', JSON.stringify(normalizedUser))
    localStorage.setItem('userRole', role)

    if (response.token) {
      localStorage.setItem('token', response.token)
    }

    setTimeout(() => {
      if (role === 'ADMIN') {
        router.push({ name: 'admin-home' })
      } else {
        router.push({ name: 'home' })
      }
    }, 500)
  }

  // --- ĐĂNG NHẬP BẰNG TÀI KHOẢN MẬT KHẨU ---
  async function handleLogin () {
    errorMessage.value = ''
    successMessage.value = ''

    if (!formData.gmail || !formData.password) {
      errorMessage.value = 'Vui lòng điền đầy đủ thông tin'
      return
    }

    isLoading.value = true

    try {
      const response = await authApi.login({
        gmail: formData.gmail,
        password: formData.password,
      })

      const account = extractAccountPayload(response)

      if (response && response.success && account) {
        handleLoginSuccess(response, account)
      } else {
        errorMessage.value
          = response?.message || 'Đăng nhập thất bại. Kiểm tra lại Email/Mật khẩu.'
      }
    } catch (error) {
      errorMessage.value
        = error.message || 'Có lỗi xảy ra. Vui lòng thử lại sau.'
    } finally {
      isLoading.value = false
    }
  }

  // --- ĐĂNG NHẬP BẰNG GOOGLE ---
  async function handleGoogleLogin (googleResponse) {
    console.log('Mã Token Google trả về:', googleResponse) // In ra để debug nếu cần

    errorMessage.value = ''
    successMessage.value = ''

    if (!googleResponse || !googleResponse.credential) {
      errorMessage.value
        = 'Không lấy được mã xác thực từ Google. Vui lòng thử lại.'
      return
    }

    isLoading.value = true

    try {
      const googleToken = googleResponse.credential
      const response = await authApi.loginWithGoogle({ token: googleToken })

      const account = extractAccountPayload(response)

      if (response && response.success && account) {
        handleLoginSuccess(response, account)
      } else {
        errorMessage.value
          = response?.message || 'Tài khoản Google của bạn bị từ chối truy cập.'
      }
    } catch (error) {
      console.error('Lỗi khi gửi Token xuống Backend:', error)
      errorMessage.value
        = 'Máy chủ đang bận hoặc có lỗi cấu hình. Vui lòng thử lại sau.'
    } finally {
      isLoading.value = false
    }
  }
</script>
