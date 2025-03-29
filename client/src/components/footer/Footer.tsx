import styles from "./footer.module.scss";
import { Container } from "../container/Container.tsx";

export const Footer = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.footer__inner}>
        <Container>
          <div className={styles.footer__content}>
            <div className={styles.footer__contacts}>
              <a href="mailto:info@lv-trans.ru">
                <div>info@lv-trans.ru</div>
              </a>
              <a href="tel:+79281346454">
                <div>+7 (928) 134-64-54</div>
              </a>
            </div>
            <div className={styles.footer__year}>© 2025 LV-Trans</div>
          </div>
        </Container>
      </div>
    </div>
  );
};
