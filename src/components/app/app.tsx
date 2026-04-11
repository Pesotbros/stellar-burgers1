import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
import '../../index.css';
import styles from './app.module.css';

import {
  AppHeader,
  Protected,
  Modal,
  FeedOrderModalRoute,
  OrderInfo,
  IngredientDetails
} from '@components';
import { Preloader } from '@ui';
import {
  ConstructorPage,
  Feed,
  Login,
  Register,
  ForgotPassword,
  ResetPassword,
  NotFound404,
  Profile,
  ProfileOrders
} from '@pages';
import { useDispatch, useSelector } from '../../services/store';
import { useEffect } from 'react';
import { getIngredients } from '../../services/burgerIngredients/actions';
import {
  selectIsLoading,
  selectError
} from '../../services/burgerIngredients/slice';

import { getUser } from '../../services/userData/action';

const App = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const isLoading = useSelector(selectIsLoading);
  const errorMessage = useSelector(selectError);

  // 🔑 ключевая штука для модалок
  const background = location.state?.background;

  const onCloseFn = () => {
    navigate(-1);
  };

  useEffect(() => {
    dispatch(getIngredients());
    dispatch(getUser());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />

      {errorMessage && <div>{errorMessage}</div>}
      {isLoading && <Preloader />}

      <>
        {/* Основные маршруты */}
        <Routes location={background || location}>
          <Route path='/' element={<ConstructorPage />} />
          <Route path='/feed' element={<Feed />} />
          <Route path='/feed/:number' element={<OrderInfo />} />
          <Route path='/ingredients/:id' element={<IngredientDetails />} />

          {/* Только для НЕавторизованных */}
          <Route
            path='/login'
            element={<Protected onlyUnAuth component={<Login />} />}
          />
          <Route
            path='/register'
            element={<Protected onlyUnAuth component={<Register />} />}
          />
          <Route
            path='/forgot-password'
            element={<Protected onlyUnAuth component={<ForgotPassword />} />}
          />
          <Route
            path='/reset-password'
            element={<Protected onlyUnAuth component={<ResetPassword />} />}
          />

          {/* Только для авторизованных */}
          <Route
            path='/profile'
            element={<Protected component={<Profile />} />}
          />
          <Route
            path='/profile/orders'
            element={<Protected component={<ProfileOrders />} />}
          />
          <Route
            path='/profile/orders/:number'
            element={<Protected component={<OrderInfo />} />}
          />

          <Route path='*' element={<NotFound404 />} />
        </Routes>

        {/* Модальные окна */}
        {background && (
          <Routes>
            <Route
              path='/feed/:number'
              element={<FeedOrderModalRoute onClose={onCloseFn} />}
            />
            <Route
              path='/ingredients/:id'
              element={
                <Modal title='Детали ингредиента' onClose={onCloseFn}>
                  <IngredientDetails />
                </Modal>
              }
            />
            <Route
              path='/profile/orders/:number'
              element={
                <Protected
                  component={<FeedOrderModalRoute onClose={onCloseFn} />}
                />
              }
            />
          </Routes>
        )}
      </>
    </div>
  );
};

export default App;
