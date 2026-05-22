<template>
  <header class="retail-header">
    <div
      class="mx-auto flex w-full max-w-[1240px] items-center justify-between px-4 py-4 md:px-8 xl:px-10"
    >
      <div class="flex items-center gap-8">
        <router-link to="/" class="flex items-center gap-3 group">
          <div
            class="flex size-10 items-center justify-center rounded-2xl bg-primary text-white transition-transform group-hover:-rotate-6 group-hover:scale-105"
          >
            <span class="material-symbols-outlined text-xl">bolt</span>
          </div>
          <div>
            <p
              class="text-[11px] font-semibold uppercase tracking-[0.24em] text-primary"
            >
              Peak Seven
            </p>
            <h2
              class="font-headline text-[28px] uppercase leading-none tracking-tight text-slate-900 dark:text-white"
            >
              Sneaker Store
            </h2>
          </div>
        </router-link>

        <nav
          class="hidden items-center gap-7 text-sm font-medium text-slate-600 dark:text-[#d5c6b7] xl:flex"
        >
          <router-link to="/shop" class="hover:text-primary transition-colors"
            >Cửa Hàng</router-link
          >
          <router-link to="/brands" class="hover:text-primary transition-colors"
            >Thương hiệu</router-link
          >
          <router-link
            to="/vouchers"
            class="hover:text-primary transition-colors"
            >Ưu đãi</router-link
          >
          <router-link to="/about" class="hover:text-primary transition-colors"
            >Về Peak Seven</router-link
          >

          <router-link
            v-if="isAdmin"
            to="/admin"
            class="hover:text-primary transition-colors"
          >
            Vào Quản Trị
          </router-link>
        </nav>
      </div>

      <div class="flex items-center gap-3">
        <router-link
          to="/cart"
          class="relative flex size-11 items-center justify-center rounded-full border border-slate-200 bg-white/80 text-slate-700 transition-colors hover:border-primary hover:text-primary dark:border-[#3c342e] dark:bg-[#1f1a17] dark:text-white"
        >
          <span class="material-symbols-outlined">shopping_bag</span>
          <span
            v-if="cartCount > 0"
            class="absolute -right-1 -top-1 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white"
          >
            {{ cartCount }}
          </span>
        </router-link>

        <div v-if="isLoggedIn" ref="userMenuRef" class="relative">
          <button
            class="flex h-11 items-center gap-3 rounded-full border border-slate-200 bg-white/85 pl-2 pr-4 text-left shadow-sm transition-colors hover:border-primary dark:border-[#3c342e] dark:bg-[#1f1a17]"
            type="button"
            @click="toggleUserMenu"
          >
            <div
              class="flex size-8 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-xs font-bold uppercase text-primary"
            >
              <img
                v-if="resolvedUserAvatar"
                :src="resolvedUserAvatar"
                :alt="userName"
                class="h-full w-full object-cover"
              />
              <span v-else>{{ userInitials }}</span>
            </div>
            <div class="hidden sm:block">
              <p class="text-xs text-slate-500 dark:text-[#b5a99c]">
                Khách hàng thân thiết
              </p>
              <p class="text-sm font-semibold text-slate-900 dark:text-white">
                {{ userName }}
              </p>
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
