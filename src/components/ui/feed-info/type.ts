import { TOrder } from '@utils-types';
export type FeedInfoUIProps = {
  feed: {
    orders?: TOrder[];
    total: number;
    totalToday: number;
    isLoading?: boolean;
    error?: string | null;
  };
  readyOrders: number[];
  pendingOrders: number[];
};

export type HalfColumnProps = {
  orders: number[];
  title: string;
  textColor?: string;
};

export type TColumnProps = {
  title: string;
  content: number;
};
