import { useEffect, useState } from "react";
import { Badge, Button, Space, Table } from "antd";
import useFetch from "../../../composales/useFetch.ts";
import { useAuth } from "../../../composales/useAuth.ts";
import { reformDate } from "../../../composales/reformDate.ts";
import { Order } from "../../../models/orderModels.ts";
import { ModalAttributes } from "../../../models/modalAttr.ts";
import { ConfirmModal } from "../../confirmModal/ConfirmModal.tsx";
import { defineStatus } from "../../../composales/defineStatus.ts";
import { useNavigate } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons";

export const UserTable = () => {
  const { user } = useAuth();
  const { fetchData } = useFetch();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const [modalData, setModalData] = useState<ModalAttributes | null>(null);
  const [orderToCancel, setOrderToCancel] = useState<number | null>(null);

  const navigate = useNavigate();

  const fetchOrders = () => {
    if (!user?.id) return;

    setLoading(true);

    fetchData(`/orders/user/${user.id}`, "GET")
      .then((response) => {
        setOrders(response);
      })
      .catch((error) => console.error("Ошибка при загрузке заказов:", error))
      .finally(() => setLoading(false));
  };

  const cancelOrder = (id: number) => {
    fetchData(`/orders/${id}`, "DELETE")
      .then(() => {
        setOrders((prevOrders) =>
          prevOrders.filter((order) => order.id !== id),
        );
      })
      .catch((error) => {
        console.error("Ошибка при удалении заказа:", error);
      });
  };

  const handleRowClick = (record: Order) => {
    return {
      onClick: () => {
        navigate(`/orders/${record.id}`);
      },
    };
  };

  const openCancelModal = (id: number) => {
    setOrderToCancel(id);
    setModalData({
      title: "Отмена заказа",
      description: `Вы уверены, что хотите отменить заказ №${id}?`,
      confirmText: "Удалить",
      action: () => cancelOrder(id),
    });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const columns = [
    {
      title: "Номер заказа",
      dataIndex: "id",
      key: "id",
      width: 80,
      fixed: "left" as const,
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
      title: "Дата создания",
      dataIndex: "create_at",
      key: "create_at",
      width: 150,
      render: (date: string) => reformDate(date),
    },
    {
      title: "Откуда",
      dataIndex: "from",
      key: "from",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Куда",
      dataIndex: "to",
      key: "to",
      width: 150,
      ellipsis: true,
    },
    {
      title: "Действия",
      key: "actions",
      width: 100,
      fixed: "right" as const,
      render: (_: any, record: Order) => (
        <Space size="middle">
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={(event) => {
              event.stopPropagation();
              openCancelModal(record.id);
            }}
          />
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Table
        dataSource={orders}
        columns={columns}
        rowKey="id"
        loading={loading}
        pagination={false}
        bordered
        style={{ marginBottom: "20px" }}
        scroll={{ x: 782 }}
        onRow={handleRowClick}
      />

      {modalData && orderToCancel !== null && (
        <ConfirmModal
          open={!!modalData}
          onClose={() => setModalData(null)}
          onConfirm={() => {
            modalData?.action();
            setModalData(null);
            setOrderToCancel(null);
          }}
          title={modalData.title}
          description={modalData.description}
          confirmText={modalData.confirmText}
        />
      )}
    </div>
  );
};
