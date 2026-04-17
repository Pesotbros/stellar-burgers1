import { forgotPassword, resetPassword } from './action';
import { createSlice, isAnyOf } from '@reduxjs/toolkit';

/**
 * Тип состояния для управления процессом восстановления пароля
 */
type PasswordRecoveryState = {
  isLoading: boolean;
  success: boolean;
  step: 'idle' | 'forgotSuccess' | 'resetSuccess';
  error: string | null;
  resetAllowed: boolean;
};

/**
 * Начальное состояние среза восстановления пароля
 * Изначально загрузка не активна, операция не завершена, ошибок нет,
 * этап — idle, сброс пароля не разрешён
 */
export const initialState: PasswordRecoveryState = {
  isLoading: false,
  success: false,
  step: 'idle',
  error: null,
  resetAllowed: false
};

/**
 * Срез Redux для управления состоянием процесса восстановления пароля
 * Обрабатывает асинхронные операции:
 * - отправку запроса на восстановление пароля (forgotPassword)
 * - выполнение сброса пароля (resetPassword)
 * Управляет индикаторами загрузки, отслеживает этапы процесса,
 * обрабатывает ошибки и предоставляет возможность сброса состояния.
 */
export const passwordRecoverySlice = createSlice({
  name: 'passwordRecoverySlice',
  initialState,
  reducers: {
    /**
     * Сбрасывает состояние процесса восстановления пароля до начального
     * Очищает все флаги, ошибки и сбрасывает этап на 'idle'
     * @returns начальное состояние среза
     */
    resetRecoveryState: () => initialState
  },
  selectors: {
    /**
     * Возвращает флаг состояния загрузки
     * @param state — текущее состояние среза
     * @returns boolean — true, если идёт обработка запроса
     */
    selectIsLoading: (state) => state.isLoading,

    /**
     * Возвращает флаг успеха последней операции
     * @param state — текущее состояние среза
     * @returns boolean — true, если операция завершилась успешно
     */
    selectSuccess: (state) => state.success,

    /**
     * Возвращает текущий этап процесса восстановления пароля
     * @param state — текущее состояние среза
     * @returns 'idle' | 'forgotSuccess' | 'resetSuccess' — текущий этап
     */
    selectStep: (state) => state.step,

    /**
     * Возвращает сообщение об ошибке (если есть)
     * @param state — текущее состояние среза
     * @returns строка с описанием ошибки или null
     */
    selectError: (state) => state.error,

    /**
     * Возвращает флаг разрешения на сброс пароля
     * @param state — текущее состояние среза
     * @returns boolean — true, если сброс пароля разрешён
     */
    selectResetAllowed: (state) => state.resetAllowed
  },
  extraReducers: (builder) => {
    builder
      // Обработка ошибки при отправке запроса на восстановление пароля
      .addCase(forgotPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.success = false;
        // Попытка извлечь информативное сообщение об ошибке из разных источников
        state.error =
          action.payload?.message ??
          action.error.message ??
          'Неизвестная ошибка при отправке запроса на восстановление пароля';
        state.resetAllowed = false;
      })
      // Обработка успешного запроса на восстановление пароля
      .addCase(forgotPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.success = true;
        state.resetAllowed = true;
        state.step = 'forgotSuccess';
      })

      // Обработка ошибки при сбросе пароля
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false;
        state.success = false;
        // Попытка извлечь информативное сообщение об ошибке из разных источников
        state.error =
          action.payload?.message ??
          action.error.message ??
          'Неизвестная ошибка при сбросе пароля';
      })

      // Обработка успешного сброса пароля
      .addCase(resetPassword.fulfilled, (state) => {
        state.isLoading = false;
        state.success = true;
        state.step = 'resetSuccess';
        state.resetAllowed = false;
      })

      // Общий обработчик начала загрузки для обоих thunk-ов
      .addMatcher(
        isAnyOf(forgotPassword.pending, resetPassword.pending),
        (state) => {
          state.isLoading = true;
          state.error = null;
        }
      );
  }
});

/** Экспорт действия для сброса состояния процесса восстановления пароля */
export const { resetRecoveryState } = passwordRecoverySlice.actions;

/** Экспорт селекторов среза для получения состояния восстановления пароля */
export const {
  selectIsLoading,
  selectSuccess,
  selectStep,
  selectError,
  selectResetAllowed
} = passwordRecoverySlice.selectors;

/** Экспорт редуктора среза по умолчанию */
export default passwordRecoverySlice.reducer;
