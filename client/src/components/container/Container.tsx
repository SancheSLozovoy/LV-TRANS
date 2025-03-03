import React from "react";
import styles from "./container.module.scss";

interface ContainerProps {
  children: React.ReactNode;
}

export const Container: React.FC<ContainerProps> = ({ children }) => {
  return (
      <div className={styles.container}>{children}</div>
  );
};
