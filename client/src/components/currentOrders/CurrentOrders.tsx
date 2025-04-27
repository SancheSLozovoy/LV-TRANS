import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Badge, Pagination } from "antd";
import "./currentOrders.scss";
import { Order } from "../../models/orderModels.ts";
import useFetch from "../../composales/useFetch.ts";
import { useAuth } from "../../composales/useAuth.ts";
import { Container } from "../container/Container.tsx";
import { defineStatus } from "../../composales/defineStatus.ts";

const PAGE_SIZE = 8;

export const CurrentOrders = () => {
  const [activeOrders, setActiveOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const { user } = useAuth();
  const { fetchData } = useFetch();
  const navigate = useNavigate();

  const fetchOrders = async () => {
    if (!user?.id) return;

    const response = await fetchData(`/orders/user/${user.id}`, "GET");

    if (response?.orders) {
      const filtered = response.orders.filter(
        (order: Order) => order.status_id !== 4,
      );
      setActiveOrders(filtered);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const paginatedOrders = activeOrders.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  if (activeOrders.length === 0) {
    return null;
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

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
          {paginatedOrders.map((order) => (
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
          {activeOrders.length > PAGE_SIZE && (
            <Pagination
              current={currentPage}
              pageSize={PAGE_SIZE}
              total={activeOrders.length}
              onChange={handlePageChange}
              showSizeChanger={false}
              hideOnSinglePage
            />
          )}
        </div>
      </Container>
    </section>
  );
};
