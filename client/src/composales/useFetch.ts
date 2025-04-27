import instance from "../api/axios/axiosSettings.ts";
import Cookies from "js-cookie";
import { isAxiosError } from "axios";

export default function useFetch() {
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
          const refreshToken = Cookies.get("refreshToken");
          if (refreshToken) {
            try {
              const res = await instance.post("/users/refresh-token", {
                refreshToken,
              });
              const newAccessToken = res.data.accessToken;
              Cookies.set("accessToken", newAccessToken, { expires: 0.01 });

              error.config.headers["Authorization"] =
                `Bearer ${newAccessToken}`;

              return instance(error.config);
            } catch (refreshError) {
              console.error(refreshError);
              throw new Error("Не удалось обновить токен");
            }
          } else {
            throw new Error("Refresh token отсутствует");
          }
        }

        throw new Error(errorMessage);
      }
      console.error("Ошибка при выполнении запроса:", error);
      throw error;
    }
  };

  return { fetchData };
}
