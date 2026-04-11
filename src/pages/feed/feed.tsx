import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useDispatch, useSelector } from '../../services/store';
import {
  selectOrders,
  selectIsLoading
} from '../../services/publicOrders/slice';
import { getPublicOrders } from '../../services/publicOrders/action';

export const Feed: FC = () => {
  const dispatch = useDispatch();
  const orders: TOrder[] = useSelector(selectOrders);
  const isLoading = useSelector(selectIsLoading);

  const handleGetFeeds = () => {
    dispatch(getPublicOrders());
  };

  useEffect(() => {
    dispatch(getPublicOrders());
  }, [dispatch]);

  if (isLoading) {
    return <Preloader />;
  }

  return (
    <>
      <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />
    </>
  );
};
