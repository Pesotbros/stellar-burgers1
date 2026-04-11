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

export const IngredientDetails: FC = () => {
  const { id } = useParams<{ id: string }>();

  const ingredients = useSelector(selectIngredients);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const ingredientData = useMemo(
    () => ingredients.find((item) => item._id === id) ?? null,
    [id, ingredients]
  );

  if (!ingredientData || isLoading) {
    return <Preloader />;
  }
  if (error) return <div>Ошибка:{error}</div>;

  return <IngredientDetailsUI ingredientData={ingredientData} />;
};
