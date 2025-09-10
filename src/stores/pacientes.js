import { defineStore } from "pinia";
import {
  listPacientes,
  getPaciente,
  createPaciente,
  updatePaciente,
  deletePaciente,
} from "@/services/pacientes";

function getId(p) {
  return p?.id_cliente ?? p?.id ?? p?.uuid ?? null;
}

function normalizeListResponse(res) {
  // aceita vários formatos
  if (Array.isArray(res)) return { items: res, meta: { page: 1, per_page: res.length ?? 0, total: res.length ?? 0 } };
  return {
    items: res?.items ?? res?.data ?? [],
    meta: res?.meta ?? {
      page: res?.page ?? 1,
      per_page: res?.limit ?? res?.per_page ?? 10,
      total: res?.total ?? (res?.items?.length ?? 0),
    },
  };
}

export const usePacientesStore = defineStore("pacientes", {
  state: () => ({
    items: [],
    current: null,
    meta: { page: 1, per_page: 10, total: 0 },
    lastParams: {},
    loading: false,
  }),

  actions: {
    async loadAll(params = {}) {
      this.loading = true;
      try {
        const res = await listPacientes(params);
        const { items, meta } = normalizeListResponse(res);
        this.items = items;
        this.meta = meta;
        this.lastParams = params;
      } catch (e) {
        // propaga erro já com a mensagem do back (chave 'error', se houver)
        const msg = e?.response?.data?.error || e?.message || "Erro ao listar pacientes";
        throw new Error(msg);
      } finally {
        this.loading = false;
      }
    },

    async reload() {
      return this.loadAll(this.lastParams);
    },

    async fetchOne(id) {
      this.loading = true;
      try {
        this.current = await getPaciente(id);
        return this.current;
      } catch (e) {
        const msg = e?.response?.data?.error || e?.message || "Erro ao carregar paciente";
        throw new Error(msg);
      } finally {
        this.loading = false;
      }
    },

    async create(payload) {
      this.loading = true;
      try {
        return await createPaciente(payload);
      } catch (e) {
        const msg = e?.response?.data?.error || e?.message || "Erro ao criar paciente";
        // reempacota para o caller mostrar no toast
        throw new Error(msg);
      } finally {
        this.loading = false;
      }
    },

    async update(id, payload) {
      this.loading = true;
      try {
        return await updatePaciente(id, payload);
      } catch (e) {
        const msg = e?.response?.data?.error || e?.message || "Erro ao atualizar paciente";
        throw new Error(msg);
      } finally {
        this.loading = false;
      }
    },

    async remove(id) {
      this.loading = true;
      try {
        await deletePaciente(id);
        this.items = this.items.filter(i => getId(i) !== id);
      } catch (e) {
        const msg = e?.response?.data?.error || e?.message || "Erro ao excluir paciente";
        throw new Error(msg);
      } finally {
        this.loading = false;
      }
    },
  },
});
