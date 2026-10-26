import axios from "axios";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: `${(process.env.EXPO_PUBLIC_API_URL || "https://mobo-m9ug.onrender.com").replace(/\/$/, "")}/api`,
  withCredentials: true,
  timeout: 15000,
});

// 🔵 REQUEST
api.interceptors.request.use(
  async (config) => {
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
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (!originalRequest) return Promise.reject(error);

    if (!error.response) {
      const isSafeToRetry = originalRequest.method?.toLowerCase() === "get";
      if (isSafeToRetry && !originalRequest._retry) {
        originalRequest._retry = true;
        return api(originalRequest);
      }
      return Promise.reject({
        message: "Servidor indisponível. Tente novamente.",
      });
    }

    const status = error.response.status;

    const isPublicAuthRequest = /\/auth\/(login|register)$/.test(
      originalRequest.url ?? "",
    );

    if (status === 401 && !isPublicAuthRequest && !originalRequest._retry) {
      originalRequest._retry = true;
      await AsyncStorage.removeItem("token");
      router.replace("/login");
    }

    return Promise.reject(error);
  },
);

export default api;
