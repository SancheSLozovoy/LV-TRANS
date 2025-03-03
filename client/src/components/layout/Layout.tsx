import React from "react";
import styles from "./layout.module.scss";
import { Header } from "../header/Header.tsx";
import { Footer } from "../footer/Footer.tsx";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className={styles.layout}>
      <Header />
      {children}
      <Footer />
    </div>
  );
};
