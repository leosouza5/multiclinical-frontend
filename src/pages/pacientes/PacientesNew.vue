<template>
    <div>
        <!-- Header -->
        <div class="flex items-center gap-3 mb-3">
            <RouterLink to="/pacientes" class="rounded-lg border border-line px-3 py-2 hover:bg-gray-50">←</RouterLink>
            <div>
                <h1 class="text-2xl font-bold">{{ pageTitle }}</h1>
                <p class="text-gray-500">
                    {{ isEdit ? 'Atualize os dados do paciente' : 'Cadastre um novo paciente no sistema' }}
                </p>
            </div>
        </div>

        <!-- Tabs (igual mockup) -->
        <div class="grid grid-cols-2 text-center mb-4">
            <button class="py-2 rounded-lg"
                :class="activeTab === 'dados' ? 'bg-gray-100 font-medium' : 'bg-gray-100/30 text-gray-600'"
                @click="activeTab = 'dados'">
                Dados Pessoais
            </button>
            <button class="py-2 rounded-lg"
                :class="activeTab === 'responsavel' ? 'bg-gray-100 font-medium' : 'bg-gray-100/30 text-gray-600'"
                @click="activeTab = 'responsavel'">
                Responsável
            </button>
        </div>

        <!-- Card -->
        <div class="bg-white border border-line rounded-xl p-4 shadow-[var(--shadow-card)]">
            <h2 class="font-semibold text-lg mb-1">
                {{ activeTab === 'dados' ? 'Informações Pessoais' : 'Informações Do Responsável' }}
            </h2>
            <p class="text-gray-500 mb-4">
                {{ activeTab === 'dados'
                    ? 'Dados básicos do paciente'
                    : 'Dados do responsável pelo paciente (se aplicável)' }}
            </p>

            <!-- FORM -->
            <form @submit.prevent="salvar" class="space-y-4">
                <!-- ======= ABA DADOS PESSOAIS ======= -->
                <section v-show="activeTab === 'dados'">
                    <div class="grid md:grid-cols-2 gap-4">
                        <!-- Nome (coluna inteira) -->
                        <div class="md:col-span-2">
                            <label class="text-sm text-gray-600">Nome Completo</label>
                            <input v-model.trim="form.nome" :class="inputCls('nome')"
                                placeholder="Nome Completo do Cliente" data-error="nome" />
                            <p v-if="erros.nome" class="text-red-600 text-sm mt-1">{{ erros.nome }}</p>
                        </div>

                        <!-- CPF -->
                        <div>
                            <label class="text-sm text-gray-600">CPF</label>
                            <input v-model="form.cpf" @input="form.cpf = maskCPF(form.cpf)" :class="inputCls('cpf')"
                                placeholder="000.000.000-00" data-error="cpf" />
                            <p v-if="erros.cpf" class="text-red-600 text-sm mt-1">{{ erros.cpf }}</p>
                        </div>

                        <!-- Data de nascimento -->
                        <div>
                            <label class="text-sm text-gray-600">Data de nascimento</label>
                            <input v-model="form.data_nascimento"
                                @input="form.data_nascimento = maskDate(form.data_nascimento)"
                                :class="inputCls('data_nascimento')" placeholder="dd/mm/aaaa"
                                data-error="data_nascimento" />
                            <p v-if="erros.data_nascimento" class="text-red-600 text-sm mt-1">{{ erros.data_nascimento
                                }}</p>
                        </div>

                        <!-- Telefone (linha inteira no mockup) -->
                        <div class="md:col-span-2">
                            <label class="text-sm text-gray-600">Telefone</label>
                            <input v-model="form.telefone" @input="form.telefone = maskPhone(form.telefone)"
                                :class="inputCls('telefone')" placeholder="(00) 00000-0000" data-error="telefone" />
                            <p v-if="erros.telefone" class="text-red-600 text-sm mt-1">{{ erros.telefone }}</p>
                        </div>
                    </div>
                </section>

                <!-- ======= ABA RESPONSÁVEL (apenas dois campos) ======= -->
                <section v-show="activeTab === 'responsavel'">
                    <div class="grid md:grid-cols-2 gap-4">
                        <div class="md:col-span-2">
                            <label class="text-sm text-gray-600">Nome do Responsável</label>
                            <input v-model.trim="form.responsavel_nome" :class="inputCls('responsavel_nome')"
                                placeholder="Digite o nome do responsável" data-error="responsavel_nome" />
                            <p v-if="erros.responsavel_nome" class="text-red-600 text-sm mt-1">{{ erros.responsavel_nome
                                }}</p>
                        </div>

                        <div class="md:col-span-2">
                            <label class="text-sm text-gray-600">Telefone do Responsável</label>
                            <input v-model="form.responsavel_telefone"
                                @input="form.responsavel_telefone = maskPhone(form.responsavel_telefone)"
                                class="w-full rounded-lg px-3 py-2 border border-line" placeholder="(00) 00000-0000"
                                data-error="responsavel_telefone" />
                            <p v-if="erros.responsavel_telefone" class="text-red-600 text-sm mt-1">{{
                                erros.responsavel_telefone }}</p>
                        </div>
                    </div>
                </section>

                <!-- Ações -->
                <div class="flex items-center justify-between pt-2">
                    <RouterLink to="/pacientes" class="px-3 py-2 rounded-lg border border-line">Cancelar</RouterLink>

                    <button type="submit"
                        class="px-3 py-2 rounded-lg bg-brand text-white hover:bg-brand-600 disabled:opacity-60"
                        :disabled="loading">
                        <span v-if="!loading">{{ isEdit ? 'Salvar Alterações' : 'Salvar Paciente' }}</span>
                        <span v-else>Salvando...</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useNotify } from "@/stores/notify";
