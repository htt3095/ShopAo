<template>
 <div class="retail-shell min-h-screen">
 <MainTopBar />

 <main class="mx-auto flex w-full max-w-[1240px] flex-col gap-10 px-4 py-10 md:px-8 xl:px-10">
 <section class="grid gap-6 lg:grid-cols-[1.06fr_0.94fr]">
 <article class="retail-card px-6 py-7 sm:px-8 lg:px-9 lg:py-9">
 <span class="retail-kicker">Trung tâm ưu đãi</span>
 <h1 class="retail-heading mt-4 text-[54px] leading-[0.92] text-slate-900 sm:text-[72px]">Tất cả mã giảm giá của bạn trong một nơi.</h1>
 <p class="mt-6 max-w-2xl text-base leading-8 text-slate-600 sm:text-lg">
 Kiểm tra mã còn dùng được, mã đã dùng và hạn áp dụng để chốt đơn nhanh hơn.
 </p>

 <div class="mt-8 grid gap-4 sm:grid-cols-3">
 <article class="rounded-[24px] border border-slate-200/70 bg-white/75 p-5">
 <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Đang hoạt động</p>
 <p class="mt-3 font-headline text-[42px] leading-none text-slate-900">{{ activeCount }}</p>
 </article>
 <article class="rounded-[24px] border border-slate-200/70 bg-white/75 p-5">
 <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Đã dùng</p>
 <p class="mt-3 font-headline text-[42px] leading-none text-slate-900">{{ usedCount }}</p>
 </article>
 <article class="rounded-[24px] border border-slate-200/70 bg-white/75 p-5">
 <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Tổng số mã</p>
 <p class="mt-3 font-headline text-[42px] leading-none text-slate-900">{{ vouchers.length }}</p>
 </article>
 </div>
 </article>

 <article class="retail-card overflow-hidden p-0">
 <div class="relative flex aspect-[4/5] min-h-[320px] h-full items-end overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(232,164,90,0.35),_transparent_45%),linear-gradient(135deg,_#1f2937,_#0f172a_58%,_#312e81)] p-8 lg:min-h-[430px]">
 <div class="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.08)_35%,transparent_70%)]"/>
 <div class="absolute right-8 top-8 flex size-24 items-center justify-center rounded-full border border-white/20 bg-white/10 text-slate-800 shadow-2xl backdrop-blur">
 <span class="material-symbols-outlined text-5xl">local_activity</span>
 </div>
 <div class="relative z-10 max-w-sm text-slate-800">
 <p class="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-800/70">Ưu đãi theo đơn hàng</p>
 <h2 class="mt-4 font-headline text-4xl leading-tight">Theo dõi điều kiện áp dụng trước khi sang checkout.</h2>
 <p class="mt-4 text-sm leading-7 text-slate-800/75">Mỗi voucher hiển thị mức giảm và đơn tối thiểu để bạn biết ngay mã nào còn dùng được với giỏ hàng hiện tại.</p>
 </div>
 </div>
 </article>
 </section>

 <section class="flex flex-wrap gap-4 border-b border-slate-300/70 pb-4">
 <button
 type="button"
 class="rounded-full px-5 py-3 text-sm font-semibold transition-colors"
 :class="currentTab ==='available'?'bg-primary text-white':'border border-slate-300 text-slate-700 hover:border-primary hover:text-primary'"
 @click="currentTab ='available'"
 >
 Đang khả dụng
 </button>
 <button
 type="button"
 class="rounded-full px-5 py-3 text-sm font-semibold transition-colors"
 :class="currentTab ==='history'?'bg-primary text-white':'border border-slate-300 text-slate-700 hover:border-primary hover:text-primary'"
 @click="currentTab ='history'"
 >
 Đã dùng và hết hạn
 </button>
 </section>

 <section v-if="isLoading"class="retail-card py-24 text-center">
 <p class="text-lg font-semibold text-slate-700">Đang tải vouchers...</p>
 </section>

 <section v-else-if="errorMessage"class="retail-card py-24 text-center">
 <span class="material-symbols-outlined text-7xl text-red-400 opacity-40">error</span>
 <p class="mt-4 text-lg font-semibold text-red-600">{{ errorMessage }}</p>
 </section>

 <section v-else-if="filteredVouchers.length > 0"class="grid grid-cols-1 gap-5 lg:grid-cols-2">
 <article v-for="voucher in filteredVouchers":key="voucher.id"class="retail-card overflow-hidden p-0">
 <div class="grid h-full grid-cols-[0.75fr_1.25fr]">
 <div class="flex items-center justify-center border-r border-dashed border-primary/30 bg-[#f6efe6] p-6">
 <div>
 <p class="text-[11px] uppercase tracking-[0.22em] text-primary">Mã ưu đãi</p>
 <h3 class="mt-3 text-2xl font-bold uppercase text-slate-900">{{ voucher.code }}</h3>
 </div>
 </div>

 <div class="flex flex-col justify-between px-6 py-6">
 <div>
 <div class="flex flex-wrap items-center justify-between gap-3">
 <p class="text-2xl font-semibold text-slate-900">Giảm {{ formatValue(voucher) }}</p>
 <span class="rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em]":class="getStatusBadge(voucher.status)">{{ getStatusLabel(voucher.status) }}</span>
 </div>
 <p class="mt-3 text-sm leading-6 text-slate-600">Hạn dùng đến {{ new Date(voucher.endDate).toLocaleDateString('vi-VN') }}.</p>
 <p class="mt-2 text-sm leading-6 text-slate-600">Đơn tối thiểu {{ formatMoney(voucher.minOrderValue) }}.</p>
 </div>

 <button
 v-if="voucher.status ==='ACTIVE'"
 type="button"
 class="mt-5 inline-flex w-full items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
 @click="copy(voucher.code)"
 >
 Sao chép mã
 </button>
 <div v-else class="mt-5 rounded-full border border-slate-300 px-5 py-3 text-center text-sm font-semibold text-slate-500">
 Mã hiện không còn dùng được
 </div>
 </div>
 </div>
 </article>
 </section>

 <section v-else class="retail-card py-24 text-center">
 <span class="material-symbols-outlined text-7xl text-slate-400 opacity-40">inventory_2</span>
 <p class="mt-4 text-lg font-semibold text-slate-700">Hiện chưa có voucher nào trong mục này.</p>
 </section>
 </main>
 </div>
