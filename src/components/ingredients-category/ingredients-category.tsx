import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { useSelector } from '../../services/store';
import { selectBurgerConstructor } from '../../services/burgerConstructor/slice';

/**
 * Компонент категории ингредиентов для конструктора бургера
 * Отображает группу ингредиентов с подсчётом количества каждого ингредиента
 * в текущей сборке бургера. Учитывает булочки (всегда 2 штуки) и остальные ингредиенты.
 */
export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const burgerConstructor = useSelector(selectBurgerConstructor);

  /**
   * Мемоизированный подсчёт количества каждого ингредиента в сборке бургера
   * @returns объект с ключами — ID ингредиентов и значениями — количеством
   */
  const ingredientsCounters = useMemo(() => {
    // Извлекаем текущие ингредиенты из состояния конструктора бургера
    const { bun, ingredients: constructorIngredients } = burgerConstructor;

    // Инициализируем объект для хранения счётчиков
    const counters: { [key: string]: number } = {};

    // Подсчёт количества каждого дополнительного ингредиента
    constructorIngredients.forEach((ingredient: TIngredient) => {
      if (!counters[ingredient._id]) {
        counters[ingredient._id] = 0;
      }
      counters[ingredient._id]++;
    });

    if (bun) {
      counters[bun._id] = 2;
    }

    return counters;
  }, [burgerConstructor]);

  // Формирование пропсов для UI‑компонента с группировкой данных
  const uiComponentProps = {
    title,
    titleRef,
    ingredients,
    ingredientsCounters,
    ref
  };

  return (
    <div className='ingredients-category-wrapper'>
      <IngredientsCategoryUI {...uiComponentProps} />
    </div>
  );
});
