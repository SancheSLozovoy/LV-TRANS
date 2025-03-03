import { UserLogin, UserRegister } from "../models/user";
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
    const decode = jwtDecode(token);
    const user = {
      login: decode.login,
      id: decode.id,
    };
    console.log(user);
    return user;
  };

  const handleAuth = async (
    form: FormInstance,
    messageApi: MessageInstance,
    navigate: NavigateFunction,
    type: "register" | "login",
  ) => {
    const values = form.getFieldsValue();
    const regData: UserRegister = {
      login: values.login,
      password: values.password,
      phone: values.phone,
    };
    const loginData: UserLogin = {
      login: values.login,
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
        Cookies.set("token", res.data.token, { expires: 7 });
        messageApi.open({
          type: "success",
          content: "Успешный вход",
        });
        setTimeout(() => navigate("/"), 3000);
      }
    } catch (e: unknown) {
      if (type === "register") {
        if (e.code === "ERR_NETWORK") {
          messageApi.open({
            type: "error",
            content: "Ошибка сервера. Попробуйте позже",
          });
        } else {
          messageApi.open({
            type: "error",
            content: "Данный логин уже существует",
          });
        }
      } else {
        messageApi.open({
          type: "error",
          content: "Неверный логин или пароль",
        });
      }
    }
  };

  return { handleAuth, handleGetUser, token };
};
