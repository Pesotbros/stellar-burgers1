import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useDispatch, useSelector } from '../../services/store';
import { getOrderByNumber } from '../../services/orderInfo/action';
import { useParams } from 'react-router-dom';
import {
  selectOrder,
  selectError,
  selectIsLoading,
  clearOrder
} from '../../services/orderInfo/slice';

import { selectIngredients } from '../../services/burgerIngredients/slice';

export const OrderInfo: FC<{ hideNumber?: boolean }> = ({ hideNumber }) => {
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();
  const orderNumber = Number(number);

  /** TODO: взять переменные orderData и ingredients из стора */
  const orderData = useSelector(selectOrder);
  const error = useSelector(selectError);
  const isLoading = useSelector(selectIsLoading);

  const ingredients = useSelector(selectIngredients);

  useEffect(() => {
    if (!number || Number.isNaN(orderNumber)) return;

    dispatch(getOrderByNumber(orderNumber));

    return () => {
      dispatch(clearOrder());
    };
  }, [dispatch, orderNumber, number]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (isLoading) return <Preloader />;
  if (error) return <div>Ошибка: {error}</div>;
  if (!orderInfo) return <Preloader />;

  return (
    <OrderInfoUI
      orderInfo={orderInfo}
      orderNumberText={
        hideNumber ? undefined : number ? `#${number}` : undefined
      }
    />
  );
};
