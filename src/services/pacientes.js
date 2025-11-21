import http  from "./http";

export async function listPacientes(params = {}) {
  const { data } = await http.get("/clientes", { params });
  return data?.items ?? data?.data ?? [];
}

export async function getPaciente(id) {
  const { data } = await http.get(`/clientes/${id}`);
  return data;
}

export async function createPaciente(payload) {
  const { data } = await http.post("/clientes", payload);
  return data;
}

export async function updatePaciente(id, payload) {
  const { data } = await http.put(`/clientes/${id}`, payload);
  return data;
}

export async function deletePaciente(id) {
  const { data } = await http.delete(`/clientes/${id}`);
  return data;
}

export async function inativarPaciente(id) {
  const { data } = await http.patch(`/clientes/${id}/inativar`);
  return data;
}
