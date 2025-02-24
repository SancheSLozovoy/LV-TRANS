import { UserLogin, UserRegister } from "../../models/user";
import instance from "../../axios/axiosSettings.ts";
import Cookies from "js-cookie";
import { FormInstance } from "antd";
import { MessageInstance } from "antd/es/message/interface";
import { NavigateFunction } from "react-router-dom";

export const handleAuth = async (
  form: FormInstance<any>,
  messageApi: MessageInstance,
  navigate: NavigateFunction,
  type: string,
): Promise<void> => {
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
      await instance
        .post("/users", regData)
        .then(() => setTimeout(() => navigate("/login"), 3000));
      messageApi.open({
        type: "success",
        content: "Успешная регистрация",
      });
    } else {
      try {
        const res = await instance.post("/users/login", loginData);
        console.log(res); // Проверяем, что содержится в ответе
        Cookies.set("token", res.data.token, { expires: 7 });
        messageApi.open({
          type: "success",
          content: "Успешный вход",
        });
        setTimeout(() => navigate("/"), 3000);
      } catch (error) {
        messageApi.open({
          type: "error",
          content: "Неверный логин или пароль",
        });
      }
    }
  } catch (e) {
    if (type === "register") {
      if (e.code === "ERR_NETWORK") {
        messageApi.open({
          type: "error",
          content: "Ошибка серевера. Попробуйте позже",
        });
      } else {
        messageApi.open({
          type: "error",
          content: "Данный логин уже существует",
        });
      }
    } else {
    }
  }
};
