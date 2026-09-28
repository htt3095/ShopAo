<template>
  <div class="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2">
    <TransitionGroup name="toast">
      <div 
        v-for="toast in toasts" 
        :key="toast.id" 
        class="min-w-[300px] max-w-[400px] rounded-xl bg-white p-4 shadow-2xl border-l-4"
        :class="{
          'border-green-500': toast.type === 'success',
          'border-orange-500': toast.type === 'warning',
          'border-blue-500': toast.type !== 'success' && toast.type !== 'warning'
        }"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="flex-1">
            <h4 class="font-bold text-slate-800">{{ toast.title }}</h4>
            <p class="text-sm text-slate-600 mt-1">{{ toast.message }}</p>
          </div>
          <button class="text-slate-400 hover:text-slate-600" @click="removeToast(toast.id)">
            <span class="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import { useGlobalNotifications } from '@/composables/useGlobalNotifications'
const { toasts, removeToast } = useGlobalNotifications()
</script>

<style scoped>
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}
.toast-enter-from {
  opacity: 0;
  transform: translateX(100%);
}
.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
