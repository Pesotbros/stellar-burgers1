import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  registerUserApi,
  loginUserApi,
  logoutApi,
  getUserApi,
  updateUserApi
} from '@api';
import { TUser } from '@utils-types';
import { TRegisterData, TLoginData } from '@api';
import { setCookie, deleteCookie } from '../../utils/cookie';
import { hasMessage } from '../../utils/func';

export const registerUser = createAsyncThunk<
  TUser,
  TRegisterData,
  { rejectValue: { message: string } }
>('userData/registerUser', async (form, { rejectWithValue }) => {
  try {
    const res = await registerUserApi(form);

    localStorage.setItem('refreshToken', res.refreshToken);
    setCookie('accessToken', res.accessToken);

    return res.user;
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : hasMessage(error)
          ? error.message
          : 'Cannot register';
    return rejectWithValue({ message });
  }
});

export const loginUser = createAsyncThunk<
  TUser,
  TLoginData,
  { rejectValue: { message: string } }
>('userData/loginUser', async (form, { rejectWithValue }) => {
  try {
    const res = await loginUserApi(form);

    localStorage.setItem('refreshToken', res.refreshToken);
    setCookie('accessToken', res.accessToken);

    return res.user;
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : hasMessage(error)
          ? error.message
          : 'Cannot login';
    return rejectWithValue({ message });
  }
});

export const logoutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: { message: string } }
>('userData/logoutUser', async (_, { rejectWithValue }) => {
  try {
    await logoutApi();
    localStorage.removeItem('refreshToken');
    deleteCookie('accessToken');
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : hasMessage(error)
          ? error.message
          : 'Cannot logout';
    return rejectWithValue({ message });
  }
});

export const getUser = createAsyncThunk<
  TUser,
  void,
  { rejectValue: { message: string } }
>('userData/getUser', async (_, { rejectWithValue }) => {
  try {
    const res = await getUserApi();
    return res.user;
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : hasMessage(error)
          ? error.message
          : 'Not authorized';
    return rejectWithValue({ message });
  }
});

export const updateUser = createAsyncThunk<
  TUser,
  Partial<TRegisterData>,
  { rejectValue: { message: string } }
>('userData/updateUser', async (form, { rejectWithValue }) => {
  try {
    const res = await updateUserApi(form);
    return res.user;
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : hasMessage(error)
          ? error.message
          : 'Cannot update user';
    return rejectWithValue({ message });
  }
});
