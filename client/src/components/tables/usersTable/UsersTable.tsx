import { useEffect, useState } from "react";
import { Table, Button, message, Tag, Pagination } from "antd";
import type { ColumnsType } from "antd/es/table";
import { ConfirmModal } from "../../confirmModal/ConfirmModal.tsx";
import { User } from "../../../models/userModels.ts";
import useFetch from "../../../composales/useFetch.ts";
import { DeleteOutlined } from "@ant-design/icons";
import "./usersTable.scss";
import { useAuth } from "../../../composales/useAuth.ts";

export const UsersTable = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { user: currentUser } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, [currentPage, pageSize]);

  const { fetchData } = useFetch();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await fetchData(
        `/users?page=${currentPage}&limit=${pageSize}`,
        "GET",
      );
      setUsers(data.users);
      setTotal(data.total);
    } catch (error) {
      message.error("Ошибка при загрузке пользователей");
    } finally {
      setLoading(false);
    }
  };

  const toggleRole = async (user: User) => {
    const role_id = user.role_id === 1 ? 2 : 1;
    try {
      await fetchData(`/users/${user.id}/role`, "PUT", { role_id });
      message.success("Роль изменена");
      fetchUsers();
    } catch {
      message.error("Ошибка при смене роли");
    }
  };

  const handleDelete = async () => {
    if (!selectedUserId) return;
    try {
      await fetchData(`/users/${selectedUserId}`, "DELETE");
      message.success("Пользователь удалён");
      fetchUsers();
    } catch {
      message.error("Ошибка при удалении");
    } finally {
      setConfirmOpen(false);
      setSelectedUserId(null);
    }
  };

  const columns: ColumnsType<User> = [
    {
      title: "Почта",
      dataIndex: "email",
      key: "email",
      width: "25%",
      ellipsis: true,
    },
    {
      title: "Телефон",
      dataIndex: "phone",
      key: "phone",
      width: "25%",
      ellipsis: true,
    },
    {
      title: "Роль",
      dataIndex: "role_id",
      key: "role_id",
      width: "20%",
      render: (role_id) =>
        role_id === 1 ? <Tag color="blue">Админ</Tag> : <Tag>Пользователь</Tag>,
    },
    {
      title: "Действия",
      key: "actions",
      width: "13%",
      render: (_, user) => {
        const isCurrentUser = currentUser?.id === user.id;
        return (
          <div className="actions-container">
            <Button
              type="primary"
              onClick={() => toggleRole(user)}
              disabled={isCurrentUser}
            >
              {user.role_id === 1 ? "Сделать пользователем" : "Сделать админом"}
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              disabled={isCurrentUser}
              onClick={() => {
                setSelectedUserId(user.id);
                setConfirmOpen(true);
              }}
            />
          </div>
        );
      },
    },
  ];

  return (
    <div>
      <h1 className="title">Список пользователей</h1>
      <Table
        dataSource={users}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={false}
      />

      <Pagination
        current={currentPage}
        total={total}
        pageSize={pageSize}
        onChange={(page, pageSize) => {
          setCurrentPage(page);
          setPageSize(pageSize);
        }}
        style={{ marginTop: "20px" }}
      />

      <ConfirmModal
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
        title="Удаление пользователя"
        description="Вы уверены, что хотите удалить этого пользователя?"
        confirmText="Удалить"
        cancelText="Отмена"
      />
    </div>
  );
};
