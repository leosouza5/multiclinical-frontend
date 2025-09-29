import { defineStore } from 'pinia'
import { getRelatorioAtendimentos } from '@/services/relatorios.js'

export const useRelatoriosAtendimentosStore = defineStore('relatoriosAtendimentos', {
  state: () => ({
    loading: false,
    items: [],
    periodo: { inicio: '', fim: '' },
    pagination: { page: 1, per_page: 200, total_items: 0, total_pages: 1 },
  }),
  actions: {
    async load({ inicio, fim, page = 1, per_page = 200, order_by = 'valor_liquido', order_dir = 'desc' } = {}) {
      this.loading = true
      try {
        const params = { inicio, fim, page, per_page, order_by, order_dir }
        const data = await getRelatorioAtendimentos(params)
        this.items = Array.isArray(data?.items) ? data.items : []
        this.periodo = data?.periodo || { inicio, fim }
        this.pagination = data?.pagination || { page, per_page, total_items: this.items.length, total_pages: 1 }
        return data
      } finally {
        this.loading = false
      }
    },
    reset () {
      this.items = []
      this.periodo = { inicio: '', fim: '' }
      this.pagination = { page: 1, per_page: 200, total_items: 0, total_pages: 1 }
    }
  }
})
