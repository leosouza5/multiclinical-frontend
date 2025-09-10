<template>
  <div>
    <!-- Header -->
    <div class="flex items-center gap-3 mb-3">
      <RouterLink to="/atendimentos" class="rounded-lg border border-line px-3 py-2 hover:bg-gray-50">←</RouterLink>
      <div>
        <h1 class="text-2xl font-bold">{{ pageTitle }}</h1>
        <p class="text-gray-500">Registre os detalhes do atendimento realizado</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
      <!-- Card Form -->
      <div class="lg:col-span-2 bg-white border border-line rounded-xl p-4 shadow-[var(--shadow-card)]">
        <h2 class="font-semibold text-lg mb-2">Informações do atendimento</h2>
        <p class="text-gray-500 mb-4">Preencha os dados conforme a sua base cadastrada</p>

        <form @submit.prevent="salvar" class="grid grid-cols-1 md:grid-cols-2 gap-3">
          <!-- Cliente / Convênio -->
          <div>
            <label class="text-sm text-gray-600">Cliente</label>
            <SearchSelect v-model="form.pacienteId" placeholder="Pesquise o cliente ou escolha 'Cliente sem cadastro'"
              :items="pacientes" item-text="nome" item-value="id" @search="buscarPacientes"
              :class="selectCls('pacienteId')" data-error="pacienteId" />
            <p v-if="erros.pacienteId && !isNovoCliente" class="text-red-600 text-sm mt-1">{{ erros.pacienteId }}</p>
          </div>
          <div>
            <label class="text-sm text-gray-600">Convênio</label>
            <SearchSelect v-model="form.convenioId" placeholder="Selecione o convênio" :items="convenios"
              item-text="nome" item-value="id" @search="buscarConvenios" :class="selectCls('convenioId')"
              data-error="convenioId" />
            <p v-if="erros.convenioId" class="text-red-600 text-sm mt-1">{{ erros.convenioId }}</p>

          </div>

          <!-- Nome/CPF: editáveis se for 'sem cadastro' -->
          <template v-if="isNovoCliente">
            <div>
              <label class="text-sm text-gray-600">Nome Completo</label>
              <input v-model="novoPaciente.nomeCompleto" :class="inputCls('nomeCompleto')"
                placeholder="Digite o nome completo" data-error="nomeCompleto" />
              <p v-if="erros.nomeCompleto" class="text-red-600 text-sm mt-1">{{ erros.nomeCompleto }}</p>
            </div>
            <div>
              <label class="text-sm text-gray-600">CPF</label>
              <input v-cpf  v-model="novoPaciente.cpf" :class="inputCls('cpf')" placeholder="000.000.000-00"
                data-error="cpf" />
              <p v-if="erros.cpf" class="text-red-600 text-sm mt-1">{{ erros.cpf }}</p>
            </div>
          </template>

          <!-- Data/Hora -->
          <div>
            <label class="text-sm text-gray-600">Data e hora</label>
            <input type="datetime-local" v-model="form.dataHora" :class="inputCls('dataHora')" data-error="dataHora" />
            <p v-if="erros.dataHora" class="text-red-600 text-sm mt-1">{{ erros.dataHora }}</p>
          </div>

          <!-- Procedimento / Clínica -->
          <div>
            <label class="text-sm text-gray-600">Procedimento</label>
            <SearchSelect v-model="form.procedimentoId" :items="procedimentos" placeholder="Selecione o procedimento"
              :class="selectCls('procedimentoId')" data-error="procedimentoId" @search="buscarProcedimentos" />
            <p v-if="erros.procedimentoId" class="text-red-600 text-sm mt-1">{{ erros.procedimentoId }}</p>
          </div>
          <div>
            <label class="text-sm text-gray-600">Clínica</label>
            <SearchSelect v-model="form.clinicaId" placeholder="Selecione a clínica" :items="clinicas" item-text="nome"
              item-value="id" @search="buscarClinicas" :class="selectCls('clinicaId')" data-error="clinicaId" />
            <p v-if="erros.clinicaId" class="text-red-600 text-sm mt-1">{{ erros.clinicaId }}</p>
          </div>

          <!-- Tipo / Valor -->
          <div>
            <label class="text-sm text-gray-600">Tipo de Atendimento</label>
            <SearchSelect v-model="form.tipoAtendimentoId" placeholder="Selecione o tipo de atendimento" :items="tipos"
              item-text="nome" item-value="id" @search="buscarTipos" :class="selectCls('tipoAtendimentoId')"
              data-error="tipoAtendimentoId" />
            <p v-if="erros.tipoAtendimentoId" class="text-red-600 text-sm mt-1">{{ erros.tipoAtendimentoId }}</p>
          </div>
          <div>
            <label class="text-sm text-gray-600">Valor Bruto (R$)</label>
            <CurrencyInput v-model="form.valorBruto" :class="inputCls('valorBruto')" data-error="valorBruto" />
            <p v-if="erros.valorBruto" class="text-red-600 text-sm mt-1">{{ erros.valorBruto }}</p>
          </div>

          <!-- Desconto Único -->
          <div class="">
            <label class="text-sm text-gray-600">Desconto (R$)</label>
            <CurrencyInput v-model="descontoTotal" :class="inputCls('desconto')" data-error="desconto" />
            <p v-if="erros.desconto" class="text-red-600 text-sm mt-1">{{ erros.desconto }}</p>
          </div>

          <!-- Observação -->
          <div class="md:col-span-2">
            <label class="text-sm text-gray-600">Observação</label>
            <textarea v-model="form.observacao" class="w-full border border-line rounded-lg px-3 py-2" rows="3"
              placeholder="Observações sobre o atendimento"></textarea>
          </div>

          <div class="md:col-span-2 mt-2 flex justify-end gap-2">
            <RouterLink to="/atendimentos" class="px-3 py-2 rounded-lg border border-line">Cancelar</RouterLink>
            <button type="submit" class="px-3 py-2 rounded-lg bg-brand text-white hover:bg-brand-600"
              :disabled="store.loading">
              <span v-if="!store.loading">{{ submitLabel }}</span>
              <span v-else>Salvando...</span>
            </button>
          </div>
        </form>
      </div>

      <!-- Sidebar: Resumo Financeiro -->
      <div class="space-y-4">
        <div class="bg-white border border-line rounded-xl p-4 shadow-[var(--shadow-card)]">
          <h3 class="font-semibold mb-3">Resumo Financeiro</h3>

          <div class="flex items-center justify-between text-sm mb-1">
            <span>Valor Bruto</span><strong>{{ currency(form.valorBruto) }}</strong>
          </div>
          <div class="flex items-center justify-between text-sm mb-1">
            <span>Desconto</span><span>{{ currency(descontoTotal) }}</span>
          </div>
          <!-- <div class="flex items-center justify-between text-sm mb-3">
            <span>Base (Bruto - Desconto)</span><span>{{ currency(baseCalculo) }}</span>
          </div> -->

          <!-- <div class="border-t my-3"></div>

          <div class="flex items-center justify-between text-sm mb-1">
            <span>Taxa Clínica</span><span>{{ taxaClinica != null ? taxaClinica + '%' : '-' }}</span>
          </div>
          <div class="flex items-center justify-between text-sm mb-1">
            <span>Taxa Convênio</span><span>{{ taxaConvenio != null ? taxaConvenio + '%' : '-' }}</span>
          </div>

          <div class="flex items-center justify-between text-sm mb-1">
            <span>Repasse Clínica (estimado)</span><span>{{ currency(repasseClinica) }}</span>
          </div>
          <div class="flex items-center justify-between text-sm mb-2">
            <span>Repasse Convênio (estimado)</span><span>{{ currency(repasseConvenio) }}</span>
          </div> -->

          <div class="border-t my-3"></div>

          <!-- <div class="flex items-center justify-between">
            <span class="font-semibold">Valor Líquido Estimado</span>
            <span class="font-bold text-lg">{{ currency(valorLiquido) }}</span>
          </div> -->
          <div class="flex items-center justify-between">
            <span class="font-semibold">Valor A Ser Cobrado</span>
            <span class="font-bold text-lg">{{ currency(baseCalculo) }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, computed, watch } from "vue";
