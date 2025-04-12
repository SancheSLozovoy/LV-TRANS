import React from "react";
import Logo from "../../assets/images/logo.png";
import { Link } from "react-router-dom";
import styles from "./header.module.scss";
import { Container } from "../container/Container.tsx";
import { UserOutlined } from "@ant-design/icons";

export const Header = (): React.JSX.Element => {
  return (
    <header className={styles.header}>
      <div className={styles.header__container}>
        <Container>
          <div className={styles.header__content}>
            <div className={styles.header__logo}>
              <Link to="/">
                <img src={Logo} alt="Logo" />
              </Link>
            </div>
            <nav>
              <ul className={styles.header__nav_list}>
                <li>
                  <Link to="/#main">Главная</Link>
                </li>
                <li>
                  <Link to="/#advantages">Преимущества</Link>
                </li>
                <li>
                  <Link to="/#about">О нас</Link>
                </li>
                <li>
                  <Link to="/#contact">Связь</Link>
                </li>
              </ul>
            </nav>
            <div>
              <Link to="/profile">
                <UserOutlined style={{ fontSize: "30px" }} />
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
};
