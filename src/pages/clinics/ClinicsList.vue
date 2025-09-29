<template>
  <div>
    <!-- Header -->
    <div class="flex items-center justify-between mb-3">
      <h1 class="text-2xl font-bold">Clínicas</h1>
      <RouterLink
        to="/clinics/new"
        class="px-3 py-2 rounded-lg bg-brand text-white hover:bg-brand-600"
      >
        + Nova Clínica
      </RouterLink>
    </div>
    <p class="text-md text-gray-500 mb-4">
      Gerencie todas as clínicas
    </p>

    <!-- Barra de filtros (clean e focada) -->
    <div class="bg-white border border-line rounded-xl p-3 md:p-4 mb-4 shadow-[var(--shadow-card)]">
      <!-- Busca: largura total -->
      <div class="relative mb-3">
        <input
          v-model="q"
          placeholder="Buscar por nome, telefone, responsável…"
          class="w-full border border-line rounded-lg px-4 py-2 pl-11 focus:outline-none focus:ring-2 focus:ring-brand/30"
        />
        <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"><Search /></span>
      </div>

    </div>

    <div class="bg-white rounded-md shadow-[var(--shadow-card)] border border-line overflow-hidden">
      <div class="flex-1 overflow-x-auto overflow-y-auto min-h-[500px]">
        <table class="w-full text-sm">
          <thead class="bg-gray-50 border-b border-line text-gray-600">
            <tr>
              <th class="text-left px-4 py-2 w-[60px]">#</th>
              <th class="text-left px-4 py-2">Clínica</th>
              <th class="text-left px-4 py-2">Contato</th>
              <th class="text-left px-4 py-2">Taxa Repasse</th>
              <th class="text-left px-4 py-2">Status</th>
              <th class="px-4 py-2 text-center w-0">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(c, i) in filtered"
              :key="getId(c)"
              class="border-t border-line hover:bg-gray-50/60"
            >
              <td class="px-4 py-3">{{ i + 1 }}</td>
              <td class="px-4 py-3">
                <div class="font-medium text-gray-900">{{ getName(c) }}</div>
                <div class="text-sm text-gray-500">{{ getPhone(c) }}</div>
              </td>
              <td class="px-4 py-3">
                <div class="text-gray-900">{{ getRespName(c) }}</div>
                <div class="text-sm text-gray-500">{{ getEmail(c) }}</div>
              </td>
              <td class="px-4 py-3">
                <span class="text-gray-900">{{ formatTaxa(getTaxa(c)) }}</span>
              </td>
              <td class="px-4 py-3">
                <span
                  class="inline-flex items-center px-2 py-0.5 rounded-full text-xs border"
                  :class="isAtivo(c) ? 'text-green-700 border-green-300 bg-green-50' : 'text-gray-600 border-gray-300 bg-gray-50'"
                >
                  {{ isAtivo(c) ? 'ATIVO' : 'INATIVO' }}
                </span>
              </td>
              <td class="px-4 py-3 text-center">
                <Menu as="div" class="relative inline-block text-left">
                  <MenuButton
                    class="inline-flex items-center justify-center size-8 rounded-md border border-line hover:bg-gray-100 focus:outline-none"
                    aria-label="Ações"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="5" cy="12" r="2" />
                      <circle cx="12" cy="12" r="2" />
                      <circle cx="19" cy="12" r="2" />
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

                      <!-- Se quiser manter "Excluir", deixe como está. Se preferir, troco por Ativar/Inativar igual Tipos. -->
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
              <td colspan="6" class="px-4 py-6 text-center text-gray-500">
                Nenhuma clínica encontrada
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de confirmação -->
    <AppModal
      :open="confirmOpen"
      title="Excluir clínica"
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
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useClinicsStore } from "../../stores/clinics";
import AppModal from "../../components/AppModal.vue";
import { useNotify } from "../../stores/notify";
import { Search } from "lucide-vue-next";

const router = useRouter();
const clinics = useClinicsStore();
const notify = useNotify();

const loading = ref(false);

// -------- Filtros (iguais Tipos) --------
const q = ref("");
const status = ref("ATIVO"); // '', 'ATIVO', 'INATIVO'
function setStatus(s){ status.value = s; }

// -------- Lista base --------
const items = ref([]);

// -------- Helpers de campos --------
function getId(c){ return c.id ?? c.id_clinica ?? c.clinica_id ?? null; }
function getName(c){ return c.nome_clinica ?? c.nome ?? c.nomeClinica ?? ""; }
function getPhone(c){ return c.telefone_clinica ?? c.telefone ?? ""; }
function getRespName(c){ return c.nome_responsavel ?? c.responsavel_nome ?? ""; }
function getEmail(c){ return c.email_clinica ?? c.responsavel_email ?? ""; }
function getTaxa(c){ return c.taxa_repasse_clinica ?? c.taxa_repasse; }

function isAtivo(c){
  // back principal: status_atividade boolean
  if (typeof c.status_atividade === "boolean") return c.status_atividade;
  // comuns: 1/0, 'A'/'I', 'ATIVO'/'INATIVO', 'true'/'false'
  if (c.status_atividade != null) {
    const v = String(c.status_atividade).toUpperCase();
    return v === "1" || v === "A" || v === "ATIVO" || v === "TRUE";
  }
  if (typeof c.ativo === "boolean") return c.ativo;
  return true;
}

function formatTaxa(v){
  if (v == null || v === "") return "-";
  const n = Number(v);
  if (Number.isNaN(n)) return String(v);
  return `${n}%`;
}

// -------- Filtro aplicado (texto + status) --------
const filtered = computed(() => {
  const term = q.value.trim().toLowerCase();
  const want = status.value.toUpperCase(); // '', 'ATIVO', 'INATIVO'

  return items.value.filter((c) => {
    // por status
    const byStatus =
      want === "" ||
      (want === "ATIVO" && isAtivo(c)) ||
      (want === "INATIVO" && !isAtivo(c));

    if (!byStatus) return false;

    // por texto
    if (!term) return true;
    const haystack = [
      getId(c),
      getName(c),
      getPhone(c),
      getRespName(c),
      getEmail(c),
    ]
      .filter(Boolean)
      .map((v) => String(v).toLowerCase())
      .join(" | ");

    return haystack.includes(term);
  });
});

// -------- Ações --------
async function reload(){
  loading.value = true;
  try{
    const data = await clinics.loadAll();
    items.value = Array.isArray(data) ? data : (data?.items ?? []);
  } finally{
    loading.value = false;
  }
}

function onEdit(c){ router.push(`/clinics/${getId(c)}/edit`); }

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
    console.log("TO AQ");
    
    await clinics.inativar(confirmId.value);
    notify.success({ title: "Clinica excluida" });
    console.log("TO 2");
    await reload();
  } finally{
    confirmLoading.value = false;
    confirmOpen.value = false;
  }
}

onMounted(reload);
</script>
