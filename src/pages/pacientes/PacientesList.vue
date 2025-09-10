<template>
    <div>
      <!-- Header -->
      <div class="flex items-center justify-between mb-3">
        <h1 class="text-2xl font-bold">Pacientes</h1>
        <RouterLink to="/pacientes/new" class="px-3 py-2 rounded-lg bg-brand text-white hover:bg-brand-600">
          + Novo Paciente
        </RouterLink>
      </div>
      <p class="text-md text-gray-500 mb-4">Gerencie todos os pacientes cadastrados</p>
  
      <!-- Filtros -->
      <div class="bg-white border border-line rounded-xl p-3 md:p-4 mb-4 shadow-[var(--shadow-card)]">
        <div class="relative">
          <input v-model="q" placeholder="Buscar pacientes por nome, CPF ou telefone…"
            class="w-full border border-line rounded-lg px-4 py-2 pl-11 focus:outline-none focus:ring-2 focus:ring-brand/30" />
          <span class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"><Search /></span>
        </div>
      </div>
  
      <!-- Tabela -->
      <div class="bg-white rounded-md shadow-[var(--shadow-card)] border border-line overflow-hidden">
        <div class="flex-1 overflow-x-auto overflow-y-auto min-h-[420px]">
          <table class="w-full text-sm">
            <thead class="bg-gray-50 border-b border-line text-gray-600">
              <tr>
                <th class="text-left px-4 py-2 w-[60px]">#</th>
                <th class="text-left px-4 py-2">Nome</th>
                <th class="text-left px-4 py-2">CPF</th>
                <th class="text-left px-4 py-2">Telefone</th>
                <th class="text-left px-4 py-2">Nascimento</th>
                <th class="px-4 py-2 text-center w-0">Ações</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(p, i) in filtered" :key="getId(p)" class="border-t border-line hover:bg-gray-50/60">
                <td class="px-4 py-3">{{ i + 1 }}</td>
                <td class="px-4 py-3 font-medium text-gray-900">{{ getNome(p) }}</td>
                <td class="px-4 py-3">{{ maskCPF(getCPF(p)) || '—' }}</td>
                <td class="px-4 py-3">{{ maskPhone(getTelefone(p)) || '—' }}</td>
                <td class="px-4 py-3">{{ formatDate(getNascimento(p)) || '—' }}</td>
                <td class="px-4 py-3 text-center">
                  <Menu as="div" class="relative inline-block text-left">
                    <MenuButton
                      class="inline-flex items-center justify-center size-8 rounded-md border border-line hover:bg-gray-100 focus:outline-none"
                      aria-label="Ações">
                      <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="5" cy="12" r="2" /><circle cx="12" cy="12" r="2" /><circle cx="19" cy="12" r="2" />
                      </svg>
                    </MenuButton>
  
                    <MenuItems
                      class="absolute right-0 mt-2 w-40 origin-top-right rounded-md border border-line bg-white shadow-[var(--shadow-card)] focus:outline-none z-50">
                      <div class="p-1">
                        <MenuItem v-slot="{ active }">
                          <button @click="router.push(`/pacientes/${getId(p)}/edit`)"
                            class="w-full text-left px-3 py-2 text-sm rounded-md"
                            :class="active ? 'bg-gray-50' : ''">Editar</button>
                        </MenuItem>
                        <MenuItem v-slot="{ active }">
                          <button @click="askDelete(p)"
                            class="w-full text-left px-3 py-2 text-sm rounded-md text-red-700"
                            :class="active ? 'bg-red-50' : ''">Excluir</button>
                        </MenuItem>
                      </div>
                    </MenuItems>
                  </Menu>
                </td>
              </tr>
  
              <tr v-if="filtered.length === 0">
                <td colspan="6" class="px-4 py-6 text-center text-gray-500">Nenhum paciente encontrado</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
  
      <!-- Modal delete -->
      <AppModal
        :open="confirmOpen"
        title="Excluir paciente"
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
  import { Search } from "lucide-vue-next";
  import AppModal from "@/components/AppModal.vue";
  import { useNotify } from "@/stores/notify";
  import { listPacientes, deletePaciente } from "@/services/pacientes.js";
  
  const router = useRouter();
  const notify = useNotify();
  
  const q = ref("");
  const items = ref([]);
  const loading = ref(false);
  
  function getId(p){ return p.id_cliente ?? p.id ?? p.uuid ?? null; }
  function getNome(p){ return p.nome_cliente ?? p.nome ?? ""; }
  function getCPF(p){ return p.cpf ?? p.cpf_cliente ?? ""; }
  function getTelefone(p){ return p.telefone ?? p.telefone_cliente ?? ""; }
  function getNascimento(p){ return p.data_nascimento ?? p.nascimento ?? null; }
  
  function maskCPF(v){
    const d = String(v || "").replace(/\D/g,"").slice(0,11);
    if (d.length <= 3) return d;
    if (d.length <= 6) return d.replace(/(\d{3})(\d{0,3})/,"$1.$2");
    if (d.length <= 9) return d.replace(/(\d{3})(\d{3})(\d{0,3})/,"$1.$2.$3");
    return d.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/,"$1.$2.$3-$4");
  }
  function maskPhone(v){
    const s = String(v||"").replace(/\D/g,"").slice(0,11);
    if (s.length <= 10) return s.replace(/^(\d{2})(\d)/,"($1) $2").replace(/(\d{4})(\d{1,4})$/,"$1-$2");
    return s.replace(/^(\d{2})(\d)/,"($1) $2").replace(/(\d{5})(\d{1,4})$/,"$1-$2");
  }
  function formatDate(iso){
    if (!iso) return "";
    const d = new Date(iso);
    const dd = String(d.getDate()).padStart(2,"0");
    const mm = String(d.getMonth()+1).padStart(2,"0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  }
  
  const filtered = computed(() => {
    const term = q.value.trim().toLowerCase();
    return items.value.filter(p => {
      if (!term) return true;
      const hay = [
        getNome(p), maskCPF(getCPF(p)), maskPhone(getTelefone(p)), formatDate(getNascimento(p))
      ].filter(Boolean).map(s => String(s).toLowerCase()).join(" | ");
      return hay.includes(term);
    });
  });
  
  async function reload(){
    loading.value = true;
    try{
      const res = await listPacientes({ page: 1, limit: 50, somente_ativos: true });
      items.value = Array.isArray(res) ? res : (res?.items ?? []);
    }catch(e){
      notify.error({ title: "Falha ao carregar", message: e?.message || "Erro ao listar pacientes" });
    }finally{
      loading.value = false;
    }
  }
  
  const confirmOpen = ref(false);
  const confirmLoading = ref(false);
  const confirmId = ref(null);
  const confirmName = ref("");
  
  function askDelete(p){
    confirmId.value = getId(p);
    confirmName.value = getNome(p) || "este paciente";
    confirmOpen.value = true;
  }
  async function confirmDelete(){
    confirmLoading.value = true;
    try{
      await deletePaciente(confirmId.value);
      notify.success({ title: "Paciente excluído" });
      await reload();
    }catch(e){
      notify.error({ title: "Erro ao excluir", message: e?.response?.data?.message || e.message });
    }finally{
      confirmLoading.value = false;
      confirmOpen.value = false;
    }
  }
  
  onMounted(reload);
  </script>
  