import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';
import { selectIngredients } from '../../services/burgerIngredients/slice';
import { useSelector } from '../../services/store';

/**
 * Максимальное количество ингредиентов для отображения в карточке заказа
 * Если ингредиентов больше, показывается часть и количество оставшихся
 */
const maxIngredients = 6;

/**
 * Компонент карточки заказа с подробной информацией
 * Отображает данные заказа, включая список ингредиентов, общую стоимость,
 * дату создания и визуальное представление первых нескольких ингредиентов.
 * При отсутствии данных возвращает null.
 */
export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const location = useLocation();
  const ingredients: TIngredient[] = useSelector(selectIngredients);

  /**
   * Мемоизированный расчёт информации о заказе
   * Собирает полную информацию об ингредиентах, их стоимости и дате заказа
   * @returns объект с расширенной информацией о заказе или null, если ингредиенты не загружены
   */
  const orderInfo = useMemo(() => {
    // Прерывание выполнения, если список ингредиентов ещё не загружен
    if (!ingredients.length) return null;

    // Поиск полных данных об ингредиентах по их ID из заказа
    const ingredientsInfo = order.ingredients.reduce(
      (acc: TIngredient[], item: string) => {
        const ingredient = ingredients.find((ing) => ing._id === item);
        if (ingredient) return [...acc, ingredient];
        return acc;
      },
      []
    );

    // Расчёт общей стоимости всех ингредиентов заказа
    const total = ingredientsInfo.reduce((acc, item) => acc + item.price, 0);

    // Ограничение списка отображаемых ингредиентов до максимального количества
    const ingredientsToShow = ingredientsInfo.slice(0, maxIngredients);

    // Подсчёт количества скрытых ингредиентов (если их больше максимума)
    const remains =
      ingredientsInfo.length > maxIngredients
        ? ingredientsInfo.length - maxIngredients
        : 0;

    // Форматирование даты создания заказа
    const date = new Date(order.createdAt);

    // Возврат расширенного объекта с информацией о заказе
    return {
      ...order,
      ingredientsInfo,
      ingredientsToShow,
      remains: remains,
      total,
      date
    };
  }, [order, ingredients]);

  // Если информация о заказе не готова (ингредиенты не загружены), не отображаем карточку
  if (!orderInfo) return null;

  // Формирование пропсов для UI‑компонента с группировкой данных
  const uiComponentProps = {
    orderInfo,
    maxIngredients,
    locationState: { background: location }
  };

  return (
    <div className='order-card-wrapper' data-order-id={order._id}>
      <OrderCardUI {...uiComponentProps} />
    </div>
  );
});
