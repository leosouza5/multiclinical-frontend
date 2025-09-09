// src/services/procedures.js
import http from "../services/http.js";

// Lista todos os procedimentos
export async function listProcedures(params = {}) {
  const { data } = await http.get("/procedimentos", { params });
  console.log(data);
  
  return data;
}

// Busca 1 procedimento
export async function getProcedure(id) {
  const { data } = await http.get(`/procedimentos/${id}`);
  return data;
}

// Cria procedimento
export async function createProcedure(payload) {
  const { data } = await http.post("/procedimentos", payload);
  return data;
}

// Atualiza procedimento
export async function updateProcedure(id, payload) {
  const { data } = await http.put(`/procedimentos/${id}`, payload);
  return data;
}

// Exclui procedimento
export async function deleteProcedure(id) {
  const { data } = await http.patch(`/procedimentos/${id}/inativar`);
  return data;
}
