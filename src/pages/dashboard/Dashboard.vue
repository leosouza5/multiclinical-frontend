<template>
  <div class="min-h-screen bg-white">
    <!-- Header -->
    <div class="border-b border-gray-200 bg-white">
      <div class="flex h-16 items-center px-6">
        <div class="ml-auto flex items-center gap-4">
          <DateRangePicker :dateRange="dateRange" @update:dateRange="val => Object.assign(dateRange, val)" />
          <button class="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium
                   border border-[#800000] text-[#800000] hover:bg-[#800000]/10 transition" @click="atualizarDados"
            :disabled="loading">
            {{ loading ? 'Carregando...' : 'Atualizar Dados' }}
          </button>
        </div>
      </div>
    </div>

    <div class="p-6 space-y-6">
      <!-- Métricas Principais -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total de Atendimentos" :value="totalAtendimentos.toLocaleString('pt-BR')" :icon="Users" />
        <MetricCard title="Faturamento Bruto" :value="formatCurrency(faturamentoBruto)" :icon="TrendingUp" />
        <MetricCard title="Faturamento Líquido" :value="formatCurrency(faturamentoLiquido)" :icon="DollarSign" />
        <MetricCard title="Ticket Médio" :value="formatCurrency(ticketMedio)" :icon="Activity" />
      </div>

      <!-- Gráficos -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Faturamento por Convênio" :data="porConvenio" :formatValue="formatCurrency"
          :icon="FileText" />
        <ChartCard title="Faturamento por Clínica" :data="porClinica" :formatValue="formatCurrency" :icon="Building2" />
        <ChartCard title="Faturamento por Tipo de Atendimento" :data="porTipoAtendimento" :formatValue="formatCurrency"
          :icon="Stethoscope" />
        <ChartCard title="Faturamento por Procedimento" :data="porProcedimento" :formatValue="formatCurrency"
          :icon="Activity" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive } from 'vue'
import { Activity, Users, TrendingUp, DollarSign, Building2, Stethoscope, FileText } from 'lucide-vue-next'

import DateRangePicker from '@/components/DateRangePicker.vue'
import MetricCard from '@/components/dashboard/MetricCard.vue'
import ChartCard from '@/components/dashboard/ChartCard.vue'

import { useDashboardStore } from '@/stores/dashboard.js'

const store = useDashboardStore()

// --- período padrão: últimos 30 dias ---
const today = new Date()
const thirtyDaysAgo = new Date()
thirtyDaysAgo.setDate(today.getDate() - 30)

function toISOLocal(d) {
  // garante que '2025-09-01' não retroceda por timezone
  const off = d.getTimezoneOffset()
  const local = new Date(d.getTime() - off * 60000)
  return local.toISOString()
}
function toInput(d) {
  return d.toISOString().split('T')[0]
}

const dateRange = reactive({
  from: toInput(thirtyDaysAgo),
  to: toInput(today),
})

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value || 0)
}

const loading = computed(() => store.loading)

const totalAtendimentos = computed(() => store.totalAtendimentos)
const faturamentoBruto = computed(() => store.faturamentoBruto)
const faturamentoLiquido = computed(() => store.faturamentoLiquido)
const ticketMedio = computed(() => store.ticketMedio)

const porConvenio = computed(() => store.porConvenioChart)
const porClinica = computed(() => store.porClinicaChart)
const porTipoAtendimento = computed(() => store.porTipoAtendimentoChart)
const porProcedimento = computed(() => store.porProcedimentoChart)

async function atualizarDados() {
  await store.loadResumo({
    inicio: toInput(new Date(dateRange.from)),
    fim: toInput(new Date(dateRange.to)),
  })
}

onMounted(atualizarDados)
</script>
