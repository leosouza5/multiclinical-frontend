<template>
  <div class="space-y-4">
    <!-- Título + descrição -->
    <div class="flex items-center gap-3">
      <button @click="goBack"
        class="size-9 grid place-items-center rounded-lg border border-line hover:bg-gray-50">←</button>
      <div>
        <h1 class="text-2xl font-bold">{{ isEdit ? "Editar Usuário" : "Novo Usuário" }}</h1>
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
          <span class="text-gray-700">{{form.active ? "Ativo" : "Inativo"}}</span>
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
              <label class="block text-md mb-1">Nome para login</label>
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
              <AppPaswordInput :disabled="isEdit"  id="password" v-model="form.password" wrapperClass="mt-3" label="Senha"
                autocomplete="new-password" :error="errors.password" />
            </div>

            <!-- Confirmar Senha -->
            <AppPaswordInput :disabled="isEdit"  id="confirmPassword" v-model="form.passwordConfirm" wrapperClass="mt-3"
              label="Confirmar Senha" autocomplete="new-password" :error="errors.passwordConfirm" />
          </div>
        </fieldset>

       

        <!-- Ações -->
        <div class="flex items-center justify-between mt-2">
          <RouterLink to="/users" class="px-3 py-2 rounded-lg border border-line hover:bg-gray-50">Cancelar</RouterLink>
          <AppButton :loading="loading">
            {{ isEdit ? "Salvar alterações" : "Salvar usuário" }}
          </AppButton>

        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, computed } from "vue";
import { useRouter, useRoute } from "vue-router";
import AppPaswordInput from "../../components/AppPaswordInput.vue";
import { useNotify } from "../../stores/notify";
import { useUsersStore } from "../../stores/users";

const router = useRouter();
const route = useRoute();
const notify = useNotify();
const usersStore = useUsersStore();

const loading = ref(false);
const errors = reactive({});

const id = route.params.id;
const isEdit = computed(() => !!id);

const form = reactive({
  name: "",
  username: "",
  email: "",
  password: "",
  passwordConfirm: "",
  active: true,
 
});

function goBack(){ router.push("/users"); }

function validate() {
  Object.keys(errors).forEach(k => delete errors[k]);
  if (!form.name) errors.name = "Informe o nome.";
  if (!form.username) errors.username = "Informe o nome de usuário.";
  if (!form.email || !/.+@.+\..+/.test(form.email)) errors.email = "E-mail inválido.";

  if (!isEdit.value) {
    if (!form.password || form.password.length < 6) errors.password = "Mínimo de 6 caracteres.";
    if (form.password !== form.passwordConfirm) errors.passwordConfirm = "As senhas não coincidem.";
  } else if (form.password || form.passwordConfirm) {
    if (form.password.length < 6) errors.password = "Mínimo de 6 caracteres.";
    if (form.password !== form.passwordConfirm) errors.passwordConfirm = "As senhas não coincidem.";
  }
  return Object.keys(errors).length === 0;
}

function payload() {
  const base = {
    login: form.name,
    nome_usuario: form.username,
    email: form.email,
    ativo: form.active,
 
  };
  if (!isEdit.value) base.senha = form.password;
  else if (form.password) base.senha = form.password;
  return base;
}

onMounted(async () => {
  if (route.params.id) {
    isEdit.value = true;
    const user = await usersStore.fetchOne(route.params.id);

    
    form.name = user.login;
    form.username = user.nome_usuario;
    form.email = user.email;
    form.active = user.ativo;
  }
});


async function onSubmit() {
  if (loading.value) return;
  if (!validate()) return;

  loading.value = true;
  try {
    if (isEdit.value) {
      console.log(payload());
      
      await usersStore.update(id, payload());
      notify.success({ title: "Usuário atualizado" });
      await usersStore.loadAll?.();
    } else {
      await usersStore.create(payload());
      notify.success({ title: "Usuário criado" });
      await usersStore.loadAll?.();
    }
    router.push("/users");
  } catch {}
  finally { loading.value = false; }
}
</script>