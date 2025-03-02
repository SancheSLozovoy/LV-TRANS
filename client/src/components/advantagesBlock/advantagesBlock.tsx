import React from "react";
import styles from "./advantagesBlock.module.scss";

interface AdvantagesBlockProps {
  text: string;
  smile: string;
  type: "small" | "medium" | "big";
}

export const AdvantagesBlock: React.FC<AdvantagesBlockProps> = ({ text, smile, type }) => {
  return (
    <div className={`${styles.block} ${styles[type]}`}>
      <div className={styles.content}>
        <div className={styles.text}>{text}</div>
        <div className={styles.smile}>{smile}</div>
      </div>
    </div>
  );
};
