import AuthForm from "../../components/forms/auth/AuthForm.tsx";
import styles from "./login.module.scss";
import { Link } from "react-router-dom";
import Logo from "../../assets/images/logo.png";
import Settings from "../../assets/images/settings.svg";

export const Login = () => {
  return (
    <div className={styles.login}>
      <div className={styles.login__left}>
        <div className={styles.background__image}>
          <img src={Settings} />
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
      <div className={styles.login__right}>
        <div className={styles.right__title}>
          <h1>Вход</h1>
        </div>
        <AuthForm type="login" />
      </div>
    </div>
  );
};
