export interface SellerAnalyticsData {
  name: string;
  shopName: string;
  gmv: number;
  orders: number;
  netMargin: number;
  returnRate: number;
  catMedianMargin: number;
  catMedianReturn: number;
}

export interface SellerAnalyticsResult {
  data: SellerAnalyticsData;
  isDemo: boolean;
}
