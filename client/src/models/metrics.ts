export interface WeightCategory {
  weight_category: string;
  orders_count: number;
  avg_delivery_days: string;
  min_weight: number;
  max_weight: number;
  avg_weight: number;
}

export interface CargoAnalytics {
  weightCategories: WeightCategory[];
}

export interface SeasonalDistribution {
  month: number;
  orders_count: number;
  total_weight: number;
  avg_weight: number;
}

export interface StuckOrder {
  time_range: string;
  orders_count: number;
}

export interface TemporalAnalytics {
  seasonalDistribution: SeasonalDistribution[];
}

export interface OversizedRatio {
  standardCargoCount: number;
  oversizedCargoCount: number;
  oversizedPercentage: string;
}

export interface TopUser {
  id: number;
  email: string;
  orders_count: number;
  total_weight: number;
  avg_weight: number;
}

export interface StatusAnalytics {
  stuckOrders: StuckOrder[];
}

export interface ExtremeParameter {
  category: string;
  id: number;
  from: string;
  to: string;
  weight: number;
  length: number;
  width: number;
  height: number;
  delivery_days: number;
}

export interface BusinessKPI {
  extremeParameters: ExtremeParameter[];
  totalWeight: number;
  avgVolume: number;
  avgDeliveryTime: string;
  oversizedRatio: OversizedRatio;
  topUser: TopUser;
}

export interface ComplexMetrics {
  extremeParameters: ExtremeParameter[];
}

export interface MetricsData {
  cargoAnalytics: CargoAnalytics;
  temporalAnalytics: TemporalAnalytics;
  statusAnalytics: StatusAnalytics;
  businessKPI: BusinessKPI;
  complexMetrics: ComplexMetrics;
}
