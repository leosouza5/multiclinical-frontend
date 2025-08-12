<template>
  <div class="min-h-dvh bg-gray-50 text-gray-900">
    <!-- Grid com coluna fixa da sidebar e coluna fluida do conteúdo -->
    <div class="grid grid-cols-[16rem_1fr] min-h-dvh">
      <!-- SIDEBAR: fica “grudada” no topo e vai até o fim da página -->
      <aside class="bg-white border-r border-line sticky top-0 self-start h-dvh flex flex-col">
        <!-- Logo -->
        <div class="h-14 px-4 flex items-center gap-2 border-b border-line">
          <div class="inline-flex items-center justify-center rounded-md bg-brand text-white p-2.5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 23 23" width="20" height="20" fill="none"
              stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="block">
              <path
                d="M2 9.5a5.5 5.5 0 0 1 9.591-3.676.56.56 0 0 0 .818 0A5.49 5.49 0 0 1 22 9.5c0 2.29-1.5 4-3 5.5l-5.492 5.313a2 2 0 0 1-3 .019L5 15c-1.5-1.5-3-3.2-3-5.5" />
            </svg>
          </div>
          <span class="font-semibold">MultiClínical</span>
        </div>

        <!-- Navegação -->
        <nav class="p-3 text-sm flex-1 overflow-auto">
          <RouterLink :to="{ name: 'dashboard' }"
            class="flex items-center gap-2 px-3 py-2 rounded-md border border-transparent"
            :class="linkClass('dashboard')">
            <House class="text-brand" />
            <span>Dashboard</span>
          </RouterLink>

          <div class="mt-4 px-3 text-xs uppercase text-gray-500">Atendimentos</div>

          <RouterLink :to="{ name: 'appointments' }"
            class="mt-1 flex items-center gap-2 px-3 py-2 rounded-md border border-transparent"
            :class="linkClass('appointments')">
            <CalendarClock class="text-brand" />
            <span>Atendimentos</span>
          </RouterLink>
          <hr class="mt-4 border-t border-line" />

          <div class="mt-4 px-3 text-xs uppercase text-gray-500">Pacientes</div>

          <RouterLink :to="{ name: '' }"
            class="mt-1 flex items-center gap-2 px-3 py-2 rounded-md border border-transparent" :class="linkClass('')">
            <Users class="text-brand" />
            <span>Pacientes</span>
          </RouterLink>
          <hr class="mt-4 border-t border-line" />

          <div class="mt-4 px-3 text-xs uppercase text-gray-500">Clínicas</div>

          <RouterLink :to="{ name: '' }"
            class="mt-1 flex items-center gap-2 px-3 py-2 rounded-md border border-transparent" :class="linkClass('')">
            <Building2 class="text-brand" />
            <span>Clínicas</span>
          </RouterLink>
          <hr class="mt-4 border-t border-line" />

          <div class="mt-4 px-3 text-xs uppercase text-gray-500">Procedimentos</div>

          <RouterLink :to="{ name: '' }"
            class="mt-1 flex items-center gap-2 px-3 py-2 rounded-md border border-transparent" :class="linkClass('')">
            <NotepadText class="text-brand" />
            <span>Procedimentos</span>
          </RouterLink>
          <hr class="mt-4 border-t border-line" />

          <div class="mt-4 px-3 text-xs uppercase text-gray-500">Convênios</div>

          <RouterLink :to="{ name: '' }"
            class="mt-1 flex items-center gap-2 px-3 py-2 rounded-md border border-transparent" :class="linkClass('')">

            <FileText class="text-brand" />
            <span>Convênios</span>
          </RouterLink>
          <hr class="mt-4 border-t border-line" />

          <div class="mt-4 px-3 text-xs uppercase text-gray-500">Tipos de Atendimentos</div>

          <RouterLink :to="{ name: '' }"
            class="mt-1 flex items-center gap-2 px-3 py-2 rounded-md border border-transparent" :class="linkClass('')">
            <List class="text-brand" />
            <span>Tipos de Atendimentos</span>
          </RouterLink>
          <hr class="mt-4 border-t border-line" />

          <div class="mt-4 px-3 text-xs uppercase text-gray-500">Financeiro</div>

          <RouterLink :to="{ name: '' }"
            class="mt-1 flex items-center gap-2 px-3 py-2 rounded-md border border-transparent" :class="linkClass('')">

            <DollarSign class="text-brand" />
            <span>Visão Geral</span>
          </RouterLink <hr class="mt-4 border-t border-line" />
          <hr class="mt-4 border-t border-line" />


          <div class="mt-4 px-3 text-xs uppercase text-gray-500">Administração</div>

          <RouterLink :to="{ name: 'users' }"
            class="mt-1 flex items-center gap-2 px-3 py-2 rounded-md border border-transparent"
            :class="linkClass('users')">
            <UserPlus class="text-brand" />
            <span>Usuários</span>
          </RouterLink>
          <hr class="mt-4 border-t border-line" />

        </nav>
      </aside>

      <!-- COLUNA DE CONTEÚDO -->
      <div class="flex flex-col min-w-0">
        <!-- Header começa APÓS a sidebar -->
        <header class="h-14 bg-white border-b border-line px-4 flex items-center justify-end ">
          <div class="relative" ref="menuRef">
            <button @click="menuOpen = !menuOpen"
              class="size-8 rounded-md bg-gray-200 grid place-items-center text-xs font-bold cursor-pointer"
              :aria-expanded="menuOpen ? 'true' : 'false'" aria-haspopup="menu" title="Abrir menu do usuário">
              {{ initials }}
            </button>

            <!-- Dropdown -->
            <div v-if="menuOpen"
              class="absolute right-0 mt-2 w-52 rounded-md border border-line bg-white shadow-[var(--shadow-card)] p-1 z-10"
              role="menu">
              <div class="px-3 py-2 text-sm text-gray-600">
                <div class="font-medium text-gray-900 truncate">{{ displayName }}</div>
                <div class="truncate">{{ displayEmail }}</div>
              </div>
              <div class="my-1 border-t border-line"></div>
              <button @click="onLogout" class="w-full text-left px-3 py-2 text-sm rounded-md hover:bg-gray-50"
                role="menuitem">
                Sair
              </button>
            </div>
          </div>
        </header>

        <!-- Conteúdo -->
        <main class="flex-1 p-4 min-w-0 overflow-auto">
          <RouterView />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  Building2,
  CalendarClock,
  DollarSign,
  FileText,
  House,
  List,
  NotepadText,
  UserPlus,
  Users
} from "lucide-vue-next";
import { useRoute, useRouter } from "vue-router";
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useAuthStore } from "@/stores/auth";

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();

