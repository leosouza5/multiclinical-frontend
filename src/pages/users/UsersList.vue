<template>
    <div>
        <div class="flex items-center justify-between mb-2">
            <h1 class="text-2xl font-bold">Usuários</h1>
            <RouterLink to="/users/new" class="px-3 py-2 rounded-lg bg-brand text-white hover:bg-brand-600">
                + Novo Usuário
            </RouterLink>
        </div>
        <p class="text-md text-gray-500 mb-4">Gerencie todos os usuários</p>

        <div class="flex items-center gap-2 mb-3">
            <div class="flex-1 relative">
                <input v-model="q" placeholder="Buscar usuários..."
                    class="w-full border border-line rounded-lg px-4 py-2 pl-10" />
                <span class="absolute left-3 top-1/2 -translate-y-1/2">🔎</span>
            </div>
            <button class="px-3 py-2 border border-line rounded-lg">Filtros</button>
        </div>

        <div class="bg-white rounded-md shadow-[var(--shadow-card)] overflow-hidden min-h-[150px] flex flex-col">
            <template v-if="loading">
                <!-- Spinner centralizado -->
                <div class="flex-1 flex items-center justify-center py-10 text-gray-500">
                    <svg class="animate-spin h-6 w-6 text-brand" xmlns="http://www.w3.org/2000/svg" fill="none"
                        viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                        </circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                    </svg>
                </div>
            </template>

            <template v-else>
                <table class="min-w-full text-md">
                    <thead class="bg-gray-50 text-gray-500">
                        <tr>
                            <th class="text-left px-4 py-2">ID</th>
                            <th class="text-left px-4 py-2">Nome</th>
                            <th class="text-left px-4 py-2">Status</th>
                            <th class="px-4 py-2 text-center">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(u, i) in filtered" :key="u.id" class="border-t border-line">
                            <td class="px-4 py-3">{{ i + 1 }}</td>
                            <td class="px-4 py-3">
                                <div class="font-medium text-gray-900">{{ u.nome_usuario }}</div>
                                <div class="text-sm text-gray-500">{{ u.email }} • {{ u.login }}</div>
                            </td>
                            <td class="px-4 py-3">
                                <span :class="u.active ? 'text-green-700' : 'text-gray-500'">
                                    {{ u.active ? 'Ativo' : 'Inativo' }}
                                </span>
                            </td>
                            <td class="px-4 py-3 text-center relative">
                                <!-- Botão de ações -->
                                <button
                                    class="inline-flex items-center justify-center size-8 rounded-md border border-line hover:bg-gray-50 cursor-pointer"
                                    @click="toggleMenu(u)" :aria-expanded="openId === getId(u) ? 'true' : 'false'"
                                    aria-haspopup="menu">
                                    <!-- 3 pontinhos (SVG leve) -->
                                    <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24"
                                        fill="currentColor">
                                        <circle cx="5" cy="12" r="2"></circle>
                                        <circle cx="12" cy="12" r="2"></circle>
                                        <circle cx="19" cy="12" r="2"></circle>
                                    </svg>
                                </button>

                                <!-- Menu -->
                                <div v-if="openId === getId(u)"
                                    class="absolute right-2 mt-2 w-36 rounded-md border border-line bg-white shadow-[var(--shadow-card)] p-1 z-10"
                                    role="menu">
                                    <button class="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-50"
                                        @click="onEdit(u)" role="menuitem">
                                        Editar
                                    </button>
                                    <button
                                        class="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-50 text-red-700"
                                        @click="onDelete(u)" role="menuitem">
                                        Excluir
                                    </button>
                                </div>
                            </td>

                        </tr>

                        <tr v-if="filtered.length === 0">
                            <td colspan="5" class="px-4 py-6 text-center text-gray-500">Nenhum usuário encontrado</td>
                        </tr>
                    </tbody>
                </table>
            </template>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useUsersStore } from "../../stores/users";
import { useNotify } from "../../stores/notify";

const router = useRouter();
const usersStore = useUsersStore();
const notify = useNotify();

const q = ref("");
const openId = ref(null);         // id do menu aberto

function getId(u) {
    // funciona com objetos já mapeados (id) ou payload cru (id_usuario)
    return u.id ?? u.id_usuario ?? u.ID ?? u.uuid ?? null;
}

function toggleMenu(u) {
    const id = getId(u);
    openId.value = openId.value === id ? null : id;
}

// fechar ao clicar fora
function onDocClick(e) {
    // fecha se clicar fora de QUALQUER menu
    // (como o menu fica dentro da TD, basta detectar clique fora de botões/menus abertos)
    // simples e eficiente:
    if (!(e.target.closest && e.target.closest("[role='menu']")) &&
        !(e.target.closest && e.target.closest("button")))
        openId.value = null;
}
onMounted(() => document.addEventListener("pointerdown", onDocClick));
onBeforeUnmount(() => document.removeEventListener("pointerdown", onDocClick));

async function onEdit(u) {
    const id = getId(u);
    openId.value = null;
    // ajuste a rota conforme sua app (crie a rota /users/:id/edit se ainda não existir)
    router.push(`/users/${id}/edit`);
}

async function onDelete(u) {
    const id = getId(u);
    openId.value = null;

    // confirmação simples (pode trocar por modal depois)
    if (!confirm("Tem certeza que deseja excluir este usuário?")) return;

    try {
        await usersStore.remove(id);
        notify.success({ title: "Usuário removido" });
    } catch {
        // erro já é tratado globalmente pelo interceptor
    }
}

// (restante do seu código…)
const loading = computed(() => usersStore.loading);
const items = computed(() => usersStore.items);
const filtered = computed(() => {
    const term = q.value.trim().toLowerCase();
    if (!term) return items.value;
    return items.value.filter(u =>
        [getId(u), u.nome_usuario ?? u.name, u.email, u.login]
            .filter(Boolean)
            .some(v => String(v).toLowerCase().includes(term))
    );
});
onMounted(() => usersStore.loadAll());

</script>
