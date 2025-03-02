import { Form, Input } from "antd";
import ButtonSubmit from "../../button/button";
import { CalculatorOutlined } from "@ant-design/icons";
import styles from "./mainForm.module.scss";

export const MainForm = () => {
  return (
    <Form>
      <div className={styles.form}>
        <Form.Item>
          <Input
            rootClassName={styles.form__input}
            placeholder="Откуда (Город, Страна)"
          ></Input>
        </Form.Item>
        <Form.Item>
          <Input
            rootClassName={styles.form__input}
            placeholder="Куда (Город, Страна)"
          ></Input>
        </Form.Item>
      </div>
      <Form.Item>
        <ButtonSubmit text={"Рассчитать"} icon={<CalculatorOutlined />} />
      </Form.Item>
    </Form>
  );
};
