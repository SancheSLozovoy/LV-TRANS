import { Layout } from "../../components/layout/Layout.tsx";
import { useParams } from "react-router-dom";
import { EditUserForm } from "../../components/forms/editProfileForn/EditUserForm.tsx";

export const EditProfile = () => {
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
        <EditUserForm orderId={params.id} />
      </div>
    </Layout>
  );
};
