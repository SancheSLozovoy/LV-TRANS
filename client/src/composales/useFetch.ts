import instance from "../api/axios/axiosSettings.ts";
import Cookies from "js-cookie";

export interface FetchOptions {
  method: "GET" | "POST" | "PUT" | "DELETE";
  url: string;
  data?: any;
  headers?: Record<string, string>;
}

export default function useFetch() {
  const fetchData = async (
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
    data?: any,
    headers: Record<string, string> | boolean = {},
  ) => {
    try {
      const response = await instance({
        method,
        url,
        data,
        headers,
      });
      return response.data;
    } catch (error) {
      if (error.response.status === 403) {
        Cookies.remove("token");
      }
      console.error("Ошибка при выполнении запроса:", error);
      throw error;
    }
  };

  return { fetchData };
}
