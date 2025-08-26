// src/services/convenios.js
import http from "../services/http.js";

export async function listConvenios(params = {}) {
  const { data } = await http.get("/convenios", { params });
  return data;
}

export async function getConvenio(id) {
  const { data } = await http.get(`/convenios/${id}`);
  return data;
}

export async function createConvenio(payload) {
  const { data } = await http.post("/convenios", payload);
  return data;
}

export async function updateConvenio(id, payload) {
  const { data } = await http.put(`/convenios/${id}`, payload);
  return data;
}

export async function deleteConvenio(id) {
  const { data } = await http.delete(`/convenios/${id}`);
  return data;
}
