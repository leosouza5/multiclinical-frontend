<template>
  <div class="bg-white border border-gray-200 rounded-xl shadow-sm">
    <div class="p-6">
      <div class="flex items-center justify-between">
        <div class="space-y-2">
          <p class="text-sm font-medium text-gray-500">{{ title }}</p>
          <p class="text-2xl font-bold text-gray-900">{{ value }}</p>

          
        </div>

        <div class="h-12 w-12 rounded-lg bg-[#800000]/10 flex items-center justify-center">
          <component :is="icon" class="h-6 w-6 text-[#800000]" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { TrendingUp, TrendingDown } from 'lucide-vue-next'

defineProps({
  title: String,
  value: String,
  icon: Object,
  trend: String,
  trendUp: Boolean,
})
</script>
