import { Button, Form, Input } from "antd";
import ButtonSubmit from "../../button/Button.tsx";
import { LogoutOutlined, DeleteOutlined } from "@ant-design/icons";
import styles from "./profileForm.module.scss";
import { User } from "../../../models/userModels.ts";
import { useAuth } from "../../../composales/useAuth.ts";
import useFetch from "../../../composales/useFetch.ts";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import { useNavigate, useLocation } from "react-router-dom";
import { ConfirmModal } from "../../confirmModal/ConfirmModal.tsx";
import { ModalAttributes } from "../../../models/modalAttr.ts";

export const ProfileForm = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const { fetchData } = useFetch();
  const location = useLocation();
  const [userData, setUserData] = useState<User | null>(null);
  const [modalData, setModalData] = useState<ModalAttributes | null>(null);

  useEffect(() => {
    if (user) {
      getUser();
    }
  }, [token]);

  const getUser = () => {
    if (user?.id) {
      return fetchData(`users/${user.id}`, "GET").then((res) => {
        setUserData(res);
      });
    }
  };

  const deleteUser = () => {
    if (user?.id) {
      fetchData(`users/${user.id}`, "DELETE").then(() => {
        Cookies.remove("accessToken");
        Cookies.remove("refreshToken");
        navigate("/login");
      });
    }
  };

  const logout = () => {
    Cookies.remove("accessToken");
    Cookies.remove("refreshToken");
    navigate("/login");
  };

  const openModal = (type: "logout" | "delete") => {
    if (type === "logout") {
      setModalData({
        title: "Выход из аккаунта",
        description: "Вы уверены, что хотите выйти?",
        confirmText: "Выйти",
        action: logout,
      });
    } else {
      setModalData({
        title: "Удаление аккаунта",
        description:
          "Вы уверены, что хотите удалить аккаунт? Это действие нельзя отменить",
        confirmText: "Удалить",
        action: deleteUser,
      });
    }
  };

  const handleEditClick = () => {
    const path = location.pathname.includes("/admin") ? "/admin/user" : "/user";
    navigate(path);
  };

  return (
    <div className={styles.form__container}>
      <h1 className={styles.form__title}>Профиль</h1>
      <Form>
        <div className={styles.form}>
          <Form.Item>
            <Input
              value={userData?.email}
              disabled={true}
              rootClassName={styles.form__input}
              placeholder="Почта"
            ></Input>
          </Form.Item>
          <Form.Item>
            <Input
              value={userData?.phone}
              disabled={true}
              rootClassName={styles.form__input}
              placeholder="Номер телефона"
            ></Input>
          </Form.Item>
          <Form.Item className={styles.form__edit}>
            <Button
              onClick={handleEditClick}
              type="link"
              className={styles.form__edit}
            >
              Редактировать
            </Button>
          </Form.Item>
        </div>
        <div className={styles.form__button__container}>
          <Form.Item className={styles.button__logout}>
            <ButtonSubmit
              onClick={() => openModal("logout")}
              text={"Выйти"}
              icon={<LogoutOutlined />}
            />
          </Form.Item>
          <Form.Item className={styles.button__delete}>
            <ButtonSubmit
              onClick={() => openModal("delete")}
              text={"Удалить аккаунт"}
              icon={<DeleteOutlined />}
            />
          </Form.Item>
        </div>
      </Form>

      {modalData && (
        <ConfirmModal
          open={!!modalData}
          onClose={() => setModalData(null)}
          onConfirm={() => {
            modalData?.action();
            setModalData(null);
          }}
          title={modalData.title}
          description={modalData.description}
          confirmText={modalData.confirmText}
        />
      )}
    </div>
  );
};
