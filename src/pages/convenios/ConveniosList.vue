<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-3">
      <h1 class="text-2xl font-bold">Convênios</h1>
      <RouterLink
        to="/convenios/new"
        class="px-3 py-2 rounded-lg bg-brand text-white hover:bg-brand-600"
      >
        + Novo Convênio
      </RouterLink>
    </div>
    <p class="text-md text-gray-500 mb-4">
      Gerencie todos os convênios cadastrados
    </p>

    <!-- Barra de busca (clean) -->
    <div class="bg-white border border-line rounded-xl p-3 md:p-4 mb-4 shadow-[var(--shadow-card)]">
      <div class="relative">
        <input
          v-model="q"
          placeholder="Buscar por nome…"
          class="w-full border border-line rounded-lg px-4 py-2 pl-11 focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"><Search /></span>
      </div>
    </div>

    <!-- Tabela -->
    <div class="bg-white rounded-xl shadow-[var(--shadow-card)] border border-line">
      <template v-if="loading">
        <div class="flex items-center justify-center py-10 text-gray-500">
          <svg class="animate-spin h-6 w-6 text-brand" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                <th class="text-left px-4 py-2">Coparticipação</th>
                <th class="text-left px-4 py-2">Telefone</th>
                <th class="px-4 py-2 text-center w-0">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="c in filtered"
                :key="getId(c)"
                class="border-t border-line hover:bg-gray-50/60"
              >
                <td class="px-4 py-3">
                  <div class=" text-gray-900">{{ getName(c) }}</div>
                </td>
                <td class="px-4 py-3">
                  <span class="text-gray-900">{{ formatPercent(c.valor_coparticipacao) }}</span>
                </td>
                <td class="px-4 py-3">
                  <span class="text-gray-700">{{ c.telefone_convenio ?? c.telefone ?? '-' }}</span>
                </td>

                <td class="px-4 py-3 text-center">
                  <Menu as="div" class="relative inline-block text-left">
                    <MenuButton
                      class="inline-flex items-center justify-center size-8 rounded-md border border-line hover:bg-gray-100 focus:outline-none"
                      aria-label="Ações"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="5" cy="12" r="2"></circle>
                        <circle cx="12" cy="12" r="2"></circle>
                        <circle cx="19" cy="12" r="2"></circle>
                      </svg>
                    </MenuButton>

                    <MenuItems
                      class="absolute right-0 mt-2 w-44 origin-top-right rounded-md border border-line bg-white shadow-[var(--shadow-card)] focus:outline-none z-50"
                    >
                      <div class="p-1">
                        <MenuItem v-slot="{ active }">
                          <button
                            @click="onEdit(c)"
                            class="w-full text-left px-3 py-2 text-sm rounded-md"
                            :class="active ? 'bg-gray-50' : ''"
                          >
                            Editar
                          </button>
                        </MenuItem>

                        <MenuItem v-slot="{ active }">
                          <button
                            @click="askDelete(c)"
                            class="w-full text-left px-3 py-2 text-sm rounded-md text-red-700"
                            :class="active ? 'bg-red-50' : ''"
                          >
                            Excluir
                          </button>
                        </MenuItem>
                      </div>
                    </MenuItems>
                  </Menu>
                </td>
              </tr>

              <tr v-if="filtered.length === 0">
                <td colspan="4" class="px-4 py-6 text-center text-gray-500">
                  Nenhum convênio encontrado
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </template>
    </div>

    <!-- Modal de confirmação -->
    <AppModal
      :open="confirmOpen"
      title="Excluir convênio"
      :description="`Tem certeza que deseja excluir ${confirmName}? Essa ação não poderá ser desfeita.`"
      cancelText="Cancelar"
      confirmText="Excluir"
      :confirmLoading="confirmLoading"
      @close="confirmOpen = false"
      @confirm="confirmDelete"
    />
  </div>
</template>

<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { computed, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import AppModal from "@/components/AppModal.vue";
import { useConveniosStore } from "@/stores/convenios.js";
import { Search } from "lucide-vue-next";

const router = useRouter();
const store = useConveniosStore();

// -------- Busca --------
const q = ref("");

// -------- Loading / items --------
const loading = computed(() => store.loading);
const items = computed(() => store.items ?? []);

// -------- Helpers --------
function getId(c){ return c.id ?? c.id_convenio ?? null; }
function getName(c){ return c.nome_convenio ?? c.nome ?? ""; }
function formatPercent(v){
  if (v == null || v === "") return "-";
  const n = Number(v);
  if (Number.isNaN(n)) return String(v);
  return `${n}%`;
}

// -------- Filtro aplicado --------
const filtered = computed(() => {
  const term = q.value.trim().toLowerCase();
  if (!term) return items.value;
  return items.value.filter(c => getName(c).toLowerCase().includes(term));
});

// -------- Ações --------
function onEdit(c){ router.push(`/convenios/${getId(c)}/edit`); }

const confirmOpen = ref(false);
const confirmLoading = ref(false);
const confirmId = ref(null);
const confirmName = ref("");

function askDelete(c){
  confirmId.value = getId(c);
  confirmName.value = getName(c);
  confirmOpen.value = true;
}

async function confirmDelete(){
  confirmLoading.value = true;
  try{
    await store.remove(confirmId.value);   
    await store.loadAll();                
  } finally {
    confirmLoading.value = false;
    confirmOpen.value = false;
  }
}

function reload(){ store.loadAll(); }
onMounted(reload);
</script>
