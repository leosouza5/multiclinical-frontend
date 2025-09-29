<template>
  <div class="min-h-screen bg-white">
    <!-- Header (padrão do dashboard) -->
    <div class="border-b border-gray-200 bg-white">
      <div class="flex h-16 items-center px-6">
        <div class="ml-auto flex items-center gap-4">
          <DateRangePicker :dateRange="dateRange" @update:dateRange="val => Object.assign(dateRange, val)" />
          <button class="inline-flex items-center justify-center rounded-md px-3 py-2 text-sm font-medium border border-[#800000] text-[#800000] hover:bg-[#800000]/10 transition" @click="atualizarDados" :disabled="loading">
            {{ loading ? 'Carregando...' : 'Atualizar Dados' }}
          </button>
        </div>
      </div>
    </div>

    <div class="p-6 space-y-6">
      <!-- Métricas Principais (MetricCard padrão) -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard title="Atendimentos" :value="totalAtendimentos.toLocaleString('pt-BR')" :icon="Users" />
        <MetricCard title="Bruto" :value="formatCurrency(totalBruto)" :icon="Receipt" />
        <MetricCard title="Descontos" :value="formatCurrency(totalDesconto)" :icon="Percent" />
        <MetricCard title="Líquido" :value="formatCurrency(totalLiquido)" :icon="Wallet" />
        <MetricCard title="Ticket Médio (Liq.)" :value="formatCurrency(ticketMedio)" :icon="Activity" />
      </div>

      <!-- Tabela principal (compacta, sem paginação local) -->
      <div class="bg-white rounded-md shadow-[var(--shadow-card)] border border-line">
        <div class="flex items-center justify-between px-4 py-3 border-b border-line/60">
          <div>
            <h2 class="font-semibold">Atendimentos do Período</h2>
            <p class="text-sm text-gray-500">Filtro: {{ dateRange.from }} a {{ dateRange.to }} · Registros: {{ rows.length }}</p>
          </div>
          <div class="flex items-center gap-2">
            <button class="px-3 py-2 rounded-lg border border-line hover:bg-gray-50" @click="exportCSV">Exportar CSV</button>
          </div>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full text-sm">
            <thead class="bg-gray-50 border-b border-line text-gray-600">
              <tr class="text-left text-gray-600 border-b bg-gray-50">
                <th class="px-3 py-2">Data</th>
                <th class="px-3 py-2">Cliente</th>
                <th class="px-3 py-2">Convênio</th>
                <th class="px-3 py-2">Clínica</th>
                <th class="px-3 py-2">Tipo</th>
                <th class="px-3 py-2">Procedimento</th>
                <th class="px-3 py-2 text-right">Bruto</th>
                <th class="px-3 py-2 text-right">Desconto</th>
                <th class="px-3 py-2 text-right">Líquido</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in rows" :key="row.id_atendimento" class="border-b last:border-0 hover:bg-gray-50">
                <td class="px-3 py-2 whitespace-nowrap">{{ formatDate(row.data_atendimento) }}</td>
                <td class="px-3 py-2">{{ row.cliente && row.cliente.nome_cliente }}</td>
                <td class="px-3 py-2">{{ row.convenio && row.convenio.nome_convenio }}</td>
                <td class="px-3 py-2">{{ row.clinica && row.clinica.nome_clinica }}</td>
                <td class="px-3 py-2">{{ row.tipo_atendimento && row.tipo_atendimento.nome_tipo_atendimento }}</td>
                <td class="px-3 py-2">{{ row.procedimento && row.procedimento.nome_procedimento }}</td>
                <td class="px-3 py-2 text-right">{{ formatCurrency(row.valor_bruto) }}</td>
                <td class="px-3 py-2 text-right">{{ formatCurrency(row.desconto) }}</td>
                <td class="px-3 py-2 text-right font-medium">{{ formatCurrency(row.valor_liquido) }}</td>
              </tr>
              <tr v-if="!rows.length && !loading">
                <td colspan="9" class="px-3 py-6 text-center text-gray-500">Nenhum registro para o período selecionado.</td>
              </tr>
              <tr v-if="loading">
                <td colspan="9" class="px-3 py-6 text-center text-gray-500">Carregando...</td>
              </tr>
            </tbody>
            <tfoot class="bg-gray-50">
              <tr class="text-sm">
                <td colspan="6" class="px-3 py-2 text-right font-medium"></td>
                <td class="px-3 py-2 text-right font-medium">{{ formatCurrency(totalBruto) }}</td>
                <td class="px-3 py-2 text-right font-medium">{{ formatCurrency(totalDesconto) }}</td>
                <td class="px-3 py-2 text-right font-semibold text-[#800000]">{{ formatCurrency(totalLiquido) }}</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      <!-- Quebras gerenciais (cards padrão) -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="bg-white rounded-md shadow-[var(--shadow-card)] border border-line overflow-hidden">
          <div class="flex items-center justify-between px-4 py-3 border-b border-line/60">
            <h3 class="font-semibold">Por Convênio</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead class="bg-gray-50 border-b border-line text-gray-600">
                <tr class="text-left text-gray-600 border-b bg-gray-50">
                  <th class="px-3 py-2">Descrição</th>
                  <th class="px-3 py-2 text-right">Qtde</th>
                  <th class="px-3 py-2 text-right">Bruto</th>
                  <th class="px-3 py-2 text-right">Desconto</th>
                  <th class="px-3 py-2 text-right">Líquido</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="r in groupedConvenio" :key="r.label" class="border-b last:border-0 hover:bg-gray-50">
                  <td class="px-3 py-2">{{ r.label }}</td>
                  <td class="px-3 py-2 text-right">{{ r.count }}</td>
                  <td class="px-3 py-2 text-right">{{ formatCurrency(r.bruto) }}</td>
                  <td class="px-3 py-2 text-right">{{ formatCurrency(r.desconto) }}</td>
                  <td class="px-3 py-2 text-right font-medium">{{ formatCurrency(r.liquido) }}</td>
                </tr>
                <tr v-if="!groupedConvenio.length && !loading">
                  <td colspan="5" class="px-3 py-4 text-center text-gray-500">Sem dados para o filtro.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="bg-white rounded-md shadow-[var(--shadow-card)] border border-line overflow-hidden">
          <div class="flex items-center justify-between px-4 py-3 border-b border-line/60">
            <h3 class="font-semibold">Por Clínica</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead class="bg-gray-50 border-b border-line text-gray-600">
                <tr class="text-left text-gray-600 border-b bg-gray-50">
                  <th class="px-3 py-2">Descrição</th>
                  <th class="px-3 py-2 text-right">Qtde</th>
                  <th class="px-3 py-2 text-right">Bruto</th>
                  <th class="px-3 py-2 text-right">Desconto</th>
                  <th class="px-3 py-2 text-right">Líquido</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="r in groupedClinica" :key="r.label" class="border-b last:border-0 hover:bg-gray-50">
                  <td class="px-3 py-2">{{ r.label }}</td>
                  <td class="px-3 py-2 text-right">{{ r.count }}</td>
                  <td class="px-3 py-2 text-right">{{ formatCurrency(r.bruto) }}</td>
                  <td class="px-3 py-2 text-right">{{ formatCurrency(r.desconto) }}</td>
                  <td class="px-3 py-2 text-right font-medium">{{ formatCurrency(r.liquido) }}</td>
                </tr>
                <tr v-if="!groupedClinica.length && !loading">
                  <td colspan="5" class="px-3 py-4 text-center text-gray-500">Sem dados para o filtro.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="bg-white rounded-md shadow-[var(--shadow-card)] border border-line overflow-hidden">
          <div class="flex items-center justify-between px-4 py-3 border-b border-line/60">
            <h3 class="font-semibold">Por Tipo de Atendimento</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead class="bg-gray-50 border-b border-line text-gray-600">
                <tr class="text-left text-gray-600 border-b bg-gray-50">
                  <th class="px-3 py-2">Descrição</th>
                  <th class="px-3 py-2 text-right">Qtde</th>
                  <th class="px-3 py-2 text-right">Bruto</th>
                  <th class="px-3 py-2 text-right">Desconto</th>
                  <th class="px-3 py-2 text-right">Líquido</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="r in groupedTipo" :key="r.label" class="border-b last:border-0 hover:bg-gray-50">
                  <td class="px-3 py-2">{{ r.label }}</td>
                  <td class="px-3 py-2 text-right">{{ r.count }}</td>
                  <td class="px-3 py-2 text-right">{{ formatCurrency(r.bruto) }}</td>
                  <td class="px-3 py-2 text-right">{{ formatCurrency(r.desconto) }}</td>
                  <td class="px-3 py-2 text-right font-medium">{{ formatCurrency(r.liquido) }}</td>
                </tr>
                <tr v-if="!groupedTipo.length && !loading">
                  <td colspan="5" class="px-3 py-4 text-center text-gray-500">Sem dados para o filtro.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div class="bg-white rounded-md shadow-[var(--shadow-card)] border border-line overflow-hidden">
          <div class="flex items-center justify-between px-4 py-3 border-b border-line/60">
            <h3 class="font-semibold">Por Procedimento</h3>
          </div>
          <div class="overflow-x-auto">
            <table class="min-w-full text-sm">
              <thead class="bg-gray-50 border-b border-line text-gray-600">
                <tr class="text-left text-gray-600 border-b bg-gray-50">
                  <th class="px-3 py-2">Descrição</th>
                  <th class="px-3 py-2 text-right">Qtde</th>
                  <th class="px-3 py-2 text-right">Bruto</th>
                  <th class="px-3 py-2 text-right">Desconto</th>
                  <th class="px-3 py-2 text-right">Líquido</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="r in groupedProcedimento" :key="r.label" class="border-b last:border-0 hover:bg-gray-50">
                  <td class="px-3 py-2">{{ r.label }}</td>
                  <td class="px-3 py-2 text-right">{{ r.count }}</td>
                  <td class="px-3 py-2 text-right">{{ formatCurrency(r.bruto) }}</td>
                  <td class="px-3 py-2 text-right">{{ formatCurrency(r.desconto) }}</td>
                  <td class="px-3 py-2 text-right font-medium">{{ formatCurrency(r.liquido) }}</td>
                </tr>
                <tr v-if="!groupedProcedimento.length && !loading">
                  <td colspan="5" class="px-3 py-4 text-center text-gray-500">Sem dados para o filtro.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, reactive, onMounted } from 'vue'
