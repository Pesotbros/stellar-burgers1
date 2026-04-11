import { forgotPassword, resetPassword } from './action';
import { createSlice, isAnyOf } from '@reduxjs/toolkit';

type PasswordRecoveryState = {
  isLoading: boolean;
  success: boolean;
  step: 'idle' | 'forgotSuccess' | 'resetSuccess';
  error: string | null;
  resetAllowed: boolean;
};

export const initialState: PasswordRecoveryState = {
  isLoading: false,
  success: false,
  step: 'idle',
  error: null,
  resetAllowed: false
};

export const passwordRecoverySlice = createSlice({
  name: 'passwordRecoverySlice',
  initialState,
  reducers: {
    resetRecoveryState: () => initialState
  },
  selectors: {
    selectIsLoading: (state) => state.isLoading,
    selectSuccess: (state) => state.success,
    selectStep: (state) => state.step,
    selectError: (state) => state.error,
    selectResetAllowed: (state) => state.resetAllowed
  },
  extraReducers: (builder) => {
    builder
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.success = false;
        state.error =
          action.payload?.message ?? action.error.message ?? 'Unknown error';
        state.resetAllowed = false;
      })
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.success = true;
        state.resetAllowed = true;
        state.step = 'forgotSuccess';
      })

      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.success = false;
        state.error =
          action.payload?.message ?? action.error.message ?? 'Unknown error';
      })

      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.success = true;
        state.step = 'resetSuccess';
        state.resetAllowed = false;
      })

      // pending для нескольких thunk-ов
      .addMatcher(
        isAnyOf(forgotPassword.pending, resetPassword.pending),
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      );
  }
});

export const { resetRecoveryState } = passwordRecoverySlice.actions;
export const {
  selectIsLoading,
  selectSuccess,
  selectStep,
  selectError,
  selectResetAllowed
} = passwordRecoverySlice.selectors;
