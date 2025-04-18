import { User, UserAuth, UserDecodeJWT } from "../models/userModels.ts";
import Cookies from "js-cookie";
import { FormInstance } from "antd";
import { MessageInstance } from "antd/es/message/interface";
import { NavigateFunction } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import useFetch from "./useFetch.ts";

export const useAuth = () => {
  const token = Cookies.get("token");

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

    const regData: UserAuth = {
      email: values.email,
      password: values.password,
      phone: values.phone,
    };

    const loginData: UserAuth = {
      email: values.email,
      password: values.password,
    };

    try {
      if (type === "register") {
        await fetchData("/users", "POST", regData);
        messageApi.open({
          type: "success",
          content: "Успешная регистрация",
        });
        setTimeout(() => navigate("/login"), 3000);
      } else {
        const res = await fetchData("/users/login", "POST", loginData);
        Cookies.set("token", res.token, { expires: 7 });
        messageApi.open({
          type: "success",
          content: "Успешный вход",
        });
        setTimeout(() => navigate("/"), 3000);
      }
    } catch (e: any) {
      if (type === "register") {
        if (e.code === "ERR_NETWORK") {
          messageApi.open({
            type: "error",
            content: "Ошибка сервера. Попробуйте позже",
          });
        } else {
          messageApi.open({
            type: "error",
            content: "Данный пользователь уже существует",
          });
        }
      } else {
        messageApi.open({
          type: "error",
          content: "Неверная почта или пароль",
        });
      }
    }
  };

  const user = token ? handleGetUser(token) : null;

  return { handleAuth, handleGetUser, token, user };
};