import MetricCard from '@/components/dashboard/MetricCard.vue'
import DateRangePicker from '@/components/DateRangePicker.vue'
import { Users, Wallet, Receipt, Percent, Activity } from 'lucide-vue-next'
import { useRelatoriosAtendimentosStore } from '@/stores/relatorios.js'

const store = useRelatoriosAtendimentosStore()
const loading = computed(() => store.loading)

// --- período padrão: últimos 30 dias ---
function toInput(d) { return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().split('T')[0] }
const today = new Date()
const thirtyDaysAgo = new Date(); thirtyDaysAgo.setDate(today.getDate() - 30)

const dateRange = reactive({ from: toInput(thirtyDaysAgo), to: toInput(today) })

// dados
const rows = computed(() => store.items)

// KPIs
const totalAtendimentos = computed(() => rows.value.length)
const totalBruto = computed(() => rows.value.reduce((s, r) => s + Number(r.valor_bruto||0), 0))
const totalDesconto = computed(() => rows.value.reduce((s, r) => s + Number(r.desconto||0), 0))
const totalLiquido = computed(() => rows.value.reduce((s, r) => s + Number(r.valor_liquido||0), 0))
const ticketMedio = computed(() => totalAtendimentos.value ? totalLiquido.value / totalAtendimentos.value : 0)

