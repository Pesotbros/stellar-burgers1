import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { selectUserData } from '../../services/userData/slice';

export const AppHeader: FC = () => {
  const user = useSelector(selectUserData);
  return <AppHeaderUI userName={user?.name} />;
};
