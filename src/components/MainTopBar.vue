<template>
  <header class="retail-header backdrop-blur-xl bg-[#0a0a0b]/80 sticky top-0 z-50 border-b border-[#27272a]">
    <div class="mx-auto flex w-full max-w-[1400px] items-center justify-between px-4 py-4 md:px-8 xl:px-10">
      
      <!-- 1. Logo (Left) -->
      <router-link to="/" class="flex items-center gap-3 group shrink-0">
        <div class="hidden sm:block">
          <p class="text-[10px] font-semibold uppercase tracking-[0.24em] text-primary">Peak Seven</p>
          <h2 class="font-headline text-[24px] uppercase leading-none tracking-tight text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">SPORT STORE</h2>
        </div>
      </router-link>

      <!-- 2. Centered Nav (Middle) -->
      <nav class="hidden flex-1 items-center justify-center xl:flex">
        <div class="flex items-center gap-8 rounded-full bg-[#18181b]/90 border border-[#27272a] px-8 py-3 shadow-glass text-[12px] font-medium tracking-wide text-[#a1a1aa]">
          <router-link to="/" class="hover:text-primary hover:drop-shadow-[0_0_8px_rgba(255,77,0,0.6)] transition-all text-white">Trang chủ</router-link>
          <router-link to="/shop" class="hover:text-primary hover:drop-shadow-[0_0_8px_rgba(255,77,0,0.6)] transition-all">Cửa Hàng</router-link>
          <router-link to="/brands" class="hover:text-primary hover:drop-shadow-[0_0_8px_rgba(255,77,0,0.6)] transition-all">Thương hiệu</router-link>
          <router-link to="/vouchers" class="hover:text-primary hover:drop-shadow-[0_0_8px_rgba(255,77,0,0.6)] transition-all">Khuyến mãi</router-link>
          <router-link to="/about" class="hover:text-primary hover:drop-shadow-[0_0_8px_rgba(255,77,0,0.6)] transition-all">Về Peak Seven</router-link>
          <router-link v-if="isAdmin" to="/admin" class="hover:text-primary hover:drop-shadow-[0_0_8px_rgba(255,77,0,0.6)] transition-all text-primary">Quản trị</router-link>
        </div>
      </nav>

      <!-- 3. Icons & Actions (Right) -->
      <div class="flex items-center justify-end gap-2 shrink-0">
        <!-- Search Icon (Mock) -->
        <button class="flex size-11 items-center justify-center rounded-full text-slate-300 hover:text-primary hover:bg-[#18181b] transition-colors">
          <span class="material-symbols-outlined">search</span>
        </button>

        <!-- Cart Icon -->
        <router-link to="/cart" class="relative flex size-11 items-center justify-center rounded-full text-slate-300 hover:text-primary hover:bg-[#18181b] transition-colors">
          <span class="material-symbols-outlined">shopping_bag</span>
          <span v-if="cartCount > 0" class="absolute right-1 top-2 flex size-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white shadow-neon">
            {{ cartCount }}
          </span>
        </router-link>

        <!-- User Menu -->
        <div v-if="isLoggedIn" ref="userMenuRef" class="relative ml-2">
          <button
            class="flex size-11 items-center justify-center rounded-full border border-[#27272a] bg-[#18181b] text-white hover:border-primary transition-colors"
            type="button"
            @click="toggleUserMenu"
          >
            <div
              class="flex size-8 items-center justify-center overflow-hidden rounded-full bg-primary/20 text-[10px] font-bold uppercase text-primary"
            >
              <img
                v-if="resolvedUserAvatar"
                :src="resolvedUserAvatar"
                :alt="userName"
                class="h-full w-full object-cover"
              />
              <span v-else>{{ userInitials }}</span>
            </div>
          </button>

          <div
            v-if="showUserMenu"
            class="absolute right-0 mt-3 w-64 rounded-3xl border border-slate-200 bg-[#fffdf8] p-3 shadow-card-warm dark:border-[#3c342e] dark:bg-[#1f1a17]"
          >
            <div class="rounded-2xl bg-[#f6efe6] px-4 py-3 dark:bg-[#2b241f]">
              <p class="text-[11px] uppercase tracking-[0.22em] text-primary">
                Tài khoản
              </p>
              <p
                class="mt-1 truncate text-sm font-semibold text-slate-900 dark:text-white"
              >
                {{ userEmail || "Không có email" }}
              </p>
            </div>
            <div class="mt-3 grid gap-1 text-sm">
              <router-link
                to="/profile"
                class="rounded-2xl px-4 py-3 font-medium hover:bg-primary/10"
                @click="showUserMenu = false"
                >Hồ sơ của tôi</router-link
              >
              <router-link
                to="/orders"
                class="block px-4 py-2 text-sm text-slate-700 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                Đơn hàng của tôi
              </router-link>
              <button
                type="button"
                class="rounded-2xl px-4 py-3 text-left font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                @click="handleLogout"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>

        <router-link
          v-else
          to="/login"
          class="inline-flex items-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
        >
          Đăng nhập
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";

import { useCartStore } from "@/stores/cart";
import { resolveBackendAssetUrl } from "@/services/api";

const cartStore = useCartStore();
const route = useRoute();
const router = useRouter();

const showUserMenu = ref(false);
const isLoggedIn = ref(false);
const userName = ref("Khách Peak Seven");
const userEmail = ref("");
const userAvatar = ref("");
const userMenuRef = ref(null);

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

function normalizeAvatarUrl(rawUrl) {
  if (!rawUrl || typeof rawUrl !== "string") {
    return "";
  }

  const fixedUrl = rawUrl.replace(
    /^https?:\/\/[^/]+\/?(https?:\/\/.+)$/i,
    "$1",
  );

  return resolveBackendAssetUrl(fixedUrl) || "";
}

const resolvedUserAvatar = computed(() => normalizeAvatarUrl(userAvatar.value));

function syncSession() {
  const rawUser = localStorage.getItem("user");
  const token = localStorage.getItem("token");

  if (!rawUser && !token) {
    isLoggedIn.value = false;
    userName.value = "Khách Peak Seven";
    userEmail.value = "";
    userAvatar.value = "";
    return;
  }

  isLoggedIn.value = true;

  if (!rawUser) return;

  try {
    const user = JSON.parse(rawUser);
    userName.value = user.username || "Khách Peak Seven";
    userEmail.value = user.gmail || user.email || "";
    userAvatar.value = user.imgUrl || "";
  } catch {
    userName.value = "Khách Peak Seven";
    userEmail.value = "";
    userAvatar.value = "";
  }
}

function toggleUserMenu(event) {
  event.stopPropagation();
  if (!isLoggedIn.value) {
    router.push("/login");
    return;
  }
  showUserMenu.value = !showUserMenu.value;
}

function handleOutsideClick(event) {
  if (!showUserMenu.value) return;
  if (userMenuRef.value && !userMenuRef.value.contains(event.target)) {
    showUserMenu.value = false;
  }
}

function handleLogout() {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  showUserMenu.value = false;
  syncSession();
  router.push("/login");
}

onMounted(() => {
  syncSession();
  window.addEventListener("click", handleOutsideClick);
});

onBeforeUnmount(() => {
  window.removeEventListener("click", handleOutsideClick);
});

watch(
  () => route.fullPath,
  () => {
    showUserMenu.value = false;
    syncSession();
  },
);

const isAdmin = computed(() => {
  const role = localStorage.getItem("userRole");
  return role === "ADMIN";
});
</script>
