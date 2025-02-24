import React from "react";
import styles from "./layout.module.scss";
import { Header } from "../header/header.tsx";

interface AuthLayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Header />
      <div className={styles.layout__container}>{children}</div>
    </div>
  );
};