import { useRouter } from "vue-router";
import { useAtendimentosStore } from "@/stores/atendimentos";
import { useNotify } from "@/stores/notify";
import SearchSelect from "@/components/SearchSelect.vue";
import CurrencyInput from "@/components/CurrencyInput.vue";

import { listPacientes } from "@/services/pacientes.js";
import { listClinics } from "@/services/clinics.js";
import { listConvenios } from "@/services/convenios.js";
import { listProcedures } from "@/services/procedures.js";
import { listTiposAtendimento } from "@/services/tiposAtendimento.js";
import { useRoute } from "vue-router";

const route = useRoute();
const editId = computed(() => route.params.id ?? null);
const isEdit = computed(() => !!editId.value);

const router = useRouter();
const store = useAtendimentosStore();
const notify = useNotify();

const pageTitle = computed(() => isEdit.value ? "Editar Atendimento" : "Novo Atendimento");
const submitLabel = computed(() => isEdit.value ? "Salvar Alterações" : "Salvar Atendimento");
const OPTION_NOVO = "__novo_cliente__";

const form = ref({
  pacienteId: null,
  clinicaId: null,
  convenioId: null,
  procedimentoId: null,
  tipoAtendimentoId: null,
  valorBruto: 0,
  observacao: "",
  dataHora: null,
});

