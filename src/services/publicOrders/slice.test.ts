import reducer, { initialState } from './slice';
import { getPublicOrders } from './action';
import { order } from '../../test-utils/mocks';

describe('редуктор publicOrders', () => {
  it('установка состояния загрузки', () => {
    const state = reducer(initialState, getPublicOrders.pending('', undefined));

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('обработка успешного ответа с данными заказов', () => {
    // Создаём начальное состояние с флагом загрузки
    const initialLoadingState = { ...initialState, isLoading: true };

    // Данные успешного ответа от API
    const payload = {
      success: true,
      orders: [order],
      total: 10,
      totalToday: 5
    };

    // Применяем действие успешного ответа
    const state = reducer(
      initialLoadingState,
      getPublicOrders.fulfilled(payload, '', undefined)
    );

    // Проверяем результат
    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual([order]);
    expect(state.feed).toEqual({ total: 10, totalToday: 5 });
    expect(state.error).toBeNull(); // Ошибка сбрасывается при успехе
  });

  it('обработка ошибки загрузки публичных заказов', () => {
    // Создаём начальное состояние с флагом загрузки
    const initialLoadingState = { ...initialState, isLoading: true };
    const errorMessage = 'Ошибка загрузки ленты';

    // Применяем действие с ошибкой
    const state = reducer(
      initialLoadingState,
      getPublicOrders.rejected(new Error(errorMessage), '', undefined, {
        message: errorMessage
      })
    );

    // Проверяем результат
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
    expect(state.orders).toEqual(initialState.orders); // Данные заказов не изменились
    expect(state.feed).toEqual(initialState.feed); // Статистика ленты не изменилась
  });
});
