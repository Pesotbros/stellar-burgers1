import reducer, { clearOrderModal, initialState } from './slice';
import { createOrder } from './action';
import { order } from '../../test-utils/mocks';

describe('редуктор createOrder', () => {
  it('установка состояния отправки заказа', () => {
    const ingredientsIds: string[] = [];
    const state = reducer(
      initialState,
      createOrder.pending('', ingredientsIds)
    );

    expect(state.orderRequest).toBe(true);
    expect(state.error).toBeNull();
  });

  it('обработка успешного ответа с данными заказа', () => {
    // Создаём начальное состояние с флагом отправки заказа
    const initialRequestState = { ...initialState, orderRequest: true };
    const ingredientsIds: string[] = [];

    // Данные успешного ответа от API
    const successResponse = {
      success: true,
      name: order.name,
      order: order
    };

    // Применяем действие успешного ответа
    const state = reducer(
      initialRequestState,
      createOrder.fulfilled(successResponse, '', ingredientsIds)
    );

    // Проверяем результат
    expect(state.orderRequest).toBe(false);
    expect(state.orderModalData).toEqual(order);
    expect(state.error).toBeNull();
  });

  it('обработка ошибки создания заказа', () => {
    // Создаём начальное состояние с флагом отправки заказа
    const initialRequestState = { ...initialState, orderRequest: true };
    const ingredientsIds: string[] = [];
    const errorMessage = 'Ошибка создания заказа';

    // Применяем действие с ошибкой
    const state = reducer(
      initialRequestState,
      createOrder.rejected(new Error(errorMessage), '', ingredientsIds, {
        message: errorMessage
      })
    );

    // Проверяем результат
    expect(state.orderRequest).toBe(false);
    expect(state.error).toBe(errorMessage);
    expect(state.orderModalData).toEqual(initialState.orderModalData); // Данные модального окна не изменились
  });

  it('очистка данных модального окна заказа', () => {
    // Создаём состояние с заполненными данными для очистки
    const dirtyState = {
      orderRequest: true,
      orderModalData: order,
      error: 'error'
    };

    // Применяем действие очистки
    const state = reducer(dirtyState, clearOrderModal());

    // Проверяем, что состояние полностью сброшено к initialState
    expect(state).toEqual(initialState);
  });
});
