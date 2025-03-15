import { useEffect, useState } from "react";
import { Space, Table } from "antd";
import useFetch from "../../../composales/useFetch.ts";
import { useAuth } from "../../../composales/useAuth.ts";
import { reformDate } from "../../../composales/reformDate.ts";
import { Order } from "../../../models/orderModels.ts";
import { ModalAttributes } from "../../../models/modalAttr.ts";
import { ConfirmModal } from "../../confirmModal/ConfirmModal.tsx";

const { Column } = Table;

export const UserTable = () => {
  const { user } = useAuth();
  const { fetchData } = useFetch();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const [modalData, setModalData] = useState<ModalAttributes | null>(null);
  const [orderToCancel, setOrderToCancel] = useState<number | null>(null);

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

  const openCancelModal = (id: number) => {
    setOrderToCancel(id);
    setModalData({
      title: "Отмена заказа",
      description: "Вы уверены, что хотите отменить этот заказ?",
      confirmText: "Удалить",
      action: () => cancelOrder(id),
    });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <>
      <Table<Order>
        dataSource={orders}
        loading={loading}
        rowKey="id"
        style={{ width: "709px" }}
      >
        <Column title="Номер заказа" dataIndex="id" key="id" />
        <Column title="Статус" dataIndex="status_id" key="status_id" />
        <Column
          title="Дата создания"
          dataIndex="create_at"
          key="create_at"
          render={(date) => reformDate(date)}
        />
        <Column title="Откуда" dataIndex="from" key="from" />
        <Column title="Куда" dataIndex="to" key="to" />
        <Column
          title="Действия"
          key="action"
          render={(_: any, record: Order) => (
            <Space size="middle">
              <a
                onClick={() => openCancelModal(record.id)}
                style={{ color: "#8F4848" }}
              >
                Отменить
              </a>
            </Space>
          )}
        />
      </Table>

      {modalData && orderToCancel !== null && (
        <ConfirmModal
          open={!!modalData}
          onClose={() => setModalData(null)}
          onConfirm={() => {
            modalData.action();
            setModalData(null);
            setOrderToCancel(null);
          }}
          title={modalData.title}
          description={modalData.description}
          confirmText={modalData.confirmText}
        />
      )}
    </>
  );
};
