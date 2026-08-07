<template>
  <router-link
    :to="{ name: 'product-detail', params: { id: product.id } }"
    class="chat-product-card group flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-2.5 transition-all hover:border-primary/50 hover:shadow-md dark:border-[#3c342e] dark:bg-[#1f1a17] dark:hover:border-primary/50"
  >
    <div
      class="size-14 flex-shrink-0 overflow-hidden rounded-lg bg-slate-100 dark:bg-[#2b241f]"
    >
      <img
        v-if="resolvedImage"
        :src="resolvedImage"
        :alt="product.name"
        class="h-full w-full object-cover transition-transform group-hover:scale-110"
        @error="handleImageError"
      />
      <div
        v-else
        class="flex h-full w-full items-center justify-center text-slate-400"
      >
        <span class="material-symbols-outlined text-[20px]">checkroom</span>
      </div>
    </div>

    <div class="min-w-0 flex-1">
      <p
        class="line-clamp-2 text-sm font-semibold leading-tight text-slate-800 dark:text-white"
      >
        {{ product.name || "Sản phẩm" }}
      </p>
      <p v-if="formattedPrice" class="mt-0.5 text-xs font-bold text-primary">
        {{ formattedPrice }}
      </p>
    </div>

    <div
      class="flex-shrink-0 rounded-lg bg-primary/10 p-1.5 text-primary transition-colors group-hover:bg-primary group-hover:text-white"
    >
      <span class="material-symbols-outlined text-[16px]">arrow_forward</span>
    </div>
  </router-link>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  product: {
    type: Object,
    required: true,
  },
});

const imgBroken = ref(false);

const resolvedImage = computed(() => {
  if (imgBroken.value) return null;
  const url =
    props.product._imageUrl ||
    props.product.imageUrl ||
    props.product.image_url ||
    props.product.imgUrl ||
    null;
  return url || null;
});

function handleImageError() {
  imgBroken.value = true;
}

const formattedPrice = computed(() => {
  const price = Number(
    props.product._minPrice || props.product.price || props.product.minPrice || 0,
  );
  if (!Number.isFinite(price) || price === 0) return null;
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  }).format(price);
});
</script>
