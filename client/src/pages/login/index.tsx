import AuthForm from "../../components/form/Form.tsx";
import styles from "./login.module.scss";
import { Link } from "react-router-dom";
import Logo from "../../assets/images/logo.png";

export const Login = () => {
  return (
    <div className={styles.login}>
      <div className={styles.login__left}>
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
