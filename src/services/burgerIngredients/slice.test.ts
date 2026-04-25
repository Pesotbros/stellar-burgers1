import reducer, { initialState } from './slice';
import { getIngredients } from './actions';
import { ingredients } from '../../test-utils/mocks';

describe('редуктор burgerIngredients', () => {
  it('установка состояния загрузки', () => {
    const state = reducer(initialState, getIngredients.pending('', undefined));

    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('обработка успешного ответа с ингредиентами', () => {
    // Создаём начальное состояние с флагом загрузки
    const initialLoadingState = { ...initialState, isLoading: true };

    // Применяем действие успешного ответа
    const state = reducer(
      initialLoadingState,
      getIngredients.fulfilled(ingredients, '', undefined)
    );

    // Проверяем результат
    expect(state.isLoading).toBe(false);
    expect(state.ingredients).toEqual(ingredients);
    expect(state.error).toBeNull();
  });

  it('обработка ошибки загрузки ингредиентов', () => {
    // Создаём начальное состояние с флагом загрузки
    const initialLoadingState = { ...initialState, isLoading: true };

    // Определяем сообщение об ошибке
    const errorMessage = 'Ошибка загрузки';

    // Применяем действие с ошибкой
    const state = reducer(
      initialLoadingState,
      getIngredients.rejected(new Error(errorMessage), '', undefined, {
        message: errorMessage
      })
    );

    // Проверяем результат
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe(errorMessage);
    expect(state.ingredients).toEqual(initialState.ingredients);
  });
});
