import { useEffect, useState } from "react";
import { Table, Button, message, Tag, Pagination, Select, Space } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { ConfirmModal } from "../../confirmModal/ConfirmModal.tsx";
import useFetch from "../../../composales/useFetch.ts";
import { Order } from "../../../models/orderModels.ts";
import { defineStatus } from "../../../composales/defineStatus.ts";
import { useNavigate } from "react-router-dom";

export const OrdersTable = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);

  const { fetchData } = useFetch();

  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, [currentPage, pageSize]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await fetchData(
        `/orders?page=${currentPage}&limit=${pageSize}`,
        "GET",
      );
      setOrders(data.orders);
      setTotal(data.total);
    } catch (error) {
      message.error("Ошибка при загрузке заказов");
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

  const handleStatusChange = async (orderId: number, statusId: number) => {
    try {
      await fetchData(`/orders/${orderId}/status`, "PUT", {
        status_id: statusId,
      });

      message.success("Статус заказа изменён");

      fetchOrders();
    } catch (error) {
      message.error("Ошибка при изменении статуса");
    }
  };

  const handleDelete = async () => {
    if (!selectedOrderId) return;
    try {
      await fetchData(`/orders/${selectedOrderId}`, "DELETE");
      message.success("Заказ отменён");
      fetchOrders();
    } catch {
      message.error("Ошибка при отмене заказа");
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
    },
    {
      title: "Статус",
      dataIndex: "status_id",
      key: "status_id",
      render: (statusId: number) => {
        const status = defineStatus(statusId);
        return <Tag color={status.color}>{status.name}</Tag>;
      },
    },

    {
      title: "Статус заказа",
      key: "status_actions",
      render: (_: any, record: Order) => (
        <Select
          defaultValue={record.status_id}
          onChange={(value) => handleStatusChange(record.id, value)}
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
      title: "Пользователь",
      dataIndex: "user_login",
      key: "user_login",
    },
    {
      title: "Номер телефона",
      dataIndex: "user_phone",
      key: "user_phone",
    },
    {
      title: "Действия",
      key: "actions",
      render: (_: any, record: Order) => (
        <Space size="middle">
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
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
      <h1 className="title">Список заказов</h1>
      <Table
        dataSource={orders}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={false}
        onRow={handleRowClick}
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
        confirmText="Отменить"
        cancelText="Отмена"
      />
    </div>
  );
};
