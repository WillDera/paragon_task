export type Owner = {
  message: string;
  statusCode: number;
  data: {
    owner_address: string;
    token_id: number;
  };
};

export type HighestHolderInfo = {
  message: string;
  statusCode: number;
  data: {
    owner_address: string;
    number_of_nfts_owned: number;
  };
};

export type HighestHolderAmountInfo = {
  message: string;
  statusCode: number;
  data: {
    owner_address: string;
    total_spent: {
      usd_amount: number;
      eth_amount: number;
    };
  };
};

export type AverageOwnershipDuration = {
  message: string;
  statusCode: number;
  data: {
    token_id: number;
    avg_ownership_duration: {
      days: number;
      hours: number;
    };
  };
};

export type OwnershipHistoryData = {
  timestamp: string;
  owner: string;
};

export type OwnershipHistory = {
  message: string;
  statusCode: number;
  data: OwnershipHistoryData[];
};
