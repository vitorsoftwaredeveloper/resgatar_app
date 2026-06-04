import axios from "axios";
import { fetchAuthSession } from "aws-amplify/auth";
import { ENV } from "@/config/env";

export const api = axios.create({
  baseURL: ENV.API_BASE_URL,
});

api.interceptors.request.use(async (config) => {
  const session = await fetchAuthSession();
  const token = session.tokens?.accessToken?.toString();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
