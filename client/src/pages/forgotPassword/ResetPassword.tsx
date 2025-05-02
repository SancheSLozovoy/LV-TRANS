import { useNavigate, useSearchParams } from "react-router-dom";
import { Form, Input, Typography, message } from "antd";
import { useState } from "react";
import ButtonSubmit from "../../components/button/Button.tsx";
import useFetch from "../../composables/useFetch.ts";
import styles from "../../components/forms/auth/form.module.scss";
import { Container } from "../../components/container/Container.tsx";
import { LockOutlined } from "@ant-design/icons";

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const { fetchData } = useFetch();
  const navigate = useNavigate();

  const onFinish = async (values: { password: string }) => {
    if (!token) {
      return messageApi.error("Некорректный токен");
    }

    setLoading(true);
    try {
      await fetchData("/users/reset-password", "POST", {
        token,
        password: values.password,
      })
        .then((res) => messageApi.success(res.message))
        .then(() => navigate("/login"));
    } catch (error) {
      console.log(error);
      messageApi.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <Typography.Text type="danger">
        Некорректная или отсутствующая ссылка восстановления
      </Typography.Text>
    );
  }

  return (
    <Container>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
          height: "100vh",
        }}
      >
        <h1 className={styles.form__title}>Восстановление пароля</h1>
        {contextHolder}
        <Form className={styles.form} onFinish={onFinish} layout="vertical">
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
            <Input.Password
              rootClassName={styles.form__input}
              prefix={<LockOutlined />}
              type="password"
              placeholder="Пароль"
            />
          </Form.Item>
          <Form.Item>
            <ButtonSubmit
              htmlType="submit"
              loading={loading}
              text="Обновить пароль"
            />
          </Form.Item>
        </Form>
      </div>
    </Container>
  );
}