import { usePacientesStore } from "@/stores/pacientes";

const route = useRoute();
const router = useRouter();
const notify = useNotify();
const store = usePacientesStore();

const idParam = computed(() => route.params.id ?? null);
const isEdit = computed(() => !!idParam.value);
const pageTitle = computed(() => (isEdit.value ? "Editar Paciente" : "Novo Paciente"));
const activeTab = ref("dados");

const loading = computed(() => store.loading);

// form
const form = ref({
    // paciente
    nome: "",
    cpf: "",
    data_nascimento: "", // dd/mm/aaaa
    telefone: "",
    // responsável (apenas nome e telefone)
    responsavel_nome: "",
    responsavel_telefone: "",
});

// ===== UI helpers =====
const erros = ref({});

const inputCls = (name) =>
    `w-full rounded-lg px-3 py-2 border ${erros.value[name] ? "border-red-500 ring-1 ring-red-200" : "border-line"}`;

const onlyDigits = (v = "") => String(v || "").replace(/\D/g, "");
const maskCPF = (v = "") => {
    const s = onlyDigits(v).slice(0, 11);
    if (s.length <= 3) return s;
    if (s.length <= 6) return s.replace(/(\d{3})(\d{0,3})/, "$1.$2");
    if (s.length <= 9) return s.replace(/(\d{3})(\d{3})(\d{0,3})/, "$1.$2.$3");
    return s.replace(/(\d{3})(\d{3})(\d{3})(\d{0,2})/, "$1.$2.$3-$4");
};
const maskPhone = (v = "") => {
    const s = onlyDigits(v).slice(0, 11);
    if (s.length <= 10) return s.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{4})(\d{1,4})$/, "$1-$2");
    return s.replace(/^(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d{1,4})$/, "$1-$2");
};
const maskDate = (v = "") =>
    onlyDigits(v).slice(0, 8).replace(/^(\d{2})(\d)/, "$1/$2").replace(/^(\d{2})\/(\d{2})(\d)/, "$1/$2/$3");

const brToIso = (br) => {
    const m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(br || "");
    if (!m) return null;
    const [, d, mo, y] = m;
    return `${y}-${mo}-${d}`;
};
const isoToBr = (iso) => {
    if (!iso) return "";
    const [y, m, d] = String(iso).split("T")[0].split("-");
    return `${d}/${m}/${y}`;
};

