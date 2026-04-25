import { combineSlices, configureStore } from '@reduxjs/toolkit';

import {
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

import { ingredientsSlice } from './burgerIngredients/slice';
import { burgerConstructorSlice } from './burgerConstructor/slice';
import { createOrderSlice } from './createOrder/slice';
import { publicOrdersSlice } from './publicOrders/slice';
import { userDataSlice } from './userData/slice';
import { passwordRecoverySlice } from './passwordRecovery/slice';
import { userOrdersSlice } from './userOrders/slice';
import { orderByNumberSlice } from './orderInfo/slice';

export const rootReducer = combineSlices(
  ingredientsSlice,
  burgerConstructorSlice,
  createOrderSlice,
  publicOrdersSlice,
  userDataSlice,
  passwordRecoverySlice,
  userOrdersSlice,
  orderByNumberSlice
);

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;
export type AppDispatch = typeof store.dispatch;

export const useDispatch = dispatchHook.withTypes<AppDispatch>();
export const useSelector = selectorHook.withTypes<RootState>();

export default store;
