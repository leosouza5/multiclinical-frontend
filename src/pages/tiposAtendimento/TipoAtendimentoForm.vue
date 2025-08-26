<template>
    <div class="space-y-4">
      <!-- Header -->
      <div class="flex items-center gap-3">
        <button @click="goBack"
          class="size-9 grid place-items-center rounded-lg border border-line hover:bg-gray-50">←</button>
        <div>
          <h1 class="text-2xl font-bold">{{ isEdit ? "Editar Tipo de Atendimento" : "Novo Tipo de Atendimento" }}</h1>
          <p class="text-md text-gray-500">Preencha os dados</p>
        </div>
      </div>
  
      <!-- Card -->
      <div class="bg-white rounded-md shadow-[var(--shadow-card)] border border-line">
        <form @submit.prevent="onSubmit" class="p-4 space-y-6">
          <fieldset class="space-y-1">
            <label class="text-md text-gray-700">Nome</label>
            <input v-model.trim="form.nome" placeholder="Digite o nome do tipo de atendimento"
                   class="w-full border border-line rounded-lg px-4 py-2" />
          </fieldset>
  
          <div class="flex items-center justify-end gap-2 pt-2 border-t border-line">
            <RouterLink to="/tipos-atendimento" class="px-3 py-2 rounded-lg border border-line hover:bg-gray-50">Cancelar</RouterLink>
            <button type="submit" :disabled="saving"
                    class="px-3 py-2 rounded-lg bg-brand text-white hover:bg-brand-600 disabled:opacity-60">
              {{ saving ? "Salvando…" : (isEdit ? "Salvar alterações" : "Salvar Tipo de Atendimento") }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup>
  import { reactive, ref, computed, onMounted } from "vue";
  import { useRoute, useRouter } from "vue-router";
  import { useTiposAtendimentoStore } from "@/stores/tiposAtendimento.js";
import { useNotify } from "../../stores/notify";
  
  const route = useRoute();
  const router = useRouter();
  const store = useTiposAtendimentoStore();
  
  const notify = useNotify()
  const form = reactive({ id: null, nome: "" });
  const isEdit = computed(() => Boolean(route.params.id));
  const saving = computed(() => store.loading);
  
  function goBack() { router.push("/tipos-atendimento"); }
  
  onMounted(async () => {
    if (isEdit.value) {
      const data = await store.fetchOne(route.params.id);
      form.id = data.id_tipo_atendimento;
      form.nome = data.nome_tipo_atendimento ?? "";
    }
  });
  
  async function onSubmit() {
    if (!form.nome.trim()) { alert("Informe o nome"); return; }
    if (isEdit.value) { await store.update(form.id, { nome_tipo_atendimento: form.nome }); }
    else { await store.create({ nome_tipo_atendimento: form.nome }); }
    notify.success({ title: "Tipo de Atendimento criado" });
    router.push("/tipos-atendimento");
  }
  </script>
  