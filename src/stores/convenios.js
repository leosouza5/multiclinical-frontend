// src/stores/convenios.js
import { defineStore } from "pinia";
import {
  listConvenios,
  getConvenio,
  createConvenio,
  updateConvenio,
  deleteConvenio,
} from "../services/convenios.js";

export const useConveniosStore = defineStore("convenios", {
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
        const data = await listConvenios(params);
        this.items = Array.isArray(data) ? data : (data.data ?? data.items ?? []);
      } catch (e) {
        this.error = e?.response?.data?.message || e.message || "Erro ao carregar convênios";
        throw e;
      } finally { this.loading = false; }
    },

    async fetchOne(id) {
      this.loading = true; this.error = null;
      try {
        this.current = await getConvenio(id);
        return this.current;
      } catch (e) {
        this.error = e?.response?.data?.message || e.message || "Erro ao carregar convênio";
        throw e;
      } finally { this.loading = false; }
    },

    async create(payload) {
      this.loading = true; this.error = null;
      try {
        const created = await createConvenio(payload);
        return created;
      } catch (e) {
        this.error = e?.response?.data?.message || e.message || "Erro ao criar convênio";
        throw e;
      } finally { this.loading = false; }
    },

    async update(id, payload) {
      this.loading = true; this.error = null;
      try {
        const updated = await updateConvenio(id, payload);
        const idx = this.items.findIndex(c => String(c.id) === String(id));
        if (idx > -1) this.items[idx] = { ...this.items[idx], ...updated };
        if (this.current?.id === id) this.current = { ...this.current, ...updated };
        return updated;
      } catch (e) {
        this.error = e?.response?.data?.message || e.message || "Erro ao atualizar convênio";
        throw e;
      } finally { this.loading = false; }
    },

    async remove(id) {
      this.loading = true; this.error = null;
      try {
        await deleteConvenio(id);
        this.items = this.items.filter(c => String(c.id) !== String(id));
      } catch (e) {
        this.error = e?.response?.data?.message || e.message || "Erro ao remover convênio";
        throw e;
      } finally { this.loading = false; }
    },
  },
});
