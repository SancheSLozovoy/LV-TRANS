import AuthForm from "../../components/form/Form.tsx";
import styles from "./register.module.scss";
import { Link } from "react-router-dom";
import Logo from "../../assets/images/logo.png";
import React from "react";
import Settings from "../../assets/images/settings.svg";

export const Register: React.FC = (): React.JSX.Element => {
  return (
    <div className={styles.register}>
      <div className={styles.register__left}>
        <div className={styles.background__image}>
          <img src={Settings} alt="settings" />
        </div>
        <div className={styles.left__content}>
          <div className={styles.left__logo}>
            <img src={Logo} alt="Logo" />
          </div>
          <div className={styles.left__title}>
            <h3>Авторизация</h3>
          </div>
          <div className={styles.left__text}>
            <p>
              Введите ваши персональные
              <br /> данные или{" "}
              <Link to="/" className={styles.left__text_link}>
                авторизуйтесь позже
              </Link>
            </p>
          </div>
        </div>
      </div>
      <div className={styles.register__right}>
        <div className={styles.right__title}>
          <h1>Регистрация</h1>
        </div>
        <AuthForm type="register" />
      </div>
    </div>
  );
};
