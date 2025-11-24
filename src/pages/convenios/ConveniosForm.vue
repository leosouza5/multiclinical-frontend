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
          <p v-if="errors.nome" class="text-xs text-red-600 mt-1">{{ errors.nome }}</p>
        </fieldset>

        <!-- Coparticipação + Telefone -->
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label class="text-md text-gray-700">Valor de Coparticipação (%)</label>
            <input v-model.number="form.coparticipacao" type="number" step="0.01" min="0" placeholder="0.00"
              class="w-full border border-line rounded-lg px-4 py-2" />
            <p v-if="errors.coparticipacao" class="text-xs text-red-600 mt-1">{{ errors.coparticipacao }}</p>
          </div>
          <div>
            <label class="text-md text-gray-700">Telefone</label>
            <input v-model="form.telefone" v-phone placeholder="(00) 00000-0000"
              class="w-full border border-line rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brand/30" />
            <p v-if="errors.telefone" class="text-xs text-red-600 mt-1">{{ errors.telefone }}</p>
          </div>
        </div>

        <!-- Contato -->
        <div class="grid md:grid-cols-2 gap-4">
          <div>
            <label class="text-md text-gray-700">Contato</label>
            <input v-model.trim="form.contato" placeholder="Nome do contato"
              class="w-full border border-line rounded-lg px-4 py-2" />
            <p v-if="errors.contato" class="text-xs text-red-600 mt-1">{{ errors.contato }}</p>
          </div>
          <div>
            <label class="text-md text-gray-700">Email do Contato</label>
            <input v-model.trim="form.email" type="email" placeholder="email@exemplo.com"
              class="w-full border border-line rounded-lg px-4 py-2" />
            <p v-if="errors.email" class="text-xs text-red-600 mt-1">{{ errors.email }}</p>
          </div>
        </div>

        <!-- Botões -->
        <div class="flex items-center justify-end gap-2 pt-2 border-t border-line">
          <RouterLink to="/convenios" class="px-3 py-2 rounded-lg border border-line hover:bg-gray-50">Cancelar
          </RouterLink>
          <AppButton :loading="saving">
            {{ saving ? "Salvando…" : (isEdit ? "Salvar alterações" : "Salvar Convênio")  }}
          </AppButton>
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

const errors = reactive({});

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

function validate() {
  Object.keys(errors).forEach(k => delete errors[k]);
  if (!form.nome?.trim() || form.nome.trim().length < 3)
    errors.nome = "Informe o nome do convênio (mín. 3 caracteres).";
  if (form.coparticipacao === "" || isNaN(Number(form.coparticipacao)))
    errors.coparticipacao = "Informe o valor de coparticipação.";
  if (!form.telefone?.trim() || form.telefone.replace(/\D/g, "").length < 10)
    errors.telefone = "Informe um telefone válido.";
  if (!form.contato?.trim() || form.contato.trim().length < 3)
    errors.contato = "Informe o nome do contato (mín. 3 caracteres).";
  const email = form.email?.trim();
  const emailOk = !!email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) errors.email = "Informe um e-mail válido.";
  return Object.keys(errors).length === 0;
}

async function onSubmit() {
  if (!validate()) return;
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