import { User, UserAuth, UserDecodeJWT } from "../models/userModels.ts";
import Cookies from "js-cookie";
import { FormInstance } from "antd";
import { MessageInstance } from "antd/es/message/interface";
import { NavigateFunction } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import useFetch from "./useFetch.ts";

export const useAuth = () => {
  const token = Cookies.get("accessToken");

  const { fetchData } = useFetch();

  const handleGetUser = (token: string) => {
    if (!token) return null;

    const decode = jwtDecode<User>(token);

    const userData: UserDecodeJWT = {
      email: decode.email,
      id: decode.id,
      role_id: decode.role_id,
    };

    return userData;
  };

  const handleAuth = async (
    form: FormInstance,
    messageApi: MessageInstance,
    navigate: NavigateFunction,
    type: "register" | "login",
  ) => {
    const values = form.getFieldsValue();

    const data: UserAuth = {
      email: values.email,
      phone: values.phone,
      password: values.password,
    };

    try {
      if (type === "register") {
        const res = await fetchData("/users", "POST", data);
        messageApi.success(res.message);
        Cookies.set("accessToken", res.accessToken, { expires: 7 });
        Cookies.set("refreshToken", res.refreshToken, { expires: 7 });
        setTimeout(() => navigate("/"), 3000);
      } else {
        const res = await fetchData("/users/login", "POST", data);
        Cookies.set("accessToken", res.accessToken, { expires: 7 });
        Cookies.set("refreshToken", res.refreshToken, { expires: 7 });
        messageApi.success(res.message);
        setTimeout(() => navigate("/"), 3000);
      }
    } catch (e: any) {
      if (type === "register") {
        if (e.code === "ERR_NETWORK") {
          messageApi.error(e.message);
        } else {
          messageApi.error(e.message);
        }
      } else {
        messageApi.error(e.message);
      }
    }
  };

  const user = token ? handleGetUser(token) : null;

  return { handleAuth, handleGetUser, token, user };
};
