import axios from "axios";
import { useAuthStore } from "../stores/auth";
import { useNotify } from "../stores/notify";

const http = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15000,
});

// Anexa Bearer se houver token
http.interceptors.request.use((config) => {
  const auth = (() => { try { return useAuthStore(); } catch { return null; } })();
  // Só adiciona Authorization se NÃO tiver vindo um no request
  if (!config.headers?.Authorization && auth?.token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${auth.token}`;
  }
  return config;
});


// Trata 401 global (opcional)
http.interceptors.response.use(
  (r) => r,
  (error) => {
    const status = error.response?.status;
    useNotify().error({
      title: `Erro${error.response?.status ? ` ${error.response.status}` : ""}`,
      message: error.response?.data?.message || "Ocorreu um erro."
    })
    if (error.response?.status === 401) useAuthStore().logout();
    return Promise.reject(error);

  }
);

export default http;
