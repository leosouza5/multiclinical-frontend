<template>
  <div class="min-h-screen grid place-items-center bg-gray-50">
    <div class="w-full max-w-md">
      <!-- Logo -->
      <div class="flex items-center justify-center gap-1 mb-6">
        <div class="p-3 flex items-center rounded-md bg-brand text-white">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
               stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5
                     c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15
                     c-1.5-1.5-3-3.2-3-5.5" />
          </svg>
        </div>
        <div class="text-2xl font-bold">MultiClínical</div>
      </div>

      <!-- Card -->
      <div class="bg-white rounded-md px-6 py-8 shadow-[var(--shadow-card)]">
        <h1 class="text-center text-2xl font-bold">Esqueci minha senha</h1>
        <p class="text-center text-md text-gray-500 mt-1">
          Informe seu email e nós enviaremos um link para recuperar sua senha.
        </p>

        <!-- Mensagem de retorno do backend -->
        <div v-if="successMessage"
             class="mt-4 p-3 rounded-md border border-green-300 bg-green-50 text-green-700 text-sm">
          {{ successMessage }}
        </div>

        <!-- Campo Email -->
        <div class="mt-6">
          <label class="block text-md mb-1">Email</label>
          <input v-model.trim="email" type="email"
                 class="w-full border border-line rounded px-3 py-2"
                 :disabled="loading" />
          <p v-if="errors.email" class="text-xs text-red-600 mt-1">{{ errors.email }}</p>
        </div>

        <!-- Botão -->
        <AppButton class="mt-5 w-full" :loading="loading" @click="onSubmit">
          Recuperar senha
        </AppButton>

        <!-- Link voltar -->
        <RouterLink to="/login"
          class="my-6 inline-flex items-center gap-2 text-brand hover:underline font-medium justify-center w-full">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18"
               fill="none" stroke="currentColor" stroke-width="2"
               stroke-linecap="round" stroke-linejoin="round">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          <span>Voltar para o login</span>
        </RouterLink>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import AppButton from "../../components/AppButton.vue";
import { forgotPasswordRequest } from "../../services/auth";

const email = ref("");
const loading = ref(false);
const errors = reactive({});
const successMessage = ref("");

function validate() {
  Object.keys(errors).forEach(k => delete errors[k]);
  if (!email.value || !/.+@.+\..+/.test(email.value)) {
    errors.email = "E-mail inválido.";
  }
  return Object.keys(errors).length === 0;
}

async function onSubmit() {
  if (!validate()) return;
  loading.value = true;
  successMessage.value = "";
  try {
    const res = await forgotPasswordRequest({ email: email.value });
    successMessage.value = res?.message || "Caso seu email seja válido, enviaremos um link para continuar.";
  } finally {
    loading.value = false;
  }
}
</script>
