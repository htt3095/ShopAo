<template>
  <router-view />
  <AIChatbot v-if="!isAdminRoute" />
</template>

<script setup>
import { computed } from "vue";
import { useRoute } from "vue-router";
import AIChatbot from "@/components/AIChatbot.vue";

const route = useRoute();
const isAdminRoute = computed(() => route.path.startsWith("/admin"));
</script>
