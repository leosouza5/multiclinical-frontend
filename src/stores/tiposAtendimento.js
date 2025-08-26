// src/stores/tiposAtendimento.js
import { defineStore } from "pinia";
import {
  listTiposAtendimento,
  getTipoAtendimento,
  createTipoAtendimento,
  updateTipoAtendimento,
  deleteTipoAtendimento,
} from "../services/tiposAtendimento.js";

export const useTiposAtendimentoStore = defineStore("tiposAtendimento", {
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
        const data = await listTiposAtendimento(params);
        this.items = Array.isArray(data) ? data : (data.data ?? data.items ?? []);
      } catch (e) {
        this.error = e?.response?.data?.message || e.message || "Erro ao carregar tipos de atendimento";
        throw e;
      } finally { this.loading = false; }
    },

    async fetchOne(id) {
      this.loading = true; this.error = null;
      try {
        this.current = await getTipoAtendimento(id);
        return this.current;
      } catch (e) {
        this.error = e?.response?.data?.message || e.message || "Erro ao carregar tipo de atendimento";
        throw e;
      } finally { this.loading = false; }
    },

    async create(payload) {
      this.loading = true; this.error = null;
      try {
        const created = await createTipoAtendimento(payload);
        return created;
      } catch (e) {
        this.error = e?.response?.data?.message || e.message || "Erro ao criar tipo de atendimento";
        throw e;
      } finally { this.loading = false; }
    },

    async update(id, payload) {
      this.loading = true; this.error = null;
      try {
        const updated = await updateTipoAtendimento(id, payload);
        const idx = this.items.findIndex(t => String(t.id) === String(id));
        if (idx > -1) this.items[idx] = { ...this.items[idx], ...updated };
        if (this.current?.id === id) this.current = { ...this.current, ...updated };
        return updated;
      } catch (e) {
        this.error = e?.response?.data?.message || e.message || "Erro ao atualizar tipo de atendimento";
        throw e;
      } finally { this.loading = false; }
    },

    async remove(id) {
      this.loading = true; this.error = null;
      try {
        await deleteTipoAtendimento(id);
        this.items = this.items.filter(t => String(t.id) !== String(id));
      } catch (e) {
        this.error = e?.response?.data?.message || e.message || "Erro ao remover tipo de atendimento";
        throw e;
      } finally { this.loading = false; }
    },
  },
});