const descontoTotal = ref(0);
const novoPaciente = ref({ nomeCompleto: "", cpf: "" });

const pacientes = ref([]);
const clinicas = ref([]);
const convenios = ref([]);
const procedimentos = ref([]);
const tipos = ref([]);

const asItems = (res) => Array.isArray(res?.items) ? res.items : Array.isArray(res) ? res : [];
const normalizeItems = (rows, { idKey, nameKey }) =>
  asItems(rows).map(o => ({ id: o[idKey], nome: o[nameKey], ...o })).filter(r => r.id != null);

const inputCls = (name) =>
  `w-full rounded-lg px-3 py-2 border ${erros.value[name] ? "border-red-500 ring-1 ring-red-200" : "border-line"}`

const selectCls = (name) =>
  `${erros.value[name] ? "border-red-500 ring-1 ring-red-200 rounded-lg" : ""}`

const pacientesMap = computed(() => new Map(pacientes.value.map(p => [p.id, p])));
const clinicasMap = computed(() => new Map(clinicas.value.map(c => [c.id, c])));
const conveniosMap = computed(() => new Map(convenios.value.map(c => [c.id, c])));

const isNovoCliente = computed(() => form.value.pacienteId === OPTION_NOVO);

const baseCalculo = computed(() =>
  Math.max(0, Number(form.value.valorBruto || 0) - Number(descontoTotal.value || 0))
);

const readTaxaClinica = (c) => c?.taxa_repasse_clinica ?? c?.taxa_repasse ?? c?.taxa ?? null;
const readTaxaConvenio = (c) => c?.taxa ?? c?.taxa_repasse ?? null;

const taxaClinica = computed(() => readTaxaClinica(clinicasMap.value.get(form.value.clinicaId)));
const taxaConvenio = computed(() => readTaxaConvenio(conveniosMap.value.get(form.value.convenioId)));

const repasseClinica = computed(() => taxaClinica.value != null ? baseCalculo.value * (Number(taxaClinica.value) / 100) : 0);
const repasseConvenio = computed(() => taxaConvenio.value != null ? baseCalculo.value * (Number(taxaConvenio.value) / 100) : 0);
const valorLiquido = computed(() => Math.max(0, baseCalculo.value - repasseClinica.value - repasseConvenio.value));

function currency(v) { return Number(v || 0).toLocaleString("pt-BR", { style: "currency", currency: "BRL" }); }

async function buscarPacientes(q = "") {
  try {
    const res = await listPacientes({ q, limit: 20, somente_ativos: true });
    const base = normalizeItems(res, { idKey: "id_cliente", nameKey: "nome_cliente" });
    pacientes.value = [{ id: OPTION_NOVO, nome: "Cliente sem cadastro (cadastrar agora)" }, ...base];
  } catch (e) {
    notify.error({ title: "Erro ao listar pacientes", message: e.message });
    pacientes.value = [{ id: OPTION_NOVO, nome: "Cliente sem cadastro (cadastrar agora)" }];
  }
}




async function buscarClinicas(q = "") {
  try {
    const res = await listClinics({ q, limit: 20, somente_ativas: true });
    clinicas.value = normalizeItems(res, { idKey: "id_clinica", nameKey: "nome_clinica" });
  } catch (e) {
    notify.error({ title: "Erro ao listar clínicas", message: e.message });
    clinicas.value = [];
  }
}
async function buscarConvenios(q = "") {
  try {
    const res = await listConvenios({ q, limit: 20, somente_ativos: true });
    convenios.value = normalizeItems(res, { idKey: "id_convenio", nameKey: "nome_convenio" });
  } catch (e) {
    notify.error({ title: "Erro ao listar convênios", message: e.message });
    convenios.value = [];
  }
}
async function buscarProcedimentos(q = "") {
  try {
    const res = await listProcedures({ q, limit: 50, somente_ativos: true });
    procedimentos.value = normalizeItems(res, { idKey: "id_procedimento", nameKey: "nome_procedimento" });
  } catch (e) {
    notify.error({ title: "Erro ao listar procedimentos", message: e.message });
    procedimentos.value = [];
  }
}
async function buscarTipos(q = "") {
  try {
    const res = await listTiposAtendimento({ q, limit: 50, somente_ativos: true });
    tipos.value = normalizeItems(res, { idKey: "id_tipo_atendimento", nameKey: "nome_tipo_atendimento" });
  } catch (e) {
    notify.error({ title: "Erro ao listar tipos", message: e.message });
    tipos.value = [];
  }
}



