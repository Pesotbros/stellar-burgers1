import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store';
import { selectBurgerConstructor } from '../../services/burgerConstructor/slice';
import {
  selectOrderRequest,
  selectOrderModalData,
  clearOrderModal
} from '../../services/createOrder/slice';
import { createOrder } from '../../services/createOrder/action';
import { selectUserData } from '../../services/userData/slice';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Компонент конструктора бургера с логикой оформления заказа
 */
export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUserData);
  const location = useLocation();
  const navigate = useNavigate();

  // Данные текущего состояния конструктора бургера
  const constructorItems = useSelector(selectBurgerConstructor);

  // Статус выполнения запроса на создание заказа
  const orderRequest = useSelector(selectOrderRequest);

  // Данные для отображения модального окна с информацией о заказе
  const orderModalData = useSelector(selectOrderModalData);

  /**
   * Обработчик клика по кнопке оформления заказа
   * Реализует проверку авторизации, наличия булочки и отправку данных на сервер
   */
  const onOrderClick = () => {
    // Прерываем выполнение, если уже идёт запрос на создание заказа
    if (orderRequest) return;

    // Перенаправление на страницу авторизации, если пользователь не авторизован
    if (!user) {
      navigate('/login', {
        replace: true,
        state: { from: location }
      });
      return;
    }

    // Проверка наличия булочки — обязательный компонент бургера
    if (!constructorItems.bun) return;

    // Формирование массива ID ингредиентов для отправки в заказе

    const orderItems = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ing) => ing._id),
      constructorItems.bun._id
    ];

    // Отправка запроса на создание заказа с перечнем ингредиентов
    dispatch(createOrder(orderItems));
  };

  /**
   * Закрытие модального окна с информацией о заказе
   * Очищает данные модального окна в сторе
   */
  const closeOrderModal = () => {
    dispatch(clearOrderModal());
  };

  // Расчёт итоговой стоимости бургера с мемоизацией
  const price = useMemo(() => {
    const bunPrice = constructorItems.bun ? constructorItems.bun.price * 2 : 0;

    // Суммирование стоимости всех дополнительных ингредиентов
    const ingredientsPrice = constructorItems.ingredients.reduce(
      (sum: number, ingredient: TConstructorIngredient) =>
        sum + ingredient.price,
      0
    );

    return bunPrice + ingredientsPrice;
  }, [constructorItems]);

  return (
    <div className='burger-constructor-container'>
      <BurgerConstructorUI
        price={price}
        orderRequest={orderRequest}
        constructorItems={constructorItems}
        orderModalData={orderModalData}
        onOrderClick={onOrderClick}
        closeOrderModal={closeOrderModal}
      />
    </div>
  );
};
