import { createAsyncThunk } from '@reduxjs/toolkit';
import { getOrdersApi } from '@api';
import { TOrder } from '@utils-types';
import { hasMessage } from '../../utils/func';

export const getUserOrders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: { message: string } }
>('userOrders/getuserOrders', async (_, { rejectWithValue }) => {
  try {
    return await getOrdersApi();
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : hasMessage(error)
          ? error.message
          : 'Request failed';
    return rejectWithValue({ message });
  }
});
