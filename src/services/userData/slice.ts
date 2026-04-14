import { createSlice, isAnyOf } from '@reduxjs/toolkit';
import {
  registerUser,
  loginUser,
  logoutUser,
  getUser,
  updateUser
} from './action';
import { TUser } from '@utils-types';

/**
 * Тип состояния для управления данными пользователя и авторизацией
 * Содержит:
 * - данные пользователя (user)
 * - флаг проверки авторизации (isAuthChecked)
 * - флаг загрузки (isLoading)
 * - сообщение об ошибке (если есть)
 */
type UserDataType = {
  user: TUser | null;
  isAuthChecked: boolean;
  isLoading: boolean;
  error: string | null;
};

/**
 * Начальное состояние среза данных пользователя
 * Изначально пользователь не авторизован, данные отсутствуют,
 * загрузка не активна, ошибок нет
 */
export const initialState: UserDataType = {
  user: null,
  isAuthChecked: false,
  isLoading: false,
  error: null
};

/**
 * Срез Redux для управления состоянием данных пользователя и авторизации
 * Обрабатывает асинхронные операции:
 * - регистрацию, вход, выход из системы
 * - получение и обновление данных пользователя
 * Управляет индикаторами загрузки, отслеживает статус авторизации,
 * обрабатывает ошибки и предоставляет селекторы для доступа к данным.
 */
export const userDataSlice = createSlice({
  name: 'userDataSlice',
  initialState,
  reducers: {},
  selectors: {
    /**
     * Возвращает данные текущего пользователя
     * @param state — текущее состояние среза
     * @returns объект пользователя или null, если пользователь не авторизован
     */
    selectUserData: (state) => state.user,

    /**
     * Возвращает флаг проверки авторизации
     * @param state — текущее состояние среза
     * @returns boolean — true, если авторизация проверена
     */
    selectIsAuth: (state) => state.isAuthChecked,

    /**
     * Возвращает флаг состояния загрузки
     * @param state — текущее состояние среза
     * @returns boolean — true, если идёт обработка запроса
     */
    selectIsLoading: (state) => state.isLoading,

    /**
     * Возвращает сообщение об ошибке (если есть)
     * @param state — текущее состояние среза
     * @returns строка с описанием ошибки или null
     */
    selectError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      // Обработка успешного выхода из системы — очищаем данные пользователя
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isLoading = false;
        state.error = null;
      })

      // Общий обработчик начала загрузки для всех операций с пользователем
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

      // Общий обработчик ошибок для всех операций с пользователем
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
          // Попытка извлечь информативное сообщение об ошибке из разных источников
          state.error =
            action.payload?.message ??
            action.error.message ??
            'Неизвестная ошибка при выполнении операции с пользователем';
        }
      )

      // Общий обработчик успешного выполнения операций, возвращающих данные пользователя
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

/** Экспорт селекторов среза для получения данных пользователя и состояния авторизации */
export const { selectUserData, selectIsAuth, selectIsLoading, selectError } =
  userDataSlice.selectors;

/** Экспорт редуктора среза по умолчанию */
export default userDataSlice.reducer;
