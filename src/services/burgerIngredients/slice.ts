import { createSelector, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';
import { getIngredients } from './actions';

type IngredientsState = {
  ingredients: TIngredient[];
  isLoading: boolean;
  error: string | null;
};

export const initialState: IngredientsState = {
  ingredients: [],
  isLoading: false,
  error: null
};

export const ingredientsSlice = createSlice({
  name: 'ingredientsSlice',
  initialState,
  reducers: {},
  selectors: {
    selectIngredients: (state) => state.ingredients,
    selectIsLoading: (state) => state.isLoading,
    selectError: (state) => state.error
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.isLoading = false;
        state.error =
          action.payload?.message ?? action.error.message ?? 'Unknown error';
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.ingredients = action.payload;
      });
  }
});

export const { selectIngredients, selectIsLoading, selectError } =
  ingredientsSlice.selectors;

export const selectBuns = createSelector([selectIngredients], (ingredients) =>
  ingredients.filter((i) => i.type === 'bun')
);

export const selectSauces = createSelector([selectIngredients], (ingredients) =>
  ingredients.filter((i) => i.type === 'sauce')
);

export const selectMains = createSelector([selectIngredients], (ingredients) =>
  ingredients.filter((i) => i.type === 'main')
);

export default ingredientsSlice.reducer;
