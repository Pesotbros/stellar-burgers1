import { createSlice, PayloadAction, nanoid } from '@reduxjs/toolkit';
import { TIngredient, TConstructorIngredient } from '@utils-types';
import { createOrder } from '../createOrder/action';

export type BurgerConstructorState = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

export const initialState: BurgerConstructorState = {
  bun: null,
  ingredients: []
};

export const burgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    setBun(state, action: PayloadAction<TIngredient>) {
      state.bun = action.payload;
    },
    addIngredient: {
      reducer(state, action: PayloadAction<TConstructorIngredient>) {
        state.ingredients.push(action.payload);
      },
      prepare(ingredient: TIngredient) {
        const payload: TConstructorIngredient = { ...ingredient, id: nanoid() };
        return { payload };
      }
    },
    removeIngredient(state, action: PayloadAction<string>) {
      state.ingredients = state.ingredients.filter(
        (i) => i.id !== action.payload
      );
    },
    moveIngredient(state, action: PayloadAction<{ from: number; to: number }>) {
      const { from, to } = action.payload;

      if (
        from === to ||
        from < 0 ||
        to < 0 ||
        from >= state.ingredients.length ||
        to >= state.ingredients.length
      )
        return;

      const [item] = state.ingredients.splice(from, 1);
      state.ingredients.splice(to, 0, item);
    }
  },
  selectors: {
    selectBun: (state) => state.bun,
    selectChosenIngredients: (state) => state.ingredients,
    selectBurgerConstructor: (state) => state
  },
  extraReducers: (builder) => {
    builder.addCase(createOrder.fulfilled, () => initialState);
  }
});

export const { setBun, addIngredient, removeIngredient, moveIngredient } =
  burgerConstructorSlice.actions;
export const { selectBun, selectChosenIngredients, selectBurgerConstructor } =
  burgerConstructorSlice.selectors;

export default burgerConstructorSlice.reducer;
