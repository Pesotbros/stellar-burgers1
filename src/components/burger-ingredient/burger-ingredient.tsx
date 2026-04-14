import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { useDispatch } from '../../services/store';
import { addIngredient } from '../../services/burgerConstructor/slice';
import { setBun } from '../../services/burgerConstructor/slice';

/**
 * Компонент ингредиента бургера с логикой добавления в конструктор
 * Отображает карточку ингредиента и обрабатывает его добавление в сборку бургера,
 * учитывая тип ингредиента (булочка или дополнительный ингредиент)
 */
export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const location = useLocation();
    const dispatch = useDispatch();

    /**
     * Обработчик добавления ингредиента в конструктор бургера
     * В зависимости от типа ингредиента отправляет соответствующее действие:
     * - для булочек — setBun
     * - для остальных ингредиентов — addIngredient
     */
    const handleAdd = () => {
      // Логика добавления зависит от типа ингредиента
      if (ingredient.type === 'bun') {
        // Булочки устанавливаются как основа бургера (верхняя и нижняя часть)
        dispatch(setBun(ingredient));
      } else {
        // Остальные ингредиенты добавляются в середину сборки
        dispatch(addIngredient(ingredient));
      }
    };

    // Формирование пропсов для UI‑компонента с учётом текущего местоположения в маршрутизаторе
    const uiComponentProps = {
      ingredient,
      count,
      locationState: { background: location },
      handleAdd
    };

    return (
      <div
        className='burger-ingredient-wrapper'
        data-ingredient-type={ingredient.type}
      >
        <BurgerIngredientUI {...uiComponentProps} />
      </div>
    );
  }
);
