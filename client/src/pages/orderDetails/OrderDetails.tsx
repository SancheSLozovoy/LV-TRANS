import { Layout } from "../../components/layout/Layout.tsx";
import { EditOrderForm } from "../../components/forms/editOrder/EditOrder.tsx";
import { useParams } from "react-router-dom";

export const OrderDetails = () => {
  const params = useParams();

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
        <EditOrderForm orderId={params.id} />
      </div>
    </Layout>
  );
};
