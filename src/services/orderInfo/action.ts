import { createAsyncThunk } from '@reduxjs/toolkit';
import { getOrderByNumberApi } from '@api';
import { TOrder } from '@utils-types';
import { hasMessage } from '../../utils/func';

export const getOrderByNumber = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: { message: string } }
>('orderInfo/getOrderByNumber', async (number, { rejectWithValue }) => {
  try {
    const res = await getOrderByNumberApi(number);
    return res.orders?.[0];
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : hasMessage(error)
          ? error.message
          : 'Cannot find order';
    return rejectWithValue({ message });
  }
});
