import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

import { ResetPasswordUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { resetPassword } from '../../services/passwordRecovery/action';

import {
  selectError,
  selectIsLoading,
  selectStep,
  resetRecoveryState
} from '../../services/passwordRecovery/slice';

export const ResetPassword: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const error = useSelector(selectError);
  const isLoading = useSelector(selectIsLoading);
  const step = useSelector(selectStep);

  const allowed = localStorage.getItem('resetPassword') === 'true';
  if (!allowed) {
    return <Navigate to='/forgot-password' replace />;
  }

  useEffect(() => {
    dispatch(resetRecoveryState());
  }, [dispatch]);

  useEffect(() => {
    if (step === 'resetSuccess') {
      localStorage.removeItem('resetPassword');
      navigate('/login', { replace: true });
    }
  }, [step, navigate]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(resetPassword({ password, token }));
  };

  return (
    <ResetPasswordUI
      errorText={error}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
};
