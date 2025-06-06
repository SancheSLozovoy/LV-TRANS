import React, { useState, useEffect } from "react";
import { EditOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { DatePicker, Form, Input, InputNumber, message } from "antd";
import { RangePickerProps } from "antd/es/date-picker";
import dayjs from "dayjs";
import useFetch from "../../../composables/useFetch.ts";
import { useAuth } from "../../../composables/useAuth.ts";
import styles from "./createOrderForm.module.scss";
import ButtonSubmit from "../../button/Button.tsx";
import { CreateSuccess } from "../../createSuccess/CreateSuccess.tsx";
import { Order, OrderDto } from "../../../models/orderModels.ts";
import { Type } from "../../../models/orderModels.ts";
import { useParams } from "react-router-dom";

const { TextArea } = Input;

export const EditOrderForm: React.FC = () => {
  const [form] = Form.useForm<Order>();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [isSuccess, setIsSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [orderData, setOrderData] = useState<Order>();

  const params = useParams();
  const { user, token } = useAuth();
  const { fetchData } = useFetch();

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await fetchData(`/orders/${params.id}`, "GET");
        setOrderData(response);
        form.setFieldsValue({
          date_end: dayjs(response.date_end),
          date_start: dayjs(response.date_start),
          deliveryDates: [dayjs(response.date_start), dayjs(response.date_end)],
          info: response.info,
          weight: response.weight,
          height: response.height,
          width: response.width,
          length: response.length,
          from: response.from,
          status_id: response.status_id,
          to: response.to,
        });
      } catch (error) {
        console.error("Fetch order data error", error);
        messageApi.error((error as Error).message);
      }
    };

    fetchOrderData();
  }, [params.id, token]);

  const onFinish = async (values: Order) => {
    setLoading(true);

    try {
      if (!user?.id) {
        throw new Error("User not found");
      }

      if (!orderData) {
        throw new Error("Order not found");
      }

      const dto: OrderDto = {
        info: values.info,
        weight: values.weight,
        height: values.height,
        width: values.width,
        length: values.length,
        from: values.from,
        to: values.to,
        status_id: orderData.status_id,
        date_start: dayjs(values.date_start).format("YYYY-MM-DD"),
        date_end: dayjs(values.date_end).format("YYYY-MM-DD"),
        user_id: orderData.user_id,
      };

      const res = await fetchData(`/orders/${params.id}`, "PUT", dto);
      messageApi.success(res.message);
      setIsSuccess(true);
      setIsEditing(false);
    } catch (error) {
      console.error("Update order error", error);
      messageApi.error((error as Error).message);
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

  if (isSuccess) {
    return <CreateSuccess type={Type.update} />;
  }

  return (
    <div className={styles.form__container}>
      {contextHolder}

      <h1 className={styles.create__title}>Информация о заказе №{params.id}</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className={styles.form}
      >
        <Form.Item
          tooltip="Опишите тип груза, габариты, особые условия доставки и т.д"
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
          tooltip="Вес груза в килограммах"
          name="weight"
          rules={[
            { required: true, message: "Пожалуйста, введите вес груза" },
            {
              type: "number",
              min: 0.01,
              message: "Вес должен быть больше 0",
            },
            {
              validator: (_, value) =>
                value === undefined || value <= 32000
                  ? Promise.resolve()
                  : Promise.reject(new Error("Максимальный вес — 32 000 кг")),
            },
          ]}
        >
          <InputNumber
            min={0.01}
            step={0.01}
            disabled={!isEditing}
            addonAfter="кг"
          />
        </Form.Item>

        <Form.Item
          label="Габариты груза"
          required={true}
          tooltip="Введите габариты вашего груза(длина, ширина, высота)"
        >
          <Input.Group compact className={styles.dimensions}>
            <Form.Item
              name="length"
              noStyle
              rules={[
                { required: true, message: "Введите длину" },
                {
                  type: "number",
                  min: 1,
                  message: "Длина должна быть больше 0",
                },
              ]}
            >
              <InputNumber
                disabled={!isEditing}
                placeholder="Длина"
                min={1}
                style={{ width: "32%" }}
                addonAfter="см"
              />
            </Form.Item>

            <Form.Item
              name="width"
              noStyle
              rules={[
                { required: true, message: "Введите ширину" },
                {
                  type: "number",
                  min: 1,
                  message: "Ширина должна быть больше 0",
                },
              ]}
            >
              <InputNumber
                disabled={!isEditing}
                placeholder="Ширина"
                min={1}
                style={{ width: "32%", marginLeft: "2%" }}
                addonAfter="см"
              />
            </Form.Item>

            <Form.Item
              name="height"
              noStyle
              rules={[
                { required: true, message: "Введите высоту" },
                {
                  type: "number",
                  min: 1,
                  message: "Высота должна быть больше 0",
                },
              ]}
            >
              <InputNumber
                disabled={!isEditing}
                placeholder="Высота"
                min={1}
                style={{ width: "32%", marginLeft: "2%" }}
                addonAfter="см"
              />
            </Form.Item>
          </Input.Group>
        </Form.Item>

        <Form.Item
          label="Откуда"
          tooltip="Место, откуда начинается перевозка груза(Страна, город, адрес)"
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
          tooltip="Место, куда нужно отвезти груз(Страна, город, адрес)"
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
          tooltip="Укажите желаемую дату загрузки"
          label="Дата загрузки"
          name="date_start"
          rules={[
            {
              required: true,
              message: "Пожалуйста, выберите дату загрузки",
            },
          ]}
        >
          <DatePicker
            format="DD-MM-YY"
            disabledDate={disabledDate}
            placeholder="Выберите дату"
            disabled={!isEditing}
          />
        </Form.Item>

        <Form.Item
          tooltip="Укажите желаемую дату выгрузки"
          label="Дата выгрузки"
          name="date_end"
          rules={[
            {
              required: true,
              message: "Пожалуйста, выберите дату выгрузки",
            },
          ]}
        >
          <DatePicker
            format="DD-MM-YY"
            disabledDate={disabledDate}
            placeholder="Выберите дату"
            disabled={!isEditing}
          />
        </Form.Item>

        {(user?.role_id === 1 ||
          (user?.role_id === 2 &&
            orderData?.status_id !== 3 &&
            orderData?.status_id !== 4)) && (
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
                <ButtonSubmit
                  htmlType="button"
                  onClick={() => setIsEditing(true)}
                  text="Редактировать"
                  icon={<EditOutlined />}
                />
              )}
            </div>
          </Form.Item>
        )}
      </Form>
    </div>
  );
};
