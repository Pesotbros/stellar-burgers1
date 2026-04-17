import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';
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

  // Контекст для отображения модальных окон поверх основного интерфейса
  const background = location.state?.background;

  // Функция для закрытия модального окна с возвратом на предыдущий экран
  const onCloseFn = () => navigate(-1);

  // Инициализация данных при монтировании компонента
  useEffect(() => {
    dispatch(getIngredients());
    dispatch(getUser());
  }, [dispatch]);

  return (
    <div className={styles.app}>
      <AppHeader />

      {/* Отображение ошибок */}
      {errorMessage && <div className={styles.error}>{errorMessage}</div>}

      {/* Индикатор загрузки */}
      {isLoading && <Preloader />}

      <section className={styles.mainContent}>
        {/* Основной набор маршрутов приложения */}
        <Routes location={background || location}>
          <Route path='/' element={<ConstructorPage />} />
          <Route path='/feed' element={<Feed />} />
          <Route path='/feed/:number' element={<OrderInfo />} />
          <Route path='/ingredients/:id' element={<IngredientDetails />} />

          {/* Маршруты для неавторизованных пользователей */}
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

          {/* Маршруты для авторизованных пользователей */}
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

        {/* Отдельный блок для модальных окон */}
        {background && (
          <div className={styles.modalOverlay}>
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
          </div>
        )}
      </section>
    </div>
  );
};

export default App;
