import styles from "./footer.module.scss";

export const Footer = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.footer__inner}>
        <div className={styles.footer__contacts}>
          <a href="mailto:info@lv-trans.ru">
            <div className={styles.footer__mail}>info@lv-trans.ru</div>
          </a>
          <a href="tel:+79281346454">
            <div className={styles.footer__phone}>+7 (928) 134-64-54</div>
          </a>
        </div>
        <div className={styles.footer__year}>© 2025 LV-Trans</div>
      </div>
    </div>
  );
};
