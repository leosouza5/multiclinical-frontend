import http from "./http.js";

export async function getDashboardResumo(params = {}) {
  // espera: { inicio: ISOString, fim: ISOString }
  const { data } = await http.get("/dashboard", { params });
  return data;
}
