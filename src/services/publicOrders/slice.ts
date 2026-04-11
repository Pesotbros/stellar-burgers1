import { createSlice } from '@reduxjs/toolkit';
import { getPublicOrders } from './action';
import { TOrder } from '@utils-types';

export type PublicOrdersState = {
  orders: TOrder[];
  feed: {
    total: number;
    totalToday: number;
  };
  isLoading: boolean;
  error: string | null;
};

export const initialState: PublicOrdersState = {
  orders: [],
  feed: {
    total: 0,
    totalToday: 0
  },
  isLoading: false,
  error: null
};

export const publicOrdersSlice = createSlice({
  name: 'publicOrdersSlice',
  initialState,
  reducers: {},
  selectors: {
    selectOrders: (state) => state.orders,
    selectFeed: (state) => state.feed,
    selectIsLoading: (state) => state.isLoading,
    selectError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(getPublicOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPublicOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message ?? action.error.message ?? 'Unknown error';
      })
      .addCase(getPublicOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.feed = {
          total: action.payload.total,
          totalToday: action.payload.totalToday
        };
      });
  }
});

export const { selectOrders, selectFeed, selectIsLoading, selectError } =
  publicOrdersSlice.selectors;
