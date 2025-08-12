import http from "./http";

// POST /auth/login  -> { token, user }
export async function loginApi(payload) {
  console.log(payload)
  const { data } = await http.post("/usuarios/login", payload);
  console.log(data);
  
  return data;
}

// GET /auth/me -> user
export async function meApi() {
  const { data } = await http.get("/auth/me");
  return data;
}

// POST /auth/logout (opcional)
export async function logoutApi() {
  try { await http.post("/auth/logout"); } catch {}
}
