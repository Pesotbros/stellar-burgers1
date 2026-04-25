import reducer, { initialState } from './slice';
import { getUser, loginUser, logoutUser } from './action';
import { user } from '../../test-utils/mocks';

describe('редуктор userData', () => {
  it('установка состояния загрузки при авторизации', () => {
    const authData = { email: 'test@example.com', password: '123456' };
    const state = reducer(initialState, loginUser.pending('', authData));

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('обработка успешного ответа с данными пользователя', () => {
    // Создаём начальное состояние с флагом загрузки
    const initialLoadingState = { ...initialState, isLoading: true };

    // Применяем действие успешного ответа
    const state = reducer(
      initialLoadingState,
      getUser.fulfilled(user, '', undefined)
    );

    // Проверяем результат
    expect(state.isLoading).toBe(false);
    expect(state.isAuthChecked).toBe(true);
    expect(state.user).toEqual(user);
    expect(state.error).toBeNull(); // Ошибка сбрасывается при успехе
  });

  it('обработка ошибки получения данных пользователя', () => {
    // Создаём начальное состояние с флагом загрузки
    const initialLoadingState = { ...initialState, isLoading: true };
    const errorMessage = 'Not authorized';

    // Применяем действие с ошибкой
    const state = reducer(
      initialLoadingState,
      getUser.rejected(new Error(errorMessage), '', undefined, {
        message: errorMessage
      })
    );

    // Проверяем результат
    expect(state.isLoading).toBe(false);
    expect(state.isAuthChecked).toBe(true);
    expect(state.error).toBe(errorMessage);
    expect(state.user).toEqual(initialState.user); // Данные пользователя не изменились
  });

  it('очистка данных пользователя при выходе из системы', () => {
    // Создаём состояние с авторизованным пользователем
    const authenticatedState = {
      ...initialState,
      user: user,
      isLoading: true,
      isAuthChecked: true
    };

    // Применяем действие выхода из системы
    const state = reducer(
      authenticatedState,
      logoutUser.fulfilled(undefined, '', undefined)
    );

    // Проверяем результат
    expect(state.user).toBeNull();
    expect(state.isLoading).toBe(false);
    expect(state.error).toBeNull();
    expect(state.isAuthChecked).toBe(true); // Флаг авторизации остаётся
  });
});
