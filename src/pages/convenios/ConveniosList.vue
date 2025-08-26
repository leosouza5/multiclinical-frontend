<template>
    <div>
      <!-- Header -->
      <div class="flex items-center justify-between mb-2">
        <h1 class="text-2xl font-bold">Convênios</h1>
        <RouterLink to="/convenios/new" class="px-3 py-2 rounded-lg bg-brand text-white hover:bg-brand-600">
          + Novo Convênio
        </RouterLink>
      </div>
      <p class="text-md text-gray-500 mb-4">Gerencie todos os convênios cadastrados</p>
  
      <!-- Busca -->
      <div class="flex items-center gap-2 mb-3">
        <div class="flex-1 relative">
          <input v-model="q" placeholder="Buscar convênios..."
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
              <th class="px-4 py-3">Coparticipação</th>
              <th class="px-4 py-3">Contato</th>
              <th class="px-4 py-3 w-32 text-center">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-if="loading">
              <td colspan="5" class="px-4 py-6 text-center text-gray-500">Carregando…</td>
            </tr>
            <tr v-else-if="filtered.length === 0">
              <td colspan="5" class="px-4 py-6 text-center text-gray-500">Nenhum convênio encontrado</td>
            </tr>
            <tr v-for="c in filtered" :key="c.id" class="border-t border-line hover:bg-gray-50">
              <td class="px-4 py-3">{{ c.id }}</td>
              <td class="px-4 py-3">{{ c.nome }}</td>
              <td class="px-4 py-3">{{ formatPercent(c.coparticipacao) }}</td>
              <td class="px-4 py-3">{{ c.telefone }}</td>
              <td class="px-4 py-3 text-center">
                <RouterLink :to="`/convenios/${c.id}/edit`"
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
  import { useConveniosStore } from "@/stores/convenios.js";
  
  const store = useConveniosStore();
  const q = ref("");
  
  const loading = computed(() => store.loading);
  const filtered = computed(() => {
    const term = q.value.trim().toLowerCase();
    if (!term) return store.items;
    return store.items.filter(c => (c.nome || "").toLowerCase().includes(term));
  });
  
  function reload() { store.loadAll({ q: q.value }); }
  function formatPercent(v) {
    if (v == null) return "-";
    return `${v}%`;
  }
  
  onMounted(reload);
  </script>
  