import React, { useState } from "react";
import { Modal, Form, Input, message } from "antd";
import useFetch from "../../composables/useFetch.ts";

interface ChangePasswordModalProps {
  visible: boolean;
  onClose: () => void;
}

export const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  visible,
  onClose,
}) => {
  const { fetchData } = useFetch();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      setLoading(true);

      const res = await fetchData("/users/update-password", "POST", {
        password: values.password,
      });
      messageApi.success(res.message);

      onClose();
    } catch (error) {
      console.error("Error updating password", error);
      messageApi.error((error as Error).message);
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
