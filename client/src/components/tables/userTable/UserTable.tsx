import { useEffect, useState } from "react";
import { Badge, Button, Pagination, Space, Table } from "antd";
import useFetch from "../../../composables/useFetch.ts";
import { useAuth } from "../../../composables/useAuth.ts";
import { reformDate } from "../../../composables/reformDate.ts";
import { Order } from "../../../models/orderModels.ts";
import { ModalAttributes } from "../../../models/modalAttr.ts";
import { ConfirmModal } from "../../confirmModal/ConfirmModal.tsx";
import { defineStatus } from "../../../composables/defineStatus.ts";
import { useNavigate } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons";

export const UserTable = () => {
  const { user, token } = useAuth();
  const { fetchData } = useFetch();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const [modalData, setModalData] = useState<ModalAttributes | null>(null);
  const [orderToCancel, setOrderToCancel] = useState<number | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(8);
  const [total, setTotal] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, [currentPage, pageSize, token]);

  const fetchOrders = () => {
    if (!user?.id) return;

    setLoading(true);

    fetchData(
      `/orders/user/${user.id}?page=${currentPage}&limit=${pageSize}`,
      "GET",
    )
      .then((response) => {
        setOrders(response.orders);
        setTotal(response.total);
      })
      .catch((error) => console.error("Ошибка при загрузке заказов:", error))
      .finally(() => setLoading(false));
  };

  const cancelOrder = (id: number) => {
    fetchData(`/orders/${id}`, "DELETE")
      .then(() => {
        fetchOrders();
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

      <Pagination
        current={currentPage}
        total={total}
        pageSize={pageSize}
        onChange={(page, pageSize) => {
          setCurrentPage(page);
          setPageSize(pageSize);
        }}
        style={{ marginBottom: "20px" }}
        showSizeChanger={false}
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
