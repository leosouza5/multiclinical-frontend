import { defineStore } from "pinia";
import {
  listAtendimentos,
  getAtendimento,
  createAtendimento,
  updateAtendimento,
  deleteAtendimento,
} from "@/services/atendimentos";

export const useAtendimentosStore = defineStore("atendimentos", {
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
        const { items, meta } = await listAtendimentos(params);
        this.items = items;
        this.meta = meta;
        this.lastParams = params;
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
        this.current = await getAtendimento(id);
        return this.current;
      } finally {
        this.loading = false;
      }
    },

    async create(payload) {
      this.loading = true;
      try {
        return await createAtendimento(payload);
      } finally {
        this.loading = false;
      }
    },

    async update(id, payload) {
      this.loading = true;
      try {
        return await updateAtendimento(id, payload);
      } finally {
        this.loading = false;
      }
    },

    async remove(id) {
      this.loading = true;
      try {
        await deleteAtendimento(id);
        this.items = this.items.filter(i => i.id !== id);
      } finally {
        this.loading = false;
      }
    },
  },
});
