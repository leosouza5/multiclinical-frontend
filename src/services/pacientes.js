import http  from "./http";

export async function listPacientes(params = {}) {
  const { data } = await http.get("/pacientes", { params });
  return data?.items ?? data?.data ?? [];
}

export async function getPaciente(id) {
  const { data } = await http.get(`/pacientes/${id}`);
  return data;
}

export async function createPaciente(payload) {
  const { data } = await http.post("/pacientes", payload);
  return data;
}

export async function updatePaciente(id, payload) {
  const { data } = await http.put(`/pacientes/${id}`, payload);
  return data;
}

export async function deletePaciente(id) {
  const { data } = await http.delete(`/pacientes/${id}`);
  return data;
}
