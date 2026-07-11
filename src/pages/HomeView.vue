<template>
  <div class="retail-shell flex flex-col overflow-x-hidden antialiased">
    <MainTopBar />

    <main class="flex-1 pb-16">
      <section
        class="mx-auto grid w-full max-w-[1240px] grid-cols-1 gap-6 px-4 pt-8 md:px-8 lg:grid-cols-[1.28fr_0.72fr] xl:px-10"
      >
        <div
          class="retail-card bg-grid-soft overflow-hidden px-6 py-7 sm:px-8 lg:px-9 lg:py-10"
        >
          <span class="retail-kicker">Áo cho lịch trình mỗi ngày</span>
          <div class="mt-6 max-w-2xl">
            <h1
              class="retail-heading text-[46px] leading-[0.95] text-slate-900 dark:text-white sm:text-[62px]"
            >
              Chọn chiếc Áo
              <span class="text-primary">đúng form</span>
              cho từng ngày.
            </h1>
            <p
              class="mt-5 max-w-xl text-base leading-7 text-slate-600 dark:text-[#d5c6b7] sm:text-lg"
            >
              Từ đi làm, đi học đến chạy bộ cuối tuần, Peak Seven sắp sẵn các
              nhóm Áo dễ chọn, giá rõ ràng và lối mua nhanh để bạn tìm được
              đôi phù hợp mà không phải cuộn quá nhiều.
            </p>
          </div>

          <div class="mt-8 flex flex-wrap gap-4">
            <router-link
              to="/shop"
              class="inline-flex items-center rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-neon transition-all hover:-translate-y-1 hover:shadow-[0_0_25px_rgba(255,77,0,0.5)]"
              >Mua ngay</router-link
            >
            <router-link
              to="/size-guide"
              class="inline-flex items-center rounded-full border border-[#3f3f46] px-8 py-3.5 text-sm font-bold text-white transition-all hover:border-primary hover:text-primary bg-[#18181b]/50"
              >Xem bảng size</router-link
            >
          </div>
        </div>

        <div class="grid gap-6">
          <article class="retail-card p-6 sm:p-7">
            <p
              class="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary"
            >
              Lối vào nhanh
            </p>
            <h2
              class="mt-3 font-headline text-[40px] uppercase leading-none text-slate-900 dark:text-white"
            >
              Bắt đầu mua theo nhu cầu
            </h2>
            <p
              class="mt-4 text-sm leading-7 text-slate-600 dark:text-[#cabdae]"
            >
              Chọn điểm bắt đầu phù hợp để vào đúng trang bạn cần ngay từ đầu.
            </p>

            <div class="mt-6 grid gap-3">
              <router-link
                to="/shop"
                class="group inline-flex items-center justify-between rounded-xl px-2 py-2 text-sm font-semibold text-slate-900 transition-colors hover:text-primary dark:text-white"
              >
                Xem toàn bộ sản phẩm
                <span
                  class="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1"
                  >arrow_forward</span
                >
              </router-link>
              <router-link
                to="/size-guide"
                class="group inline-flex items-center justify-between rounded-xl border-t border-slate-200 px-2 py-3 text-sm font-semibold text-slate-900 transition-colors hover:text-primary dark:border-[#3c342e] dark:text-white"
              >
                Xem bảng size trước khi mua
                <span
                  class="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1"
                  >arrow_forward</span
                >
              </router-link>
              <router-link
                to="/vouchers"
                class="group inline-flex items-center justify-between rounded-xl border-t border-slate-200 px-2 py-3 text-sm font-semibold text-slate-900 transition-colors hover:text-primary dark:border-[#3c342e] dark:text-white"
              >
                Kiểm tra ưu đãi đang áp dụng
                <span
                  class="material-symbols-outlined text-lg transition-transform group-hover:translate-x-1"
                  >arrow_forward</span
                >
              </router-link>
            </div>
          </article>
        </div>
      </section>

      <section class="mx-auto mt-8 w-full max-w-[1240px] px-4 md:px-8 xl:px-10">
        <div class="grid gap-5 md:grid-cols-3">
          <article
            v-for="item in categoryShortcuts"
            :key="item.title"
            class="retail-card flex items-center justify-between gap-5 px-6 py-5"
          >
            <div>
              <p
                class="text-[11px] font-semibold uppercase tracking-[0.22em] text-primary"
              >
                {{ item.kicker }}
              </p>
              <h3
                class="mt-2 text-xl font-semibold text-slate-900 dark:text-white"
              >
                {{ item.title }}
              </h3>
              <p
                class="mt-2 text-sm leading-6 text-slate-600 dark:text-[#cabdae]"
              >
                {{ item.description }}
              </p>
            </div>
            <router-link
              :to="item.to"
              class="inline-flex size-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary transition-colors hover:bg-primary hover:text-white"
            >
              <span class="material-symbols-outlined">arrow_forward</span>
            </router-link>
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
              class="retail-heading mt-4 text-[42px] leading-none text-slate-900 dark:text-white"
            >
              Chọn nhanh theo nhu cầu
            </h2>
          </div>
          <p
            class="max-w-xl text-sm leading-6 text-slate-600 dark:text-[#cabdae]"
          >
            Mỗi danh mục dẫn thẳng đến trang mua hàng để bạn lọc và xem giá
            ngay, không mất thêm thao tác vòng.
          </p>
        </div>

        <div class="grid grid-cols-2 gap-5 lg:grid-cols-4">
          <router-link
            v-for="cat in categoryCards"
            :key="cat.id"
            :to="{ path: '/shop', query: { categoryId: String(cat.id) } }"
            class="group overflow-hidden rounded-[30px]"
          >
            <div class="retail-card h-full overflow-hidden p-0">
              <div class="aspect-[4/5] overflow-hidden">
                <img
                  :src="cat.image"
                  :alt="cat.name"
                  class="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div class="px-5 py-5">
                <p class="text-[11px] uppercase tracking-[0.22em] text-primary">
                  Danh mục
                </p>
                <h3
                  class="mt-2 text-lg font-semibold text-slate-900 dark:text-white"
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
              class="retail-heading mt-4 text-[42px] leading-none text-slate-900 dark:text-white"
            >
              Mẫu đang được quan tâm
            </h2>
          </div>
          <router-link
            to="/shop"
            class="text-sm font-semibold text-primary hover:underline"
            >Xem toàn bộ cửa hàng</router-link
          >
        </div>

        <div class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          <article
            v-for="product in featuredProducts"
            :key="product.id"
            class="retail-card overflow-hidden p-0 transition-transform hover:-translate-y-1"
          >
            <router-link :to="`/product/${product.id}`" class="block">
              <div
                class="aspect-[5/4] overflow-hidden bg-[#ece4da] dark:bg-[#2b241f]"
              >
                <img
                  :src="getProductImage(product)"
                  :alt="product.name"
                  class="h-full w-full object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
            </router-link>
            <div class="px-5 py-5">
              <p
                class="text-xs font-medium uppercase tracking-[0.16em] text-slate-500 dark:text-[#cabdae]"
              >
                {{ getBrandName(product.brandId) }}
              </p>
              <router-link
                :to="`/product/${product.id}`"
                class="mt-2 block min-h-[52px] text-lg font-semibold leading-6 text-slate-900 transition-colors hover:text-primary dark:text-white"
                >{{ product.name }}</router-link
              >
              <div class="mt-4 flex items-center justify-between">
                <div>
                  <p
                    class="text-xs uppercase tracking-[0.18em] text-slate-400 dark:text-[#a8988a]"
                  >
                    Giá tham khảo
                  </p>
                  <p
                    class="mt-1 text-xl font-semibold text-slate-900 dark:text-white"
                  >
                    {{ formatMoney(getProductPrice(product)) }}
                  </p>
                </div>
                <router-link
                  :to="`/product/${product.id}`"
                  class="inline-flex size-11 items-center justify-center rounded-full bg-primary text-white transition-colors hover:bg-[#a84f24]"
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
                class="retail-heading mt-4 text-[38px] leading-none text-slate-900 dark:text-white"
              >
                Mã giảm giá đang khả dụng
              </h2>
            </div>
            <router-link
              to="/vouchers"
              class="text-sm font-semibold text-primary hover:underline"
              >Xem trung tâm voucher</router-link
            >
          </div>

          <div class="grid gap-4 md:grid-cols-3">
            <article
              v-for="voucher in activeVouchers.slice(0, 3)"
              :key="voucher.id"
              class="rounded-[26px] border border-dashed border-primary/30 bg-[#f6efe6] p-5 dark:bg-[#2b241f]"
            >
              <div class="flex items-start justify-between gap-4">
                <div>
                  <p
                    class="text-[11px] uppercase tracking-[0.22em] text-primary"
                  >
                    Mã áp dụng
                  </p>
                  <h3
                    class="mt-2 text-2xl font-bold text-slate-900 dark:text-white"
                  >
                    {{ voucher.code }}
                  </h3>
                </div>
                <button
                  type="button"
                  class="inline-flex size-10 items-center justify-center rounded-full bg-white text-primary shadow-sm transition-colors hover:bg-primary hover:text-white dark:bg-[#1f1a17]"
                  @click="copyCode(voucher.code)"
                >
                  <span class="material-symbols-outlined">content_copy</span>
                </button>
              </div>
              <p
                class="mt-4 text-sm leading-6 text-slate-600 dark:text-[#cabdae]"
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
import { computed, onMounted, ref } from "vue";
import axios from "axios";

