import { defineStore } from "pinia";
import {
  listUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} from "../services/users.js";

export const useUsersStore = defineStore("users", {
  state: () => ({
    items: [],       // lista completa
    current: null,   // usuário carregado p/ edição/detalhe
    loading: false,
    error: null,
  }),

  actions: {
    async loadAll(params = {}) {
      this.loading = true; this.error = null;
      try {
        const data = await listUsers(params);
        console.log(data);
        this.items = Array.isArray(data) ? data : (data.data ?? data.items ?? []);
        
      } catch (e) {
        this.error = e?.response?.data?.message || e.message || "Erro ao carregar usuários";
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async fetchOne(id) {
      this.loading = true; this.error = null;
      try {
        this.current = await getUser(id);
        return this.current;
      } catch (e) {
        this.error = e?.response?.data?.message || e.message || "Erro ao carregar usuário";
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async create(payload) {
      this.loading = true; this.error = null;
      try {
        const created = await createUser(payload);
        // atualiza lista local (se já está carregada)
        // this.loadAll(); 
        return created;
      } catch (e) {
        this.error = e?.response?.data?.message || e.message || "Erro ao criar usuário";
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async update(id, payload) {
      this.loading = true; this.error = null;
      try {
        const updated = await updateUser(id, payload);
        console.log(updated);
        
        const idx = this.items.findIndex(u => String(u.id) === String(id));
        if (idx > -1) this.items[idx] = { ...this.items[idx], ...updated };
        if (this.current?.id === id) this.current = { ...this.current, ...updated };
        return updated;
      } catch (e) {
        this.error = e?.response?.data?.message || e.message || "Erro ao atualizar usuário";
        throw e;
      } finally {
        this.loading = false;
      }
    },

    async remove(id) {
      this.loading = true; this.error = null;
      try {
        await deleteUser(id);
        this.items = this.items.filter(u => String(u.id) !== String(id));
      } catch (e) {
        this.error = e?.response?.data?.message || e.message || "Erro ao remover usuário";
        throw e;
      } finally {
        this.loading = false;
      }
    },
  },
});
