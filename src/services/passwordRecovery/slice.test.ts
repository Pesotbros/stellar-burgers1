import reducer, { initialState, resetRecoveryState } from './slice';
import { forgotPassword, resetPassword } from './action';

describe('редуктор passwordRecovery', () => {
  it('установка состояния загрузки при запросе восстановления пароля', () => {
    const testEmail = 'test@example.com';
    const state = reducer(
      initialState,
      forgotPassword.pending('', { email: testEmail })
    );

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('обработка успешного ответа на запрос восстановления пароля', () => {
    // Создаём начальное состояние с флагом загрузки
    const initialLoadingState = { ...initialState, isLoading: true };
    const testEmail = 'test@example.com';

    // Данные успешного ответа от API
    const successResponse = { success: true };

    // Применяем действие успешного ответа
    const state = reducer(
      initialLoadingState,
      forgotPassword.fulfilled(successResponse, '', { email: testEmail })
    );

    // Проверяем результат
    expect(state.isLoading).toBe(false);
    expect(state.success).toBe(true);
    expect(state.resetAllowed).toBe(true);
    expect(state.step).toBe('forgotSuccess');
    expect(state.error).toBeNull(); // Ошибка сбрасывается при успехе
  });

  it('обработка ошибки сброса пароля', () => {
    // Создаём начальное состояние с флагом загрузки
    const initialLoadingState = { ...initialState, isLoading: true };
    const resetData = { password: '123456', token: 'token' };
    const errorMessage = 'Ошибка сброса пароля';

    // Применяем действие с ошибкой
    const state = reducer(
      initialLoadingState,
      resetPassword.rejected(new Error(errorMessage), '', resetData, {
        message: errorMessage
      })
    );

    // Проверяем результат
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
    expect(state.success).toBe(false);
    expect(state.resetAllowed).toEqual(initialState.resetAllowed); // Не изменилось
    expect(state.step).toEqual(initialState.step); // Не изменилось
  });

  it('сброс состояния восстановления пароля', () => {
    // Создаём состояние с заполненными данными для очистки
    const dirtyState = {
      isLoading: true,
      success: true,
      step: 'forgotSuccess' as const,
      error: 'error',
      resetAllowed: true
    };

    // Применяем действие сброса состояния
    const state = reducer(dirtyState, resetRecoveryState());

    // Проверяем, что состояние полностью сброшено к initialState
    expect(state).toEqual(initialState);
  });
});
