import { Layout } from "../../components/layout/Layout.tsx";
import { OrderTabs } from "../../components/tabs/OrderTabs.tsx";

export const OrderDetails = () => {
  return (
    <Layout>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          marginTop: "2%",
        }}
      >
        <OrderTabs />
      </div>
    </Layout>
  );
};
