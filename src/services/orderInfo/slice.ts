import { getOrderByNumber } from './action';
import { createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

type OrderByNumberState = {
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

export const initialState: OrderByNumberState = {
  order: null,
  isLoading: false,
  error: null
};

export const orderByNumberSlice = createSlice({
  name: 'orderByNumberSlice',
  initialState,
  reducers: {
    clearOrder: () => initialState
  },
  selectors: {
    selectIsLoading: (state) => state.isLoading,
    selectOrder: (state) => state.order,
    selectError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(getOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getOrderByNumber.rejected, (state, action) => {
        state.error =
          action.payload?.message ?? action.error.message ?? 'Unknown error';
        state.isLoading = false;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      });
  }
});

export const { selectIsLoading, selectOrder, selectError } =
  orderByNumberSlice.selectors;
export const { clearOrder } = orderByNumberSlice.actions;
