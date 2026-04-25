import { rootReducer } from './store';
import { initialState as ingredientsInitialState } from './burgerIngredients/slice';
import { initialState as burgerConstructorInitialState } from './burgerConstructor/slice';
import { initialState as createOrderInitialState } from './createOrder/slice';
import { initialState as publicOrdersInitialState } from './publicOrders/slice';
import { initialState as userDataInitialState } from './userData/slice';
import { initialState as passwordRecoveryInitialState } from './passwordRecovery/slice';
import { initialState as userOrdersInitialState } from './userOrders/slice';
import { initialState as orderByNumberInitialState } from './orderInfo/slice';

describe('rootReducer', () => {
  it('инициализация хранилища', () => {
    const state = rootReducer(undefined, { type: 'UNKNOWN_ACTION' });

    // Ожидаемое полное состояние приложения при инициализации
    const expectedState = {
      ingredientsSlice: ingredientsInitialState,
      burgerConstructor: burgerConstructorInitialState,
      createOrderSlice: createOrderInitialState,
      publicOrdersSlice: publicOrdersInitialState,
      userDataSlice: userDataInitialState,
      passwordRecoverySlice: passwordRecoveryInitialState,
      userOrdersSlice: userOrdersInitialState,
      orderByNumberSlice: orderByNumberInitialState
    };

    // Проверяем, что инициализация прошла корректно
    expect(state).toEqual(expectedState);

    // Убеждаемся, что все ключи присутствуют
    const actualKeys = Object.keys(state);
    const expectedKeys = Object.keys(expectedState);

    expect(actualKeys).toHaveLength(expectedKeys.length);
    expect(actualKeys).toEqual(expect.arrayContaining(expectedKeys));
  });
});
