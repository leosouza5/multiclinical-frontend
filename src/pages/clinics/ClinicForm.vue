<template>
  <div class="space-y-4">
    <!-- Header -->
    <div class="flex items-center gap-3">
      <button @click="goBack"
        class="size-9 grid place-items-center rounded-lg border border-line hover:bg-gray-50">←</button>
      <div>
        <h1 class="text-2xl font-bold">{{ isEdit ? "Editar Clínica" : "Nova Clínica" }}</h1>
        <p class="text-md text-gray-500">Registra uma clínica no sistema</p>
      </div>
    </div>

    <!-- Card -->
    <div class="bg-white rounded-md shadow-[var(--shadow-card)] border border-line">
      <div class="flex items-center justify-between px-4 py-3">
        <div>
          <h2 class="font-semibold">Dados da Clínica</h2>
          <p class="text-sm text-gray-500">Preencha os campos obrigatórios</p>
        </div>
      </div>

      <!-- Form -->
      <form @submit.prevent="onSubmit" class="p-4 space-y-6" novalidate>
        <fieldset class="space-y-1">
          <div class="grid gap-4 md:grid-cols-2 mt-3">
            <!-- Nome -->
            <div class="md:col-span-2">
              <label class="block text-md mb-1">Nome</label>
              <input
                v-model.trim="form.nome"
                required
                minlength="3"
                placeholder="Digite o nome da clínica"
                class="w-full border border-line rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/30" />
              <p v-if="errors.nome" class="text-xs text-red-600 mt-1">{{ errors.nome }}</p>
            </div>

            <!-- Taxa de Repasse (%) -->
            <div>
              <label class="block text-md mb-1">Taxa de Repasse (%)</label>
              <input
                v-model.number="form.taxa_repasse"
                type="number"
                step="0.01" min="0" max="100"
                placeholder="Ex.: 15.5"
                class="w-full border border-line rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/30" />
              <p v-if="errors.taxa_repasse" class="text-xs text-red-600 mt-1">{{ errors.taxa_repasse }}</p>
            </div>

            <!-- Telefone -->
            <div>
              <label class="block text-md mb-1">Telefone</label>
              <input
                :value="form.telefone"
                @input="onPhoneInput"
                @keydown="onlyDigitsKeydown"
                inputmode="tel"
                placeholder="(00) 00000-0000"
                maxlength="16"
                class="w-full border border-line rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/30" />
              <p v-if="errors.telefone" class="text-xs text-red-600 mt-1">{{ errors.telefone }}</p>
            </div>

            <!-- Responsável -->
            <div>
              <label class="block text-md mb-1">Nome do Responsável</label>
              <input
                v-model.trim="form.responsavel_nome"
                required
                minlength="3"
                placeholder="Digite o nome"
                class="w-full border border-line rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/30" />
              <p v-if="errors.responsavel_nome" class="text-xs text-red-600 mt-1">{{ errors.responsavel_nome }}</p>
            </div>

            <div>
              <label class="block text-md mb-1">Email do Responsável</label>
              <input
                v-model.trim="form.responsavel_email"
                type="email"
                inputmode="email"
                placeholder="email@exemplo.com"
                class="w-full border border-line rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/30" />
              <p v-if="errors.responsavel_email" class="text-xs text-red-600 mt-1">{{ errors.responsavel_email }}</p>
            </div>

            <!-- Endereço (opcional, não envia para o back) -->
            <div class="md:col-span-2">
              <label class="block text-md mb-1">Endereço</label>
              <input v-model.trim="form.endereco" placeholder="Rua, nº, bairro, cidade"
                     class="w-full border border-line rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand/30" />
            </div>
          </div>
        </fieldset>

        <!-- Ações -->
        <div class="flex items-center justify-end gap-3 pt-2 border-t border-line">
          <button type="button" @click="goBack"
                  class="px-3 py-2 rounded-lg border border-line hover:bg-gray-50">Cancelar</button>
          <button type="submit" :disabled="loading"
                  class="px-3 py-2 rounded-lg bg-brand text-white hover:bg-brand-600 disabled:opacity-50">
            {{ isEdit ? (loading ? "Salvando..." : "Salvar alterações") : (loading ? "Cadastrando..." : "Cadastrar") }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useNotify } from "../../stores/notify";
