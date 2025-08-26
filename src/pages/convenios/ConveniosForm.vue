<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center gap-3">
      <button @click="goBack"
        class="size-9 grid place-items-center rounded-lg border border-line hover:bg-gray-50">←</button>
      <div>
        <h1 class="text-2xl font-bold">{{ isEdit ? "Editar Convênio" : "Novo Convênio" }}</h1>
        <p class="text-md text-gray-500">Preencha os dados do convênio</p>
      </div>
    </div>

    <!-- Card -->
    <div class="bg-white rounded-md shadow-[var(--shadow-card)] border border-line">
      <form @submit.prevent="onSubmit" class="p-4 space-y-6">
        <!-- Nome -->
        <fieldset class="space-y-1">
          <label class="text-md text-gray-700">Nome</label>
          <input v-model.trim="form.nome" placeholder="Digite o nome do convênio"
            class="w-full border border-line rounded-lg px-4 py-2" />
        </fieldset>

        <!-- Coparticipação + Telefone -->
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label class="text-md text-gray-700">Valor de Coparticipação (%)</label>
            <input v-model.number="form.coparticipacao" type="number" step="0.01" min="0" placeholder="0.00"
              class="w-full border border-line rounded-lg px-4 py-2" />
          </div>
          <div>
            <label class="text-md text-gray-700">Telefone</label>
            <input v-model="form.telefone" v-phone placeholder="(00) 00000-0000"
              class="w-full border border-line rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand/30" />
            <!-- <p v-if="errors.telefone" class="text-xs text-red-600 mt-1">{{ errors.telefone }}</p> -->
          </div>
        </div>

        <!-- Contato -->
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label class="text-md text-gray-700">Contato</label>
            <input v-model.trim="form.contato" placeholder="Nome do contato"
              class="w-full border border-line rounded-lg px-4 py-2" />
          </div>
          <div>
            <label class="text-md text-gray-700">Email do Contato</label>
            <input v-model.trim="form.email" type="email" placeholder="email@exemplo.com"
              class="w-full border border-line rounded-lg px-4 py-2" />
          </div>
        </div>

        <!-- Botões -->
        <div class="flex items-center justify-end gap-2 pt-2 border-t border-line">
          <RouterLink to="/convenios" class="px-3 py-2 rounded-lg border border-line hover:bg-gray-50">Cancelar
          </RouterLink>
          <button type="submit" :disabled="saving"
            class="px-3 py-2 rounded-lg bg-brand text-white hover:bg-brand-600 disabled:opacity-60">
            {{ saving ? "Salvando…" : (isEdit ? "Salvar alterações" : "Salvar Convênio") }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useConveniosStore } from "@/stores/convenios.js";
import { useNotify } from "../../stores/notify";

const notify = useNotify()
const route = useRoute();
const router = useRouter();
const store = useConveniosStore();

const form = reactive({
  id: null,
  nome: "",
  coparticipacao: "",
  telefone: "",
  contato: "",
  email: "",
});

const isEdit = computed(() => Boolean(route.params.id));
const saving = computed(() => store.loading);

function goBack() { router.push("/convenios"); }

onMounted(async () => {
  if (isEdit.value) {
    const data = await store.fetchOne(route.params.id);
    form.id = data.id_convenio;
    form.nome = data.nome_convenio ?? "";
    form.coparticipacao = data.valor_coparticipacao ?? "";
    form.telefone = data.telefone_convenio ?? "";
    form.contato = data.nome_contato_convenio ?? "";
    form.email = data.email_contato_convenio ?? "";
  }
});

async function onSubmit() {
  if (!form.nome.trim()) { alert("Informe o nome do convênio"); return; }
  const payload = {
    nome_convenio: form.nome,
    valor_coparticipacao: form.coparticipacao,
    telefone_convenio: form.telefone,
    nome_contato_convenio: form.contato,
    email_contato_convenio: form.email,
  };

  if (isEdit.value) {
    await store.update(form.id, payload);
    notify.success({ title: "Tipo de Atendimento atualizado" });
  }
  else {
    await store.create(payload);
    notify.success({ title: "Tipo de Atendimento criado" });
  }

  router.push("/convenios");
}

const vPhone = {
  mounted(el) {
    // garante attrs úteis
    el.setAttribute('inputmode', 'tel');
    el.setAttribute('autocomplete', 'tel');
    el.setAttribute('maxlength', '16'); // (00) 00000-0000

    const format = (value = "") => {
      const digits = String(value).replace(/\D/g, "").slice(0, 11);
      if (digits.length <= 10) {
        // (00) 0000-0000
        return digits.replace(
          /^(\d{0,2})(\d{0,4})(\d{0,4}).*/,
          (_, a, b, c) => [a && `(${a}`, a && ") ", b, c && `-${c}`].filter(Boolean).join("")
        );
      }
      // (00) 00000-0000
      return digits.replace(
        /^(\d{0,2})(\d{0,5})(\d{0,4}).*/,
        (_, a, b, c) => [a && `(${a}`, a && ") ", b, c && `-${c}`].filter(Boolean).join("")
      );
    };

    const commit = () => {
      const masked = format(el.value);
      if (el.value !== masked) {
        el.value = masked;
        // dispara 'input' pra atualizar o v-model
        el.dispatchEvent(new Event("input", { bubbles: true }));
      }
    };

    // bloqueia não-dígitos ANTES de entrar no input (cobre IME e mobile)
    const onBeforeInput = (e) => {
      // allow deletions / compositions
      if (e.inputType && e.inputType.startsWith("delete")) return;
      // quando data é null (ex: colagem grande), deixamos passar e tratamos no input
      if (e.data && /\D/.test(e.data)) e.preventDefault();
    };

    // formata sempre que o valor muda
    const onInput = () => commit();

    // bloqueia letras no teclado (setas/backspace/home/end ok)
    const onKeydown = (e) => {
      const allowed = ["Backspace", "Delete", "Tab", "ArrowLeft", "ArrowRight", "Home", "End", "Enter"];
      if (allowed.includes(e.key)) return;
      if (!/^\d$/.test(e.key)) e.preventDefault();
    };

    // trata colagem para aceitar só números
    const onPaste = (e) => {
      e.preventDefault();
      const text = (e.clipboardData || window.clipboardData).getData("text") || "";
      el.value = text;
      commit();
    };

    el.addEventListener("beforeinput", onBeforeInput);
    el.addEventListener("input", onInput);
    el.addEventListener("keydown", onKeydown);
    el.addEventListener("paste", onPaste);

    // formata caso já venha preenchido (edição)
    commit();

    // cleanup
    el._phone_cleanup = () => {
      el.removeEventListener("beforeinput", onBeforeInput);
      el.removeEventListener("input", onInput);
      el.removeEventListener("keydown", onKeydown);
      el.removeEventListener("paste", onPaste);
    };
  },
  beforeUnmount(el) {
    el._phone_cleanup?.();
  }
};
</script>