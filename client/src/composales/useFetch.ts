import instance from "../api/axios/axiosSettings.ts";
import Cookies from "js-cookie";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";

export interface FetchOptions {
  method: "GET" | "POST" | "PUT" | "DELETE";
  url: string;
  data?: any;
  headers?: Record<string, string>;
}

export default function useFetch() {
  const navigate = useNavigate();

  const fetchData = async (
    url: string,
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
    data?: any,
    headers?: Record<string, string>,
  ) => {
    try {
      const response = await instance({
        method,
        url,
        data,
        headers: headers || {},
      });
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        if (error.response?.status === 403) {
          Cookies.remove("token");
          navigate("/login");
        }
      }
      console.error("Ошибка при выполнении запроса:", error);
      throw error;
    }
  };

  return { fetchData };
}
