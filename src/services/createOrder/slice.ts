import { createSlice } from '@reduxjs/toolkit';
import { createOrder } from './action';
import { TOrder } from '@utils-types';

type CreateOrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
};

export const initialState: CreateOrderState = {
  orderRequest: false,
  orderModalData: null,
  error: null
};

export const createOrderSlice = createSlice({
  name: 'createOrderSlice',
  initialState,
  reducers: {
    clearOrderModal(state) {
      state.error = null;
      state.orderModalData = null;
      state.orderRequest = false;
    }
  },
  selectors: {
    selectOrderRequest: (state) => state.orderRequest,
    selectOrderModalData: (state) => state.orderModalData,
    selectError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error =
          action.payload?.message ?? action.error.message ?? 'Unknown error';
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
      });
  }
});

export const { clearOrderModal } = createOrderSlice.actions;
export const { selectOrderRequest, selectOrderModalData, selectError } =
  createOrderSlice.selectors;
