import { Layout } from "../../components/layout/Layout.tsx";
import { EditUserForm } from "../../components/forms/editProfileForn/EditUserForm.tsx";

export const EditProfile = () => {
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
        <EditUserForm />
      </div>
    </Layout>
  );
};
