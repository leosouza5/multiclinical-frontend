<template>
  <div class="bg-white border border-gray-200 rounded-xl shadow-sm">
    <div class="px-6 pt-5 pb-0">
      <h3 class="flex items-center gap-2 text-gray-900 font-semibold">
        <component :is="icon" class="h-5 w-5 text-[#800000]" />
        {{ title }}
      </h3>
    </div>

    <div class="p-6 space-y-4">
      <div
        v-for="(item, index) in data"
        :key="item.nome"
        class="space-y-2"
      >
        <div class="flex items-center justify-between text-sm">
          <span class="text-gray-900 font-medium pr-2">{{ item.nome }} - {{ item.nome }}</span>
          <div class="text-right">
            <div class="text-gray-900 font-semibold">{{ formatValue(item.valor) }}</div>
            <div class="text-gray-500 text-xs">{{ item.porcentagem }}%</div>
          </div>
        </div>

        <div class="w-full bg-gray-100 rounded-full h-2">
          <div
            class="h-2 rounded-full transition-all duration-300"
            :style="{
              width: (item.porcentagem || 0) + '%',
              backgroundColor: barColors[index % barColors.length]
            }"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
/**
 * Props:
 * - title: string
 * - data: Array<{ nome: string, valor: number, porcentagem: number }>
 * - formatValue: (value: number) => string
 * - icon: Componente (ex.: de 'lucide-vue-next')
 */
defineProps({
  title: { type: String, required: true },
  data: {
    type: Array,
    required: true,
    // esperado: [{ nome, valor, porcentagem }]
  },
  formatValue: { type: Function, required: true },
  icon: { type: Object, required: true },
})

// Paleta alinhada ao MultiClinical (bordô #800000 e variações)
const barColors = [
  '#800000', // primária
  '#9A1A1A',
  '#B23C3C',
  '#CC6B6B',
  '#E6A8A8',
]
</script>
