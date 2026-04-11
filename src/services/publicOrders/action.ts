import { getFeedsApi, TFeedsResponse } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { hasMessage } from '../../utils/func';

export const getPublicOrders = createAsyncThunk<
  TFeedsResponse,
  void,
  { rejectValue: { message: string } }
>('publicOrders/getPublicOrders', async (_, { rejectWithValue }) => {
  try {
    return await getFeedsApi();
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : hasMessage(error)
          ? error.message
          : 'Cannot find public orders';
    return rejectWithValue({ message });
  }
});
