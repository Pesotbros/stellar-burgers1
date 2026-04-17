import { FC, useState, SyntheticEvent, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { ForgotPasswordUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { forgotPassword } from '../../services/passwordRecovery/action';
import {
  selectError,
  selectIsLoading,
  selectStep,
  resetRecoveryState
} from '../../services/passwordRecovery/slice';

export const ForgotPassword: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');

  const error = useSelector(selectError);
  const isLoading = useSelector(selectIsLoading);
  const step = useSelector(selectStep);

  useEffect(() => {
    dispatch(resetRecoveryState());
  }, [dispatch]);

  useEffect(() => {
    if (step === 'forgotSuccess') {
      localStorage.setItem('resetPassword', 'true');
      navigate('/reset-password', { replace: true });
    }
  }, [step, navigate]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(forgotPassword({ email }));
  };

  return (
    <ForgotPasswordUI
      errorText={error}
      email={email}
      setEmail={setEmail}
      handleSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
};
