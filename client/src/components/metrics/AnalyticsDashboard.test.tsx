import { render, screen, waitFor, act } from "@testing-library/react";
import { AnalyticsDashboard } from "./Metrics";
import useFetch from "../../composables/useFetch";
import { MetricsData } from "../../models/metrics";
import "@testing-library/jest-dom";

beforeAll(() => {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
});
jest.mock("../../composables/useFetch", () => ({
  __esModule: true,
  default: jest.fn(() => ({
    fetchData: jest.fn(),
    data: null,
    loading: false,
    error: null,
  })),
}));

const mockUseFetch = useFetch as jest.Mock;

const mockMetricsData: MetricsData = {
  cargoAnalytics: {
    weightCategories: [
      {
        weight_category: "1-5 тонн",
        orders_count: 10,
        avg_delivery_days: "3.5",
        min_weight: 1000,
        max_weight: 5000,
        avg_weight: 2500,
      },
    ],
  },
  temporalAnalytics: {
    seasonalDistribution: [
      {
        month: 4,
        orders_count: 46,
        total_weight: 452264,
        avg_weight: 9831.826087,
      },
    ],
  },
  statusAnalytics: {
    stuckOrders: [
      { time_range: "До 7 дней", orders_count: 15 },
      { time_range: "7-14 дней", orders_count: 5 },
    ],
  },
  businessKPI: {
    extremeParameters: [],
    totalWeight: 10000,
    avgVolume: 5.5,
    avgDeliveryTime: "2.5",
    oversizedRatio: {
      standardCargoCount: 5,
      oversizedCargoCount: 5,
      oversizedPercentage: "50.0",
    },
    topUser: {
      id: 1,
      email: "test@example.com",
      orders_count: 10,
      total_weight: 5000,
      avg_weight: 500,
    },
  },
  complexMetrics: {
    extremeParameters: [],
  },
};

describe("AnalyticsDashboard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("отображает загрузку при получении данных", async () => {
    mockUseFetch.mockReturnValue({
      fetchData: jest.fn(),
      data: null,
      loading: true,
      error: null,
    });

    render(<AnalyticsDashboard />);

    expect(await screen.findByTestId("loading-spinner")).toBeInTheDocument();
  });

  it("отображает ошибку при неудачном запросе", async () => {
    mockUseFetch.mockReturnValue({
      fetchData: jest.fn().mockRejectedValue(new Error("Ошибка загрузки")),
      data: null,
      loading: false,
      error: "Ошибка загрузки",
    });

    await act(async () => {
      render(<AnalyticsDashboard />);
    });

    await waitFor(() => {
      expect(document.querySelector(".ant-alert-error")).toBeInTheDocument();
      expect(
        screen.getByText(/Ошибка загрузки аналитики/i),
      ).toBeInTheDocument();
    });
  });

  it("отображает данные при успешном запросе", async () => {
    mockUseFetch.mockReturnValue({
      fetchData: jest.fn().mockResolvedValue(mockMetricsData),
      data: mockMetricsData,
      loading: false,
      error: null,
    });

    render(<AnalyticsDashboard />);

    await waitFor(() => {
      expect(screen.getByText(/Ключевые показатели/i)).toBeInTheDocument();
    });

    const weightValue = await screen.findByText("10,000");
    const weightUnit = await screen.findByText("кг");

    const weightStatistic = weightValue.closest(".ant-statistic-content");
    expect(weightStatistic).toContainElement(weightUnit);

    expect(
      await screen.findByText(/Общий перевезенный вес/i),
    ).toBeInTheDocument();
    expect(await screen.findByText(/test@example.com/i)).toBeInTheDocument();
    expect(await screen.findByText(/1-5 тонн/i)).toBeInTheDocument();
  });

  it("отображает сообщение при отсутствии данных", async () => {
    mockUseFetch.mockReturnValue({
      fetchData: jest.fn().mockResolvedValue(null),
      data: null,
      loading: false,
      error: null,
    });

    await act(async () => {
      render(<AnalyticsDashboard />);
    });

    await waitFor(() => {
      expect(document.querySelector(".ant-empty")).toBeInTheDocument();
      expect(screen.getByText(/аналитика не готова/i)).toBeInTheDocument();
    });
  });
});
