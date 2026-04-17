import { getUserOrders } from './action';
import { createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

/**
 * Тип состояния для управления заказами пользователя
 * Содержит:
 * - массив заказов пользователя (orders)
 * - флаг загрузки (isLoading)
 * - сообщение об ошибке (если есть)
 */
type UserOrdersState = {
  orders: TOrder[];
  isLoading: boolean;
  error: string | null;
};

/**
 * Начальное состояние среза заказов пользователя
 * Изначально список заказов пуст, загрузка не активна, ошибок нет
 */
export const initialState: UserOrdersState = {
  orders: [],
  isLoading: false,
  error: null
};

/**
 * Срез Redux для управления состоянием заказов пользователя
 * Обрабатывает асинхронный запрос на получение списка заказов:
 * - устанавливает индикатор загрузки при начале запроса
 * - сохраняет полученные заказы
 * - обрабатывает и отображает возможные ошибки
 * Предоставляет действие для сброса состояния и селекторы для доступа к данным.
 */
export const userOrdersSlice = createSlice({
  name: 'userOrdersSlice',
  initialState,
  reducers: {
    /**
     * Сбрасывает состояние среза заказов пользователя до начального
     * Очищает список заказов, сбрасывает флаг загрузки и ошибку
     * @returns начальное состояние среза
     */
    resetUserOrders: () => initialState
  },
  selectors: {
    /**
     * Возвращает флаг состояния загрузки заказов
     * @param state — текущее состояние среза
     * @returns boolean — true, если идёт загрузка данных
     */
    selectIsLoading: (state) => state.isLoading,

    /**
     * Возвращает список заказов пользователя
     * @param state — текущее состояние среза
     * @returns массив объектов заказов
     */
    selectOrders: (state) => state.orders,

    /**
     * Возвращает сообщение об ошибке (если есть)
     * @param state — текущее состояние среза
     * @returns строка с описанием ошибки или null
     */
    selectError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      // Обработка начала загрузки заказов пользователя — активируем индикатор загрузки
      .addCase(getUserOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Обработка ошибки при загрузке заказов — сохраняем сообщение об ошибке
      .addCase(getUserOrders.rejected, (state, action) => {
        state.isLoading = false;
        // Попытка извлечь информативное сообщение об ошибке из разных источников
        state.error =
          action.payload?.message ??
          action.error.message ??
          'Неизвестная ошибка при загрузке заказов пользователя';
      })
      // Обработка успешного получения заказов — сохраняем данные в состояние
      .addCase(getUserOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      });
  }
});

/** Экспорт действия для сброса состояния среза заказов пользователя */
export const { resetUserOrders } = userOrdersSlice.actions;

/** Экспорт селекторов среза для получения состояния заказов пользователя */
export const { selectIsLoading, selectOrders, selectError } =
  userOrdersSlice.selectors;

/** Экспорт редуктора среза по умолчанию */
export default userOrdersSlice.reducer;
