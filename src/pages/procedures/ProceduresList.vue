<template>
  <div>
    <!-- Cabeçalho -->
    <div class="flex items-center justify-between mb-2">
      <h1 class="text-2xl font-bold">Procedimentos</h1>
      <RouterLink to="/procedures/new" class="px-3 py-2 rounded-lg bg-brand text-white hover:bg-brand-600">
        + Novo Procedimento
      </RouterLink>
    </div>
    <p class="text-md text-gray-500 mb-4">Gerencie todos os procedimentos cadastrados</p>

    <!-- Busca -->
    <div class="flex items-center gap-2 mb-3">
      <div class="flex-1 relative">
        <input v-model="q" placeholder="Buscar procedimentos..."
               class="w-full border border-line rounded-lg px-4 py-2 pl-10" />
        <span class="absolute left-3 top-1/2 -translate-y-1/2">🔎</span>
      </div>
      <button class="px-3 py-2 rounded-lg border border-line hover:bg-gray-50" @click="reload">Buscar</button>
    </div>

    <!-- Tabela -->
    <div class="bg-white rounded-md shadow-[var(--shadow-card)] border border-line overflow-hidden">
      <table class="w-full text-left">
        <thead class="bg-gray-50 text-gray-700">
          <tr class="border-b border-line">
            <th class="px-4 py-3 w-16">ID</th>
            <th class="px-4 py-3">Nome</th>
            <th class="px-4 py-3 w-32 text-center">Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="loading">
            <td colspan="3" class="px-4 py-6 text-center text-gray-500">Carregando…</td>
          </tr>
          <tr v-else-if="filtered.length === 0">
            <td colspan="3" class="px-4 py-6 text-center text-gray-500">Nenhum procedimento encontrado</td>
          </tr>
          <tr v-for="p in filtered" :key="p.id" class="border-t border-line hover:bg-gray-50">
            <td class="px-4 py-3">{{ p.id }}</td>
            <td class="px-4 py-3">{{ p.nome }}</td>
            <td class="px-4 py-3 text-center">
              <RouterLink :to="`/procedures/${p.id}/edit`"
                          class="px-3 py-1 rounded-md border border-line hover:bg-gray-50">Editar</RouterLink>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from "vue";
import { useProceduresStore } from "@/stores/procedures.js";

const store = useProceduresStore();
const q = ref("");

const loading = computed(() => store.loading);
const filtered = computed(() => {
  const term = q.value.trim().toLowerCase();
  if (!term) return store.items;
  return store.items.filter(p => (p.nome || "").toLowerCase().includes(term));
});

function reload() { store.loadAll({ q: q.value }); }
onMounted(reload);
</script>
