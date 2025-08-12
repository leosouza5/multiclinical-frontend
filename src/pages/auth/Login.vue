<template>
    <div class="min-h-screen grid place-items-center bg-gray-50">
        <div class="w-full max-w-md">
            <div class="flex items-center justify-center gap-1 mb-6">
                <div class="p-3 flex items-center rounded-md bg-brand text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none"
                        stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
                        class="lucide lucide-heart-icon lucide-heart">
                        <path
                            d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
                    </svg>
                </div>
                <div class="text-2xl font-bold">MultiClínical</div>
            </div>

            <form @submit.prevent="onSubmit" class="bg-white rounded-md px-6 py-18 shadow-[var(--shadow-card)]">
                <h1 class="text-center text-2xl font-bold">Entrar</h1>
                <p class="text-center text-md text-gray-500 mt-1">Entre com suas credenciais para acessar sua conta</p>

                <div class="mt-6">
                    <label class="block text-md mb-1">Nome de Usuário</label>
                    <input v-model.trim="userName" type="text"
                        class="w-full border border-line border border-line-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand focus:border border-line-transparent" />
                </div>

                <div class="mt-4">
                    <div class="flex items-center justify-between">
                        <label class="block text-md mb-1">Senha</label>
                        <RouterLink to="/forgot" class="text-md text-brand hover:text-brand-600 hover:underline">
                            Esqueci minha senha
                        </RouterLink>
                    </div>

                    <div class="relative">
                        <input v-model.trim="password" :type="showPassword ? 'text' : 'password'"
                            class="w-full border border-line border-gray-300 rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-brand focus:border-transparent" />
                        <button type="button"
                            class="absolute inset-y-0 right-0 px-3 flex items-center text-gray-500 hover:text-gray-700"
                            @click="showPassword = !showPassword">
                            <Eye class="text-brand" v-if="!showPassword" />
                            <EyeClosed class="text-brand" v-else />
                        </button>
                    </div>
                </div>

                <label class="mt-4 flex items-center gap-2 text-md text-gray-600">
                    <input type="checkbox" class="size-4 text-brand focus:ring-brand" v-model="remember" />
                    Lembrar de mim
                </label>

                <p v-if="error" class="text-md text-red-600 mt-3">{{ error }}</p>

                <button :disabled="loading"
                    class="mt-6 w-full py-2.5 rounded-md bg-brand text-white font-medium hover:bg-brand-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                    {{ loading ? "Entrando..." : "Entrar" }}
                </button>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import { Eye, EyeClosed } from "lucide-vue-next";

const userName = ref("");
const password = ref("");
const remember = ref(false);
const loading = ref(false);
const error = ref("");
const showPassword = ref(false);

const router = useRouter();
const route = useRoute();
const auth = useAuthStore();

async function onSubmit() {
    loading.value = true; error.value = "";
    try {
        console.log(userName.value);

        await auth.login({ userName: userName.value, password: password.value, remember: remember.value });
        router.push(String(route.query.redirect || "/"));
    } catch (e) {
        error.value = auth.error || "Erro ao entrar";
    } finally {
        loading.value = false;
    }
}
</script>
