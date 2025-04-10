import { Layout } from "../../components/layout/Layout.tsx";
import { EditOrderForm } from "../../components/forms/editOrder/EditOrder.tsx";

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
        <EditOrderForm />
      </div>
    </Layout>
  );
};
