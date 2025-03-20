import { useState } from "react";
import { Form, Input } from "antd";
import ButtonSubmit from "../../button/Button.tsx";
import { CalculatorOutlined } from "@ant-design/icons";
import styles from "./mainForm.module.scss";
import { Link } from "react-router-dom";

export const MainForm = () => {
  const [formData, setFormData] = useState({ from: "", to: "" });

  return (
    <Form>
      <div className={styles.form}>
        <Form.Item>
          <Input
            rootClassName={styles.form__input}
            placeholder="Откуда (Город, Страна)"
            value={formData.from}
            onChange={(e) => setFormData({ ...formData, from: e.target.value })}
          />
        </Form.Item>
        <Form.Item>
          <Input
            rootClassName={styles.form__input}
            placeholder="Куда (Город, Страна)"
            value={formData.to}
            onChange={(e) => setFormData({ ...formData, to: e.target.value })}
          />
        </Form.Item>
      </div>
      <Form.Item>
        <Link to="/create" state={formData}>
          <ButtonSubmit text={"Рассчитать"} icon={<CalculatorOutlined />} />
        </Link>
      </Form.Item>
    </Form>
  );
};
