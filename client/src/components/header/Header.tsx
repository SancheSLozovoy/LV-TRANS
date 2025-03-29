import React from "react";
import Logo from "../../assets/images/logo.png";
import Profile from "../../assets/images/profile.svg";
import { Link } from "react-router-dom";
import styles from "./header.module.scss";
import { Container } from "../container/Container.tsx";

const scrollToSection = (id: string) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth" });
  }
};

export const Header = (): React.JSX.Element => {
  return (
    <header className={styles.header}>
      <div className={styles.header__container}>
        <Container>
          <div className={styles.header__content}>
            <div className={styles.header__logo}>
              <img src={Logo} alt="Logo" />
            </div>
            <nav>
              <ul className={styles.header__nav_list}>
                <li onClick={() => scrollToSection("main")}>Главная</li>
                <li onClick={() => scrollToSection("advantages")}>
                  Преимущества
                </li>
                <li onClick={() => scrollToSection("about")}>О нас</li>
                <li onClick={() => scrollToSection("contact")}>Связь</li>
              </ul>
            </nav>
            <div>
              <Link to="/profile">
                <img src={Profile} alt="Profile" />
              </Link>
            </div>
          </div>
        </Container>
      </div>
    </header>
  );
};
