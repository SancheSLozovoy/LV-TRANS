import React, { useState, useEffect } from "react";
import {
  EditOutlined,
  CheckOutlined,
  CloseOutlined,
} from "@ant-design/icons";
import { DatePicker, Form, Input, InputNumber, message } from "antd";
import { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
import useFetch from "../../../composales/useFetch.ts";
import { useAuth } from "../../../composales/useAuth.ts";
import styles from "./createOrderForm.module.scss";
import ButtonSubmit from "../../button/Button.tsx";
import { CreateSuccess } from "../../createSuccess/CreateSuccess.tsx";
import { Order, OrderDto } from "../../../models/orderModels.ts";
import { Type } from "../../../models/orderModels.ts";

const { RangePicker } = DatePicker;
const { TextArea } = Input;

export const EditOrderForm: React.FC<{ orderId: string | undefined }> = ({
  orderId,
}) => {
  const { user } = useAuth();
  const [form] = Form.useForm<Order>();
  const [loading, setLoading] = useState(false);
  const { fetchData } = useFetch();
  const [messageApi, contextHolder] = message.useMessage();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await fetchData(`/orders/${orderId}`, "GET");
        setOrderData(response);

        form.setFieldsValue({
          user_id: 0,
          date_end: dayjs(response.date_end),
          date_start: dayjs(response.date_start),
          deliveryDates: [dayjs(response.date_start), dayjs(response.date_end)],
          info: response.info,
          weight: response.weight,
          from: response.from,
          status_id: response.status_id,
          to: response.to,
        });
      } catch (error) {
        console.error("Fetch order data error", error);
        messageApi.open({
          type: "error",
          content: "Не удалось загрузить данные заказа",
        });
      }
    };

    fetchOrderData();
  }, []);

  const onFinish = async (values: Order) => {
    setLoading(true);

    try {
      if (!user?.id) {
        throw new Error("User not found");
      }
      console.log(values);

      const dto: OrderDto = {
        info: values.info,
        weight: values.weight,
        from: values.from,
        to: values.to,
        status_id: orderData.status_id,
        date_start: values.deliveryDates?.[0]
          ? dayjs(values.deliveryDates[0]).format("YYYY-MM-DD")
          : "",
        date_end: values.deliveryDates?.[1]
          ? dayjs(values.deliveryDates[1]).format("YYYY-MM-DD")
          : "",

        user_id: user.id,
      };

      await fetchData(`/orders/${orderId}`, "PUT", dto);
      messageApi.open({
        type: "success",
        content: "Заказ обновлен",
      });
      setIsSuccess(true);
      setIsEditing(false);
    } catch (error) {
      console.error("Update order error", error);
      messageApi.open({
        type: "error",
        content: "Не удалось обновить заказ",
      });
    } finally {
      setLoading(false);
    }
  };

  const onReset = () => {
    setIsEditing(false);
  };

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return current && current < dayjs().startOf("day");
  };

  return (
    <>
      {contextHolder}
      {isSuccess ? (
        <CreateSuccess type={Type.update} />
      ) : (
        <>
          <h1 className={styles.create__title}>
            Информация о заказе №{orderId}
          </h1>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            className={styles.form}
          >
            <Form.Item
              label="Общая информация"
              name="info"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, введите информацию о грузе",
                },
              ]}
            >
              <TextArea rows={6} disabled={!isEditing} />
            </Form.Item>

            <Form.Item
              label="Вес груза"
              name="weight"
              rules={[
                { required: true, message: "Пожалуйста, введите вес груза" },
                {
                  type: "number",
                  min: 0.01,
                  message: "Вес должен быть больше 0",
                },
              ]}
            >
              <InputNumber min={0.01} step={0.01} disabled={!isEditing} />
            </Form.Item>

            <Form.Item
              label="Откуда"
              name="from"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, введите место загрузки",
                },
              ]}
            >
              <Input disabled={!isEditing} />
            </Form.Item>

            <Form.Item
              label="Куда"
              name="to"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, введите место выгрузки",
                },
              ]}
            >
              <Input disabled={!isEditing} />
            </Form.Item>

            <Form.Item
              label="Даты доставки"
              name="deliveryDates"
              rules={[
                {
                  required: true,
                  message: "Пожалуйста, выберите даты доставки",
                },
              ]}
            >
              <RangePicker
                disabledDate={disabledDate}
                placeholder={["Дата загрузки", "Дата выгрузки"]}
                disabled={!isEditing}
              />
            </Form.Item>

            <Form.Item>
              <div className={styles.form__buttons}>
                {isEditing ? (
                  <>
                    <ButtonSubmit
                      htmlType="button"
                      onClick={onReset}
                      text="Отмена"
                      icon={<CloseOutlined />}
                    />
                    <ButtonSubmit
                      htmlType="submit"
                      loading={loading}
                      text="Сохранить"
                      icon={<CheckOutlined />}
                    />
                  </>
                ) : (
                  <>
                    <ButtonSubmit
                      htmlType="button"
                      onClick={() => setIsEditing(true)}
                      text="Редактировать"
                      icon={<EditOutlined />}
                    />
                  </>
                )}
              </div>
            </Form.Item>
          </Form>
        </>
      )}
    </>
  );
};
