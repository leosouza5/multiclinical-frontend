<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-3">
      <h1 class="text-2xl font-bold">Tipos de Atendimento</h1>
      <RouterLink to="/tipos-atendimento/new" class="px-3 py-2 rounded-lg bg-brand text-white hover:bg-brand-600">
        + Novo Tipo de Atendimento
      </RouterLink>
    </div>
    <p class="text-md text-gray-500 mb-4">
      Gerencie todos os tipos de atendimento cadastrados
    </p>

    <!-- Barra de filtros (clean e focada) -->
    <div class="bg-white border border-line rounded-xl p-3 md:p-4 mb-4 shadow-[var(--shadow-card)]">
      <!-- Busca: largura total -->
      <div class="relative mb-3">
        <input v-model="q" placeholder="Buscar por nome…"
          class="w-full border border-line rounded-lg px-4 py-2 pl-11 focus:outline-none focus:ring-2 focus:ring-brand/30" />
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"><Search /></span>
      </div>

  
    </div>

    <!-- Tabela -->
    <div class="bg-white rounded-xl shadow-[var(--shadow-card)] border border-line">
      <template v-if="loading">
        <div class="flex items-center justify-center py-10 text-gray-500">
          <svg class="animate-spin h-6 w-6 text-brand" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
          </svg>
        </div>
      </template>

      <template v-else>
        <div class="flex-1 overflow-x-auto overflow-y-auto min-h-[500px]">
          <table class="min-w-full text-md">
            <thead class="bg-gray-50 text-gray-600">
              <tr>
                <th class="text-left px-4 py-2">Nome</th>
                <th class="text-left px-4 py-2">Status</th>
                <th class="px-4 py-2 text-center w-0">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="t in filtered" :key="getId(t)" class="border-t border-line hover:bg-gray-50/60">
                <td class="px-4 py-3">
                  <div class="font-medium text-gray-900">{{ getName(t) }}</div>
                </td>
                <td class="px-4 py-3">
                  <span class="inline-flex items-center px-2 py-0.5 rounded-full text-xs border"
                    :class="isAtivo(t) ? 'text-green-700 border-green-300 bg-green-50' : 'text-gray-600 border-gray-300 bg-gray-50'">
                    {{ isAtivo(t) ? 'ATIVO' : 'INATIVO' }}
                  </span>
                </td>
                <td class="px-4 py-3 text-center">
                  <Menu as="div" class="relative inline-block text-left">
                    <MenuButton
                      class="inline-flex items-center justify-center size-8 rounded-md border border-line hover:bg-gray-100 focus:outline-none"
                      aria-label="Ações">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="5" cy="12" r="2"></circle>
                        <circle cx="12" cy="12" r="2"></circle>
                        <circle cx="19" cy="12" r="2"></circle>
                      </svg>
                    </MenuButton>

                    <MenuItems
                      class="absolute right-0 mt-2 w-44 origin-top-right rounded-md border border-line bg-white shadow-[var(--shadow-card)] focus:outline-none z-50">
                      <div class="p-1">
                        <MenuItem v-slot="{ active }">
                        <button @click="onEdit(t)" class="w-full text-left px-3 py-2 text-sm rounded-md"
                          :class="active ? 'bg-gray-50' : ''">
                          Editar
                        </button>
                        </MenuItem>

                        <MenuItem v-slot="{ active }">
                        <button @click="askToggle(t)" class="w-full text-left px-3 py-2 text-sm rounded-md" :class="[
                          active ? 'bg-gray-50' : '',
                          isAtivo(t) ? 'text-red-700' : 'text-green-700'
                        ]">
                          {{ "Excluir" }}
                        </button>
                        </MenuItem>
                      </div>
                    </MenuItems>
                  </Menu>
                </td>
              </tr>

              <tr v-if="filtered.length === 0">
                <td colspan="3" class="px-4 py-6 text-center text-gray-500">
                  Nenhum tipo de atendimento encontrado
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </div>

    <!-- Modal -->
    <AppModal :open="confirmOpen"
      :title="confirmAction === 'Excluir' ? 'Excluir tipo de atendimento' : 'Ativar tipo de atendimento'"
      :description="confirmAction === 'Excluir'
        ? `Tem certeza que deseja Excluir ${confirmName}? Você poderá reativar quando quiser.`
        : `Deseja ativar ${confirmName}?`" cancelText="Cancelar"
      :confirmText="confirmAction === 'Excluir' ? 'Excluir' : 'Ativar'" :confirmLoading="confirmLoading"
      @close="confirmOpen = false" @confirm="confirmToggle" />
  </div>
</template>

<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useTiposAtendimentoStore } from "@/stores/tiposAtendimento.js";
import { useNotify } from "@/stores/notify";
import AppModal from "@/components/AppModal.vue";
import { Search } from "lucide-vue-next";

const router = useRouter();
const store = useTiposAtendimentoStore();
const notify = useNotify();

const loading = computed(() => store.loading);

// -------- Filtros (simples, client-side) --------
const q = ref("");
const status = ref("ATIVO"); // '', 'ATIVO', 'INATIVO'

// helpers
function setStatus(s) { status.value = s; }
function resetFilters() {
  q.value = "";
  status.value = "";
}

// mapeia variações de campos
function getId(t) { return t.id ?? t.id_tipo_atendimento ?? null; }
function getName(t) { return t.nome ?? t.nome_tipo_atendimento ?? ""; }
function isAtivo(t) {
  if (typeof t.ativo === "boolean") return t.ativo;
  if (t.status) return String(t.status).toUpperCase() === "ATIVO";
  return true;
}

// lista base vem do store
const itemsRaw = computed(() => store.items ?? []);

// aplica filtros localmente
const filtered = computed(() => {
  const term = q.value.trim().toLowerCase();
  const want = status.value.toUpperCase();

  return itemsRaw.value.filter((t) => {
    const byText = !term || getName(t).toLowerCase().includes(term);
    const byStatus =
      want === "" ||
      (want === "ATIVO" && isAtivo(t)) ||
      (want === "INATIVO" && !isAtivo(t));
    return byText && byStatus;
  });
});

// -------- Ações --------
function onEdit(t) {
  router.push(`/tipos-atendimento/${getId(t)}/edit`);
}

const confirmOpen = ref(false);
const confirmLoading = ref(false);
const confirmId = ref(null);
const confirmName = ref("");
const confirmAction = ref("inativar"); // 'inativar' | 'ativar'

function askToggle(t) {
  confirmId.value = getId(t);
  confirmName.value = getName(t);
  confirmAction.value = "Excluir";
  confirmOpen.value = true;
}

async function confirmToggle() {


  if (!confirmId.value) return;
  confirmLoading.value = true;
  try {
    await store.desactivate(confirmId.value);
    notify.success({ title: "Tipo de atendimento excluido" });
    confirmOpen.value = false;
    await store.loadAll();
  } catch (e) {
  } finally {
    confirmLoading.value = false;
  }
}

onMounted(() => {
  store.loadAll(); // carrega uma vez e filtra em memória
});
</script>
