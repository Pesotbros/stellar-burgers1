import { FC } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '../../services/store';
import { selectFeed, selectOrders } from '../../services/publicOrders/slice';

/**
 * Вспомогательная функция для фильтрации и извлечения номеров заказов по статусу
 * @param orders - массив заказов для обработки
 * @param status - статус заказов, которые нужно отобрать ('done' или 'pending')
 * @returns массив номеров заказов (максимум 20 элементов)
 */
const getOrders = (orders: TOrder[], status: string): number[] => {
  // Фильтрация заказов по заданному статусу
  const filteredOrders = orders.filter((item) => item.status === status);

  // Извлечение номеров заказов из отфильтрованных элементов
  const orderNumbers = filteredOrders.map((item) => item.number);

  // Ограничение количества элементов до 20 для отображения
  return orderNumbers.slice(0, 20);
};

/**
 * Компонент отображения информации о заказах (готовые и в процессе)
 */
export const FeedInfo: FC = () => {
  const orders: TOrder[] = useSelector(selectOrders);
  const feed = useSelector(selectFeed);

  /**
   * Получение уникальных статусов заказов для внутренней аналитики
   * Используется для отслеживания возможных статусов в системе
   */
  const statuses = Array.from(new Set(orders.map((o) => o.status)));
  console.log('statuses:', statuses);

  /**
   * Готовые заказы — успешно выполненные заказы со статусом 'done'
   */
  const readyOrders = getOrders(orders, 'done');

  /**
   * Заказы в процессе — текущие заказы со статусом 'pending'
   */
  const pendingOrders = getOrders(orders, 'pending');

  // Формирование пропсов для UI‑компонента с группировкой данных
  const uiComponentProps = {
    readyOrders,
    pendingOrders,
    feed
  };

  return (
    <div className='feed-info-wrapper'>
      <FeedInfoUI {...uiComponentProps} />
    </div>
  );
};
