import { orderBurgerApi, TNewOrderResponse } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { hasMessage } from '../../utils/func';

export const createOrder = createAsyncThunk<
  TNewOrderResponse,
  string[],
  { rejectValue: { message: string } }
>('order/createOrder', async (orderData: string[], { rejectWithValue }) => {
  try {
    return await orderBurgerApi(orderData);
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : hasMessage(error)
          ? error.message
          : 'Order failed';
    return rejectWithValue({ message });
  }
});
