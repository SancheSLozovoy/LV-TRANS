import axios from "axios";
import Cookies from "js-cookie";

const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

instance.interceptors.request.use((config) => {
  const token = Cookies.get("token");

  if (token && !config.url?.includes("/login") && !config.url?.includes("/register")) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default instance;
