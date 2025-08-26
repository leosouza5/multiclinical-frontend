<template>
    <div class="space-y-4">
      <!-- Header -->
      <div class="flex items-center gap-3">
        <button @click="goBack"
          class="size-9 grid place-items-center rounded-lg border border-line hover:bg-gray-50">←</button>
        <div>
          <h1 class="text-2xl font-bold">{{ isEdit ? "Editar Convênio" : "Novo Convênio" }}</h1>
          <p class="text-md text-gray-500">Preencha os dados do convênio</p>
        </div>
      </div>
  
      <!-- Card -->
      <div class="bg-white rounded-md shadow-[var(--shadow-card)] border border-line">
        <form @submit.prevent="onSubmit" class="p-4 space-y-6">
          <!-- Nome -->
          <fieldset class="space-y-1">
            <label class="text-md text-gray-700">Nome</label>
            <input v-model.trim="form.nome" placeholder="Digite o nome do convênio"
                   class="w-full border border-line rounded-lg px-4 py-2" />
          </fieldset>
  
          <!-- Coparticipação + Telefone -->
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="text-md text-gray-700">Valor de Coparticipação (%)</label>
              <input v-model.number="form.coparticipacao" type="number" step="0.01" min="0"
                     placeholder="0.00" class="w-full border border-line rounded-lg px-4 py-2" />
            </div>
            <div>
              <label class="text-md text-gray-700">Telefone</label>
              <input v-model.trim="form.telefone" placeholder="(00) 00000-0000"
                     class="w-full border border-line rounded-lg px-4 py-2" />
            </div>
          </div>
  
          <!-- Contato -->
          <div class="grid md:grid-cols-2 gap-4">
            <div>
              <label class="text-md text-gray-700">Contato</label>
              <input v-model.trim="form.contato" placeholder="Nome do contato"
                     class="w-full border border-line rounded-lg px-4 py-2" />
            </div>
            <div>
              <label class="text-md text-gray-700">Email do Contato</label>
              <input v-model.trim="form.email" type="email" placeholder="email@exemplo.com"
                     class="w-full border border-line rounded-lg px-4 py-2" />
            </div>
          </div>
  
          <!-- Botões -->
          <div class="flex items-center justify-end gap-2 pt-2 border-t border-line">
            <RouterLink to="/convenios" class="px-3 py-2 rounded-lg border border-line hover:bg-gray-50">Cancelar</RouterLink>
            <button type="submit" :disabled="saving"
                    class="px-3 py-2 rounded-lg bg-brand text-white hover:bg-brand-600 disabled:opacity-60">
              {{ saving ? "Salvando…" : (isEdit ? "Salvar alterações" : "Salvar Convênio") }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { reactive, ref, computed, onMounted } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { useConveniosStore } from "@/stores/convenios.js";
  
  const route = useRoute();
  const router = useRouter();
  const store = useConveniosStore();
  
  const form = reactive({
    id: null,
    nome: "",
    coparticipacao: "",
    telefone: "",
    contato: "",
    email: "",
  });
  
  const isEdit = computed(() => Boolean(route.params.id));
  const saving = computed(() => store.loading);
  
  function goBack() { router.push("/convenios"); }
  
  onMounted(async () => {
    if (isEdit.value) {
      const data = await store.fetchOne(route.params.id);
      form.id = data.id;
      form.nome = data.nome ?? "";
      form.coparticipacao = data.coparticipacao ?? "";
      form.telefone = data.telefone ?? "";
      form.contato = data.contato ?? "";
      form.email = data.email ?? "";
    }
  });
  
  async function onSubmit() {
    if (!form.nome.trim()) { alert("Informe o nome do convênio"); return; }
    const payload = {
      nome: form.nome,
      coparticipacao: form.coparticipacao,
      telefone: form.telefone,
      contato: form.contato,
      email: form.email,
    };
  
    if (isEdit.value) { await store.update(form.id, payload); }
    else { await store.create(payload); }
  
    router.push("/convenios");
  }
  </script>
  