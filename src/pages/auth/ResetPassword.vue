<template>
    <div class="min-h-screen grid place-items-center bg-gray-50">
        <div class="w-full max-w-md">
            <!-- Logo -->
            <div class="flex items-center justify-center gap-1 mb-6">
                <div class="p-3 flex items-center rounded-md bg-brand text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor"
                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0
                       A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5
                       l-5.492 5.313a2 2 0 0 1-3 .019L5 15
                       c-1.5-1.5-3-3.2-3-5.5" />
                    </svg>
                </div>
                <div class="text-2xl font-bold">MultiClínical</div>
            </div>

            <!-- Card -->
            <div class="bg-white rounded-md px-6 py-8 shadow-[var(--shadow-card)]">
                <h1 class="text-center text-2xl font-bold">Redefinir senha</h1>
                <p class="text-center text-md text-gray-500 mt-1">
                    Defina sua nova senha para acessar sua conta.
                </p>

                <!-- Mensagem sucesso -->
                <div v-if="successMessage"
                    class="mt-4 p-3 rounded-md border border-green-300 bg-green-50 text-green-700 text-sm">
                    {{ successMessage }}
                </div>

                <!-- Campos -->
                <div class="mt-6">
                    <label class="block text-md mb-1">Nova senha</label>
                    <input v-model.trim="password" type="password" class="w-full border border-line rounded px-3 py-2"
                        :disabled="loading" />
                    <p v-if="errors.password" class="text-xs text-red-600 mt-1">{{ errors.password }}</p>
                </div>

                <div class="mt-4">
                    <label class="block text-md mb-1">Confirmar senha</label>
                    <input v-model.trim="passwordConfirm" type="password"
                        class="w-full border border-line rounded px-3 py-2" :disabled="loading" />
                    <p v-if="errors.passwordConfirm" class="text-xs text-red-600 mt-1">{{ errors.passwordConfirm }}</p>
                </div>

                <!-- Botão -->
                <AppButton class="mt-5 w-full" :loading="loading" @click="onSubmit">
                    Alterar senha
                </AppButton>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive } from "vue";
import { useRoute, useRouter } from "vue-router";
import AppButton from "../../components/AppButton.vue";
import { resetPasswordWithToken } from "../../services/auth";

const route = useRoute();
const router = useRouter();

const token = String(route.query.token || "");
const password = ref("");
const passwordConfirm = ref("");
const loading = ref(false);
const errors = reactive({});
const successMessage = ref("");

function validate() {
    Object.keys(errors).forEach(k => delete errors[k]);
    if (!token) { errors.global = "Token inválido."; return false; }
    if (!password.value || password.value.length < 6) errors.password = "A nova senha deve ter pelo menos 6 caracteres.";
    if (password.value !== passwordConfirm.value) errors.passwordConfirm = "As senhas não coincidem.";
    return Object.keys(errors).length === 0;
}


async function onSubmit() {
    if (!validate()) return;
    loading.value = true;
    successMessage.value = "";
    console.log({
            token,
            novaSenha: password.value
        });
    
    try {
        const res = await resetPasswordWithToken({
            token,
            novaSenha: password.value
        });
        successMessage.value = res?.message || "Senha alterada com sucesso. Agora você já pode fazer login.";
        setTimeout(() => router.replace("/login"), 2500);
    } finally {
        loading.value = false;
    }

}
</script>