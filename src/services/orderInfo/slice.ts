import { getOrderByNumber } from './action';
import { createSlice } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

/**
 * Тип состояния для управления загрузкой заказа по номеру
 * Содержит:
 * - данные заказа (order)
 * - флаг загрузки (isLoading)
 * - сообщение об ошибке (если есть)
 */
type OrderByNumberState = {
  order: TOrder | null;
  isLoading: boolean;
  error: string | null;
};

/**
 * Начальное состояние среза загрузки заказа по номеру
 * Изначально заказ не загружен, загрузка не активна, ошибок нет
 */
export const initialState: OrderByNumberState = {
  order: null,
  isLoading: false,
  error: null
};

/**
 * Срез Redux для управления состоянием загрузки заказа по его номеру
 * Обрабатывает асинхронный запрос на получение данных заказа:
 * - устанавливает индикатор загрузки при начале запроса
 * - сохраняет полученные данные заказа
 * - обрабатывает и отображает возможные ошибки
 * Предоставляет действие для сброса состояния до начального.
 */
export const orderByNumberSlice = createSlice({
  name: 'orderByNumberSlice',
  initialState,
  reducers: {
    /**
     * Сбрасывает состояние среза до начального
     * Очищает данные заказа, сбрасывает флаг загрузки и ошибку
     * @returns начальное состояние среза
     */
    clearOrder: () => initialState
  },
  selectors: {
    /**
     * Возвращает флаг состояния загрузки заказа
     * @param state - текущее состояние среза
     * @returns boolean — true, если идёт загрузка данных заказа
     */
    selectIsLoading: (state) => state.isLoading,

    /**
     * Возвращает данные заказа по номеру (если загружены)
     * @param state - текущее состояние среза
     * @returns объект заказа или null, если данных нет
     */
    selectOrder: (state) => state.order,

    /**
     * Возвращает сообщение об ошибке (если есть)
     * @param state - текущее состояние среза
     * @returns строка с описанием ошибки или null
     */
    selectError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      // Обработка начала загрузки заказа — активируем индикатор загрузки
      .addCase(getOrderByNumber.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Обработка ошибки при загрузке заказа — сохраняем сообщение об ошибке
      .addCase(getOrderByNumber.rejected, (state, action) => {
        // Попытка извлечь информативное сообщение об ошибке из разных источников
        state.error =
          action.payload?.message ??
          action.error.message ??
          'Неизвестная ошибка при загрузке заказа';
        state.isLoading = false;
      })
      // Обработка успешного получения заказа — сохраняем данные в состояние
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.order = action.payload;
      });
  }
});

/** Экспорт селекторов среза для получения состояния загрузки заказа */
export const { selectIsLoading, selectOrder, selectError } =
  orderByNumberSlice.selectors;

/** Экспорт действия для сброса состояния среза */
export const { clearOrder } = orderByNumberSlice.actions;

/** Экспорт редуктора среза по умолчанию */
export default orderByNumberSlice.reducer;
