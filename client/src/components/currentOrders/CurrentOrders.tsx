import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge, Pagination, Spin } from "antd";
import "./currentOrders.scss";
import { Order } from "../../models/orderModels.ts";
import useFetch from "../../composables/useFetch.ts";
import { useAuth } from "../../composables/useAuth.ts";
import { Container } from "../container/Container.tsx";
import { defineStatus } from "../../composables/defineStatus.ts";

const PAGE_SIZE = 8;

export const CurrentOrders = () => {
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalOrders, setTotalOrders] = useState(0);
  const [loading, setLoading] = useState(true);

  const { user } = useAuth();
  const { fetchData } = useFetch();
  const navigate = useNavigate();

  const fetchOrders = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const response = await fetchData(
        `/orders/user/${user.id}/active?page=${currentPage}&limit=${PAGE_SIZE}`,
        "GET",
      );

      if (response && response.orders) {
        setActiveOrders(response.orders);
        setTotalOrders(response.total || 0);
      }
    } catch (error) {
      console.error("Ошибка при загрузке заказов:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, user?.id]);

  if (loading) {
    return <Spin size="large" />;
  }

  if (activeOrders.length === 0) {
    return null;
  }

  const handleOrderClick = (id: number) => {
    navigate(`/orders/${id}`);
  };

  const formatRoute = (route: string) => {
    return route.length > 12 ? route.slice(0, 12) + "..." : route;
  };

  return (
    <section id="current-orders" className="current-orders">
      <Container>
        <h2 className="current-orders__title">Текущие заказы</h2>
        <div className="current-orders__list">
          {activeOrders.map((order) => (
            <div
              key={order.id}
              className="current-orders__item"
              onClick={() => handleOrderClick(order.id)}
              style={{ cursor: "pointer" }}
            >
              <div className="current-orders__item-header">
                <span className="current-orders__item-id">
                  Заказ № {order.id}
                </span>
              </div>
              <Badge
                color={defineStatus(order.status_id).color}
                text={defineStatus(order.status_id).name}
              />
              <div className="current-orders__item-route">
                {formatRoute(order.from)} → {formatRoute(order.to)}
              </div>
            </div>
          ))}
        </div>

        <div className="current-orders__pagination">
          {totalOrders > PAGE_SIZE && (
            <div className="current-orders__pagination">
              <Pagination
                current={currentPage}
                pageSize={PAGE_SIZE}
                total={totalOrders}
                onChange={(page) => setCurrentPage(page)}
                showSizeChanger={false}
              />
            </div>
          )}
        </div>
      </Container>
    </section>
  );
};
