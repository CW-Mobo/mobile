import axios from "axios";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: "https://mobo-m9ug.onrender.com/api",
  withCredentials: true,
  timeout: 15000,
});

// 🔵 REQUEST
api.interceptors.request.use(
  async (config) => {
    console.log("➡️ Request:", config.method?.toUpperCase(), config.url);

    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    }
    return config;
  },
  (error) => {
    console.error("❌ Erro antes da requisição:", error);
    return Promise.reject(error);
  },
);

// 🔴 RESPONSE
api.interceptors.response.use(
  (response) => {
    console.log("✅ Response:", response.status, response.config.url);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      console.error("🌐 Erro de rede ou servidor offline:", error.message);
      if (!originalRequest._retry) {
        originalRequest._retry = true;
        console.log("🔁 Tentando novamente...");
        return api(originalRequest);
      }
      return Promise.reject({
        message: "Servidor indisponível. Tente novamente.",
      });
    }

    const status = error.response.status;

    if (status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      console.warn("🔒 Não autenticado, redirecionando...");
      await AsyncStorage.removeItem("token");
      router.replace("/login");
    }

    if (status === 403) console.warn("⛔ Acesso negado");
    if (status === 404)
      console.warn("❓ Endpoint não encontrado:", originalRequest.url);
    if (status >= 500)
      console.error("🔥 Erro no servidor:", error.response.data);

    return Promise.reject(error);
  },
);

export default api;
