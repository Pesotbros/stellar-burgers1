import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { RegisterUI } from '@ui-pages';
import { useDispatch, useSelector } from '../../services/store';
import { registerUser } from '../../services/userData/action';

import {
  selectUserData,
  selectIsLoading,
  selectError
} from '../../services/userData/slice';
import { TLocationState } from '@utils-types';

export const Register: FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const user = useSelector(selectUserData);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  const state = location.state as TLocationState | null;
  const from = state?.from
    ? state.from.pathname + state.from.search + state.from.hash
    : '/';

  useEffect(() => {
    if (user) navigate(from, { replace: true });
  }, [user, from, navigate]);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();

    dispatch(registerUser({ email, name: userName, password }));
  };

  return (
    <RegisterUI
      errorText={error}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
      isLoading={isLoading}
    />
  );
};
