<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center gap-3">
      <button @click="goBack"
        class="size-9 grid place-items-center rounded-lg border border-line hover:bg-gray-50">←</button>
      <div>
        <h1 class="text-2xl font-bold">{{ isEdit ? "Editar Procedimento" : "Novo Procedimento" }}</h1>
        <p class="text-md text-gray-500">Preencha os dados do procedimento</p>
      </div>
    </div>

    <!-- Card -->
    <div class="bg-white rounded-md shadow-[var(--shadow-card)] border border-line">
      <form @submit.prevent="onSubmit" class="p-4 space-y-6">
        <fieldset class="space-y-1">
          <label class="text-md text-gray-700">Nome</label>
          <input v-model.trim="form.nome" placeholder="Digite o nome do procedimento"
                 class="w-full border border-line rounded-lg px-4 py-2" />
          <p v-if="errors.nome" class="text-sm text-red-500">{{ errors.nome }}</p>
        </fieldset>

        <div class="flex items-center justify-end gap-2 pt-2 border-t border-line">
          <RouterLink to="/procedures" class="px-3 py-2 rounded-lg border border-line hover:bg-gray-50">Cancelar</RouterLink>
          <AppButton :loading="saving">
            {{ saving ? "Salvando…" : (isEdit ? "Salvar alterações" : "Salvar Procedimento")   }}
          </AppButton>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useProceduresStore } from "@/stores/procedures.js";

const route = useRoute();
const router = useRouter();
const store = useProceduresStore();

const form = reactive({ id: null, nome: "" });
const errors = reactive({});
const isEdit = computed(() => Boolean(route.params.id));
const saving = computed(() => store.loading);

function goBack() { router.push("/procedures"); }

function validate() {
  Object.keys(errors).forEach(k => delete errors[k]);
  if (!form.nome?.trim() || form.nome.trim().length < 3)
    errors.nome = "Informe o nome do procedimento (mín. 3 caracteres).";
  return Object.keys(errors).length === 0;
}

onMounted(async () => {
  if (isEdit.value) {
    const data = await store.fetchOne(route.params.id);
    form.id = data.id_procedimento;
    form.nome = data.nome_procedimento ?? "";
  }
});

async function onSubmit() {
  if (!validate()) return;
  if (isEdit.value) { await store.update(form.id, { nome_procedimento: form.nome }); }
  else { await store.create({ nome_procedimento: form.nome }); }
  router.push("/procedures");
}
</script>
