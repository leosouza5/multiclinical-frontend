<template>
  <div class="relative" v-click-outside="handleOutside">
    <div
      class="flex items-center border border-line rounded-lg bg-white shadow-[var(--shadow-card)] focus-within:ring-2 focus-within:ring-brand/30"
      @click="openDropdown"
    >
      <input
        ref="inputRef"
        :value="displayLabel"
        :placeholder="placeholder"
        class="w-full bg-transparent rounded-lg px-3 py-2 pr-8 outline-none"
        @focus="openDropdown"
        @input="onType($event.target.value)"
        @keydown="onKeydown"
        :aria-expanded="open ? 'true' : 'false'"
        :aria-controls="listId"
        :role="'combobox'"
      />
      <!-- chevron dentro da área clicável -->
      <span class="absolute right-2 text-gray-500 pointer-events-none">▾</span>
    </div>

    <!-- Dropdown -->
    <div
      v-if="open"
      class="absolute z-50 mt-1 w-full rounded-lg border border-line bg-white shadow-[var(--shadow-card)] max-h-64 overflow-auto"
      :id="listId"
      role="listbox"
    >
      <!-- Caixa de busca dedicada (opcional; mantém mesma consulta do input principal) -->
      <div class="p-2 border-b border-line">
        <input
          v-model="query"
          class="w-full border border-line rounded-md px-2 py-1 text-sm"
          placeholder="Digite para pesquisar…"
          @input="triggerSearch(query)"
          @keydown="onKeydown"
        />
      </div>

      <ul class="py-1">
        <li v-if="loading" class="px-3 py-2 text-sm text-gray-500">Carregando…</li>
        <li v-else-if="!items.length" class="px-3 py-2 text-sm text-gray-500">Nenhum resultado</li>

        <li
          v-for="(opt, i) in items"
          :key="getVal(opt) ?? i"
          class="px-3 py-2 text-sm cursor-pointer flex items-center justify-between"
          :class="i === activeIndex ? 'bg-gray-50' : 'hover:bg-gray-50'"
          @click="select(opt)"
          @mouseenter="activeIndex = i"
          role="option"
          :aria-selected="modelValue === getVal(opt) ? 'true' : 'false'"
        >
          <span class="truncate">{{ getText(opt) }}</span>
          <span v-if="modelValue === getVal(opt)">✔</span>
        </li>
      </ul>

      <div class="border-t px-2 py-1 text-right">
        <button
          type="button"
          class="text-sm text-gray-600 px-2 py-1 rounded hover:bg-gray-50"
          @click="closeDropdown"
        >Fechar</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted } from "vue";

const props = defineProps({
  modelValue: [String, Number, Object, null],
  items: { type: Array, default: () => [] },
  itemText: { type: String, default: "nome" },
  itemValue: { type: String, default: "id" },
  placeholder: { type: String, default: "Selecione..." },
});
const emit = defineEmits(["update:modelValue", "search"]);

const open = ref(false);
const query = ref("");
const loading = ref(false);
const activeIndex = ref(-1);
const inputRef = ref(null);
const listId = `ss-${Math.random().toString(36).slice(2, 9)}`;

function getText(o){ return o?.[props.itemText] ?? ""; }
function getVal(o){ return o?.[props.itemValue]; }

const displayLabel = computed(() => {
  const found = props.items.find(i => getVal(i) === props.modelValue);
  return found ? getText(found) : query.value || "";
});

function openDropdown() {
  open.value = true;
  // primeira abertura: dispara busca inicial
  if (!props.items?.length) triggerSearch("");
  // posiciona highlight no item selecionado
  const idx = props.items.findIndex(i => getVal(i) === props.modelValue);
  activeIndex.value = idx >= 0 ? idx : -1;
}

function closeDropdown() { open.value = false; }

function onType(val){
  query.value = val;
  if (!open.value) openDropdown();
  triggerSearch(val);
}

function select(opt){
  emit("update:modelValue", getVal(opt));
  closeDropdown();
}

function onKeydown(e){
  if (!open.value && (e.key === "ArrowDown" || e.key === "Enter")) {
    openDropdown();
    e.preventDefault();
    return;
  }
  if (!open.value) return;

  const max = props.items.length - 1;
  if (e.key === "ArrowDown") {
    activeIndex.value = activeIndex.value < max ? activeIndex.value + 1 : 0;
    e.preventDefault();
  } else if (e.key === "ArrowUp") {
    activeIndex.value = activeIndex.value > 0 ? activeIndex.value - 1 : max;
    e.preventDefault();
  } else if (e.key === "Enter") {
    const opt = props.items[activeIndex.value];
    if (opt) select(opt);
    e.preventDefault();
  } else if (e.key === "Escape" || e.key === "Tab") {
    closeDropdown();
  }
}

let _t = null;
function triggerSearch(q){
  clearTimeout(_t);
  _t = setTimeout(() => {
    loading.value = true;
    Promise.resolve(emit("search", q)).finally(() => {
      loading.value = false;
      // reset highlight
      const idx = props.items.findIndex(i => getVal(i) === props.modelValue);
      activeIndex.value = idx >= 0 ? idx : (props.items.length ? 0 : -1);
    });
  }, 200);
}

// --- click outside (diretiva local) ---
function handleOutside(evt){
  if (!open.value) return;
  const root = evt?.currentTarget; // não usamos aqui (diretiva fornece el), mas mantemos assinatura
  // Fecha se clicar fora do wrapper (feito pela diretiva)
  closeDropdown();
}
onMounted(() => {
  // nada extra
});

// diretiva local de click-outside
const vClickOutside = {
  mounted(el, binding) {
    el.__clickOutside__ = (e) => {
      if (!(el === e.target || el.contains(e.target))) {
        binding.value(e);
      }
    };
    document.addEventListener("mousedown", el.__clickOutside__);
    document.addEventListener("touchstart", el.__clickOutside__);
  },
  unmounted(el) {
    document.removeEventListener("mousedown", el.__clickOutside__);
    document.removeEventListener("touchstart", el.__clickOutside__);
    delete el.__clickOutside__;
  }
};
// registra localmente
// eslint-disable-next-line vue/no-setup-props-destructure
defineExpose({});
</script>

<script>
// registra a diretiva no escopo do componente
export default {
  directives: { clickOutside: {
    mounted(el, binding) {
      el.__clickOutside__ = (e) => {
        if (!(el === e.target || el.contains(e.target))) {
          binding.value(e);
        }
      };
      document.addEventListener("mousedown", el.__clickOutside__);
      document.addEventListener("touchstart", el.__clickOutside__);
    },
    unmounted(el) {
      document.removeEventListener("mousedown", el.__clickOutside__);
      document.removeEventListener("touchstart", el.__clickOutside__);
      delete el.__clickOutside__;
    }
  } }
};
</script>
