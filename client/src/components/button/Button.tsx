import React from "react";
import { Button } from "antd";
import styles from "./button.module.scss";

interface ButtonSubmitProps {
  text: string;
  icon?: React.JSX.Element;
  htmlType?: "button" | "submit" | "reset";
  onClick?: () => void;
  loading?: boolean;
}

const ButtonSubmit: React.FC<ButtonSubmitProps> = ({
  text,
  htmlType,
  icon,
  onClick,
  loading,
}) => {
  return (
    <Button
      icon={icon}
      className={styles.form__button}
      block
      type="primary"
      htmlType={htmlType}
      onClick={onClick}
      loading={loading}
    >
      {text}
    </Button>
  );
};

export default ButtonSubmit;
