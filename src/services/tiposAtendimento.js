// src/services/tiposAtendimento.js
import http from "../services/http.js";

export async function listTiposAtendimento(params = {}) {
  const { data } = await http.get("/tipos-atendimento", { params });
  return data;
}

export async function getTipoAtendimento(id) {
  const { data } = await http.get(`/tipos-atendimento/${id}`);
  return data;
}

export async function createTipoAtendimento(payload) {
  const { data } = await http.post("/tipos-atendimento", payload);
  return data;
}

export async function updateTipoAtendimento(id, payload) {
  const { data } = await http.put(`/tipos-atendimento/${id}`, payload);
  return data;
}

export async function deleteTipoAtendimento(id) {
  const { data } = await http.delete(`/tipos-atendimento/${id}`);
  return data;
}
