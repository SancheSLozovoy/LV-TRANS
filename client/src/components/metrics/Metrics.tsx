import { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Progress,
  Divider,
  Typography,
  Descriptions,
  Badge,
  Alert,
  Empty,
  Spin,
} from "antd";
import {
  DashboardOutlined,
  PieChartOutlined,
  LineChartOutlined,
  CalendarOutlined,
  CarOutlined,
  BoxPlotOutlined,
  ProfileOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import useFetch from "../../composables/useFetch.ts";
import type { ColumnsType } from "antd/es/table";
import {
  ExtremeParameter,
  MetricsData,
  StuckOrder,
  WeightCategory,
} from "../../models/metrics.ts";

const { Title, Text } = Typography;

export const AnalyticsDashboard = () => {
  const [analyticsData, setAnalyticsData] = useState<MetricsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { fetchData } = useFetch();

  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        setLoading(true);
        const data = await fetchData("/orders/metrics", "GET");
        setAnalyticsData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
        console.error("Failed to fetch analytics:", err);
      } finally {
        setLoading(false);
      }
    };

    loadAnalytics();
  }, []);

  if (loading) return <Spin size="large" />;
  if (error)
    return (
      <Alert
        message="Ошибка загрузки аналитики"
        description={error}
        type="error"
        showIcon
      />
    );
  if (!analyticsData)
    return <Empty description="В данный момент аналитика не готова" />;

  const {
    complexMetrics,
    cargoAnalytics,
    statusAnalytics,
    businessKPI,
    temporalAnalytics,
  } = analyticsData;

  const weightColumns: ColumnsType<WeightCategory> = [
    {
      title: "Весовая категория",
      dataIndex: "weight_category",
      key: "weight_category",
    },
    {
      title: "Кол-во заказов",
      dataIndex: "orders_count",
      key: "orders_count",
      align: "center",
    },
    {
      title: "Ср. время доставки",
      dataIndex: "avg_delivery_days",
      key: "avg_delivery_days",
      render: (text: string) => text,
      align: "center",
    },
    {
      title: "Вес (мин/ср/макс)",
      key: "weight_range",
      render: (_: any, record: WeightCategory) => (
        <>
          <Text>{record.min_weight} кг</Text>
          <Divider type="vertical" />
          <Text strong>{record.avg_weight} кг</Text>
          <Divider type="vertical" />
          <Text>{record.max_weight} кг</Text>
        </>
      ),
      align: "center",
    },
  ];

  const extremeColumns: ColumnsType<ExtremeParameter> = [
    {
      title: "Категория",
      dataIndex: "category",
      key: "category",
    },
    {
      title: "ID заказа",
      dataIndex: "id",
      key: "id",
      align: "center",
    },
    {
      title: "Маршрут",
      key: "route",
      render: (_: any, record: ExtremeParameter) => (
        <Text>
          {record.from} → {record.to}
        </Text>
      ),
    },
    {
      title: "Параметры",
      key: "params",
      width: 500,
      render: (_: any, record: ExtremeParameter) => (
        <Descriptions size="small" column={1}>
          <Descriptions.Item label="Вес">{record.weight} кг</Descriptions.Item>
          <Descriptions.Item label="Длина">
            {record.length} см
          </Descriptions.Item>
          <Descriptions.Item label="Ширина">
            {record.width} см
          </Descriptions.Item>
          <Descriptions.Item label="Высота">
            {record.height} см
          </Descriptions.Item>
        </Descriptions>
      ),
    },
    {
      title: "Время доставки",
      dataIndex: "delivery_days",
      key: "delivery_days",
      render: (text: number) => text,
      align: "center",
    },
  ];

  const stuckColumns: ColumnsType<StuckOrder> = [
    {
      title: "Дней с момента загрузки",
      dataIndex: "time_range",
      key: "time_range",
    },
    {
      title: "Кол-во заказов",
      dataIndex: "orders_count",
      key: "orders_count",
      align: "center",
    },
  ];

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>
        <DashboardOutlined /> Ключевые показатели
      </Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Card>
            <Statistic
              title="Общий перевезенный вес"
              value={businessKPI.totalWeight}
              precision={0}
              suffix="кг"
              prefix={<BoxPlotOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Card>
            <Statistic
              title="Средний объем груза"
              value={businessKPI.avgVolume}
              precision={2}
              suffix="м³"
              prefix={<ProfileOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Card>
            <Statistic
              title="Среднее время доставки"
              value={businessKPI.avgDeliveryTime}
              precision={1}
              suffix="дней"
              prefix={<CalendarOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={8} lg={6} xl={4}>
          <Card>
            <div style={{ marginBottom: 16 }}>
              <Text strong>Соотношение грузов:</Text>
            </div>
            <Progress
              percent={parseFloat(
                businessKPI.oversizedRatio.oversizedPercentage
              )}
              success={{ percent: 0 }}
              format={(percent) => <Text strong>{percent}% негабаритных</Text>}
            />
            <div>
              <Text
                style={{
                  marginTop: 8,
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <Badge
                  status="default"
                  text={`${businessKPI.oversizedRatio.standardCargoCount} стандартных`}
                />{" "}
                <Badge
                  status="processing"
                  text={`${businessKPI.oversizedRatio.oversizedCargoCount} негабаритных`}
                />
              </Text>
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={24} md={12} lg={12} xl={8}>
          <Card
            title={
              <>
                <CarOutlined /> Топ пользователь
              </>
            }
          >
            <Descriptions column={1}>
              <Descriptions.Item label="Email">
                <Text strong>{businessKPI.topUser.email}</Text>
              </Descriptions.Item>
              <Descriptions.Item label="Кол-во заказов">
                {businessKPI.topUser.orders_count}
              </Descriptions.Item>
              <Descriptions.Item label="Общий вес">
                {businessKPI.topUser.total_weight} кг
              </Descriptions.Item>
              <Descriptions.Item label="Средний вес">
                {businessKPI.topUser.avg_weight} кг
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>

      <Card
        style={{ marginBottom: 24 }}
        title={
          <>
            <PieChartOutlined /> Распределение по весовым категориям
          </>
        }
      >
        <Table
          columns={weightColumns}
          dataSource={cargoAnalytics.weightCategories}
          pagination={false}
          scroll={{ x: 1050 }}
          size="small"
          locale={{
            emptyText: "Нет данных по категории",
          }}
        />
      </Card>

      <Card
        style={{ marginBottom: 24 }}
        title={
          <>
            <ClockCircleOutlined /> Заказы в процессе
          </>
        }
      >
        <Table
          columns={stuckColumns}
          dataSource={statusAnalytics.stuckOrders}
          pagination={false}
          size="small"
          scroll={{ x: 650 }}
          locale={{
            emptyText: "Нет заказов в процессе",
          }}
        />
      </Card>

      <Card
        style={{ marginBottom: 24 }}
        title={
          <>
            <LineChartOutlined /> Сезонное распределение
          </>
        }
      >
        <Table
          scroll={{ x: 1050 }}
          columns={[
            {
              title: "Месяц",
              dataIndex: "month",
              key: "month",
              render: (month: number) => {
                const months = [
                  "Январь",
                  "Февраль",
                  "Март",
                  "Апрель",
                  "Май",
                  "Июнь",
                  "Июль",
                  "Август",
                  "Сентябрь",
                  "Октябрь",
                  "Ноябрь",
                  "Декабрь",
                ];
                return months[month - 1];
              },
            },
            {
              title: "Кол-во заказов",
              dataIndex: "orders_count",
              key: "orders_count",
              align: "center",
            },
            {
              title: "Общий вес",
              dataIndex: "total_weight",
              key: "total_weight",
              render: (text: number) => `${text} кг`,
              align: "center",
            },
            {
              title: "Ср. вес",
              dataIndex: "avg_weight",
              key: "avg_weight",
              render: (text: number) => `${text} кг`,
              align: "center",
            },
          ]}
          dataSource={temporalAnalytics.seasonalDistribution}
          pagination={false}
          size="small"
          locale={{
            emptyText: "Нет данных по категории",
          }}
        />
      </Card>

      <Card
        title={
          <>
            <BoxPlotOutlined /> Грузы с экстремальными параметрами
          </>
        }
      >
        <Table
          scroll={{ x: 1050 }}
          columns={extremeColumns}
          dataSource={complexMetrics.extremeParameters}
          pagination={false}
          size="small"
          locale={{
            emptyText: "Нет данных по категории",
          }}
        />
      </Card>
    </div>
  );
};
