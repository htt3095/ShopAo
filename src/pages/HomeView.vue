<template>
  <div class="retail-shell flex flex-col overflow-x-hidden antialiased">
    <MainTopBar />

    <main class="flex-1 pb-16">
      <section class="w-full relative bg-white">
        <div class="relative w-full h-[600px] lg:h-[800px] overflow-hidden">

          <!-- Background Image Transition -->
          <transition mode="in-out" name="fade">
            <img
              :key="currentSlide"
              :alt="heroSlides[currentSlide].titleLine1"
              class="absolute inset-0 w-full h-full object-cover transition-transform duration-[10000ms] ease-linear hover:scale-110"
              :src="heroSlides[currentSlide].image"
            >
          </transition>

          <!-- Light Overlay for text readability -->
          <div class="absolute inset-0 bg-gradient-to-r from-white/90 via-white/50 to-transparent" />
          <div class="absolute inset-0 bg-white/30" />

          <div class="relative z-10 w-full h-full max-w-[1400px] mx-auto px-4 md:px-8 xl:px-10 flex flex-col justify-center">
            <!-- Left Text Content -->
            <transition mode="out-in" name="fade">
              <div :key="currentSlide" class="max-w-2xl">
                <span class="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/20 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-primary shadow-neon mb-6 backdrop-blur-sm">
                  {{ heroSlides[currentSlide].kicker }}
                </span>
                <h1 class="retail-heading text-[48px] leading-[0.95] text-slate-900 sm:text-[68px] lg:text-[76px]">
                  {{ heroSlides[currentSlide].titleLine1 }}
                  <br>
                  <span class="text-primary neon-text">{{ heroSlides[currentSlide].titleLine2 }}</span>
                  <br>
                  {{ heroSlides[currentSlide].titleLine3 }}
                </h1>
                <p class="mt-6 max-w-xl text-base leading-relaxed text-slate-600 sm:text-lg">
                  {{ heroSlides[currentSlide].description }}
                </p>

                <div class="mt-10 flex flex-wrap gap-4">
                  <router-link
                    class="inline-flex items-center rounded-full bg-primary px-10 py-4 text-sm font-bold text-white shadow-neon transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(255,77,0,0.6)]"
                    :to="heroSlides[currentSlide].link"
                  >
                    {{ heroSlides[currentSlide].btnText }}
                  </router-link>
                  <router-link
                    class="inline-flex items-center rounded-full border border-slate-300 px-10 py-4 text-sm font-bold text-slate-800 transition-all duration-300 hover:border-slate-500 bg-white/50 backdrop-blur-md hover:bg-white/80"
                    to="/size-guide"
                  >
                    Xem Bảng Size
                  </router-link>
                </div>
              </div>
            </transition>

            <!-- Carousel Controls -->
            <div class="absolute bottom-12 left-4 md:left-8 xl:left-10 flex gap-4 z-20 items-center">
              <button
                class="flex size-10 items-center justify-center rounded-full bg-white/40 text-slate-800 backdrop-blur-md transition-all hover:bg-primary hover:text-white"
                @click="prevSlide"
              >
                <span class="material-symbols-outlined">chevron_left</span>
              </button>

              <div class="flex gap-2">
                <button
                  v-for="(_, index) in heroSlides"
                  :key="'dot-'+index"
                  :class="['h-1.5 rounded-full transition-all duration-300', currentSlide === index ? 'w-8 bg-primary shadow-neon' : 'w-2 bg-slate-300 hover:bg-slate-400']"
                  @click="setSlide(index)"
                />
              </div>

              <button
                class="flex size-10 items-center justify-center rounded-full bg-white/40 text-slate-800 backdrop-blur-md transition-all hover:bg-primary hover:text-white"
                @click="nextSlide"
              >
                <span class="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Quick access block -> Full width like before -->
      <section class="mx-auto mt-12 grid w-full max-w-[1400px] gap-6 px-4 md:px-8 xl:px-10">
        <article class="retail-card p-6 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div class="max-w-xl">
            <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
              Lối vào nhanh
            </p>
            <h2 class="mt-3 font-headline text-[32px] md:text-[40px] uppercase leading-none text-slate-900 ">
              Mua Theo Nhu Cầu
            </h2>
            <p class="mt-4 text-sm leading-6 text-slate-500 ">
              Chọn điểm bắt đầu phù hợp để vào đúng trang bạn cần ngay từ đầu.
            </p>
          </div>

          <div class="flex flex-col sm:flex-row gap-3">
            <router-link
              class="group inline-flex items-center justify-center rounded-xl bg-primary px-6 py-4 text-sm font-bold text-white transition-all duration-300 shadow-neon hover:shadow-[0_0_30px_rgba(255,77,0,0.6)] hover:-translate-y-1"
              to="/shop"
            >
              Tất cả sản phẩm
              <span class="material-symbols-outlined ml-2 text-lg transition-transform group-hover:translate-x-1">arrow_forward</span>
            </router-link>
            <router-link
              class="group inline-flex items-center justify-center  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-6 py-4 text-sm font-semibold text-slate-800 transition-colors hover:border-primary hover:text-primary  "
              to="/size-guide"
            >
              Bảng size
            </router-link>
            <router-link
              class="group inline-flex items-center justify-center  shadow-sm hover:shadow-lg hover:border-primary/30 transition-all duration-300 px-6 py-4 text-sm font-semibold text-slate-800 transition-colors hover:border-primary hover:text-primary  "
              to="/vouchers"
            >
              Kiểm tra ưu đãi
            </router-link>
          </div>
        </article>
      </section>

      <!-- 3 Shortcuts -->
      <section class="mx-auto mt-6 w-full max-w-[1400px] px-4 md:px-8 xl:px-10">
        <div class="grid gap-6 md:grid-cols-3">
          <article
            v-for="item in categoryShortcuts"
            :key="item.title"
            class="retail-card flex flex-col justify-between p-6 sm:p-7 h-full"
          >
            <div>
              <p class="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary">
                {{ item.kicker }}
              </p>
              <h3 class="mt-3 font-headline text-[24px] uppercase leading-none text-slate-900 ">
                {{ item.title }}
              </h3>
              <p class="mt-4 text-sm leading-6 text-slate-500 ">
                {{ item.description }}
              </p>
            </div>
            <div class="mt-6 flex justify-end">
              <router-link
                class="inline-flex size-11 items-center justify-center rounded-full bg-primary text-white shadow-neon hover:shadow-[0_0_20px_rgba(255,77,0,0.6)] transition-all hover:-translate-y-1 hover:text-white"
                :to="item.to"
              >
                <span class="material-symbols-outlined">arrow_forward</span>
              </router-link>
            </div>
          </article>
        </div>
      </section>

      <section
        class="mx-auto mt-16 w-full max-w-[1240px] px-4 md:px-8 xl:px-10"
      >
        <div
          class="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <span class="retail-kicker">Danh mục nổi bật</span>
            <h2
              class="retail-heading mt-4 text-[42px] leading-none text-slate-900 "
            >
              Chọn nhanh theo nhu cầu
            </h2>
          </div>
          <p
            class="max-w-xl text-sm leading-6 text-slate-500 "
          >
            Mỗi danh mục dẫn thẳng đến trang mua hàng để bạn lọc và xem giá
            ngay, không mất thêm thao tác vòng.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-5 lg:grid-cols-4">
          <router-link
            v-for="cat in categoryCards"
            :key="cat.id"
            class="group overflow-hidden rounded-[30px]"
            :to="{ path: '/shop', query: { categoryId: String(cat.id) } }"
          >
            <div class="retail-card h-full overflow-hidden p-0">
              <div class="aspect-[4/5] overflow-hidden">
                <img
                  :alt="cat.name"
                  class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  :src="cat.image"
                >
              </div>
              <div class="px-5 py-5">
                <p class="text-[11px] uppercase tracking-[0.22em] text-primary">
                  Danh mục
                </p>
                <h3
                  class="mt-2 text-lg font-semibold text-slate-900 "
                >
                  {{ cat.name }}
                </h3>
              </div>
            </div>
          </router-link>
        </div>
      </section>

      <section
        class="mx-auto mt-16 w-full max-w-[1240px] px-4 md:px-8 xl:px-10"
      >
        <div
          class="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <span class="retail-kicker">Sản phẩm nên xem</span>
            <h2
              class="retail-heading mt-4 text-[42px] leading-none text-slate-900 "
            >
              Mẫu đang được quan tâm
            </h2>
          </div>
          <router-link
            class="text-sm font-semibold text-primary hover:underline"
            to="/shop"
          >Xem toàn bộ cửa hàng</router-link>
        </div>

        <div class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <article
            v-for="product in featuredProducts"
            :key="product.id"
            class="retail-card flex flex-col overflow-hidden p-0 transition-transform hover:-translate-y-1 h-full"
          >
            <router-link class="block" :to="`/product/${product.id}`">
              <div
                class="aspect-[5/4] overflow-hidden bg-slate-100 "
              >
                <img
                  :alt="product.name"
                  class="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                  :src="getProductImage(product)"
                >
              </div>
            </router-link>
            <div class="px-5 py-5 flex flex-col flex-1">
              <p
                class="text-xs font-medium uppercase tracking-[0.16em] text-slate-500 "
              >
                {{ getBrandName(product.brandId) }}
              </p>
              <router-link
                class="mt-2 block min-h-[52px] text-lg font-semibold leading-6 text-slate-900 transition-colors hover:text-primary "
                :to="`/product/${product.id}`"
              >{{ product.name }}</router-link>
              <div class="mt-auto pt-4 flex items-center justify-between">
                <div>
                  <p
                    class="text-xs uppercase tracking-[0.18em] text-slate-500"
                  >
                    Giá tham khảo
                  </p>
                  <p
                    class="mt-1 text-xl font-semibold text-slate-900 "
                  >
                    {{ formatMoney(getProductPrice(product)) }}
                  </p>
                </div>
                <router-link
                  class="inline-flex size-11 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-[#a84f24]"
                  :to="`/product/${product.id}`"
                >
                  <span class="material-symbols-outlined">arrow_forward</span>
                </router-link>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section
        v-if="isLoggedIn && activeVouchers.length > 0"
        class="mx-auto mt-16 w-full max-w-[1240px] px-4 md:px-8 xl:px-10"
      >
        <div class="retail-card px-6 py-7 sm:px-8">
          <div
            class="mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between"
          >
            <div>
              <span class="retail-kicker">Ưu đãi của bạn</span>
              <h2
                class="retail-heading mt-4 text-[38px] leading-none text-slate-900 "
              >
                Mã giảm giá đang khả dụng
              </h2>
            </div>
            <router-link
              class="text-sm font-semibold text-primary hover:underline"
              to="/vouchers"
            >Xem trung tâm voucher</router-link>
          </div>

          <div class="grid gap-4 md:grid-cols-3">
            <article
              v-for="voucher in activeVouchers.slice(0, 3)"
              :key="voucher.id"
              class="rounded-[26px] border border-dashed border-primary/30 bg-white p-5 "
            >
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p
                    class="text-[11px] uppercase tracking-[0.22em] text-primary"
                  >
                    Mã áp dụng
                  </p>
                  <h3
                    class="mt-2 text-2xl font-bold text-slate-900 "
                  >
                    {{ voucher.code }}
                  </h3>
                </div>
                <button
                  class="inline-flex size-10 items-center justify-center rounded-full bg-slate-100 text-primary shadow-sm transition-colors hover:bg-primary hover:text-white"
                  type="button"
                  @click="copyCode(voucher.code)"
                >
                  <span class="material-symbols-outlined">content_copy</span>
                </button>
              </div>
              <p
                class="mt-4 text-sm leading-6 text-slate-500 "
              >
                Giảm {{ voucher.discountValue
                }}{{ voucher.discountType === "PERCENT" ? "%" : "đ" }} cho đơn
                đủ điều kiện.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
  import axios from 'axios'
  import { computed, onMounted, onUnmounted, ref } from 'vue'

  import { useCartStore } from '@/stores/cart'
  import { useProductStore } from '@/stores/products'
  import { getProductImageUrl } from '@/utils/productImages'

  const cartStore = useCartStore()
  const productStore = useProductStore()

  const isLoggedIn = ref(false)
  const showUserMenu = ref(false)
  const userName = ref('')
  const userEmail = ref('')
  const userAvatar = ref('')
  const activeVouchers = ref([])

  // Carousel Logic
  const heroSlides = ref([
    {
      kicker: 'BỘ SƯU TẬP MỚI NHẤT',
      titleLine1: 'CHỌN CHIẾC ÁO',
      titleLine2: 'ĐÚNG FORM',
      titleLine3: 'CHO TỪNG NGÀY.',
      description: 'Từ đi làm, đi học đến chạy bộ cuối tuần. SportX sắp sẵn các dòng áo thể thao dễ chọn, chất vải thoáng mát và lên form cực chuẩn để bạn luôn thoải mái vận động.',
      image: '/banners/hero1.png',
      link: '/shop',
      btnText: 'Mua Ngay Bây Giờ',
    },
    {
      kicker: 'HÀNG MỚI VỀ',
      titleLine1: 'THOẢI MÁI',
      titleLine2: 'TỐI ĐA',
      titleLine3: 'MỌI HOẠT ĐỘNG.',
      description: 'Chất vải co giãn 4 chiều cùng công nghệ thấm hút mồ hôi vượt trội, giúp bạn tự tin vượt qua mọi giới hạn trong mọi bài tập.',
      image: '/banners/hero2.png',
      link: '/shop',
      btnText: 'Khám Phá Ngay',
    },
    {
      kicker: 'PHONG CÁCH TỐI GIẢN',
      titleLine1: 'TỰ TIN',
      titleLine2: 'THỂ HIỆN',
      titleLine3: 'CHÍNH MÌNH.',
      description: 'Thiết kế tinh tế, màu sắc basic dễ phối đồ. Không cần quá cầu kỳ, chỉ cần một chiếc áo vừa vặn cũng đủ làm nổi bật khí chất của bạn.',
      image: '/banners/hero3.png',
      link: '/shop',
      btnText: 'Xem Bộ Sưu Tập',
    },
  ])
  const currentSlide = ref(0)
  let slideInterval = null

  function setSlide (index) {
    currentSlide.value = index
    resetInterval()
  }

  function prevSlide () {
    currentSlide.value = (currentSlide.value - 1 + heroSlides.value.length) % heroSlides.value.length
    resetInterval()
  }

  function nextSlide () {
    currentSlide.value = (currentSlide.value + 1) % heroSlides.value.length
    resetInterval()
  }

  function resetInterval () {
    if (slideInterval) clearInterval(slideInterval)
    slideInterval = setInterval(nextSlide, 5000)
  }

  const categoryShortcuts = [
    {
      kicker: 'Tập luyện',
      title: 'Áo chạy bộ',
      description:
        'Ưu tiên chất vải thoáng mát, form áo thể thao linh hoạt cho lịch chạy hàng tuần.',
      to: '/shop',
    },
    {
      kicker: 'Đi làm, đi chơi',
      title: 'Áo mang hàng ngày',
      description:
        'Màu trung tính, dễ phối đồ, không quá thể thao nhưng vẫn đủ thoải mái để mặc cả ngày dài.',
      to: '/shop',
    },
    {
      kicker: 'Tiết kiệm hơn',
      title: 'Ưu đãi thành viên',
      description:
        'Mã giảm giá, đợt xả size và các ưu đãi ngắn hạn được gom về một chỗ để dễ dùng.',
      to: '/vouchers',
    },
  ]

  const cartCount = computed(() => cartStore.cartItems.length)

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

  const categoryCards = computed(() => {
    const source = Array.isArray(productStore.categories)
      ? productStore.categories
      : []

    return source.slice(0, 8).map(category => {
      let catImage = category.imageUrl

      if (!catImage) {
        const firstProduct = productStore.products.find(
          p =>
            p.categoryId === category.id
            || (p.category && p.category.id === category.id),
        )

        if (firstProduct) {
          catImage = getProductImage(firstProduct)
        }
      }

      if (!catImage) {
        catImage
          = 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80'
      }

      return {
        id: category.id,
        name: String(category.name || 'Danh mục').trim(),
        image: catImage,
      }
    })
  })

  const featuredProducts = computed(() => {
    return [...productStore.products].slice(0, 4)
  })

  function getBrandName (brandId) {
    const brand = productStore.brands.find(item => item.id === brandId)
    return brand?.name || 'SportX Select'
  }

  function getProductPrice (product) {
    const variant = productStore.variants.find(
      item => item.productId === product.id && item.price,
    )
    return variant?.price ?? product.price ?? 0
  }

  function getProductImage (product) {
    return getProductImageUrl({
      product,
      variants: productStore.variants,
      width: 800,
      height: 600,
    })
  }

  function formatMoney (value) {
    const amount = Number(value)
    if (!Number.isFinite(amount) || amount <= 0) {
      return 'Liên hệ'
    }

    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      maximumFractionDigits: 0,
    }).format(amount)
  }

  async function loadHomeData () {
    const tasks = []
    if (productStore.categories.length === 0)
      tasks.push(productStore.fetchCategories())
    if (productStore.products.length === 0)
      tasks.push(productStore.fetchProducts())
    if (productStore.variants.length === 0)
      tasks.push(productStore.fetchVariants())
    if (productStore.brands.length === 0) tasks.push(productStore.fetchBrands())
    await Promise.all(tasks)
  }

  async function loadUserData () {
    const rawUser = localStorage.getItem('user')
    if (!rawUser) return

    try {
      const user = JSON.parse(rawUser)
      isLoggedIn.value = true
      userName.value = user.username || 'Khách SportX'
      userEmail.value = user.gmail || user.email || ''
      userAvatar.value = user.imgUrl || ''

      // Kiểm tra và log để debug
      console.log('Loading vouchers for user:', user.id)

      // Thử các endpoint khác nhau
      try {
        // Cách 1: Dùng query param
        const response = await axios.get(`http://localhost:8080/api/vouchers`, {
          params: { accountId: user.id },
        })

        // Xử lý response
        if (response.data) {
          activeVouchers.value = Array.isArray(response.data)
            ? response.data.filter(v => v.status === 'ACTIVE')
            : []
        }
      } catch (error) {
        console.warn('Endpoint 1 failed:', error.message)

        try {
          // Cách 2: Dùng path variable
          const response2 = await axios.get(
            `http://localhost:8080/api/vouchers/user/${user.id}`,
          )
          if (response2.data) {
            activeVouchers.value = Array.isArray(response2.data)
              ? response2.data.filter(v => v.status === 'ACTIVE')
              : []
          }
        } catch (error) {
          console.warn('Endpoint 2 failed:', error.message)
          // Không hiển thị lỗi vì tính năng này không quan trọng
          activeVouchers.value = []
        }
      }
    } catch (error) {
      console.error('Error loading user data:', error)
      activeVouchers.value = []
    }
  }

  onMounted(async () => {
    resetInterval()
    await Promise.all([loadHomeData(), loadUserData()])
  })

  onUnmounted(() => {
    if (slideInterval) clearInterval(slideInterval)
  })

  function toggleUserMenu (event) {
    event.stopPropagation()
    showUserMenu.value = !showUserMenu.value
  }

  function copyCode (code) {
    navigator.clipboard.writeText(code)
    alert(`Đã sao chép mã ${code}`)
  }

  function handleLogout () {
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    window.location.reload()
  }
</script>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
