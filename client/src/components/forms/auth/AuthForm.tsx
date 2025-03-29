import React, { useState } from "react";
import { LockOutlined, UserOutlined, PhoneOutlined } from "@ant-design/icons";
import { Checkbox, Flex, Form, Input, message } from "antd";
import { Link, useNavigate } from "react-router-dom";
import styles from "./form.module.scss";
import ButtonSubmit from "../../button/Button.tsx";
import { useAuth } from "../../../composales/useAuth.ts";

interface FormProps {
  type: "login" | "register";
}

const AuthForm: React.FC<FormProps> = ({ type }): React.JSX.Element => {
  const [form] = Form.useForm();
  const [agreement, setAgreement] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const navigate = useNavigate();

  const { handleAuth } = useAuth();

  const handleSubmit = (): void => {
    if (!agreement && type === "register") {
      messageApi.error(
        "Пожалуйста, примите согласие на обработку персональных данных",
      );
      return;
    }

    handleAuth(form, messageApi, navigate, type);
  };

  return (
    <Form form={form} name="form" onFinish={handleSubmit}>
      <div className={styles.form}>
        {contextHolder}
        <Form.Item
          className={styles.form__item}
          name="login"
          rules={[{ required: true, message: "Пожалуйста, введите логин!" }]}
        >
          <Input
            rootClassName={styles.form__input}
            prefix={<UserOutlined />}
            placeholder="Логин"
          />
        </Form.Item>
        {type === "register" ? (
          <Form.Item
            className={styles.form__item}
            name="phone"
            rules={[
              {
                required: true,
                message: "Пожалуйста, введите номер телефона!",
              },
            ]}
          >
            <Input
              rootClassName={styles.form__input}
              prefix={<PhoneOutlined />}
              placeholder="Номер телефона"
            />
          </Form.Item>
        ) : null}

        <Form.Item
          className={styles.form__item}
          name="password"
          rules={[
            { required: true, message: "Пожалуйста, введите пароль!" },
            {
              min: 8,
              message: "Пароль не может быть меньше 8 символов",
            },
          ]}
        >
          <Input
            rootClassName={styles.form__input}
            prefix={<LockOutlined />}
            type="password"
            placeholder="Пароль"
          />
        </Form.Item>
        {type === "register" ? (
          <Form.Item
            className={styles.form__item}
            name="agreement"
            valuePropName="checked"
            rules={[
              {
                required: true,
                message: "Пожалуйста, примите согласие на обработку",
              },
            ]}
          >
            <Checkbox onChange={() => setAgreement(!agreement)}>
              Согласие на обработку персональных данных
            </Checkbox>
          </Form.Item>
        ) : null}
      </div>

      <Form.Item>
        <Flex vertical={true} align={"center"} gap={23}>
          <ButtonSubmit
            text={type === "register" ? "Зарегестрироваться" : "Войти"}
            htmlType="submit"
          />
          {type === "register" ? (
            <p className={styles.form__text}>
              Уже есть аккаунт?{" "}
              <Link to="/login" className={styles.form__link}>
                Войти
              </Link>
            </p>
          ) : (
            <p className={styles.form__text}>
              Нет аккаунта?{" "}
              <Link to="/register" className={styles.form__link}>
                Зарегестрироваться
              </Link>
            </p>
          )}
        </Flex>
      </Form.Item>
    </Form>
  );
};

export default AuthForm;
