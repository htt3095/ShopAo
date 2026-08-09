<template>
 <div class="retail-shell min-h-screen">
 <MainTopBar />

 <main class="mx-auto flex w-full max-w-[1240px] flex-col gap-6 px-4 py-8 md:px-8 xl:px-10">
 <section class="retail-card overflow-hidden p-0">
 <div class="grid gap-0 lg:grid-cols-[1.12fr_0.88fr] lg:items-stretch">
 <div class="px-4 py-4 sm:px-5 lg:px-6 lg:py-5">
 <div class="flex flex-wrap items-center gap-3">
 <span class="retail-kicker">Danh mục thương hiệu</span>
 </div>

 <h1 class="retail-heading mt-3 text-[28px] leading-tight text-slate-900 sm:text-[34px]">
 Chọn thương hiệu bạn muốn xem
 </h1>
 <p class="mt-2 max-w-lg text-sm leading-6 text-slate-600">
 Nếu bạn đã có hãng mình thích, đây là cách nhanh nhất để đi thẳng tới đúng nhóm sản phẩm mà không cần tìm vòng quanh.
 </p>

 <p class="mt-3 max-w-xl text-sm leading-6 text-slate-600">
 Chỉ cần chọn thương hiệu quen thuộc, nhìn logo một chút là bạn có thể mở ngay nhóm sản phẩm tương ứng trong cửa hàng và tiếp tục mua sắm nhanh hơn.
 </p>
 </div>

 <div class="border-t border-slate-200/70 bg-[#f7efe7] lg:border-l lg:border-t-0">
 <img
 src="https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=1400&q=80"
 alt="Cận cảnh áo thể thao SportX"
 class="h-[150px] w-full object-cover sm:h-[180px] lg:h-full lg:min-h-[210px]"
 />
 <div class="border-t border-slate-200/70 bg-white px-4 py-2 sm:px-5">
 <p class="text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">SportX Brands</p>
 <p class="mt-1 text-sm leading-5 text-slate-600">
 Một góc nhìn nhỏ để trang bớt khô, còn phần chọn thương hiệu vẫn là trọng tâm chính.
 </p>
 </div>
 </div>
 </div>
 </section>

 <section v-if="loading"class="retail-card py-24 text-center">
 <div class="mx-auto inline-block h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
 <p class="mt-4 text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">Đang tải danh sách thương hiệu</p>
 </section>

 <section v-else-if="error"class="retail-card py-24 text-center text-red-600">
 <span class="material-symbols-outlined text-7xl opacity-30">error</span>
 <p class="mt-4 text-lg font-semibold">{{ error }}</p>
 </section>

 <section v-else>
 <div v-if="paginatedBrands.length > 0"class="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
 <router-link
 v-for="brand in paginatedBrands"
 :key="brand.id"
 :to="{ name:'shop', query: { brandId: String(brand.id) } }"
 class="retail-card group overflow-hidden p-0 transition-transform hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
 >
 <div class="flex aspect-[16/10] items-center justify-center bg-[#f7efe7] p-8 transition-colors group-hover:bg-[#f2e5d9]">
 <img :src="getBrandImageUrl(brand.logoUrl)":alt="brand.name"class="max-h-full max-w-full object-contain"@error="handleImageError"/>
 </div>
 <div class="border-t border-slate-200/70 px-6 py-5">
 <p class="text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">Thương hiệu</p>
 <h3 class="mt-2 text-2xl font-semibold text-slate-900">{{ brand.name }}</h3>
 <p class="mt-2 text-sm leading-6 text-slate-600">Có mặt trong hệ sinh thái SportX để bạn lọc nhanh theo hãng yêu thích.</p>
 <span class="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-transform group-hover:translate-x-1">
 Xem tại cửa hàng
 <span class="material-symbols-outlined text-[18px]">arrow_outward</span>
 </span>
 </div>
 </router-link>
 </div>

 <div v-else class="retail-card py-24 text-center">
 <span class="material-symbols-outlined text-7xl text-slate-400 opacity-40">inventory_2</span>
 <p class="mt-4 text-lg font-semibold text-slate-700">Hiện chưa có thương hiệu nào để hiển thị.</p>
 </div>

 <div v-if="totalPages > 1"class="mt-10 flex flex-wrap items-center justify-center gap-3">
 <button
 type="button"
 class="inline-flex items-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
 :disabled="currentPage === 1"
 @click="previousPage"
 >
 <span class="material-symbols-outlined text-[18px]">chevron_left</span>
 Trước
 </button>

 <button
 v-for="page in displayedPages"
 :key="page"
 type="button"
 :class="page === currentPage ?'bg-primary text-white border-primary':'border-slate-300 text-slate-700 hover:border-primary hover:text-primary'"
 class="inline-flex h-11 w-11 items-center justify-center rounded-full border text-sm font-semibold transition-colors"
 @click="goToPage(page)"
 >
 {{ page }}
 </button>

 <button
 type="button"
 class="inline-flex items-center rounded-full border border-slate-300 px-5 py-3 text-sm font-semibold transition-colors hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
 :disabled="currentPage === totalPages"
 @click="nextPage"
 >
 Sau
 <span class="material-symbols-outlined text-[18px]">chevron_right</span>
 </button>
 </div>

 <p class="mt-5 text-center text-sm text-slate-500">
 Hiển thị {{ (currentPage - 1) * itemsPerPage + 1 }} - {{ Math.min(currentPage * itemsPerPage, brands.length) }} trên tổng {{ brands.length }} thương hiệu.
 </p>
 </section>
 </main>
 </div>
