// src/stores/procedures.js
import { defineStore } from "pinia";
import {
  listProcedures,
  getProcedure,
  createProcedure,
  updateProcedure,
  deleteProcedure,
} from "../services/procedures.js";

export const useProceduresStore = defineStore("procedures", {
  state: () => ({
    items: [],
    current: null,
    loading: false,
    error: null,
  }),

  actions: {
    async loadAll(params = {}) {
      this.loading = true; this.error = null;
      try {
        const data = await listProcedures(params);
        this.items = Array.isArray(data) ? data : (data.data ?? data.items ?? []);
      } catch (e) {
        this.error = e?.response?.data?.message || e.message || "Erro ao carregar procedimentos";
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async fetchOne(id) {
      this.loading = true; this.error = null;
      try {
        this.current = await getProcedure(id);
        return this.current;
      } catch (e) {
        this.error = e?.response?.data?.message || e.message || "Erro ao carregar procedimento";
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async create(payload) {
      this.loading = true; this.error = null;
      try {
        const created = await createProcedure(payload);
        return created;
      } catch (e) {
        this.error = e?.response?.data?.message || e.message || "Erro ao criar procedimento";
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async update(id, payload) {
      this.loading = true; this.error = null;
      try {
        const updated = await updateProcedure(id, payload);
        const idx = this.items.findIndex(p => String(p.id) === String(id));
        if (idx > -1) this.items[idx] = { ...this.items[idx], ...updated };
        if (this.current?.id === id) this.current = { ...this.current, ...updated };
        return updated;
      } catch (e) {
        this.error = e?.response?.data?.message || e.message || "Erro ao atualizar procedimento";
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async remove(id) {
      this.loading = true; this.error = null;
      try {
        await deleteProcedure(id);
        this.items = this.items.filter(p => String(p.id) !== String(id));
      } catch (e) {
        this.error = e?.response?.data?.message || e.message || "Erro ao remover procedimento";
        throw e;
      } finally {
        this.loading = false;
      }
    },
  },
});
