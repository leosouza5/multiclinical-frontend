<template>
  <div class="space-y-4">
    <!-- Título + descrição -->
    <div class="flex items-center gap-3">
      <button @click="goBack"
        class="size-9 grid place-items-center rounded-lg border border-line hover:bg-gray-50">←</button>
      <div>
        <h1 class="text-2xl font-bold">Novo Usuário</h1>
        <p class="text-md text-gray-500">Registra um novo usuário no sistema</p>
      </div>
    </div>

    <!-- Card -->
    <div class="bg-white rounded-md shadow-[var(--shadow-card)] border border-line">
      <!-- Cabeçalho do card -->
      <div class="flex items-center justify-between px-4 py-3 ">
        <div>
          <legend class="text-lg font-semibold ">Informações</legend>
          <p class="text-md text-gray-500">Dados básicos do usuário</p>
        </div>

        <!-- Toggle Ativo -->
        <label class="flex items-center gap-2 text-md select-none">
          <span class="text-gray-700">Ativo</span>
          <button type="button" @click="form.active = !form.active"
            class="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
            :class="form.active ? 'bg-brand' : 'bg-gray-300'">
            <span class="inline-block h-5 w-5 transform rounded-full bg-white transition-transform"
              :class="form.active ? 'translate-x-5' : 'translate-x-1'" />
          </button>
        </label>
      </div>

      <!-- Conteúdo -->
      <form @submit.prevent="onSubmit" class="p-4 space-y-6">
        <fieldset class="space-y-1">
          <div class="grid gap-4 md:grid-cols-2 mt-3">

            <!-- Nome -->
            <div class="md:col-span-2">
              <label class="block text-md mb-1">Nome</label>
              <input v-model.trim="form.name" placeholder="Digite o nome completo"
                class="w-full border border-line rounded-lg px-3 py-2" />
              <p v-if="errors.name" class="text-xs text-red-600 mt-1">{{ errors.name }}</p>
            </div>

            <!-- Nome de Usuário -->
            <div>
              <label class="block text-md mb-1">Nome de Usuário</label>
              <input v-model.trim="form.username" placeholder="Digite o nome de usuário (login)"
                class="w-full border border-line rounded-lg px-3 py-2" />
              <p v-if="errors.username" class="text-xs text-red-600 mt-1">{{ errors.username }}</p>
            </div>

            <!-- Email -->
            <div>
              <label class="block text-md mb-1">Email</label>
              <input v-model.trim="form.email" type="email" placeholder="Digite o email"
                class="w-full border border-line rounded-lg px-3 py-2" />
              <p v-if="errors.email" class="text-xs text-red-600 mt-1">{{ errors.email }}</p>
            </div>

            <!-- Senha -->
            <div>
              <AppPaswordInput id="password" v-model="form.password" wrapperClass="mt-3" label="Senha"
                autocomplete="new-password" :error="errors.password" />
            </div>

            <!-- Confirmar Senha -->
            <AppPaswordInput id="confirmPassword" v-model="form.passwordConfirm" wrapperClass="mt-3"
              label="Confirmar Senha" autocomplete="new-password" :error="errors.passwordConfirm" />
          </div>
        </fieldset>

        <!-- Permissões -->
        <fieldset>
          <legend class="text-md font-medium text-gray-700">Permissões</legend>
          <div class="grid gap-x-10 gap-y-2 md:grid-cols-3 mt-2 text-md">
            <label class="flex items-center gap-2">
              <input type="checkbox" value="pacientes" v-model="form.perms" class="size-4"> Pacientes
            </label>
            <label class="flex items-center gap-2">
              <input type="checkbox" value="atendimentos" v-model="form.perms" class="size-4"> Atendimentos
            </label>
            <label class="flex items-center gap-2">
              <input type="checkbox" value="clinicas" v-model="form.perms" class="size-4"> Clínicas
            </label>

            <label class="flex items-center gap-2">
              <input type="checkbox" value="profissionais" v-model="form.perms" class="size-4"> Profissionais
            </label>
            <label class="flex items-center gap-2">
              <input type="checkbox" value="procedimentos" v-model="form.perms" class="size-4"> Procedimentos
            </label>
            <label class="flex items-center gap-2">
              <input type="checkbox" value="convenios" v-model="form.perms" class="size-4"> Convênios
            </label>

            <label class="flex items-center gap-2">
              <input type="checkbox" value="financeiro" v-model="form.perms" class="size-4"> Financeiro
            </label>
            <label class="flex items-center gap-2">
              <input type="checkbox" value="admin" v-model="form.perms" class="size-4"> Administração
            </label>
          </div>
        </fieldset>

        <!-- Ações -->
        <div class="flex items-center justify-between mt-2">
          <RouterLink to="/users" class="px-3 py-2 rounded-lg border border-line hover:bg-gray-50">Cancelar</RouterLink>
          <AppButton :loading="loading">
            Salvar usuário
          </AppButton>

        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import AppPaswordInput from "../../components/AppPaswordInput.vue";
import { useNotify } from "../../stores/notify";
import { useUsersStore } from "../../stores/users";
import AppButton from "../../components/AppButton.vue";

const router = useRouter();
const loading = ref(false);
const errors = reactive({});
const notify = useNotify();
const isEdit = ref(false);

const usersStore = useUsersStore();

const form = reactive({
  name: "",
  username: "",
  email: "",
  password: "",
  passwordConfirm: "",
  active: true,
  perms: []
});

function goBack() { router.push("/users"); }

function validate() {
  Object.keys(errors).forEach(k => delete errors[k]);
  if (!form.name) errors.name = "Informe o nome.";
  if (!form.username) errors.username = "Informe o nome de usuário.";
  if (!form.email || !/.+@.+\..+/.test(form.email)) errors.email = "E-mail inválido.";
  if (!form.password || form.password.length < 6) errors.password = "Mínimo de 6 caracteres.";
  if (form.password !== form.passwordConfirm) errors.passwordConfirm = "As senhas não coincidem.";
  return Object.keys(errors).length === 0;
}

function payload() {
  const base = {
    nome_usuario: form.name,
    login: form.username,
    email: form.email,
    ativo: form.active,
    perms: Array.isArray(form.perms) ? form.perms : [],
  };
  if (!isEdit.value) {
    base.senha = form.password;
  } else if (form.password) {
    base.senha = form.password;
  }
  return base;
}

async function onSubmit() {
  if (loading.value) return;
  if (!validate()) return;

  loading.value = true;
  try {
    if (isEdit.value) {
      await usersStore.update(id, payload());
      notify.success({ title: "Usuário atualizado" });
    } else {
      await usersStore.create(payload());
      notify.success({ title: "Usuário criado" });
    }
    router.push("/users");
  } catch (e) {

  } finally {
    loading.value = false;
  }
}

</script>
