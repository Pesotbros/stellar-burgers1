import React from 'react';
import { useSelector } from '../../services/store';
// import { selectIsAuthChecked, selectUser } from '../services/user/slice.ts';
import { selectUserData, selectIsAuth } from '../../services/userData/slice';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';
import { TLocationState } from '@utils-types';

type ProtectedProps = {
  onlyUnAuth?: boolean;
  component: React.JSX.Element;
};

export const Protected = ({
  onlyUnAuth = false,
  component
}: ProtectedProps): React.JSX.Element => {
  const user = useSelector(selectUserData);
  const isAuthChecked = useSelector(selectIsAuth);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' replace state={{ from: location }} />;
  }

  if (onlyUnAuth && user) {
    const state = location.state as TLocationState | null;
    const from = state?.from
      ? state.from.pathname + state.from.search + state.from.hash
      : '/';
    return <Navigate to={from} replace />;
  }

  return component;
};