</template>

<script setup>
import { computed, onMounted, ref } from'vue';
import { voucherAPI } from'@/services/orders';
import { orderUtils } from'@/services/orders';
import MainTopBar from'@/components/MainTopBar.vue';

const currentTab = ref('available');
const vouchers = ref([]);
const isLoading = ref(false);
const errorMessage = ref('');

const activeCount = computed(() => vouchers.value.filter((voucher) => voucher.status ==='ACTIVE').length);
const usedCount = computed(() => vouchers.value.filter((voucher) => ['USED','EXPIRED'].includes(voucher.status)).length);

const filteredVouchers = computed(() => {
 return currentTab.value ==='available'
 ? vouchers.value.filter((voucher) => ['ACTIVE','INACTIVE'].includes(voucher.status))
 : vouchers.value.filter((voucher) => ['USED','EXPIRED'].includes(voucher.status));
});

function normalizeVoucher(voucher) {
 // Prefer snake_case fields returned by backend SQL result.
 return {
 ...voucher,
 id: voucher.id,
 code: voucher.code,
 discountType: voucher.discount_type ?? voucher.discountType,
 discountValue: voucher.discount_value ?? voucher.discountValue,
 minOrderValue: voucher.min_order_value ?? voucher.minOrderValue,
 startDate: voucher.start_date ?? voucher.startDate,
 endDate: voucher.end_date ?? voucher.endDate,
 isActive: voucher.is_active ?? voucher.isActive ?? false,
 usedCount: voucher.used_count ?? voucher.usedCount ?? 0,
 usageLimit: voucher.usage_limit ?? voucher.usageLimit ?? null,
 };
}

function determineStatus(voucher) {
 const now = new Date();
 const startDate = new Date(voucher.startDate);
 const endDate = new Date(voucher.endDate);

 if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
 return'INACTIVE';
 }

 if (!voucher.isActive) return'INACTIVE';
 if (now > endDate) return'EXPIRED';
 if (now >= startDate && now <= endDate) return'ACTIVE';
 return'INACTIVE';
}

function formatMoney(value) {
 return orderUtils.formatPrice(Number(value || 0));
}

function formatValue(voucher) {
 return voucher.discountType ==='PERCENT'
 ? `${voucher.discountValue}%`
 : `${Number(voucher.discountValue || 0).toLocaleString('vi-VN')}đ`;
}

function getStatusBadge(status) {
 if (status ==='ACTIVE') return'bg-green-100 text-green-700';
 if (status ==='USED') return'bg-slate-200 text-slate-700';
 if (status ==='INACTIVE') return'bg-amber-100 text-amber-700';
 return'bg-red-100 text-red-700';
}

function getStatusLabel(status) {
 if (status ==='ACTIVE') return'Đang dùng';
 if (status ==='USED') return'Đã dùng';
 if (status ==='INACTIVE') return'Tạm khóa';
 return'Hết hạn';
}

function copy(code) {
 navigator.clipboard.writeText(code);
 alert(`Đã sao chép mã ${code}`);
}

onMounted(async () => {
 try {
 isLoading.value = true;
 const response = await voucherAPI.getAllVouchers();
 
 let voucherList = [];
 
 // Handle different response structures
 if (response.success && response.data) {
 voucherList = Array.isArray(response.data) ? response.data : [response.data];
 } else if (Array.isArray(response)) {
 voucherList = response;
 } else if (response.data && Array.isArray(response.data)) {
 voucherList = response.data;
 }
 
 // Normalize fields first, then compute status from normalized values.
 vouchers.value = voucherList.map((rawVoucher) => {
 const voucher = normalizeVoucher(rawVoucher);
 return {
 ...voucher,
 status: determineStatus(voucher)
 };
 });

 if (vouchers.value.length === 0) {
 errorMessage.value ='Bạn chưa có voucher nào';
 }
 } catch (error) {
 console.error('Error fetching vouchers:', error);
 errorMessage.value = error.message ||'Lỗi khi tải vouchers';
 vouchers.value = [];
 } finally {
 isLoading.value = false;
 }
});
</script>