function toIsoUtcFromLocal(dt) {
  // dt vem do input datetime-local, ex: "2025-09-09T10:00"
  // new Date(dt) interpreta no fuso local e toISOString() converte p/ UTC com 'Z'
  return dt ? new Date(dt).toISOString() : null;
}

function montarPayload() {
  const isNovo = isNovoCliente.value;
  const pacienteSel = pacientesMap.value.get(form.value.pacienteId);

  const payload = {
    id_convenio: form.value.convenioId ?? null,
    id_procedimento: form.value.procedimentoId,
    id_clinica: form.value.clinicaId,
    id_tipo_atendimento: form.value.tipoAtendimentoId,
    valor_bruto: Number(form.value.valorBruto || 0),
    desconto: Number(descontoTotal.value || 0),
    observacao: form.value.observacao || "",
    data_atendimento: toIsoUtcFromLocal(form.value.dataHora),
  };

  if (isNovo) {
    if (novoPaciente.value.nomeCompleto?.trim())
      payload.nome_cliente = novoPaciente.value.nomeCompleto.trim();
    if (novoPaciente.value.cpf?.trim())
      payload.cpf_cliente = novoPaciente.value.cpf.replace(/\D/g, ""); 
  } else if (pacienteSel) {
    if (pacienteSel.nome_paciente || pacienteSel.nome)
      payload.nome_cliente = pacienteSel.nome_paciente || pacienteSel.nome;
    if (pacienteSel.cpf)
      payload.cpf_cliente = String(pacienteSel.cpf).replace(/\D/g, ""); 
  }

  return payload;
}


async function salvar() {
  if (!validar()) return;
  try {
    const payload = montarPayload();

    if (isEdit.value) {
      // UPDATE — troque 'update' pelo método do seu store
      await (store.update?.(editId.value, payload));
      notify.success({ title: "Sucesso", message: "Atendimento atualizado." });
    } else {
      // CREATE
      await store.create(payload);
      notify.success({ title: "Sucesso", message: "Atendimento salvo com sucesso." });
    }

    router.push("/atendimentos");
  } catch (e) {
    // notify.error({ title: "Erro", message: e?.response?.data?.message || e.message || "Falha ao salvar atendimento" });
  }
}



watch(() => form.value.pacienteId, (novo) => {
  if (novo !== OPTION_NOVO) {
    // limpamos os campos de cadastro avulso quando sair do modo "sem cadastro"
    novoPaciente.value = { nomeCompleto: "", cpf: "" };
  }
});

const erros = ref({})

function cpfValido(raw) {
  const v = String(raw || "").replace(/\D/g, "")
  if (v.length !== 11 || /^(\d)\1{10}$/.test(v)) return false
  let s = 0, r
  for (let i = 1; i <= 9; i++) s += parseInt(v.substring(i - 1, i)) * (11 - i)
  r = (s * 10) % 11; if (r === 10 || r === 11) r = 0; if (r !== parseInt(v.substring(9, 10))) return false
  s = 0
  for (let i = 1; i <= 10; i++) s += parseInt(v.substring(i - 1, i)) * (12 - i)
  r = (s * 10) % 11; if (r === 10 || r === 11) r = 0; if (r !== parseInt(v.substring(10, 11))) return false
  return true
}

function firstErrorKey() {
  const keys = Object.keys(erros.value)
  return keys.length ? keys[0] : null
}

