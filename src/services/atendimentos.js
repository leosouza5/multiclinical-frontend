import http from "./http";

export async function listAtendimentos(params = {}) {
  const { data } = await http.get("/atendimentos", { params });
  return {
    items: data?.items ?? data?.data ?? [],
    meta: data?.meta ?? { page: 1, per_page: 10, total: data?.total ?? 0 },
  };
}

export async function getAtendimento(id) {
  const { data } = await http.get(`/atendimentos/${id}`);
  return data;
}

export async function createAtendimento(payload) {
  const { data } = await http.post("/atendimentos", payload);
  return data;
}

export async function updateAtendimento(id, payload) {
  const { data } = await http.put(`/atendimentos/${id}`, payload);
  return data;
}

export async function deleteAtendimento(id) {
  const { data } = await http.delete(`/atendimentos/${id}`);
  return data;
}
