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

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector(selectUserData);
  const location = useLocation();
  const navigate = useNavigate();

  const constructorItems = useSelector(selectBurgerConstructor);

  const orderRequest = useSelector(selectOrderRequest);

  const orderModalData = useSelector(selectOrderModalData);

  const onOrderClick = () => {
    if (orderRequest) return;
    if (!user) {
      navigate('/login', { replace: true, state: { from: location } });
      return;
    }
    if (!constructorItems.bun) return;

    const orderItems = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((ing) => ing._id),
      constructorItems.bun._id
    ];

    dispatch(createOrder(orderItems));
  };

  const closeOrderModal = () => {
    dispatch(clearOrderModal());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