import { useCartStore } from "@/stores/cart";
import { useProductStore } from "@/stores/products";
import { getProductImageUrl } from "@/utils/productImages";

const cartStore = useCartStore();
const productStore = useProductStore();

const isLoggedIn = ref(false);
const showUserMenu = ref(false);
const userName = ref("");
const userEmail = ref("");
const userAvatar = ref("");
const activeVouchers = ref([]);

const categoryShortcuts = [
  {
    kicker: "Tập luyện",
    title: "Áo chạy bộ",
    description:
      "Ưu tiên chất vải thoáng mát, form áo thể thao linh hoạt cho lịch chạy hàng tuần.",
    to: "/shop",
  },
  {
    kicker: "Đi làm, đi chơi",
    title: "Áo mang hàng ngày",
    description:
      "Màu trung tính, dễ phối đồ, không quá thể thao nhưng vẫn đủ thoải mái để mặc cả ngày dài.",
    to: "/shop",
  },
  {
    kicker: "Tiết kiệm hơn",
    title: "Ưu đãi thành viên",
    description:
      "Mã giảm giá, đợt xả size và các ưu đãi ngắn hạn được gom về một chỗ để dễ dùng.",
    to: "/vouchers",
  },
];

const cartCount = computed(() => cartStore.cartItems.length);

