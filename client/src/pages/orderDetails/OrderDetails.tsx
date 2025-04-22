import { Layout } from "../../components/layout/Layout.tsx";
import { OrderTabs } from "../../components/tabs/OrderTabs.tsx";
import { Container } from "../../components/container/Container.tsx";

export const OrderDetails = () => {
  return (
    <Layout>
      <Container>
        <OrderTabs />
      </Container>
    </Layout>
  );
};
