import reducer, { clearOrder, initialState } from './slice';
import { getOrderByNumber } from './action';
import { order } from '../../test-utils/mocks';

describe('редуктор orderInfo', () => {
  it('установка состояния загрузки', () => {
    const orderNumber = 12345;
    const state = reducer(
      initialState,
      getOrderByNumber.pending('', orderNumber)
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('обработка успешного ответа с данными заказа', () => {
    // Создаём начальное состояние с флагом загрузки
    const initialLoadingState = { ...initialState, isLoading: true };
    const orderNumber = 12345;

    // Применяем действие успешного ответа
    const state = reducer(
      initialLoadingState,
      getOrderByNumber.fulfilled(order, '', orderNumber)
    );

    // Проверяем результат
    expect(state.isLoading).toBe(false);
    expect(state.order).toEqual(order);
    expect(state.error).toBeNull();
  });

  it('обработка ошибки загрузки информации о заказе', () => {
    // Создаём начальное состояние с флагом загрузки
    const initialLoadingState = { ...initialState, isLoading: true };
    const orderNumber = 12345;
    const errorMessage = 'Ошибка получения заказа';

    // Применяем действие с ошибкой
    const state = reducer(
      initialLoadingState,
      getOrderByNumber.rejected(new Error(errorMessage), '', orderNumber, {
        message: errorMessage
      })
    );

    // Проверяем результат
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
    expect(state.order).toEqual(initialState.order); // Данные заказа не изменились
  });

  it('очистка состояния заказа', () => {
    // Создаём состояние с заполненными данными для очистки
    const dirtyState = {
      ...initialState,
      order,
      isLoading: true,
      error: 'x'
    };

    // Применяем действие очистки
    const state = reducer(dirtyState, clearOrder());

    // Проверяем, что состояние полностью сброшено к initialState
    expect(state).toEqual(initialState);
  });
});
