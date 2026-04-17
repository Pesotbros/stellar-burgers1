import { createSelector, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredients } from './actions';

/**
 * Тип состояния для управления списком ингредиентов
 * Содержит данные об ингредиентах, статусе загрузки и возможных ошибках
 */
type IngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

/**
 * Начальное состояние среза ингредиентов
 * Изначально список ингредиентов пуст, загрузка не активна, ошибок нет
 */
export const initialState: IngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

/**
 * Срез Redux для управления состоянием ингредиентов приложения
 * Обрабатывает асинхронную загрузку ингредиентов, обновляет статус загрузки
 * и обрабатывает возможные ошибки. Предоставляет селекторы для фильтрации
 * ингредиентов по типам (булочки, соусы, начинки).
 */
export const ingredientsSlice = createSlice({
  name: 'ingredientsSlice',
  initialState,
  reducers: {},
  selectors: {
    /**
     * Возвращает полный список ингредиентов
     * @param state - текущее состояние среза
     * @returns массив объектов ингредиентов
     */
    selectIngredients: (state) => state.ingredients,

    /**
     * Возвращает флаг состояния загрузки ингредиентов
     * @param state - текущее состояние среза
     * @returns boolean — true, если идёт загрузка
     */
    selectIsLoading: (state) => state.isLoading,

    /**
     * Возвращает сообщение об ошибке (если есть)
     * @param state - текущее состояние среза
     * @returns строка с описанием ошибки или null
     */
    selectError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      // Обработка начала загрузки ингредиентов
      .addCase(getIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      // Обработка ошибки при загрузке ингредиентов
      .addCase(getIngredients.rejected, (state, action) => {
        state.isLoading = false;
        // Попытка извлечь сообщение об ошибке из разных источников
        state.error =
          action.payload?.message ??
          action.error.message ??
          'Неизвестная ошибка при загрузке ингредиентов';
      })
      // Обработка успешного получения ингредиентов
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      });
  }
});

/** Экспорт селекторов среза ингредиентов */
export const { selectIngredients, selectIsLoading, selectError } =
  ingredientsSlice.selectors;

/**
 * Селектор для получения списка булочек из общего списка ингредиентов
 * Фильтрует ингредиенты по типу 'bun'
 * @param ingredients - массив всех ингредиентов
 * @returns массив ингредиентов типа 'bun'
 */
export const selectBuns = createSelector([selectIngredients], (ingredients) =>
  ingredients.filter((i) => i.type === 'bun')
);

/**
 * Селектор для получения списка соусов из общего списка ингредиентов
 * Фильтрует ингредиенты по типу 'sauce'
 * @param ingredients - массив всех ингредиентов
 * @returns массив ингредиентов типа 'sauce'
 */
export const selectSauces = createSelector([selectIngredients], (ingredients) =>
  ingredients.filter((i) => i.type === 'sauce')
);

/**
 * Селектор для получения списка начинок из общего списка ингредиентов
 * Фильтрует ингредиенты по типу 'main'
 * @param ingredients - массив всех ингредиентов
 * @returns массив ингредиентов типа 'main'
 */
export const selectMains = createSelector([selectIngredients], (ingredients) =>
  ingredients.filter((i) => i.type === 'main')
);

/** Экспорт редуктора среза по умолчанию */
export default ingredientsSlice.reducer;
