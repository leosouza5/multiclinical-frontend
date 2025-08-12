// src/services/users.service.js
import http from "../services/http.js"; // seu axios configurado
// ou: import axios from "axios"; se não tiver plugin

export async function listUsers(params = {}) {
  const { data } = await http.get("/usuarios", { params });
  return data; 
}

export async function getUser(id) {
  const { data } = await http.get(`/users/${id}`);
  return data;
}

export async function createUser(payload) {
  console.log(payload);
  
  const { data } = await http.post("/usuarios", payload);
  return data;
}

export async function updateUser(id, payload) {
  const { data } = await http.put(`/users/${id}`, payload);
  return data;
}

export async function deleteUser(id) {
  const { data } = await http.delete(`/users/${id}`);
  return data;
}
