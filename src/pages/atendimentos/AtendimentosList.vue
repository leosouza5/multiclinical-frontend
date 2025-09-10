<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-3">
      <h1 class="text-2xl font-bold">Atendimentos</h1>
      <RouterLink to="/atendimentos/new" class="px-3 py-2 rounded-lg bg-brand text-white hover:bg-brand-600">
        + Novo Atendimento
      </RouterLink>
    </div>
    <p class="text-md text-gray-500 mb-4">
      Gerencie todos os atendimentos
    </p>

    <!-- Barra de filtros -->
    <div class="bg-white border border-line rounded-xl p-3 md:p-4 mb-4 shadow-[var(--shadow-card)]">
      <!-- Busca -->
      <div class="relative mb-3">
        <input v-model="q" placeholder="Buscar por paciente, clínica, convênio, procedimento…"
          class="w-full border border-line rounded-lg px-4 py-2 pl-11 focus:outline-none focus:ring-2 focus:ring-brand/30" />
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
          <Search />
        </span>
      </div>

      <!-- (Opcional) Segmento de status -->
      <!--
      <div class="flex items-center gap-2">
        <span class="text-sm text-gray-500 mr-1">Status:</span>
        <div class="inline-flex rounded-lg border border-line p-0.5 bg-gray-50">
          <button
            class="px-3 py-1.5 rounded-md text-sm transition"
            :class="status === '' ? 'bg-white shadow border border-line' : 'text-gray-600 hover:bg-white'"
            @click="setStatus('')"
          >
            Todos
          </button>
          <button
            class="px-3 py-1.5 rounded-md text-sm transition"
            :class="status === 'REALIZADO' ? 'bg-white shadow border border-line' : 'text-gray-600 hover:bg-white'"
            @click="setStatus('REALIZADO')"
          >
            Realizados
          </button>
          <button
            class="px-3 py-1.5 rounded-md text-sm transition"
            :class="status === 'PENDENTE' ? 'bg-white shadow border border-line' : 'text-gray-600 hover:bg-white'"
            @click="setStatus('PENDENTE')"
          >
            Pendentes
          </button>
        </div>
      </div>
      -->
    </div>

    <!-- Tabela -->
    <div class="bg-white rounded-md shadow-[var(--shadow-card)] border border-line overflow-hidden">
      <div class="flex-1 overflow-x-auto overflow-y-auto min-h-[500px]">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-line text-gray-600">
            <tr>
              <th class="text-left px-4 py-2 w-[60px]">#</th>
              <th class="text-left px-4 py-2">Paciente</th>
              <th class="text-left px-4 py-2">Clínica / Convênio</th>
              <th class="text-left px-4 py-2">Procedimento / Tipo</th>
              <th class="text-left px-4 py-2">Data</th>
              <th class="text-left px-4 py-2">Valor</th>
              <!-- <th class="text-left px-4 py-2">Status</th> -->
              <th class="px-4 py-2 text-center w-0">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(a, i) in filtered" :key="getId(a)" class="border-t border-line hover:bg-gray-50/60">
              <td class="px-4 py-3">{{ i + 1 }}</td>
              <td class="px-4 py-3">
                <div class="font-medium text-gray-900">{{ getPacienteNome(a) }}</div>
                <div class="text-sm text-gray-500">{{ getPacienteCPF(a) }}</div>
              </td>
              <td class="px-4 py-3">
                <div class="text-gray-900">{{ getClinicaNome(a) }}</div>
                <div class="text-sm text-gray-500">{{ getConvenioNome(a) }}</div>
              </td>
              <td class="px-4 py-3">
                <div class="text-gray-900">{{ getProcedimentoNome(a) }}</div>
                <div class="text-sm text-gray-500">{{ getTipoNome(a) }}</div>
              </td>
              <td class="px-4 py-3">{{ formatDate(getDataHora(a)) }}</td>
              <td class="px-4 py-3">{{ currency(getValor(a)) }}</td>
              <!-- <td class="px-4 py-3">
                <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs border"
                  :class="isRealizado(a) ? 'text-green-700 border-green-300 bg-green-50' : 'text-gray-600 border-gray-300 bg-gray-50'">
                  {{ isRealizado(a) ? 'REALIZADO' : 'PENDENTE' }}
                </span>
              </td> -->
              <td class="px-4 py-3 text-center">
                <Menu as="div" class="relative inline-block text-left">
                  <MenuButton
                    class="inline-flex items-center justify-center size-8 rounded-md border border-line hover:bg-gray-100 focus:outline-none"
                    aria-label="Ações">
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="5" cy="12" r="2" />
                      <circle cx="12" cy="12" r="2" />
                      <circle cx="19" cy="12" r="2" />
                    </svg>
                  </MenuButton>

                  <MenuItems
                    class="absolute right-0 mt-2 w-44 origin-top-right rounded-md border border-line bg-white shadow-[var(--shadow-card)] focus:outline-none z-50">
                    <div class="p-1">
                      <MenuItem v-slot="{ active }">
                      <button @click="router.push(`/atendimentos/${getId(a)}/edit`)" class="w-full text-left px-3 py-2 text-sm rounded-md"
                        :class="active ? 'bg-gray-50' : ''">
                        Editar
                      </button>
                      </MenuItem>
                      <MenuItem v-slot="{ active }">
                      <button @click="askDelete(a)" class="w-full text-left px-3 py-2 text-sm rounded-md text-red-700"
                        :class="active ? 'bg-red-50' : ''">
                        Excluir
                      </button>
                      </MenuItem>
                    </div>
                  </MenuItems>
                </Menu>
              </td>
            </tr>

            <tr v-if="filtered.length === 0">
              <td colspan="8" class="px-4 py-6 text-center text-gray-500">
                Nenhum atendimento encontrado
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de confirmação -->
    <AppModal :open="confirmOpen" title="Excluir atendimento"
      :description="`Tem certeza que deseja excluir o atendimento de ${confirmName}? Essa ação não poderá ser desfeita.`"
      cancelText="Cancelar" confirmText="Excluir" :confirmLoading="confirmLoading" @close="confirmOpen = false"
      @confirm="confirmDelete" />
  </div>
