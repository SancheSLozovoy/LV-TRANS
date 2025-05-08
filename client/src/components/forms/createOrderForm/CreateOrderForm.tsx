import React, { useEffect, useState } from "react";
import {
  LeftCircleOutlined,
  PlusOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import {
  DatePicker,
  Form,
  Input,
  InputNumber,
  message,
  Upload,
  UploadFile,
  UploadProps,
} from "antd";
import dayjs from "dayjs";
import useFetch from "../../../composables/useFetch.ts";
import { useAuth } from "../../../composables/useAuth.ts";
import styles from "./createOrderForm.module.scss";
import ButtonSubmit from "../../button/Button.tsx";
import { CreateSuccess } from "../../createSuccess/CreateSuccess.tsx";
import { useLocation, useNavigate } from "react-router-dom";
import { OrderFormData, Type } from "../../../models/orderModels.ts";
import { RangePickerProps } from "antd/es/date-picker/index";

const { TextArea } = Input;

const normFile = (e: any) => {
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

const disabledDate: RangePickerProps["disabledDate"] = (current) => {
  return current && current < dayjs().startOf("day");
};

const MAX_FILE_SIZE_MB = 5;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

export const CreateOrderForm: React.FC = () => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [totalSize, setTotalSize] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm<OrderFormData>();

  const navigate = useNavigate();
  const location = useLocation();
  const { fetchData } = useFetch();
  const { user } = useAuth();

  const { from, to } = location.state || { from: "", to: "" };

  useEffect(() => {
    form.setFieldsValue({ from, to });
  }, [form, from, to]);

  const calculateTotalSize = (files: UploadFile[]) => {
    return files.reduce((sum, file) => sum + (file.size || 0), 0);
  };

  const handleSubmit = async (values: OrderFormData) => {
    setLoading(true);

    try {
      if (!user?.id) {
        throw new Error("Пользователь не найден");
      }

      if (totalSize > MAX_FILE_SIZE_BYTES) {
        throw new Error(
          `Общий размер файлов не должен превышать ${MAX_FILE_SIZE_MB} МБ`,
        );
      }

      const formData = createFormData(values);
      const res = await submitOrder(formData);

      messageApi.success(res.message);

      setIsSuccess(true);
      form.resetFields();
      setFileList([]);
      setTotalSize(0);
    } catch (error) {
      console.error("Create order error", error);
      messageApi.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const createFormData = (values: OrderFormData): FormData => {
    const formData = new FormData();

    formData.append("info", values.info);
    formData.append("weight", values.weight.toString());
    formData.append("length", values.length.toString());
    formData.append("height", values.height.toString());
    formData.append("width", values.width.toString());
    formData.append("from", values.from);
    formData.append("to", values.to);
    formData.append(
      "date_start",
      dayjs(values.date_start).format("YYYY-MM-DD"),
    );
    formData.append("date_end", dayjs(values.date_end).format("YYYY-MM-DD"));
    formData.append("user_id", user!.id.toString());

    fileList.forEach((file) => {
      if (file.originFileObj) {
        formData.append("files", file.originFileObj);
      }
    });

    return formData;
  };

  const submitOrder = async (formData: FormData) => {
    return await fetchData("/orders", "POST", formData, {
      "Content-Type": "multipart/form-data",
    });
  };

  const handleBack = () => navigate("/profile");

  const handleBeforeUpload: UploadProps["beforeUpload"] = (file) => {
    const isImage = file.type.startsWith("image/");
    const isDocument = file.type.startsWith("application/");

    if (!isImage && !isDocument) {
      messageApi.error("Можно загружать только изображения и документы!");
      return Upload.LIST_IGNORE;
    }

    const newTotalSize = totalSize + file.size;
    if (newTotalSize > MAX_FILE_SIZE_BYTES) {
      messageApi.error(
        `Общий размер файлов не должен превышать ${MAX_FILE_SIZE_MB} МБ`,
      );
      return Upload.LIST_IGNORE;
    }

    setFileList((prev) => [...prev, { ...file, originFileObj: file }]);
    setTotalSize(newTotalSize);
    return false;
  };

  const handleRemove: UploadProps["onRemove"] = (file) => {
    const newFileList = fileList.filter((f) => f.uid !== file.uid);
    setFileList(newFileList);
    setTotalSize(calculateTotalSize(newFileList));
  };

  const handleChange: UploadProps["onChange"] = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    setTotalSize(calculateTotalSize(newFileList));
  };

  if (isSuccess) {
    return (
      <>
        {contextHolder}
        <CreateSuccess type={Type.create} />
      </>
    );
  }

  return (
    <div className={styles.form__container}>
      {contextHolder}
      <h1 className={styles.create__title}>Сделать заказ</h1>
      <Form<OrderFormData>
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
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
          <TextArea rows={6} />
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
          <InputNumber min={0.01} step={0.01} addonAfter="кг" />
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
                step={0.01}
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
                step={0.01}
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
                step={0.01}
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
          <Input />
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
          <Input />
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
          />
        </Form.Item>

        <Form.Item
          tooltip={`Фото, документы, таблицы и т.д. (Общий размер ≤ ${MAX_FILE_SIZE_MB} МБ)`}
          label="Загрузить файлы"
          name="files"
          valuePropName="fileList"
          getValueFromEvent={normFile}
          extra={`Общий размер: ${(totalSize / (1024 * 1024)).toFixed(2)} МБ / ${MAX_FILE_SIZE_MB} МБ`}
        >
          <Upload
            listType="picture-card"
            fileList={fileList}
            beforeUpload={handleBeforeUpload}
            onRemove={handleRemove}
            onChange={handleChange}
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
              onClick={handleBack}
              text="Назад"
              icon={<LeftCircleOutlined />}
            />
            <ButtonSubmit
              htmlType="submit"
              loading={loading}
              text="Сохранить"
              icon={<CheckOutlined />}
            />
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};
