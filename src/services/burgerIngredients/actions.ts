import { getIngredientsApi } from '@api';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { hasMessage } from '../../utils/func';

export const getIngredients = createAsyncThunk<
  TIngredient[],
  void,
  { rejectValue: { message: string } }
>('burgerIngredients/getIngredients', async (_, { rejectWithValue }) => {
  try {
    return await getIngredientsApi();
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
