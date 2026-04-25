import reducer, {
  addIngredient,
  initialState,
  moveIngredient,
  removeIngredient,
  setBun
} from './slice';
import { bun, main, sauce } from '../../test-utils/mocks';

describe('редуктор burgerConstructor', () => {
  it('добавление ингредиента в конструктор', () => {
    const state = reducer(initialState, addIngredient(main));

    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]).toMatchObject(main);
    expect(state.ingredients[0].id).toEqual(expect.any(String));
  });

  it('удаление ингредиента из конструктора', () => {
    // Создаём состояние с двумя ингредиентами
    const stateWithItems = reducer(
      reducer(initialState, addIngredient(main)),
      addIngredient(sauce)
    );

    // Берём ID первого ингредиента для удаления
    const ingredientId = stateWithItems.ingredients[0].id;

    // Применяем действие удаления
    const state = reducer(stateWithItems, removeIngredient(ingredientId));

    // Проверяем результат
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0].name).toBe(sauce.name);
  });

  it('изменение порядка ингредиентов в начинке', () => {
    // Создаём состояние с двумя ингредиентами
    const stateWithItems = reducer(
      reducer(initialState, addIngredient(main)),
      addIngredient(sauce)
    );

    // Перемещаем первый ингредиент на позицию второго
    const state = reducer(stateWithItems, moveIngredient({ from: 0, to: 1 }));

    // Проверяем, что порядок изменился
    expect(state.ingredients[0].name).toBe(sauce.name);
    expect(state.ingredients[1].name).toBe(main.name);
  });

  it('установка булки в конструктор', () => {
    const state = reducer(initialState, setBun(bun));

    expect(state.bun).toEqual(bun);
  });
});
