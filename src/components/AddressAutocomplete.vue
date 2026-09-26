<template>
  <div ref="inputContainer" class="relative w-full">
    <input
      ref="inputRef"
      :class="inputClass"
      :placeholder="placeholder"
      type="text"
      :value="modelValue"
      @blur="handleBlur"
      @focus="handleFocus"
      @input="handleInput"
      @keydown.esc="closeSuggestions"
      @keyup.enter="emit('enter')"
    >
  </div>

  <Teleport to="body">
    <ul
      v-if="suggestions.length > 0"
      class="fixed z-[9999] max-h-60 overflow-y-auto rounded-xl border border-slate-200 bg-white shadow-lg"
      :style="menuStyle"
    >
      <li
        v-for="(suggestion, index) in suggestions"
        :key="suggestion.place_id || index"
        class="flex cursor-pointer items-start gap-3 border-b border-slate-100 px-4 py-3 text-sm hover:bg-slate-50 last:border-0"
        @mousedown.prevent="selectSuggestion(suggestion)"
      >
        <span class="material-symbols-outlined mt-0.5 text-[18px] text-slate-400">location_on</span>
        <span class="min-w-0 flex-1 leading-snug text-slate-700">{{ suggestion.display_name }}</span>
      </li>
    </ul>
  </Teleport>
</template>

<script setup>
  import { computed, onMounted, onUnmounted, ref } from 'vue'

  const props = defineProps({
    modelValue: { type: String, default: '' },
    placeholder: { type: String, default: '' },
    inputClass: { type: String, default: '' },
    queryContext: { type: String, default: '' },
  })

  const emit = defineEmits(['update:modelValue', 'select', 'blur', 'enter'])
  const inputContainer = ref(null)
  const inputRef = ref(null)
  const suggestions = ref([])
  const menuPosition = ref({ top: 0, left: 0, width: 0 })
  let debounceTimer = null
  let blurTimer = null
  let lastRequestAt = 0
  let requestVersion = 0

  const menuStyle = computed(() => ({
    top: `${menuPosition.value.top}px`,
    left: `${menuPosition.value.left}px`,
    width: `${menuPosition.value.width}px`,
  }))

  function updateMenuPosition () {
    const rect = inputRef.value?.getBoundingClientRect()
    if (!rect) return
    const width = Math.min(Math.max(rect.width, 320), window.innerWidth - 16)
    const left = Math.max(8, Math.min(rect.left, window.innerWidth - width - 8))
    menuPosition.value = { top: rect.bottom + 6, left, width }
  }

  function handleInput (event) {
    const value = event.target.value
    const currentRequestVersion = ++requestVersion
    emit('update:modelValue', value)
    if (debounceTimer) clearTimeout(debounceTimer)
    if (value.trim().length < 3) {
      suggestions.value = []
      return
    }

    debounceTimer = setTimeout(async () => {
      try {
        const elapsed = Date.now() - lastRequestAt
        if (elapsed < 1100) {
          await new Promise(resolve => setTimeout(resolve, 1100 - elapsed))
        }
        if (currentRequestVersion !== requestVersion) return

        const query = [value.trim(), props.queryContext].filter(Boolean).join(', ')
        const url = `/photon/api/?limit=5&q=${encodeURIComponent(query + ', Việt Nam')}`
        lastRequestAt = Date.now()
        let response = await fetch(url)
        if (response.status === 429) {
          await new Promise(resolve => setTimeout(resolve, 1200))
          if (currentRequestVersion !== requestVersion) return
          lastRequestAt = Date.now()
          response = await fetch(url)
        }
        if (!response.ok || currentRequestVersion !== requestVersion) return
        const payload = await response.json()
        suggestions.value = (payload.features || []).map(normalizePhotonSuggestion)
        updateMenuPosition()
      } catch (error) {
        console.error('Lỗi lấy gợi ý địa chỉ', error)
      }
    }, 500)
  }

  function normalizePhotonSuggestion (feature) {
    const properties = feature?.properties || {}
    const address = {
      house_number: properties.housenumber,
      road: properties.street,
      suburb: properties.district,
      city: properties.city,
      state: properties.state,
      postcode: properties.postcode,
      country: properties.country,
    }
    const firstLine = properties.name
      || [properties.housenumber, properties.street].filter(Boolean).join(' ')
    const displayName = [
      firstLine,
      properties.district,
      properties.city,
      properties.state,
      properties.postcode,
      properties.country,
    ].filter(Boolean).join(', ')

    return {
      ...feature,
      address,
      display_name: displayName || properties.name || 'Địa điểm được chọn',
      lat: feature?.geometry?.coordinates?.[1],
      lon: feature?.geometry?.coordinates?.[0],
    }
  }

  function handleFocus () {
    updateMenuPosition()
  }

  function handleBlur () {
    blurTimer = setTimeout(() => {
      closeSuggestions()
      emit('blur')
    }, 200)
  }

  function selectSuggestion (suggestion) {
    if (blurTimer) clearTimeout(blurTimer)
    emit('update:modelValue', suggestion.display_name || '')
    emit('select', suggestion)
    closeSuggestions()
  }

  function closeSuggestions () {
    suggestions.value = []
  }

  function handleViewportChange () {
    if (suggestions.value.length > 0) updateMenuPosition()
  }

  onMounted(() => {
    window.addEventListener('resize', handleViewportChange)
    window.addEventListener('scroll', handleViewportChange, true)
  })

  onUnmounted(() => {
    if (debounceTimer) clearTimeout(debounceTimer)
    if (blurTimer) clearTimeout(blurTimer)
    window.removeEventListener('resize', handleViewportChange)
    window.removeEventListener('scroll', handleViewportChange, true)
  })
</script>