// Quebras
function groupByLabel(rows, path){
  const map = new Map()
  rows.forEach((r)=>{ const key = path.reduce((a,k)=> (a && a[k]!==undefined? a[k]: undefined), r) || '—'
    const ref = map.get(key) || { label:key, bruto:0, desconto:0, liquido:0, count:0 }
    ref.bruto += Number(r.valor_bruto||0); ref.desconto += Number(r.desconto||0); ref.liquido += Number(r.valor_liquido||0); ref.count++
    map.set(key, ref)
  })
  return Array.from(map.values()).sort((a,b)=> b.liquido - a.liquido)
}
const groupedConvenio = computed(()=> groupByLabel(rows.value, ['convenio','nome_convenio']))
const groupedClinica = computed(()=> groupByLabel(rows.value, ['clinica','nome_clinica']))
const groupedTipo = computed(()=> groupByLabel(rows.value, ['tipo_atendimento','nome_tipo_atendimento']))
const groupedProcedimento = computed(()=> groupByLabel(rows.value, ['procedimento','nome_procedimento']))

// ações
function formatCurrency(value){ return new Intl.NumberFormat('pt-BR',{ style:'currency', currency:'BRL'}).format(value||0) }
function formatDate(iso){ const d = new Date(iso); return Number.isNaN(d.getTime()) ? '—' : d.toLocaleDateString('pt-BR') }

async function atualizarDados(){
  await store.load({
    inicio: dateRange.from,
    fim: dateRange.to,
    page: 1,
    per_page: 200,
    order_by: 'valor_liquido',
    order_dir: 'desc',
  })
}

onMounted(atualizarDados)
</script>

<style scoped>
</style>