// ===== validação =====
function cpfValido(raw) {
    const v = onlyDigits(raw);
    if (!v) return true; // opcional
    if (v.length !== 11 || /^(\d)\1{10}$/.test(v)) return false;
    let s = 0,
        r;
    for (let i = 1; i <= 9; i++) s += parseInt(v.substring(i - 1, i)) * (11 - i);
    r = (s * 10) % 11;
    if (r === 10 || r === 11) r = 0;
    if (r !== parseInt(v.substring(9, 10))) return false;
    s = 0;
    for (let i = 1; i <= 10; i++) s += parseInt(v.substring(i - 1, i)) * (12 - i);
    r = (s * 10) % 11;
    if (r === 10 || r === 11) r = 0;
    return r === parseInt(v.substring(10, 11));
}

function firstErrorKey() {
    const keys = Object.keys(erros.value);
    return keys.length ? keys[0] : null;
}
async function focusFirstError() {
    const key = firstErrorKey();
    if (!key) return;
    await nextTick();
    const el = document.querySelector(`[data-error="${key}"]`);
    el?.focus?.();
}

function validar() {
    erros.value = {};
    if (!form.value.nome?.trim()) erros.value.nome = "Informe o nome";

    if (form.value.cpf && !cpfValido(form.value.cpf)) erros.value.cpf = "CPF inválido";
    if (form.value.data_nascimento && !brToIso(form.value.data_nascimento))
        erros.value.data_nascimento = "Data inválida";
    if (form.value.telefone && onlyDigits(form.value.telefone).length < 10)
        erros.value.telefone = "Telefone inválido";

    if (form.value.responsavel_telefone && onlyDigits(form.value.responsavel_telefone).length < 10)
        erros.value.responsavel_telefone = "Telefone inválido";

    const ok = Object.keys(erros.value).length === 0;
    if (!ok) {
        notify.warning({ title: "Atenção", message: "Corrija os campos destacados." });
        focusFirstError();
    }
    return ok;
}

// compacta payload (remove null/undefined/'')
const compact = (obj) =>
    Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== null && v !== undefined && v !== ""));

// ===== carregar para edição =====
onMounted(async () => {
    if (!isEdit.value) return;
    try {
        const data = await store.fetchOne(idParam.value);
        form.value = {
            nome: data.nome_cliente ?? data.nome ?? "",
            cpf: data.cpf ? maskCPF(data.cpf) : "",
            data_nascimento: isoToBr(data.data_nascimento ?? data.nascimento ?? null),
            telefone: data.telefone ? maskPhone(data.telefone) : "",
            responsavel_nome: data.responsavel?.nome_responsavel ?? "",
            responsavel_telefone: data.responsavel?.telefone ? maskPhone(data.responsavel.telefone) : "",
        };
    } catch (e) {
        notify.error({ title: "Erro", message: e?.message || "Falha ao carregar paciente" });
        router.push("/pacientes");
    }
});

// ===== submit (create/update na mesma tela) =====
async function salvar() {
    if (!validar()) return;
    try {
        const payload = compact({
            // contrato do back
            nome_cliente: form.value.nome?.trim(),
            status_atividade: true,
            cpf: onlyDigits(form.value.cpf) || null,
            data_nascimento: brToIso(form.value.data_nascimento),
            telefone: onlyDigits(form.value.telefone) || null,

            // responsável (apenas dois campos)
            responsavel_nome: form.value.responsavel_nome?.trim() || null,
            responsavel_telefone: form.value.responsavel_telefone?.trim() || null,
        });

        if (isEdit.value) {
            await store.update(idParam.value, payload);
            notify.success({ title: "Sucesso", message: "Paciente atualizado." });
        } else {
            await store.create(payload);
            notify.success({ title: "Sucesso", message: "Paciente cadastrado com sucesso." });
        }
        router.push("/pacientes");
    } catch (e) {
        notify.error({ title: "Erro ao salvar", message: e?.message || "Falha ao salvar paciente" });
    }
}
</script>