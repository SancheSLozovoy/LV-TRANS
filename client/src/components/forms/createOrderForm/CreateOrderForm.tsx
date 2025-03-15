import React, { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import { DatePicker, Form, Input, InputNumber, Upload, message } from "antd";
import { RangePickerProps } from "antd/es/date-picker";
import { UploadFile } from "antd/es/upload/interface";
import dayjs from "dayjs";
import useFetch from "../../../composales/useFetch.ts";
import { useAuth } from "../../../composales/useAuth.ts";
import styles from "./createOrderForm.module.scss";
import ButtonSubmit from "../../button/Button.tsx";
import { LeftCircleOutlined, SaveOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;
const { TextArea } = Input;

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

export const CreateOrderForm: React.FC = () => {
  const { user } = useAuth();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [loading, setLoading] = useState(false);
  const { fetchData } = useFetch();
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: any) => {
    setLoading(true);

    try {
      if (fileList.length === 0) {
        throw new Error("No file upload");
      }

      const formData = new FormData();
      formData.append("info", values.info);
      formData.append("weight", values.weight);
      formData.append("from", values.from);
      formData.append("to", values.to);
      formData.append(
        "date_start",
        dayjs(values.deliveryDates[0]).format("YYYY-MM-DD"),
      );
      formData.append(
        "date_end",
        dayjs(values.deliveryDates[1]).format("YYYY-MM-DD"),
      );
      formData.append("user_id", user?.id.toString());

      fileList.forEach((file) => {
        if (file.originFileObj) {
          formData.append("photos", file.originFileObj);
        }
      });

      await fetchData("/orders", "POST", formData, true);
      messageApi.open({
        type: "success",
        content: "Заказ создан",
      });
      form.resetFields();
      setFileList([]);
    } catch (error) {
      console.error("Create order error", error);
      messageApi.open({
        type: "success",
        content: "Не удалось создать заказ",
      });
    } finally {
      setLoading(false);
    }
  };

  const onReset = () => {
    form.resetFields();
    setFileList([]);
  };

  const disabledDate: RangePickerProps["disabledDate"] = (current) => {
    return current && current < dayjs().startOf("day");
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      className={styles.form}
    >
      {contextHolder}
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
        <TextArea rows={6} />
      </Form.Item>

      <Form.Item
        label="Вес груза"
        name="weight"
        rules={[
          { required: true, message: "Пожалуйста, введите вес груза" },
          { type: "number", min: 0.01, message: "Вес должен быть больше 0" },
        ]}
      >
        <InputNumber min={0.01} step={0.01} />
      </Form.Item>

      <Form.Item
        label="Откуда"
        name="from"
        rules={[
          { required: true, message: "Пожалуйста, введите место загрузки" },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Куда"
        name="to"
        rules={[
          { required: true, message: "Пожалуйста, введите место выгрузки" },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Даты доставки"
        name="deliveryDates"
        rules={[
          { required: true, message: "Пожалуйста, выберите даты доставки" },
        ]}
      >
        <RangePicker
          disabledDate={disabledDate}
          placeholder={["Дата загрузки", "Дата выгрузки"]}
        />
      </Form.Item>

      <Form.Item
        label="Загрузить фото груза и схем"
        name="photos"
        valuePropName="fileList"
        getValueFromEvent={normFile}
        rules={[{ required: true, message: "Пожалуйста, загрузите фото" }]}
      >
        <Upload
          listType="picture-card"
          fileList={fileList}
          beforeUpload={(file) => {
            if (!file) {
              message.error("Ошибка загрузки файла");
              return false;
            }

            setFileList((prev) => [...prev, { ...file, originFileObj: file }]);
            return false;
          }}
          onRemove={(file) => {
            setFileList((prev) => prev.filter((f) => f.uid !== file.uid));
          }}
        >
          <button
            style={{
              color: "inherit",
              cursor: "inherit",
              border: 1,
              background: "none",
            }}
            type="button"
          >
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Загрузить</div>
          </button>
        </Upload>
      </Form.Item>

      <Form.Item>
        <div className={styles.form__buttons}>
          <ButtonSubmit
            htmlType="button"
            onClick={onReset}
            text="Отмена"
            icon={<LeftCircleOutlined />}
          />
          <ButtonSubmit
            type="primary"
            htmlType="submit"
            loading={loading}
            text="Сохранить"
            icon={<SaveOutlined />}
          />
        </div>
      </Form.Item>
    </Form>
  );
};
