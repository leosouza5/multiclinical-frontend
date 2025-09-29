import { defineStore } from "pinia";
import { getDashboardResumo } from "@/services/dashboard.js";

function calcPercent(value, total) {
  if (!total || total <= 0) return 0;
  return Number(((value / total) * 100).toFixed(1));
}
function mapListToChartData(list = [], totalLiquido = 0) {
  return list.map(item => ({
    nome: item?.nome ?? "",
    valor: Number(item?.liquido ?? 0),
    porcentagem: calcPercent(Number(item?.liquido ?? 0), totalLiquido),
  }));
}

export const useDashboardStore = defineStore("dashboard", {
  state: () => ({
    resumo: null,
    loading: false,
    error: null,
    periodo: { inicio: null, fim: null },
  }),

  getters: {
    totalAtendimentos: (s) => s.resumo?.total?.quantidade_atendimentos ?? 0,
    faturamentoBruto:  (s) => s.resumo?.total?.faturamento_bruto ?? 0,
    descontoTotal:     (s) => s.resumo?.total?.desconto_total ?? 0,
    faturamentoLiquido:(s) => s.resumo?.total?.faturamento_liquido ?? 0,
    ticketMedio:       (s) => s.resumo?.total?.ticket_medio ?? 0,

    porConvenioChart(s) {
      const totalLiq = s.resumo?.total?.faturamento_liquido ?? 0;
      return mapListToChartData(s.resumo?.por_convenio ?? [], totalLiq);
    },
    porClinicaChart(s) {
      const totalLiq = s.resumo?.total?.faturamento_liquido ?? 0;
      return mapListToChartData(s.resumo?.por_clinica ?? [], totalLiq);
    },
    porTipoAtendimentoChart(s) {
      const totalLiq = s.resumo?.total?.faturamento_liquido ?? 0;
      return mapListToChartData(s.resumo?.por_tipo_atendimento ?? [], totalLiq);
    },
    porProcedimentoChart(s) {
      const totalLiq = s.resumo?.total?.faturamento_liquido ?? 0;
      return mapListToChartData(s.resumo?.por_procedimento ?? [], totalLiq);
    },
  },

  actions: {
    async loadResumo({ inicio, fim }) {
      this.loading = true; this.error = null;
      try {
        this.periodo = { inicio, fim };
        const data = await getDashboardResumo({ inicio, fim });
        this.resumo = data ?? {
          total: {
            quantidade_atendimentos: 0,
            faturamento_bruto: 0,
            desconto_total: 0,
            faturamento_liquido: 0,
            ticket_medio: 0,
          },
          por_convenio: [],
          por_clinica: [],
          por_tipo_atendimento: [],
          por_procedimento: [],
        };
        return this.resumo;
      } catch (e) {
        this.error = e?.response?.data?.message || e.message || "Erro ao carregar resumo do dashboard";
        throw e;
      } finally { this.loading = false; }
    },
  },
});
