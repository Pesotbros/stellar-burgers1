import { createAsyncThunk } from '@reduxjs/toolkit';
import { forgotPasswordApi, resetPasswordApi, TServerResponse } from '@api';
import { hasMessage } from '../../utils/func';

export const forgotPassword = createAsyncThunk<
  TServerResponse<{}>,
  { email: string },
  { rejectValue: { message: string } }
>('passwordRecovery/forgotPassword', async (form, { rejectWithValue }) => {
  try {
    return forgotPasswordApi(form);
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

export const resetPassword = createAsyncThunk<
  TServerResponse<{}>,
  { password: string; token: string },
  { rejectValue: { message: string } }
>('password/reset', async (form, { rejectWithValue }) => {
  try {
    return resetPasswordApi(form);
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : hasMessage(error)
          ? error.message
          : 'Cannot reset password';
    return rejectWithValue({ message });
  }
});
