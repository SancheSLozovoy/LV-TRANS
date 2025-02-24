import React from "react";
import Logo from "../../assets/images/logo.png";
import Profile from "../../assets/images/Male User.svg";
import { Link } from "react-router-dom";
import styles from "./header.module.scss";

export const Header = (): React.JSX.Element => {
  return (
    <header className={styles.header}>
      <div className={styles.header__container}>
        <div className={styles.header__logo}>
          <img src={Logo} alt="Logo" />
        </div>
        <nav className={styles.header__nav}>
          <ul className={styles.header__nav_list}>
            <li>Главная</li>
            <li>Преимущества</li>
            <li>О нас</li>
            <li>Связь</li>
          </ul>
        </nav>
        <div className={styles.header__profile}>
          <Link to="/profile">
            <img src={Profile} />
          </Link>
        </div>
      </div>
    </header>
  );
};