function toLocalInputValue(isoZ) {
  if (!isoZ) return null;
  const d = new Date(isoZ);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

function ensureItem(listRef, id, nome) {
  if (!id) return;
  const exists = listRef.value.some(i => i.id === id);
  if (!exists) listRef.value.unshift({ id, nome });
}

async function carregarAtendimento() {
  if (!isEdit.value) return;

  const a = await (store.fetchOne?.(editId.value));
  console.log(a);
  
  if (!a) throw new Error("Atendimento não encontrado");

  const idCliente = a.cliente?.id_cliente ?? null;
  const nomeCliente = a.cliente?.nome_cliente ?? "";
  const cpfCliente = a.cliente?.cpf ?? "";

  const idClinica = a.clinica?.id_clinica ?? null;
  const nomeClinica = a.clinica?.nome_clinica ?? "";

  const idConvenio = a.convenio?.id_convenio ?? null;
  const nomeConvenio = a.convenio?.nome_convenio ?? "";

  const idProced = a.procedimento?.id_procedimento ?? null;
  const nomeProced = a.procedimento?.nome_procedimento ?? "";

  const idTipo = a.tipoAtendimento?.id_tipo_atendimento ?? null;
  const nomeTipo = a.tipoAtendimento?.nome_tipo_atendimento ?? "";

  ensureItem(pacientes, idCliente, nomeCliente);
  ensureItem(clinicas, idClinica, nomeClinica);
  ensureItem(convenios, idConvenio, nomeConvenio);
  ensureItem(procedimentos, idProced, nomeProced);
  ensureItem(tipos, idTipo, nomeTipo);

  form.value = {
    pacienteId: idCliente ?? null,
    clinicaId: idClinica ?? null,
    convenioId: idConvenio ?? null,
    procedimentoId: idProced ?? null,
    tipoAtendimentoId: idTipo ?? null,
    valorBruto: Number(a.valor_bruto ?? 0),
    observacao: a.observacao ?? "",
    dataHora: toLocalInputValue(a.data_atendimento), // datetime-local
  };

  descontoTotal.value = Number(a.desconto ?? 0);
  novoPaciente.value = { nomeCompleto: nomeCliente, cpf: cpfCliente };
}


async function focusFirstError() {
  const key = firstErrorKey()
  if (!key) return
  await nextTick?.()
  const el = document.querySelector(`[data-error="${key}"]`)
  el?.focus?.()
}


function validar() {
  erros.value = {}

  if (isNovoCliente.value) {
    if (!novoPaciente.value.nomeCompleto?.trim()) erros.value.nomeCompleto = "Informe o nome completo"
    if (!novoPaciente.value.cpf?.trim()) erros.value.cpf = "Informe o CPF"
    else if (!cpfValido(novoPaciente.value.cpf)) erros.value.cpf = "CPF inválido"
  } else if (!form.value.pacienteId) {
    erros.value.pacienteId = "Selecione um cliente"
  }

  if (!form.value.convenioId) erros.value.convenioId = "Selecione o convênio"
  if (!form.value.procedimentoId) erros.value.procedimentoId = "Selecione o procedimento"
  if (!form.value.clinicaId) erros.value.clinicaId = "Selecione a clínica"
  if (!form.value.tipoAtendimentoId) erros.value.tipoAtendimentoId = "Selecione o tipo de atendimento"

  if (!form.value.valorBruto || Number(form.value.valorBruto) <= 0) erros.value.valorBruto = "Informe o valor bruto"
  if (Number(descontoTotal.value) < 0) erros.value.desconto = "Desconto não pode ser negativo"

  if (!form.value.dataHora) erros.value.dataHora = "Informe a data e hora do atendimento"

  const ok = Object.keys(erros.value).length === 0
  if (!ok) {
    notify.warning({ title: "Atenção", message: "Corrija os campos destacados." })
    focusFirstError()
  }
  return ok
}

const vCpf = {
  mounted(el) {
    const onInput = (e) => {
      // mantém só números (máx 11) e aplica a máscara 000.000.000-00
      let v = (e.target.value || "").replace(/\D/g, "").slice(0, 11);
      if (v.length > 9) e.target.value = v.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, "$1.$2.$3-$4");
      else if (v.length > 6) e.target.value = v.replace(/(\d{3})(\d{3})(\d{0,3})/, "$1.$2.$3");
      else if (v.length > 3) e.target.value = v.replace(/(\d{3})(\d{0,3})/, "$1.$2");
      else e.target.value = v;

      // dispara evento 'input' pro v-model perceber a mudança
      const evt = new Event("input", { bubbles: true });
      e.target.dispatchEvent(evt);
    };
    el.__cpfMask__ = onInput;
    el.addEventListener("input", onInput);
  },
  beforeUnmount(el) {
    el.removeEventListener("input", el.__cpfMask__);
    delete el.__cpfMask__;
  }
};


onMounted(async () => {
  await Promise.all([
    buscarPacientes(""),
    buscarClinicas(""),
    buscarConvenios(""),
    buscarProcedimentos(""),
    buscarTipos(""),
  ]);
  await carregarAtendimento();
});

</script>
