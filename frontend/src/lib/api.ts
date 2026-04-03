import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const authStorage = localStorage.getItem("auth-storage");
    if (authStorage) {
      const { state } = JSON.parse(authStorage);
      if (state.user?.token) {
        config.headers.Authorization = `Bearer ${state.user.token}`;
      }
    }
  }
  return config;
});

export default api;
