export type Tokens = {
  access_token: string;
  refresh_token: string;
};

export type TokenId = {
  token_id: number;
};

export type TokenIds = {
  message: string;
  statusCode: number;
  data: TokenId[];
};

export type AveragePrice = {
  message: string;
  statusCode: number;
  data: {
    token_id: number;
    avg_usd_price: number;
    avg_eth_price: number;
  };
};

export type PriceHistoryData = {
  timestamp: string;
  usd_price: number;
  eth_price: number;
};

export type PriceHistory = {
  message: string;
  statusCode: number;
  data: PriceHistoryData[];
};
