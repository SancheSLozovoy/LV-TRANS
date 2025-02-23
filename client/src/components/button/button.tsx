import React from "react";
import { Button } from "antd";
import styles from "./button.module.scss";

interface ButtonSubmitProps {
  text: string;
  htmlType?: "button" | "submit" | "reset";
}

const ButtonSubmit: React.FC<ButtonSubmitProps> = ({ text, htmlType }) => {
  return (
    <Button
      className={styles.form__button}
      block
      type="primary"
      htmlType={htmlType}
    >
      {text}
    </Button>
  );
};

export default ButtonSubmit;
