import React, { useEffect, useState } from "react";
import { Form, Input, message, Button } from "antd";
import { User } from "../../../models/userModels.ts";
import { useAuth } from "../../../composales/useAuth.ts";
import useFetch from "../../../composales/useFetch.ts";
import { useNavigate } from "react-router-dom";
import styles from "./editUserForm.module.scss";
import ButtonSubmit from "../../button/Button.tsx";
import { LeftCircleOutlined, SaveOutlined } from "@ant-design/icons";
import { ChangePasswordModal } from "../../changePassword/ChangePasswordModal.tsx";

export const EditUserForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { fetchData } = useFetch();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [userData, setUserData] = useState<User | null>(null);
  const [isPasswordModalOpen, setPasswordModalOpen] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchData(`users/${user.id}`, "GET").then((res) => {
        setUserData(res);
        form.setFieldsValue(res);
      });
    }
  }, []);

  const onFinish = async (values: Partial<User>) => {
    setLoading(true);
    try {
      if (!userData) {
        throw new Error("User data not loaded");
      }

      const dto: User = { ...userData, ...values };

      await fetchData(`users/${user?.id}`, "PUT", dto);
      messageApi.success("Профиль успешно обновлен");
    } catch (error) {
      console.error("Update user error", error);
      messageApi.error("Не удалось обновить профиль");
    } finally {
      setLoading(false);
    }
  };

  const onCancel = () => {
    navigate("/profile");
  };

  return (
    <>
      {contextHolder}
      <h1 className={styles.create__title}>Редактировать профиль</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className={styles.form}
      >
        <div className={styles.form__content}>
          <Form.Item
            label="Логин"
            name="login"
            rules={[{ required: true, message: "Введите логин" }]}
          >
            <Input className={styles.form__input} />
          </Form.Item>

          <Form.Item
            label="Номер телефона"
            name="phone"
            rules={[{ required: true, message: "Введите номер телефона" }]}
          >
            <Input className={styles.form__input} />
          </Form.Item>

          <Form.Item>
            <Button
              className={styles.form__link}
              type="link"
              onClick={() => setPasswordModalOpen(true)}
            >
              Сменить пароль
            </Button>
          </Form.Item>

          <Form.Item className={styles.form__buttons}>
            <div className={styles.button__group}>
              <Form.Item className={styles.cancelButton}>
                <ButtonSubmit
                  htmlType="button"
                  onClick={onCancel}
                  text="Назад"
                  icon={<LeftCircleOutlined />}
                />
              </Form.Item>
              <Form.Item className={styles.saveButton}>
                <ButtonSubmit
                  htmlType="submit"
                  loading={loading}
                  text="Сохранить"
                  icon={<SaveOutlined />}
                />
              </Form.Item>
            </div>
          </Form.Item>
        </div>
      </Form>

      <ChangePasswordModal
        userData={userData}
        visible={isPasswordModalOpen}
        onClose={() => setPasswordModalOpen(false)}
        onSuccess={setUserData}
      />
    </>
  );
};