</template>

<script setup>
import { computed, onMounted, ref } from'vue';

import { brandsApi } from'@/services/api';

const brands = ref([]);
const loading = ref(true);
const error = ref('');
const currentPage = ref(1);
const itemsPerPage = 6;

const totalPages = computed(() => Math.max(1, Math.ceil(brands.value.length / itemsPerPage)));

const paginatedBrands = computed(() => {
 const start = (currentPage.value - 1) * itemsPerPage;
 return brands.value.slice(start, start + itemsPerPage);
});

const displayedPages = computed(() => {
 const pages = [];
 const maxDisplayed = 5;
 let startPage = Math.max(1, currentPage.value - Math.floor(maxDisplayed / 2));
 let endPage = Math.min(totalPages.value, startPage + maxDisplayed - 1);

 if (endPage - startPage < maxDisplayed - 1) {
 startPage = Math.max(1, endPage - maxDisplayed + 1);
 }

 for (let page = startPage; page <= endPage; page += 1) {
 pages.push(page);
 }

 return pages;
});

function getBrandImageUrl(logoUrl) {
 if (!logoUrl) return'';
 if (logoUrl.startsWith('http://') || logoUrl.startsWith('https://')) return logoUrl;
 if (logoUrl.startsWith('/images/')) return `http://localhost:8080${logoUrl}`;
 return `http://localhost:8080/images/${logoUrl}`;
}

function handleImageError(event) {
 event.target.style.display ='none';
 const container = event.target.parentElement;
 if (container) {
 container.innerHTML ='<div class="text-4xl font-black text-slate-400">?</div>';
 }
}

function nextPage() {
 if (currentPage.value >= totalPages.value) return;
 currentPage.value += 1;
 window.scrollTo({ top: 0, behavior:'smooth'});
}

function previousPage() {
 if (currentPage.value <= 1) return;
 currentPage.value -= 1;
 window.scrollTo({ top: 0, behavior:'smooth'});
}

function goToPage(page) {
 currentPage.value = page;
 window.scrollTo({ top: 0, behavior:'smooth'});
}

onMounted(async () => {
 try {
 loading.value = true;
 const data = await brandsApi.getAll();
 brands.value = Array.isArray(data?.list) ? data.list : Array.isArray(data) ? data : [];
 } catch (fetchError) {
 console.error('Error fetching brands:', fetchError);
 error.value ='Không thể tải danh sách thương hiệu. Bạn thử lại sau nhé.';
 } finally {
 loading.value = false;
 }
});
</script>


