import React, { useState } from "react";
import { Modal, Form, Input, message } from "antd";
import { User } from "../../models/userModels.ts";
import useFetch from "../../composables/useFetch.ts";

interface ChangePasswordModalProps {
  userData: User | null;
  visible: boolean;
  onClose: () => void;
  onSuccess: (updatedUser: User) => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  userData,
  visible,
  onClose,
  onSuccess,
}) => {
  const { fetchData } = useFetch();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!userData) return;

      setLoading(true);
      const updatedUser: User = { ...userData, password: values.password };

      await fetchData(`users/${userData.id}`, "PUT", updatedUser);
      messageApi.success("Пароль успешно обновлен");

      onSuccess(updatedUser);
      onClose();
    } catch (error) {
      console.error("Error updating password", error);
      messageApi.error("Не удалось сменить пароль");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        title="Смена пароля"
        open={visible}
        onCancel={onClose}
        onOk={handleSubmit}
        okText="Сохранить"
        cancelText="Отмена"
        confirmLoading={loading}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Новый пароль"
            name="password"
            rules={[
              { required: true, message: "Введите новый пароль" },
              {
                min: 8,
                message: "Пароль не может быть меньше 8 символов",
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
