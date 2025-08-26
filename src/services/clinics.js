// src/services/clinicas.js
import http from "./http.js"; // mesmo padrão do users service

export async function listClinics(params = {}) {
  const { data } = await http.get("/clinicas", { params });
  return data;
}

export async function getClinic(id) {
  const { data } = await http.get(`/clinicas/${id}`);
  return data;
}

export async function createClinic(payload) {
  const { data } = await http.post("/clinicas", payload);
  return data;
}

export async function updateClinic(id, payload) {
  const { data } = await http.put(`/clinicas/${id}`, payload);
  return data;
}

export async function deleteClinic(id) {
  const { data } = await http.delete(`/clinicas/${id}`);
  return data;
}
