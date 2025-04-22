import { Layout } from "../../components/layout/Layout.tsx";
import { EditUserForm } from "../../components/forms/editProfileForn/EditUserForm.tsx";
import { Container } from "../../components/container/Container.tsx";

export const EditProfile = () => {
  return (
    <Layout>
      <Container>
        <EditUserForm />
      </Container>
    </Layout>
  );
};
