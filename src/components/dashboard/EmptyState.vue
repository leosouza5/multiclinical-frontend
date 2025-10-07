<template>
  <div class="flex flex-col items-center justify-center text-center p-8 rounded-xl bg-white">
    <div class="h-12 w-12 rounded-xl bg-[#800000]/10 flex items-center justify-center mb-3">
      <component :is="icon" class="h-6 w-6 text-[#800000]" />
    </div>
    <h4 class="text-gray-900 font-semibold">{{ title }}</h4>
    <p class="text-gray-500 text-sm mt-1" v-if="description">{{ description }}</p>

    <div class="mt-4" v-if="actionText">
      <button
        class="inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium border border-[#800000] text-[#800000] hover:bg-[#800000]/10 transition"
        @click="$emit('action')"
      >
        {{ actionText }}
      </button>
    </div>

    <slot />
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  description: { type: String, default: '' },
  actionText: { type: String, default: '' },
  icon: { type: Object, default: null },
})
defineEmits(['action'])
</script>
