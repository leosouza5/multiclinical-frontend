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
            <!-- <button class="px-3 py-2 border border-line rounded-lg">Filtros</button> -->
        </div>

        <div class="bg-white rounded-md shadow-[var(--shadow-card)] min-h-[150px]">
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
                <div class="flex-1 overflow-x-auto overflow-y-auto min-h-[500px]">
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
                                        {{ u.ativo ? 'Ativo' : 'Inativo' }}
                                    </span>
                                </td>
                                <td class="px-4 py-3 text-center">
                                    <Menu as="div" class="relative inline-block text-left">
                                        <MenuButton
                                            class="inline-flex items-center justify-center size-8 rounded-md border border-line hover:bg-gray-50 focus:outline-none"
                                            aria-label="Ações">
                                            <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24"
                                                fill="currentColor">
                                                <circle cx="5" cy="12" r="2"></circle>
                                                <circle cx="12" cy="12" r="2"></circle>
                                                <circle cx="19" cy="12" r="2"></circle>
                                            </svg>
                                        </MenuButton>

                                        <MenuItems
                                            class="absolute right-0 mt-2 w-40 origin-top-right rounded-md border border-line bg-white shadow-[var(--shadow-card)] focus:outline-none z-50">
                                            <div class="p-1">
                                                <MenuItem v-slot="{ active }">
                                                <button @click="onEdit(u)"
                                                    class="w-full text-left px-3 py-2 text-sm rounded-md"
                                                    :class="active ? 'bg-gray-50' : ''">
                                                    Editar
                                                </button>
                                                </MenuItem>
                                                <MenuItem v-slot="{ active }">
                                                <button @click="askDelete(u)"
                                                    class="w-full text-left px-3 py-2 text-sm rounded-md text-red-700"
                                                    :class="active ? 'bg-gray-50' : ''">
                                                    Excluir
                                                </button>
                                                </MenuItem>
                                            </div>
                                        </MenuItems>
                                    </Menu>
                                </td>



                            </tr>

                            <tr v-if="filtered.length === 0">
                                <td colspan="5" class="px-4 py-6 text-center text-gray-500">Nenhum usuário encontrado
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </template>
        </div>
    </div>

    <!-- Modal de confirmação -->
    <AppModal :open="confirmOpen" title="Excluir usuário"
        :description="`Tem certeza que deseja excluir ${confirmName}? Essa ação não poderá ser desfeita.`"
        cancelText="Cancelar" confirmText="Excluir" :confirmLoading="confirmLoading" @close="confirmOpen = false"
        @confirm="confirmDelete" />
</template>

<script setup>
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";
import { useUsersStore } from "../../stores/users";
import { useNotify } from "../../stores/notify";
import AppModal from "../../components/AppModal.vue";

const router = useRouter();
const usersStore = useUsersStore();
const notify = useNotify();

const q = ref("");
const openId = ref(null);
const confirmOpen = ref(false);
const confirmLoading = ref(false);
const confirmId = ref(null);
const confirmName = ref("");

function getId(u) { return u.id ?? u.id_usuario ?? null; }
function getName(u) { return u.name ?? u.nome_usuario ?? ""; }

function toggleMenu(u) {
    const id = getId(u);
    openId.value = openId.value === id ? null : id;
}

function askDelete(u) {
    openId.value = null;
    confirmId.value = getId(u);
    confirmName.value = getName(u);
    confirmOpen.value = true;
}

async function confirmDelete() {
    if (!confirmId.value) return;
    confirmLoading.value = true;
    try {
        await usersStore.remove(confirmId.value);
        notify.success({ title: "Usuário removido" });
        confirmOpen.value = false;
    } catch {/* erro já no interceptor */ }
    finally {
        confirmLoading.value = false;
    }
}

function onDocClick(e) {
    if (!(e.target.closest && e.target.closest("[role='menu']")) &&
        !(e.target.closest && e.target.closest("button"))) {
        openId.value = null;
    }
}
onMounted(() => {
    document.addEventListener("pointerdown", onDocClick);
    usersStore.loadAll();
});
onBeforeUnmount(() => document.removeEventListener("pointerdown", onDocClick));

const items = computed(() => usersStore.items);
const loading = computed(() => usersStore.loading);
const filtered = computed(() => {
    const term = q.value.trim().toLowerCase();
    if (!term) return items.value;
    return items.value.filter(u =>
        [getId(u), getName(u), u.email, u.login]
            .filter(Boolean)
            .some(v => String(v).toLowerCase().includes(term))
    );
});

function onEdit(u) {
    const id = getId(u);
    openId.value = null;
    router.push(`/users/${id}/edit`);
}
</script>