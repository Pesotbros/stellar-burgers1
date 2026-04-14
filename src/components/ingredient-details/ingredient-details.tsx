import { FC, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import {
  selectIngredients,
  selectIsLoading,
  selectError
} from '../../services/burgerIngredients/slice';

/**
 * Компонент отображения детальной информации об ингредиенте
 * Получает ID ингредиента из параметров маршрута, находит соответствующий элемент
 * в списке ингредиентов и отображает его детали. При загрузке показывает прелоадер,
 * при ошибке — сообщение об ошибке.
 */
export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();

  const ingredients = useSelector(selectIngredients);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);

  /**
   * Поиск ингредиента по ID с мемоизацией результата
   * Если ингредиент не найден, возвращает null
   */
  const ingredientData = useMemo(() => {
    // Поиск ингредиента в массиве по уникальному идентификатору
    const foundIngredient = ingredients.find((item) => item._id === id);

    // Гарантированное возвращение значения: найденный ингредиент или null
    return foundIngredient ?? null;
  }, [id, ingredients]);

  // Логика отображения в зависимости от состояния загрузки и наличия данных
  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <div className='ingredient-details-error'>
        <h3>Ошибка при загрузке данных</h3>
        <p>{error}</p>
      </div>
    );
  }

  if (!ingredientData) {
    return (
      <div className='ingredient-details-not-found'>
        <h3>Ингредиент не найден</h3>
        <p>Проверьте корректность идентификатора или попробуйте позже.</p>
      </div>
    );
  }

  // Формирование пропсов для UI‑компонента
  const uiComponentProps = {
    ingredientData
  };

  return (
    <div className='ingredient-details-wrapper'>
      <IngredientDetailsUI {...uiComponentProps} />
    </div>
  );
};
