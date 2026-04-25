import reducer, { initialState, resetUserOrders } from './slice';
import { getUserOrders } from './action';
import { order } from '../../test-utils/mocks';

describe('редуктор userOrders', () => {
  it('установка состояния загрузки', () => {
    const state = reducer(initialState, getUserOrders.pending('', undefined));

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('обработка успешного ответа с данными заказов', () => {
    // Создаём начальное состояние с флагом загрузки
    const initialLoadingState = { ...initialState, isLoading: true };

    // Данные успешного ответа от API
    const ordersPayload = [order];

    // Применяем действие успешного ответа
    const state = reducer(
      initialLoadingState,
      getUserOrders.fulfilled(ordersPayload, '', undefined)
    );

    // Проверяем результат
    expect(state.isLoading).toBe(false);
    expect(state.orders).toEqual(ordersPayload);
    expect(state.error).toBeNull(); // Ошибка сбрасывается при успехе
  });

  it('обработка ошибки загрузки заказов пользователя', () => {
    // Создаём начальное состояние с флагом загрузки
    const initialLoadingState = { ...initialState, isLoading: true };
    const errorMessage = 'Ошибка загрузки заказов';

    // Применяем действие с ошибкой
    const state = reducer(
      initialLoadingState,
      getUserOrders.rejected(new Error(errorMessage), '', undefined, {
        message: errorMessage
      })
    );

    // Проверяем результат
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
    expect(state.orders).toEqual(initialState.orders); // Данные заказов не изменились
  });

  it('сброс состояния заказов пользователя', () => {
    // Создаём состояние с заполненными данными для очистки
    const dirtyState = {
      ...initialState,
      orders: [order],
      isLoading: true,
      error: 'x'
    };

    // Применяем действие сброса состояния
    const state = reducer(dirtyState, resetUserOrders());

    // Проверяем, что состояние полностью сброшено к initialState
    expect(state).toEqual(initialState);
  });
});
