import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectOrders,
  selectIsLoading,
  selectError
} from '../../services/userOrders/slice';
import { getUserOrders } from '../../services/userOrders/action';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  /** TODO: взять переменную из стора */
  const orders: TOrder[] = useSelector(selectOrders);
  const error = useSelector(selectError);
  const isLoading = useSelector(selectIsLoading);

  useEffect(() => {
    dispatch(getUserOrders());
  }, [dispatch]);

  return (
    <ProfileOrdersUI orders={orders} error={error} isLoading={isLoading} />
  );
};
