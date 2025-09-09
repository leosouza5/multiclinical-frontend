<template>
  <input ref="el" :value="display" class="w-full border border-line rounded-lg focus:outline-none focus:ring-2 focus:ring-brand/30 px-3 py-2 text-right" inputmode="numeric"
    autocomplete="off" @keydown="onKeydown" @paste="onPaste" @focus="onFocus" @blur="onBlur" />
</template>

<script setup>
import { computed, ref, watch, onMounted } from "vue";

// v-model numérico (ex.: 1234.56)
const props = defineProps({
  modelValue: { type: Number, default: 0 }
});
const emit = defineEmits(["update:modelValue"]);

const el = ref(null);
// Armazena apenas dígitos (centavos). Ex.: 123456 -> R$ 1.234,56
const digits = ref("0");

// ---- helpers de formatação/parsing ----
const toDigits = (num) => {
  // Number -> "centavos"
  const cents = Math.round((Number(num) || 0) * 100);
  return String(Math.max(0, cents));
};
const fromDigits = (ds) => {
  // "centavos" -> Number
  const n = Number(ds || "0");
  return (n / 100) || 0;
};
const fmtBRL = (n) =>
  new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(n);

const display = computed(() => fmtBRL(fromDigits(digits.value)));

// Mantém em sincronia quando modelValue muda de fora
watch(() => props.modelValue, (v) => {
  const next = toDigits(v);
  if (next !== digits.value) digits.value = next;
});

// Inicializa
onMounted(() => { digits.value = toDigits(props.modelValue); });

// ---- edição baseada em teclas ----
function commit() {
  const val = fromDigits(digits.value);
  emit("update:modelValue", val);
}

function addDigit(d) {
  // appenda dígito à direita (em centavos)
  if (!/^\d$/.test(d)) return;
  // evita crescer infinito com zeros à esquerda
  if (digits.value === "0") digits.value = d;
  else digits.value += d;
  commit();
}

function backspace() {
  // remove último dígito
  if (digits.value.length <= 1) digits.value = "0";
  else digits.value = digits.value.slice(0, -1);
  commit();
}

function delAll() {
  digits.value = "0";
  commit();
}

function onKeydown(e) {
  const k = e.key;

  // Permite navegação/atalhos comuns
  const allow =
    ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End", "Tab"].includes(k) ||
    (e.ctrlKey || e.metaKey) && ["a", "c", "v", "x", "A", "C", "V", "X"].includes(k);
  if (allow) return;

  // Bloqueia entrada padrão (vamos tratar nós mesmos)
  e.preventDefault();

  if (/^\d$/.test(k)) return addDigit(k);
  if (k === "Backspace") return backspace();
  if (k === "Delete") return delAll();
  if (k === "Enter") return; // nada especial
  // ignora outros
}

function onPaste(e) {
  e.preventDefault();
  const txt = (e.clipboardData?.getData("text") || "").toString();
  const onlyDigits = txt.replace(/[^\d]/g, "");
  if (!onlyDigits) return;
  // se colar "1234,56" -> onlyDigits = 123456 (se vier com pontos/vírgula)
  // heurística: se houver vírgula/ponto no original, tentamos interpretar como moeda
  if (/[.,]/.test(txt)) {
    // mantém no máximo 2 casas
    const n = Number(txt.replace(/\./g, "").replace(",", "."));
    if (!isNaN(n)) {
      digits.value = toDigits(n);
      return commit();
    }
  }
  // caso contrário, tratamos como centavos já
  digits.value = String(parseInt(onlyDigits, 10)).replace(/^NaN$/, "0");
  commit();
}

function onFocus() {
  // seleciona tudo para facilitar digitação direta de novo valor
  requestAnimationFrame(() => {
    try { el.value?.setSelectionRange(0, String(display.value).length); } catch { }
  });
}

function onBlur() {
  // nada especial; display já fica formatado
}
</script>