import { useClinicsStore } from "../../stores/clinics";

const router = useRouter();
const route = useRoute();
const notify = useNotify();
const clinics = useClinicsStore();

const loading = ref(false);
const errors = reactive({});

const id = route.params.id;
const isEdit = computed(() => !!id);

const form = reactive({
  nome: "",
  taxa_repasse: "",
  telefone: "",
  responsavel_nome: "",
  responsavel_email: "",
  endereco: "",
  ativo: true,
});

function onlyDigitsKeydown(e){
  const allowed = ["Backspace","Delete","Tab","ArrowLeft","ArrowRight","Home","End"];
  if (allowed.includes(e.key)) return;
  if (!/^\d$/.test(e.key)) e.preventDefault();
}

function maskPhone(value = "") {
  const digits = (value || "").toString().replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 10) {
    return digits.replace(/^(\d{0,2})(\d{0,4})(\d{0,4}).*/, (_, a, b, c) =>
      [a && `(${a}`, a && ") ", b, c && `-${c}`].filter(Boolean).join("")
    );
  }
  return digits.replace(/^(\d{0,2})(\d{0,5})(\d{0,4}).*/, (_, a, b, c) =>
    [a && `(${a}`, a && ") ", b, c && `-${c}`].filter(Boolean).join("")
  );
}
function onPhoneInput(e) { form.telefone = maskPhone(e.target.value); }

function goBack(){ router.push("/clinics"); }

function validate(){
  Object.keys(errors).forEach(k => delete errors[k]);

  if(!form.nome?.trim() || form.nome.trim().length < 3)
    errors.nome = "Informe o nome da clínica (mín. 3 caracteres).";

  const taxa = Number(form.taxa_repasse);
  if(Number.isNaN(taxa)) errors.taxa_repasse = "Informe a taxa de repasse (número).";
  else if (taxa < 0 || taxa > 100) errors.taxa_repasse = "A taxa deve estar entre 0 e 100%.";

  const telDigits = form.telefone.replace(/\D/g, "");
  if (telDigits.length < 10) errors.telefone = "Informe um telefone válido.";

  if(!form.responsavel_nome?.trim() || form.responsavel_nome.trim().length < 3)
    errors.responsavel_nome = "Informe o nome do responsável (mín. 3 caracteres).";

  const email = form.responsavel_email?.trim();
  const emailOk = !!email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if(!emailOk) errors.responsavel_email = "Informe um e-mail válido.";

  return Object.keys(errors).length === 0;
}

function payload(){
  return {
    nome_clinica: form.nome,
    taxa_repasse_clinica: Number(form.taxa_repasse),
    telefone_clinica: form.telefone,
    nome_responsavel: form.responsavel_nome,
    email_clinica: form.responsavel_email,
  };
}

async function loadIfEdit(){
  if(!isEdit.value) return;
  loading.value = true;
  try{
    const data = await clinics.getById(id);
    form.nome = data?.nome_clinica ?? data?.nome ?? "";
    form.taxa_repasse = data?.taxa_repasse_clinica ?? data?.taxa_repasse ?? "";
    form.telefone = maskPhone(data?.telefone_clinica ?? data?.telefone ?? "");
    form.responsavel_nome = data?.nome_responsavel ?? data?.responsavel_nome ?? "";
    form.responsavel_email = data?.email_clinica ?? data?.responsavel_email ?? "";
    form.endereco = data?.endereco ?? "";
    form.ativo = data?.ativo ?? true;
  } finally{
    loading.value = false;
  }
}

async function onSubmit(){
  if(!validate()) return;
  loading.value = true;
  try{
    if(isEdit.value){
      await clinics.update(id, payload()); // PUT /clinicas/:id
      notify.success({ title: "Clínica atualizada" });
    }else{
      await clinics.create(payload());     // POST /clinicas
      notify.success({ title: "Clínica criada" });
    }
    await clinics.loadAll?.();
    router.push("/clinics");
  }catch{
    /* erros globais via interceptor */
  }finally{
    loading.value = false;
  }
}

onMounted(loadIfEdit);
</script>
