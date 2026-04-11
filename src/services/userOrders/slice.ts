import { getUserOrders } from './action';
import { createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type UserOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

export const initialState: UserOrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

export const userOrdersSlice = createSlice({
  name: 'userOrdersSlice',
  initialState,
  reducers: {
    resetUserOrders: () => initialState
  },
  selectors: {
    selectIsLoading: (state) => state.isLoading,
    selectOrders: (state) => state.orders,
    selectError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(getUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message ?? action.error.message ?? 'Unknown error';
      })
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      });
  }
});

export const { selectIsLoading, selectOrders, selectError } =
  userOrdersSlice.selectors;
