import { defineStore } from "pinia";
import { loginApi, meApi, logoutApi } from "../services/auth";
import { useNotify } from "./notify";

function loadPersisted() {
  const raw = localStorage.getItem("auth") || sessionStorage.getItem("auth");
  try { return raw ? JSON.parse(raw) : null; } catch { return null; }
}
function persist({ token, user }, remember) {
  const json = JSON.stringify({ token, user });
  if (remember) localStorage.setItem("auth", json);
  else sessionStorage.setItem("auth", json);
}
function clearPersist() {
  localStorage.removeItem("auth");
  sessionStorage.removeItem("auth");
}

export const useAuthStore = defineStore("auth", {
  state: () => {
    const p = loadPersisted();
    return { token: p?.token ?? null, user: p?.user ?? null, loading: false, error: null };
  },
  getters: { isAuthenticated: (s) => !!s.token },
  actions: {
    async login({ userName, password, remember }) {
      this.loading = true; this.error = null;
      try {
        const { token, usuario } = await loginApi({ "login": userName, "senha": password });
        console.log(token,usuario);
        

        // 
        this.token = token; 
        this.user = usuario;
        clearPersist();               // limpa antes
        persist(this.$state, !!remember);
        useNotify().success({ title: "Bem-vindo!", message: "Login realizado com sucesso." });

      } catch (e) {
        this.error = e?.response?.data?.message || "Falha no login";
        throw e;
      } finally {
        this.loading = false;
      }
    },
    logout() {
      this.token = null;
      this.user = null;
      clearPersist();
    },

  },
});
