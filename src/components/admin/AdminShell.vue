<template>
  <div class="retail-shell">
    <header class="retail-header">
      <div
        class="mx-auto flex w-full max-w-[1400px] items-center justify-between px-4 py-3 md:px-6"
      >
        <div class="flex items-center gap-3">
          <div
            class="flex size-10 items-center justify-center rounded-2xl bg-primary text-white"
          >
            <span class="material-symbols-outlined text-xl"
              >admin_panel_settings</span
            >
          </div>
          <div>
            <p class="text-[11px] uppercase tracking-[0.2em] text-primary">
              Peak Seven
            </p>
            <h1 class="text-lg font-bold leading-none">Bảng quản trị</h1>
          </div>
        </div>

        <div class="flex items-center gap-3">
          <p class="hidden text-sm text-slate-600 dark:text-[#b9aa9a] md:block">
            Xin chào,
            <span class="font-semibold text-slate-900 dark:text-white">{{
              currentUserName
            }}</span>
          </p>

          <button
            type="button"
            class="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium transition-colors hover:border-red-500 hover:text-red-500 dark:border-[#3c342e] dark:bg-[#1f1a17]"
            @click="handleLogout"
          >
            <span class="material-symbols-outlined text-[18px]">logout</span>
            Đăng xuất
          </button>
        </div>
      </div>
    </header>

    <div class="mx-auto flex w-full max-w-[1400px] gap-6 px-4 py-6 md:px-6">
      <aside class="hidden w-72 shrink-0 lg:block">
        <div class="retail-card p-3">
          <nav class="grid gap-1">
            <router-link
              v-for="item in navItems"
              :key="item.path"
              :to="item.path"
              class="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors"
              :class="
                isActive(item.path)
                  ? 'bg-primary text-white'
                  : 'text-slate-700 hover:bg-primary/10 hover:text-primary dark:text-[#d5c6b7]'
              "
            >
              <span class="material-symbols-outlined text-[20px]">{{
                item.icon
              }}</span>
              <span>{{ item.label }}</span>
            </router-link>

            <router-link
              to="/"
              class="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100 hover:text-primary dark:text-[#d5c6b7] dark:hover:bg-[#2b241f]"
            >
              <span class="material-symbols-outlined text-[20px]"
                >storefront</span
              >
              <span>Về Trang chủ</span>
            </router-link>
          </nav>
        </div>
      </aside>

      <section class="min-w-0 flex-1 space-y-6">
        <div class="overflow-x-auto lg:hidden">
          <div class="flex gap-2">
            <router-link
              v-for="item in navItems"
              :key="`mobile-${item.path}`"
              :to="item.path"
              class="inline-flex items-center gap-2 whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition-colors"
              :class="
                isActive(item.path)
                  ? 'bg-primary text-white'
                  : 'bg-white text-slate-700 dark:bg-[#1f1a17] dark:text-[#d5c6b7]'
              "
            >
              <span class="material-symbols-outlined text-[16px]">{{
                item.icon
              }}</span>
              <span>{{ item.label }}</span>
            </router-link>

            <router-link
              to="/"
              class="inline-flex items-center gap-2 whitespace-nowrap rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-700 transition-colors hover:bg-slate-50 hover:text-primary dark:border-[#3c342e] dark:bg-[#1f1a17] dark:text-[#d5c6b7]"
            >
              <span class="material-symbols-outlined text-[16px]"
                >storefront</span
              >
              <span>Về cửa hàng</span>
            </router-link>
          </div>
        </div>

        <header v-if="$slots.header" class="retail-card p-5 md:p-6">
          <slot name="header" />
        </header>

        <slot />
      </section>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const navItems = [
  { path: "/admin", label: "Tổng quan", icon: "dashboard" },
  { path: "/admin/pos", label: "Bán hàng POS", icon: "point_of_sale" },
  { path: "/admin/orders", label: "Đơn hàng", icon: "shopping_bag" },
  { path: "/admin/inventory", label: "Sản phẩm & Tồn kho", icon: "inventory_2" },
  { path: "/admin/categories", label: "Danh mục", icon: "category" },
  { path: "/admin/brands", label: "Thương hiệu", icon: "branding_watermark" },
  { path: "/admin/customers", label: "Khách hàng", icon: "group" },
  { path: "/admin/vouchers", label: "Voucher", icon: "local_activity" },
  { path: "/admin/reports", label: "Báo cáo", icon: "bar_chart" },
  { path: "/admin/settings", label: "Cài đặt", icon: "settings" },
];

const currentUserName = computed(() => {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return "Admin";
    const parsed = JSON.parse(raw);
    return parsed.username || parsed.gmail || "Admin";
  } catch {
    return "Admin";
  }
});

function isActive(path) {
  if (path === "/admin") {
    return route.path === "/admin";
  }
  return route.path.startsWith(path);
}

function handleLogout() {
  localStorage.removeItem("user");
  localStorage.removeItem("userRole");
  localStorage.removeItem("token");
  router.push({ name: "login" });
}
</script>
