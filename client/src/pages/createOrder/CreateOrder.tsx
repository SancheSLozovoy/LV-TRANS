import styles from "./createOrder.module.scss";
import { CreateOrderForm } from "../../components/forms/createOrderForm/CreateOrderForm.tsx";
import { Layout } from "../../components/layout/Layout.tsx";
import { Container } from "../../components/container/Container.tsx";

export const CreateOrder = () => {
  return (
    <Layout>
      <div className={styles.create}>
        <Container>
          <div className={styles.create__inner}>
            <div className={styles.create__form}>
              <CreateOrderForm />
            </div>
          </div>
        </Container>
      </div>
    </Layout>
  );
};
