import http from "./http.js";

// GET /relatorios/atendimentos?inicio=YYYY-MM-DD&fim=YYYY-MM-DD&page=1&per_page=99999&order_by=valor_liquido&order_dir=desc
export async function getRelatorioAtendimentos (params) {
  const { inicio, fim, page = 1, per_page = 200, order_by = 'valor_liquido', order_dir = 'desc' } = params || {}
  const { data } = await http.get('/relatorios/atendimentos', {
    params: { inicio, fim, page, per_page, order_by, order_dir }
  })
  return data
}
