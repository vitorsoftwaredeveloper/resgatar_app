// import axios from "axios";

// export const api = axios.create({
//   baseURL: ENV.API_BASE_URL,
//   timeout: 10000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// export const apiAuth = axios.create({
//   baseURL: ENV.API_BASE_URL_AUTH,
//   timeout: 10000,
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// src/services/api.js
import axios from "axios";
import { ENV } from "../config/env";
import AsyncStorage from "@react-native-async-storage/async-storage";

const api = axios.create({
  baseURL: ENV.API_BASE_URL, // Se você tiver uma API própria
  timeout: 10000,
});

// Interceptor para adicionar token nas requisições
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
