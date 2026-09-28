<template>
  <div class="relative" v-click-outside="closeDropdown">
    <button 
      class="relative flex size-11 items-center justify-center rounded-full text-slate-500 hover:text-primary hover:bg-slate-100 transition-colors"
      type="button" 
      @click="toggleDropdown"
    >
      <span class="material-symbols-outlined">notifications</span>
      <span v-if="unreadCount > 0" class="absolute right-2 top-2 flex size-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white shadow-neon">
        {{ unreadCount }}
      </span>
    </button>

    <div v-if="isOpen" class="absolute right-0 mt-3 w-80 max-w-[90vw] rounded-2xl border border-slate-200 bg-white p-2 shadow-xl z-[100]">
      <div class="flex items-center justify-between px-3 py-2 border-b border-slate-100">
        <h4 class="font-bold text-slate-800">Thông báo</h4>
        <button 
          v-if="unreadCount > 0" 
          class="text-[11px] font-semibold text-primary hover:underline"
          @click="markAllAsRead"
        >
          Đánh dấu đã đọc
        </button>
      </div>
      <div class="max-h-[350px] overflow-y-auto custom-scrollbar p-1 mt-1 space-y-1">
        <div 
          v-for="notif in notifications" 
          :key="notif.id"
          class="rounded-xl p-3 transition-colors text-sm"
          :class="notif.read ? 'bg-white hover:bg-slate-50' : 'bg-primary/5 hover:bg-primary/10'"
        >
          <div class="flex items-center gap-2 mb-1">
            <span v-if="notif.type === 'success'" class="material-symbols-outlined text-[16px] text-green-500">check_circle</span>
            <span v-else-if="notif.type === 'warning'" class="material-symbols-outlined text-[16px] text-orange-500">warning</span>
            <span v-else class="material-symbols-outlined text-[16px] text-blue-500">info</span>
            <h5 class="font-bold text-slate-800" :class="{'text-primary': !notif.read}">{{ notif.title }}</h5>
          </div>
          <p class="text-[12px] text-slate-600 pl-6">{{ notif.message }}</p>
          <p class="text-[10px] text-slate-400 pl-6 mt-1">{{ new Date(notif.createdAt).toLocaleTimeString('vi-VN') }}</p>
        </div>
        <div v-if="notifications.length === 0" class="text-center py-6 text-slate-400 text-sm">
          Chưa có thông báo nào
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useGlobalNotifications } from '@/composables/useGlobalNotifications'

// A simple click-outside directive equivalent for Vue 3 setup
const vClickOutside = {
  mounted(el, binding) {
    el.clickOutsideEvent = function(event) {
      // check if click was outside the el and its children
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event, el)
      }
    }
    document.body.addEventListener('click', el.clickOutsideEvent)
  },
  unmounted(el) {
    document.body.removeEventListener('click', el.clickOutsideEvent)
  }
}

const { notifications, unreadCount, markAllAsRead } = useGlobalNotifications()
const isOpen = ref(false)

function toggleDropdown() {
  isOpen.value = !isOpen.value
  if (isOpen.value && unreadCount.value > 0) {
    // Optionally mark all as read when opened
    // markAllAsRead() 
  }
}

function closeDropdown() {
  isOpen.value = false
}
</script>

<style scoped>
.custom-scrollbar {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e1 transparent;
}
.shadow-neon {
  box-shadow: 0 0 8px rgba(239, 68, 68, 0.6);
}
</style>
