<template>
  <router-view />
  <AIChatbot v-if="!isAdminRoute" />
  <GlobalToasts />
</template>

<script setup>
  import { computed, onMounted, onUnmounted } from 'vue'
  import { useRoute } from 'vue-router'
  import AIChatbot from '@/components/AIChatbot.vue'
  import GlobalToasts from '@/components/GlobalToasts.vue'
  import { useGlobalNotifications } from '@/composables/useGlobalNotifications'

  const route = useRoute()
  const isAdminRoute = computed(() => route.path.startsWith('/admin'))
  
  const { startPolling, stopPolling } = useGlobalNotifications()
  
  onMounted(() => {
    startPolling()
  })
  
  onUnmounted(() => {
    stopPolling()
  })
</script>
