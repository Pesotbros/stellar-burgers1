import { createSlice } from '@reduxjs/toolkit';
import { createOrder } from './action';
import { TOrder } from '@utils-types';

/**
 * Тип состояния для управления процессом создания заказа
 * Содержит:
 * - флаг запроса на создание заказа (orderRequest)
 * - данные заказа для модального окна (orderModalData)
 * - сообщение об ошибке (если есть)
 */
type CreateOrderState = {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  error: string | null;
};

/**
 * Начальное состояние среза создания заказа
 * Изначально запрос не активен, данные заказа отсутствуют, ошибок нет
 */
export const initialState: CreateOrderState = {
  orderRequest: false,
  orderModalData: null,
  error: null
};

/**
 * Срез Redux для управления состоянием создания заказа
 * Обрабатывает асинхронный процесс создания заказа:
 * - устанавливает флаг загрузки при начале запроса
 * - сохраняет данные успешного заказа
 * - обрабатывает и отображает ошибки
 * Предоставляет действие для очистки модального окна заказа.
 */
export const createOrderSlice = createSlice({
  name: 'createOrderSlice',
  initialState,
  reducers: {
    /**
     * Очищает состояние модального окна заказа
     * Сбрасывает все поля до начальных значений:
     * - убирает ошибку
     * - очищает данные заказа
     * - отключает флаг запроса
     * @param state - текущее состояние среза
     */
    clearOrderModal(state) {
      state.error = null;
      state.orderModalData = null;
      state.orderRequest = false;
    }
  },
  selectors: {
    /**
     * Возвращает флаг состояния запроса на создание заказа
     * @param state - текущее состояние среза
     * @returns boolean — true, если идёт отправка заказа
     */
    selectOrderRequest: (state) => state.orderRequest,

    /**
     * Возвращает данные заказа для отображения в модальном окне
     * @param state - текущее состояние среза
     * @returns объект заказа или null, если данных нет
     */
    selectOrderModalData: (state) => state.orderModalData,

    /**
     * Возвращает сообщение об ошибке (если есть)
     * @param state - текущее состояние среза
     * @returns строка с описанием ошибки или null
     */
    selectError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      // Обработка начала отправки заказа — активируем индикатор загрузки
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      // Обработка ошибки при создании заказа — сохраняем сообщение об ошибке
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        // Попытка извлечь информативное сообщение об ошибке из разных источников
        state.error =
          action.payload?.message ??
          action.error.message ??
          'Неизвестная ошибка при создании заказа';
      })
      // Обработка успешного создания заказа — сохраняем данные в состояние
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload.order;
      });
  }
});

/** Экспорт действия для очистки модального окна заказа */
export const { clearOrderModal } = createOrderSlice.actions;

/** Экспорт селекторов среза для получения состояния создания заказа */
export const { selectOrderRequest, selectOrderModalData, selectError } =
  createOrderSlice.selectors;

/** Экспорт редуктора среза по умолчанию */
export default createOrderSlice.reducer;
