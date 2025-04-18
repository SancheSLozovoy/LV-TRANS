import "./profile.scss";
import { Container } from "../../components/container/Container.tsx";
import { ProfileForm } from "../../components/forms/profileForm/ProfileForm.tsx";
import { Layout } from "../../components/layout/Layout.tsx";
import { UserTable } from "../../components/tables/userTable/UserTable.tsx";
import ButtonSubmit from "../../components/button/Button.tsx";
import { Link } from "react-router-dom";

export const Profile = () => {
  return (
    <Layout>
      <div className="profile">
        <Container>
          <div className="profile__inner">
            <div className="profile__table">
              <h1 className="profile__form-title">Заказы</h1>
              <UserTable />
              <div className="profile__crete-order">
                <Link to="/create">
                  <ButtonSubmit text="Сделать заказ" />
                </Link>
              </div>
            </div>
            <div className="profile__form">
              <ProfileForm />
            </div>
          </div>
        </Container>
      </div>
    </Layout>
  );
};
