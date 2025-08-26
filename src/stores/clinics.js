// src/stores/clinicas.js
import { defineStore } from "pinia";
import {
  listClinics,
  getClinic,
  createClinic,
  updateClinic,
  deleteClinic,
} from "../services/clinics.js";

export const useClinicsStore = defineStore("clinics", {
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
        const data = await listClinics(params);
        // console.log(data);

        this.items = data?.items
        return this.items

      } catch (e) {
        this.error = e?.response?.data?.message || e.message || "Erro ao carregar clínicas";
        throw e;
      } finally { this.loading = false; }
    },

    async fetchOne(id) {
      this.loading = true; this.error = null;
      try {
        this.current = await getClinic(id);
        return this.current;
      } catch (e) {
        this.error = e?.response?.data?.message || e.message || "Erro ao carregar clínica";
        throw e;
      } finally { this.loading = false; }
    },

    async create(payload) {
      this.loading = true; this.error = null;
      try {
        const created = await createClinic(payload);
        // se já tiver lista carregada, você pode optar por recarregar:
        // await this.loadAll();
        return created;
      } catch (e) {
        this.error = e?.response?.data?.message || e.message || "Erro ao criar clínica";
        throw e;
      } finally { this.loading = false; }
    },

    async update(id, payload) {
      this.loading = true; this.error = null;
      try {
        const updated = await updateClinic(id, payload);
        const idx = this.items.findIndex(c => String(c.id) === String(id));
        if (idx > -1) this.items[idx] = { ...this.items[idx], ...updated };
        if (this.current?.id == id) this.current = { ...this.current, ...updated };
        return updated;
      } catch (e) {
        this.error = e?.response?.data?.message || e.message || "Erro ao atualizar clínica";
        throw e;
      } finally { this.loading = false; }
    },

    async remove(id) {
      this.loading = true; this.error = null;
      try {
        await deleteClinic(id);
        this.items = this.items.filter(c => String(c.id) !== String(id));
      } catch (e) {
        this.error = e?.response?.data?.message || e.message || "Erro ao remover clínica";
        throw e;
      } finally { this.loading = false; }
    },
    // stores/clinics.ts (trecho)
    async inativar(id) { const r = await fetch(`${BASE}/${id}/inativar`, { method: 'PATCH' }); if (!r.ok) throw new Error(); return r.json(); },
    async ativar(id) { const r = await fetch(`${BASE}/${id}/ativar`, { method: 'PATCH' }); if (!r.ok) throw new Error(); return r.json(); },

  },
});
