import instance from "../api/axios/axiosSettings.ts";
import Cookies from "js-cookie";
import { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";

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
        const errorMessage = error.response?.data?.message || error.message;

        if (
          errorMessage === "Invalid token" ||
          error.response?.status === 401
        ) {
          Cookies.remove("token");
          navigate("/login");
        }

        throw new Error(errorMessage);
      }
      console.error("Ошибка при выполнении запроса:", error);
      throw error;
    }
  };

  return { fetchData };
}
