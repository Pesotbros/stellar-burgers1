import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  updateUser
} from './action';
import { TUser } from '@utils-types';

type UserDataType = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
};

export const initialState: UserDataType = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null
};

export const userDataSlice = createSlice({
  name: 'userDataSlice',
  initialState,
  reducers: {},
  selectors: {
    selectUserData: (state) => state.user,
    selectIsAuth: (state) => state.isAuthChecked,
    selectIsLoading: (state) => state.isLoading,
    selectError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isLoading = false;
        state.error = null;
      })
      // pending для нескольких thunk-ов
      .addMatcher(
        isAnyOf(
          registerUser.pending,
          loginUser.pending,
          logoutUser.pending,
          getUser.pending,
          updateUser.pending
        ),
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      )

      // rejected для нескольких thunk-ов
      .addMatcher(
        isAnyOf(
          registerUser.rejected,
          loginUser.rejected,
          logoutUser.rejected,
          getUser.rejected,
          updateUser.rejected
        ),
        (state, action) => {
          state.isLoading = false;
          state.isAuthChecked = true;
          state.error =
            action.payload?.message ?? action.error.message ?? 'Unknown error';
        }
      )

      // fulfilled для тех, что возвращают TUser
      .addMatcher(
        isAnyOf(
          registerUser.fulfilled,
          loginUser.fulfilled,
          getUser.fulfilled,
          updateUser.fulfilled
        ),
        (state, action) => {
          state.isLoading = false;
          state.isAuthChecked = true;
          state.user = action.payload;
        }
      );
  }
});

export const { selectUserData, selectIsAuth, selectIsLoading, selectError } =
  userDataSlice.selectors;