</template>

<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useAtendimentosStore } from "@/stores/atendimentos";
import AppModal from "@/components/AppModal.vue";
import { useNotify } from "@/stores/notify";
import { Search } from "lucide-vue-next";

const router = useRouter();
const store = useAtendimentosStore();
const notify = useNotify();

const loading = ref(false);
const q = ref("");
const status = ref(""); // '', 'REALIZADO', 'PENDENTE'
function setStatus(s) { status.value = s; }

const items = ref([]);

// -------- Helpers (normalizam campos vindos do back) --------
function getId(a) {
  return a.id_atendimento ?? a.id ?? null;
}

function getPacienteNome(a) {
  return a.cliente?.nome_cliente ?? a.nome_cliente ?? a.paciente_nome ?? "";
}

function maskCPF(v) {
  const d = String(v || "").replace(/\D/g, "").slice(0, 11);
  if (d.length <= 3) return d;
  if (d.length <= 6) return d.replace(/(\d{3})(\d{0,3})/, "$1.$2");
  if (d.length <= 9) return d.replace(/(\d{3})(\d{3})(\d{0,3})/, "$1.$2.$3");
  return d.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, "$1.$2.$3-$4");
}

function getPacienteCPF(a) {
  // back manda só dígitos; exibimos formatado
  const cpf = a.cliente?.cpf ?? a.cpf ?? a.paciente_cpf ?? "";
  return maskCPF(cpf);
}

function getClinicaNome(a) {
  return a.clinica?.nome_clinica ?? a.nome_clinica ?? "";
}

function getConvenioNome(a) {
  return a.convenio?.nome_convenio ?? a.nome_convenio ?? "";
}

function getProcedimentoNome(a) {
  return a.procedimento?.nome_procedimento ?? a.nome_procedimento ?? "";
}

function getTipoNome(a) {
  // seu payload vem com objeto 'tipoAtendimento' (camelCase) e campos internos snake_case
  return a.tipoAtendimento?.nome_tipo_atendimento ?? a.nome_tipo_atendimento ?? "";
}

function getDataAtendimento(a) {
  return a.data_atendimento ?? a.data ?? null;
}
// alias p/ não precisar trocar o template agora
function getDataHora(a) {
  return getDataAtendimento(a);
}

// Mostramos por padrão o valor_liquido; se quiser o bruto, troque a ordem
function getValor(a) {
  const n = Number(a.valor_liquido ?? a.valor_bruto ?? 0);
  return Number.isNaN(n) ? 0 : n;
}

// Se não vier 'status', inferimos: realizado se já passou da data_atendimento
function isRealizado(a) {
  const st = a.status ? String(a.status).toUpperCase() : "";
  if (st) return st === "REALIZADO" || st === "CONCLUIDO" || st === "CONCLUÍDO";
  const dt = getDataAtendimento(a);
  return dt ? new Date(dt) <= new Date() : true;
}
function formatDate(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${hh}:${mi}`;
}
function currency(v) {
  return Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

// -------- Filtro aplicado --------
const filtered = computed(() => {
  const term = q.value.trim().toLowerCase();
  const want = status.value.toUpperCase();

  return items.value.filter((a) => {
    const byStatus =
      want === "" ||
      (want === "REALIZADO" && isRealizado(a)) ||
      (want === "PENDENTE" && !isRealizado(a));
    if (!byStatus) return false;

    if (!term) return true;
    const haystack = [
      getId(a),
      getPacienteNome(a),
      getPacienteCPF(a),
      getClinicaNome(a),
      getConvenioNome(a),
      getProcedimentoNome(a),
      getTipoNome(a),
      getValor(a),
      formatDate(getDataHora(a)),
    ].filter(Boolean).map(v => String(v).toLowerCase()).join(" | ");

    return haystack.includes(term);
  });
});

// -------- Ações --------
async function reload() {
  loading.value = true;
  try {
    await store.loadAll({ page: 1 });
    const data = store.items;
    items.value = Array.isArray(data) ? data : (data?.items ?? []);
  } catch (e) {
    notify.error({ title: "Falha ao carregar", message: e.message || "Erro ao carregar atendimentos." });
  } finally {
    loading.value = false;
  }
}

function onDetails(a) {
  router.push(`/atendimentos/${getId(a)}`);
}

const confirmOpen = ref(false);
const confirmLoading = ref(false);
const confirmId = ref(null);
const confirmName = ref("");

function askDelete(a) {
  confirmId.value = getId(a);
  confirmName.value = getPacienteNome(a) || "este atendimento";
  confirmOpen.value = true;
}

async function confirmDelete() {
  confirmLoading.value = true;
  try {
    await store.remove(confirmId.value);
    notify.success({ title: "Atendimento excluído" });
    await reload();
  } catch (e) {
    notify.error({ title: "Erro ao excluir", message: e.message });
  } finally {
    confirmLoading.value = false;
    confirmOpen.value = false;
  }
}

onMounted(reload);
</script>
