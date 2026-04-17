import { createSlice } from '@reduxjs/toolkit';
import { getPublicOrders } from './action';
import { TOrder } from '@utils-types';

/**
 * Тип состояния для управления публичными заказами
 * Содержит:
 * - массив заказов (orders)
 * - статистику по заказам (feed: общее количество и за сегодня)
 * - флаг загрузки (isLoading)
 * - сообщение об ошибке (если есть)
 */
export type PublicOrdersState = {
  orders: TOrder[];
  feed: {
    total: number;
    totalToday: number;
  };
  isLoading: boolean;
  error: string | null;
};

/**
 * Начальное состояние среза публичных заказов
 * Изначально список заказов пуст, статистика обнулена,
 * загрузка не активна, ошибок нет
 */
export const initialState: PublicOrdersState = {
  orders: [],
  feed: {
    total: 0,
    totalToday: 0
  },
  isLoading: false,
  error: null
};

/**
 * Срез Redux для управления состоянием публичных заказов
 * Обрабатывает асинхронный запрос на получение:
 * - списка публичных заказов
 * - статистики по заказам (общее количество и за текущий день)
 * Управляет индикатором загрузки и обрабатывает возможные ошибки.
 * Предоставляет селекторы для доступа к данным.
 */
export const publicOrdersSlice = createSlice({
  name: 'publicOrdersSlice',
  initialState,
  reducers: {},
  selectors: {
    /**
     * Возвращает список публичных заказов
     * @param state — текущее состояние среза
     * @returns массив объектов заказов
     */
    selectOrders: (state) => state.orders,

    /**
     * Возвращает статистику по заказам
     * @param state — текущее состояние среза
     * @returns объект с полями total и totalToday
     */
    selectFeed: (state) => state.feed,

    /**
     * Возвращает флаг состояния загрузки заказов
     * @param state — текущее состояние среза
     * @returns boolean — true, если идёт загрузка данных
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
      // Обработка начала загрузки публичных заказов — активируем индикатор загрузки
      .addCase(getPublicOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Обработка ошибки при загрузке публичных заказов
      .addCase(getPublicOrders.rejected, (state, action) => {
        state.isLoading = false;
        // Попытка извлечь информативное сообщение об ошибке из разных источников
        state.error =
          action.payload?.message ??
          action.error.message ??
          'Неизвестная ошибка при загрузке публичных заказов';
      })
      // Обработка успешного получения публичных заказов и статистики
      .addCase(getPublicOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.feed = {
          total: action.payload.total,
          totalToday: action.payload.totalToday
        };
      });
  }
});

/** Экспорт селекторов среза для получения данных публичных заказов */
export const { selectOrders, selectFeed, selectIsLoading, selectError } =
  publicOrdersSlice.selectors;

/** Экспорт редуктора среза по умолчанию */
export default publicOrdersSlice.reducer;
