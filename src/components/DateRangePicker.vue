<template>
  <div class="flex items-center gap-2">
    <Calendar class="h-4 w-4 text-gray-500" />
    <input
      type="date"
      :value="dateRange.from"
      @change="onFromChange"
      class="bg-white border border-gray-300 rounded-md px-3 py-1 text-sm"
    />
    <span class="text-gray-500">até</span>
    <input
      type="date"
      :value="dateRange.to"
      @change="onToChange"
      class="bg-white border border-gray-300 rounded-md px-3 py-1 text-sm"
    />
  </div>
</template>

<script setup>
import { Calendar } from 'lucide-vue-next'

const props = defineProps({
  dateRange: { type: Object, required: true } // { from: 'YYYY-MM-DD', to: 'YYYY-MM-DD' }
})
const emit = defineEmits(['update:dateRange'])

function onFromChange(e) {
  emit('update:dateRange', { ...props.dateRange, from: e.target.value })
}
function onToChange(e) {
  emit('update:dateRange', { ...props.dateRange, to: e.target.value })
}
</script>
