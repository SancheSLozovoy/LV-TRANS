import { Form, Input, message } from "antd";
import { MailOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import ButtonSubmit from "../../components/button/Button.tsx";
import { Container } from "../../components/container/Container.tsx";
import useFetch from "../../composales/useFetch.ts";
import { useState } from "react";
import styles from "../../components/forms/auth/form.module.scss";

export const ForgotPassword = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);

  const { fetchData } = useFetch();

  const handleSubmit = async () => {
    setLoading(true);
    const { email } = form.getFieldsValue();

    try {
      await fetchData("/users/forgot-password", "POST", {
        email,
      })
        .then(() =>
          messageApi.success("Письмо с инструкцией отправлено на ваш email"),
        )
        .then(() => navigate("/login"));
    } catch (err) {
      messageApi.error("Не удалось отправить письмо");
    } finally {
      setLoading(false);
    }
  };

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
        <Form form={form} onFinish={handleSubmit}>
          <div className={styles.form}>
            {contextHolder}

            <Form.Item
              name="email"
              rules={[
                { required: true, message: "Введите email!" },
                { type: "email", message: "Введите корректный email" },
              ]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Email"
                size="large"
              />
            </Form.Item>

            <ButtonSubmit
              loadind={loading}
              text="Восстановить пароль"
              htmlType="submit"
              loading={loading}
            />

            <Link to="/login" className={styles.form__link}>
              Вернуться к входу
            </Link>
          </div>
        </Form>
      </div>
    </Container>
  );
};