const userInitials = computed(() => {
  if (!userName.value) return "PS";
  return userName.value
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
});

const categoryCards = computed(() => {
  const source = Array.isArray(productStore.categories)
    ? productStore.categories
    : [];

  return source.slice(0, 8).map((category) => {
    let catImage = category.imageUrl;

    if (!catImage) {
      const firstProduct = productStore.products.find(
        (p) =>
          p.categoryId === category.id ||
          (p.category && p.category.id === category.id),
      );

      if (firstProduct) {
        catImage = getProductImage(firstProduct);
      }
    }

    if (!catImage) {
      catImage =
        "https://images.unsplash.com/photo-1576566588028-4147f3842f27?auto=format&fit=crop&w=800&q=80";
    }

    return {
      id: category.id,
      name: String(category.name || "Danh mục").trim(),
      image: catImage,
    };
  });
});

const featuredProducts = computed(() => {
  return [...productStore.products].slice(0, 4);
});

function getBrandName(brandId) {
  const brand = productStore.brands.find((item) => item.id === brandId);
  return brand?.name || "Peak Seven Select";
}

function getProductPrice(product) {
  const variant = productStore.variants.find(
    (item) => item.productId === product.id && item.price,
  );
  return variant?.price ?? product.price ?? 0;
}

function getProductImage(product) {
  return getProductImageUrl({
    product,
    variants: productStore.variants,
    width: 800,
    height: 600,
  });
}

function formatMoney(value) {
  const amount = Number(value);
  if (!Number.isFinite(amount) || amount <= 0) {
    return "Liên hệ";
  }

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(amount);
}

async function loadHomeData() {
  const tasks = [];
  if (productStore.categories.length === 0)
    tasks.push(productStore.fetchCategories());
  if (productStore.products.length === 0)
    tasks.push(productStore.fetchProducts());
  if (productStore.variants.length === 0)
    tasks.push(productStore.fetchVariants());
  if (productStore.brands.length === 0) tasks.push(productStore.fetchBrands());
  await Promise.all(tasks);
}

async function loadUserData() {
  const rawUser = localStorage.getItem("user");
  if (!rawUser) return;

  try {
    const user = JSON.parse(rawUser);
    isLoggedIn.value = true;
    userName.value = user.username || "Khách Peak Seven";
    userEmail.value = user.gmail || user.email || "";
    userAvatar.value = user.imgUrl || "";

    // Kiểm tra và log để debug
    console.log("Loading vouchers for user:", user.id);

    // Thử các endpoint khác nhau
    try {
      // Cách 1: Dùng query param
      const response = await axios.get(`http://localhost:8080/api/vouchers`, {
        params: { accountId: user.id },
      });

      // Xử lý response
      if (response.data) {
        activeVouchers.value = Array.isArray(response.data)
          ? response.data.filter((v) => v.status === "ACTIVE")
          : [];
      }
    } catch (err1) {
      console.warn("Endpoint 1 failed:", err1.message);

      try {
        // Cách 2: Dùng path variable
        const response2 = await axios.get(
          `http://localhost:8080/api/vouchers/user/${user.id}`,
        );
        if (response2.data) {
          activeVouchers.value = Array.isArray(response2.data)
            ? response2.data.filter((v) => v.status === "ACTIVE")
            : [];
        }
      } catch (err2) {
        console.warn("Endpoint 2 failed:", err2.message);
        // Không hiển thị lỗi vì tính năng này không quan trọng
        activeVouchers.value = [];
      }
    }
  } catch (error) {
    console.error("Error loading user data:", error);
    activeVouchers.value = [];
  }
}

onMounted(async () => {
  await Promise.all([loadHomeData(), loadUserData()]);
});

function toggleUserMenu(event) {
  event.stopPropagation();
  showUserMenu.value = !showUserMenu.value;
}

function copyCode(code) {
  navigator.clipboard.writeText(code);
  alert(`Đã sao chép mã ${code}`);
}

function handleLogout() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  window.location.reload();
}
</script>
