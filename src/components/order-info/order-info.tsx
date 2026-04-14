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

/**
 * Компонент отображения детальной информации о заказе
 * Загружает данные заказа по номеру, обрабатывает информацию об ингредиентах,
 * рассчитывает общую стоимость и отображает карточку заказа.
 * @param hideNumber - флаг, скрывающий номер заказа в интерфейсе (опционально)
 */
export const OrderInfo: FC<{ hideNumber?: boolean }> = ({ hideNumber }) => {
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();
  const orderNumber = Number(number);

  // Данные заказа из стора
  const orderData = useSelector(selectOrder);
  const error = useSelector(selectError);
  const isLoading = useSelector(selectIsLoading);

  // Список всех доступных ингредиентов для сопоставления с заказом
  const ingredients = useSelector(selectIngredients);

  /**
   * Эффект загрузки данных заказа при монтировании компонента
   * И очищает состояние при размонтировании
   */
  useEffect(() => {
    // Проверка корректности номера заказа
    if (!number || Number.isNaN(orderNumber)) return;

    // Загрузка данных заказа по номеру
    dispatch(getOrderByNumber(orderNumber));

    // Очистка состояния заказа при размонтировании компонента
    return () => {
      dispatch(clearOrder());
    };
  }, [dispatch, orderNumber, number]);

  /**
   * Мемоизированный расчёт информации о заказе для отображения
   * Собирает данные об ингредиентах с подсчётом количества, рассчитывает общую стоимость
   * @returns объект с расширенной информацией о заказе или null, если данные недоступны
   */
  const orderInfo = useMemo(() => {
    // Прерывание расчёта, если данные заказа или ингредиенты не загружены
    if (!orderData || !ingredients.length) return null;

    // Форматирование даты создания заказа
    const date = new Date(orderData.createdAt);

    // Тип для хранения ингредиентов с количеством
    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    // Сбор информации об ингредиентах заказа с подсчётом их количества
    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          // Поиск полного описания ингредиента по ID
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          // Увеличение счётчика для уже найденного ингредиента
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    // Расчёт общей стоимости заказа с учётом количества каждого ингредиента
    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    // Возврат расширенного объекта с информацией о заказе
    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  // Логика отображения в зависимости от состояния загрузки и наличия данных
  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <div className='order-info-error'>
        <h3>Ошибка при загрузке заказа</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!orderInfo) {
    return <Preloader />;
  }

  // Формирование пропсов для UI‑компонента с группировкой данных
  const uiComponentProps = {
    orderInfo,
    orderNumberText: hideNumber ? undefined : number ? `#${number}` : undefined
  };

  return (
    <div className='order-info-wrapper' data-order-number={orderNumber}>
      <OrderInfoUI {...uiComponentProps} />
    </div>
  );
};
