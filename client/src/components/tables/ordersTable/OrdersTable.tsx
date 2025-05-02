import { useEffect, useState } from "react";
import { Table, Button, message, Pagination, Select, Space, Badge } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { ConfirmModal } from "../../confirmModal/ConfirmModal.tsx";
import useFetch from "../../../composables/useFetch.ts";
import { Order } from "../../../models/orderModels.ts";
import { defineStatus } from "../../../composables/defineStatus.ts";
import { useNavigate } from "react-router-dom";
import { reformDate } from "../../../composables/reformDate.ts";
import { useAuth } from "../../../composables/useAuth.ts";

export const OrdersTable = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [messageApi, contextHolder] = message.useMessage();

  const { token } = useAuth();
  const { fetchData } = useFetch();

  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, [currentPage, pageSize, token]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchData(
        `/orders?page=${currentPage}&limit=${pageSize}`,
        "GET"
      );
      setOrders(data.orders);
      setTotal(data.total);
    } catch (error) {
      messageApi.error((error as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleRowClick = (record: Order) => {
    return {
      onClick: () => {
        navigate(`/admin/orders/${record.id}`);
      },
    };
  };

  const handleStatusChange = async (
    orderId: number,
    statusId: number,
    email: string
  ) => {
    try {
      const res = await fetchData(`/orders/${orderId}/status`, "PUT", {
        status_id: statusId,
        email: email,
      });

      messageApi.success(res.message);

      fetchOrders();
    } catch (error) {
      messageApi.error((error as Error).message);
    }
  };

  const handleDelete = async () => {
    if (!selectedOrderId) return;
    try {
      const res = await fetchData(`/orders/${selectedOrderId}`, "DELETE");
      messageApi.success(res.message);
      fetchOrders();
    } catch (error) {
      messageApi.error((error as Error).message);
    } finally {
      setConfirmOpen(false);
      setSelectedOrderId(null);
    }
  };

  const columns = [
    {
      title: "Номер заказа",
      dataIndex: "id",
      key: "id",
      width: 50,
    },
    {
      title: "Статус",
      dataIndex: "status_id",
      key: "status_id",
      width: 150,
      render: (statusId: number) => {
        const status = defineStatus(statusId);
        return <Badge color={status.color} text={status.name} />;
      },
    },

    {
      title: "Смена статуса",
      key: "status_actions",
      width: 200,
      render: (_: any, record: Order) => (
        <Select
          defaultValue={record.status_id}
          onChange={(value) =>
            handleStatusChange(record.id, value, record.user_email || "")
          }
          style={{ width: 120 }}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Select.Option value={1}>Не принят</Select.Option>
          <Select.Option value={2}>Принят</Select.Option>
          <Select.Option value={3}>В пути</Select.Option>
          <Select.Option value={4}>Доставлен</Select.Option>
        </Select>
      ),
    },

    {
      title: "Создан",
      dataIndex: "create_at",
      key: "create_at",
      width: 150,
      render: (date: string) => reformDate(date),
    },

    {
      title: "Пользователь",
      dataIndex: "user_email",
      key: "user_email",
      width: 150,
    },
    {
      title: "Номер телефона",
      dataIndex: "user_phone",
      key: "user_phone",
      width: 150,
    },
    {
      title: "Действия",
      key: "actions",
      width: 50,
      render: (_: any, record: Order) => (
        <Space size="middle">
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedOrderId(record.id);
              setConfirmOpen(true);
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      {contextHolder}
      <h1 className="title">Список заказов</h1>
      <Table
        dataSource={orders}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={false}
        onRow={handleRowClick}
        scroll={{ x: 900 }}
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
        title="Отмена заказа"
        description="Вы уверены, что хотите отменить этот заказ?"
        confirmText="Удалить"
        cancelText="Отмена"
      />
    </div>
  );
};
