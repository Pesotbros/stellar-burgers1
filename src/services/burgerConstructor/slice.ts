import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '@utils-types';
import { createOrder } from '../createOrder/action';

/**
 * Тип состояния конструктора бургера
 * Содержит информацию о выбранной булочке и списке дополнительных ингредиентов
 */
export type BurgerConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

/**
 * Начальное состояние конструктора бургера
 * Изначально булочка не выбрана, список ингредиентов пуст
 */
export const initialState: BurgerConstructorState = {
  bun: null,
  ingredients: []
};

/**
 * Срез Redux для управления состоянием конструктора бургера
 * Реализует логику добавления, удаления, перемещения ингредиентов и установки булочки.
 * После успешного создания заказа сбрасывает состояние до начального.
 */
export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    /**
     * Устанавливает выбранную булочку для бургера
     * @param state - текущее состояние среза
     * @param action - действие с полезной нагрузкой (булочка)
     */
    setBun(state, action: PayloadAction<TIngredient>) {
      state.bun = action.payload;
    },

    /**
     * Добавляет ингредиент в сборку бургера с уникальным ID
     * Использует prepare‑функцию для генерации ID через nanoid
     */
    addIngredient: {
      reducer(state, action: PayloadAction<TConstructorIngredient>) {
        state.ingredients.push(action.payload);
      },
      prepare(ingredient: TIngredient) {
        const payload: TConstructorIngredient = { ...ingredient, id: nanoid() };
        return { payload };
      }
    },

    /**
     * Удаляет ингредиент из сборки бургера по его уникальному ID
     * @param state - текущее состояние среза
     * @param action - действие с ID ингредиента для удаления
     */
    removeIngredient(state, action: PayloadAction<string>) {
      state.ingredients = state.ingredients.filter(
        (i) => i.id !== action.payload
      );
    },

    /**
     * Перемещает ингредиент в списке сборки бургера
     * Проверяет корректность индексов перед перемещением
     * @param state - текущее состояние среза
     * @param action - действие с индексами «откуда» и «куда»
     */
    moveIngredient(state, action: PayloadAction<{ from: number; to: number }>) {
      const { from, to } = action.payload;

      // Проверка корректности индексов: вне границ или одинаковые индексы
      if (
        from === to ||
        from < 0 ||
        to < 0 ||
        from >= state.ingredients.length ||
        to >= state.ingredients.length
      ) {
        return;
      }

      // Извлечение элемента по индексу «from»
      const [item] = state.ingredients.splice(from, 1);
      // Вставка элемента на позицию «to»
      state.ingredients.splice(to, 0, item);
    }
  },
  selectors: {
    /** Возвращает выбранную булочку */
    selectBun: (state) => state.bun,

    /** Возвращает список выбранных ингредиентов */
    selectChosenIngredients: (state) => state.ingredients,

    /** Возвращает полное состояние конструктора бургера */
    selectBurgerConstructor: (state) => state
  },
  extraReducers: (builder) => {
    // Сброс состояния до начального после успешного создания заказа
    builder.addCase(createOrder.fulfilled, () => initialState);
  }
});

/** Экспорт действий среза */
export const { setBun, addIngredient, removeIngredient, moveIngredient } =
  burgerConstructorSlice.actions;

/** Экспорт селекторов среза */
export const { selectBun, selectChosenIngredients, selectBurgerConstructor } =
  burgerConstructorSlice.selectors;

/** Экспорт редуктора среза по умолчанию */
export default burgerConstructorSlice.reducer;