function linkClass(name) {
  const active = route.name === name;
  return active
    ? "bg-gray-100 font-medium border border-line font-semibold"
    : "hover:bg-gray-50 font-semibold";
}

// ===== Avatar + Menu =====
const menuOpen = ref(false);
const menuRef = ref(null);

const displayName = computed(() =>
  auth.user?.name ||
  auth.user?.nome ||
  auth.user?.nome_usuario ||
  auth.user?.username ||
  ""
);
const displayEmail = computed(() => auth.user?.email || "");

const initials = computed(() => {
  const source =
    displayName.value ||
    auth.user?.username ||
    auth.user?.nome_usuario ||
    auth.user?.email ||
    "";
  if (!source) return "US";
  const parts = source.trim().split(/\s+/);
  if (parts.length === 1) {
    return parts[0]
      .replace(/[^a-zA-Z]/g, "")
      .slice(0, 2)
      .toUpperCase() || parts[0].slice(0, 2).toUpperCase();
  }
  return (parts[0][0] + (parts[1]?.[0] || "")).toUpperCase();
});

function onDocClick(e) {
  if (!menuRef.value) return;
  if (!menuRef.value.contains(e.target)) menuOpen.value = false;
}
onMounted(() => document.addEventListener("pointerdown", onDocClick));
onBeforeUnmount(() => document.removeEventListener("pointerdown", onDocClick));

function onLogout() {
  auth.logout();
  menuOpen.value = false;
  router.replace({ name: "login" });
}
</script>
